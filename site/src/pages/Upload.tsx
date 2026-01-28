import { useState, useMemo, useEffect, useRef } from 'react'
import FileDropzone from '../components/FileDropzone'
import ServiceAddonPicker from '../components/ServiceAddonPicker'
import PriceCalculator from '../components/PriceCalculator'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import { materials } from '../data/materials'
import { calculateTotal, formatPrice, parsePricingParams, type PricingParams } from '../lib/pricing'
import { calculatePrice as apiCalculatePrice, fetchPricingParameters } from '../lib/api'
import { useCartStore } from '../store/cartStore'

const acceptedTypes = ['.dxf', '.svg', '.ai', '.eps', '.dwg', '.step']

export default function Upload() {
  const addItem = useCartStore((s) => s.addItem)

  const [file, setFile] = useState<File | null>(null)
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0].id)
  const [selectedThickness, setSelectedThickness] = useState(materials[0].thicknesses[0].label)
  const [width, setWidth] = useState(6)
  const [height, setHeight] = useState(4)
  const [quantity, setQuantity] = useState(1)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [pricingParams, setPricingParams] = useState<PricingParams | null>(null)

  const material = materials.find((m) => m.id === selectedMaterialId)
  const thicknessOptions = (material?.thicknesses ?? []).map((t) => ({
    value: t.label,
    label: t.label,
  }))

  const materialOptions = materials.map((m) => ({ value: m.id, label: m.name }))

  // Fetch pricing parameters from API once on mount
  useEffect(() => {
    fetchPricingParameters()
      .then((grouped) => setPricingParams(parsePricingParams(grouped)))
      .catch(() => {
        // API unavailable — client-side will use hardcoded defaults
      })
  }, [])

  const clientPricing = useMemo(
    () => calculateTotal(selectedMaterialId, selectedThickness, width, height, quantity, selectedServices, pricingParams),
    [selectedMaterialId, selectedThickness, width, height, quantity, selectedServices, pricingParams]
  )

  const [apiPricing, setApiPricing] = useState<{ unitPrice: number; discount: number; subtotal: number; setupFee?: number } | null>(null)
  const [apiPricingLoading, setApiPricingLoading] = useState(false)
  const apiDebounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setApiPricing(null)

    clearTimeout(apiDebounceRef.current)
    apiDebounceRef.current = setTimeout(async () => {
      setApiPricingLoading(true)
      try {
        const result = await apiCalculatePrice({
          materialId: selectedMaterialId,
          thicknessLabel: selectedThickness,
          width,
          height,
          quantity,
          services: selectedServices,
        })
        setApiPricing({
          unitPrice: result.unitPrice,
          discount: result.discount,
          subtotal: result.subtotal,
          setupFee: result.setupFee,
        })
      } catch {
        // API unavailable, keep using client-side pricing
      } finally {
        setApiPricingLoading(false)
      }
    }, 500)

    return () => clearTimeout(apiDebounceRef.current)
  }, [selectedMaterialId, selectedThickness, width, height, quantity, selectedServices])

  const pricing = apiPricing || clientPricing

  function handleMaterialChange(id: string) {
    setSelectedMaterialId(id)
    const mat = materials.find((m) => m.id === id)
    if (mat && mat.thicknesses.length > 0) {
      setSelectedThickness(mat.thicknesses[0].label)
    }
  }

  function handleToggleService(serviceId: string) {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    )
  }

  function handleAddToCart() {
    if (!file || !material) return
    addItem({
      id: `upload-${Date.now()}`,
      name: file.name,
      type: 'upload',
      material: material.name,
      materialId: material.id,
      thickness: selectedThickness,
      quantity,
      services: selectedServices,
      dimensions: { width, height },
      fileInfo: { name: file.name, size: file.size, type: file.type || file.name.split('.').pop() || '' },
      unitPrice: pricing.unitPrice,
      subtotal: pricing.subtotal,
    })
    setFile(null)
    setQuantity(1)
    setSelectedServices([])
  }

  const svgPreviewUrl = file && file.name.toLowerCase().endsWith('.svg') ? URL.createObjectURL(file) : null

  return (
    <div>
      {/* Header */}
      <section className="bg-offwhite py-12 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-sans font-bold text-charcoal mb-3">Upload Your Design</h1>
          <p className="text-gray-mid font-serif text-lg max-w-2xl mx-auto">
            Upload your CAD file and we'll cut it to your exact specifications.
            Accepted formats: DXF, SVG, AI, EPS, DWG, STEP.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left Column - Upload & Config */}
          <div className="lg:col-span-3 space-y-8">
            {/* File Upload */}
            <div>
              <h2 className="text-xl font-sans font-bold text-charcoal mb-4">1. Upload File</h2>
              <FileDropzone onFileSelect={setFile} acceptedTypes={acceptedTypes} />
            </div>

            {/* Material */}
            <div>
              <h2 className="text-xl font-sans font-bold text-charcoal mb-4">2. Select Material</h2>
              <Select
                label="Material"
                id="material"
                options={materialOptions}
                value={selectedMaterialId}
                onChange={(e) => handleMaterialChange(e.target.value)}
              />
            </div>

            {/* Thickness */}
            <div>
              <h2 className="text-xl font-sans font-bold text-charcoal mb-4">3. Select Thickness</h2>
              <Select
                label="Thickness"
                id="thickness"
                options={thicknessOptions}
                value={selectedThickness}
                onChange={(e) => setSelectedThickness(e.target.value)}
              />
            </div>

            {/* Dimensions */}
            <div>
              <h2 className="text-xl font-sans font-bold text-charcoal mb-4">4. Estimated Dimensions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Width (inches)"
                  id="width"
                  type="number"
                  min={0.5}
                  step={0.25}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value) || 0.5)}
                />
                <Input
                  label="Height (inches)"
                  id="height"
                  type="number"
                  min={0.5}
                  step={0.25}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 0.5)}
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h2 className="text-xl font-sans font-bold text-charcoal mb-4">5. Quantity</h2>
              <Input
                label="Quantity"
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="max-w-[150px]"
              />
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-sans font-bold text-charcoal mb-4">6. Add-On Services</h2>
              <ServiceAddonPicker selectedServices={selectedServices} onToggle={handleToggleService} />
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-sans font-bold text-charcoal mb-4">Order Summary</h2>

                {/* File Info */}
                {file && (
                  <div className="mb-4 p-3 bg-offwhite rounded text-sm font-serif">
                    <p className="font-semibold text-charcoal">{file.name}</p>
                    <p className="text-gray-mid">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                )}

                {/* SVG Preview */}
                {svgPreviewUrl && (
                  <div className="mb-4 border border-gray-200 rounded p-4 bg-gray-50 flex items-center justify-center">
                    <img src={svgPreviewUrl} alt="SVG Preview" className="max-h-40 max-w-full" />
                  </div>
                )}

                {/* Pricing */}
                <PriceCalculator
                  unitPrice={pricing.unitPrice}
                  quantity={quantity}
                  discount={pricing.discount}
                  setupFee={pricing.setupFee}
                  subtotal={pricing.subtotal}
                />

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-sans font-bold text-charcoal">Total</span>
                    <span className="text-2xl font-sans font-bold text-primary flex items-center gap-2">
                      {formatPrice(pricing.subtotal)}
                      {apiPricingLoading && (
                        <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={!file}
                    className="w-full"
                    size="lg"
                  >
                    Add to Cart
                  </Button>

                  {!file && (
                    <p className="text-sm text-gray-mid text-center mt-2 font-serif">
                      Upload a file to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
