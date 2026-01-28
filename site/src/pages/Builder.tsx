import { useState, useMemo, useEffect, useRef } from 'react'
import { calculateTotal, formatPrice, parsePricingParams, type PricingParams } from '../lib/pricing'
import { calculatePrice as apiCalculatePrice, fetchPricingParameters } from '../lib/api'
import { materials } from '../data/materials'
import { templates, templateCategories } from '../data/templates'
import { useCartStore } from '../store/cartStore'
import ShapePreview from '../components/ShapePreview'
import TemplateCard from '../components/TemplateCard'
import PriceCalculator from '../components/PriceCalculator'
import ServiceAddonPicker from '../components/ServiceAddonPicker'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import type { ShapeTemplate } from '../data/templates'

export default function Builder() {
  const addItem = useCartStore((s) => s.addItem)

  const [selectedTemplate, setSelectedTemplate] = useState<ShapeTemplate | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [width, setWidth] = useState(6)
  const [height, setHeight] = useState(4)
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0].id)
  const [selectedThickness, setSelectedThickness] = useState(materials[0].thicknesses[0].label)
  const [quantity, setQuantity] = useState(1)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [pricingParams, setPricingParams] = useState<PricingParams | null>(null)

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId)

  const thicknessOptions = (selectedMaterial?.thicknesses ?? []).map((t) => ({
    value: t.label,
    label: t.label,
  }))

  const materialOptions = materials.map((m) => ({ value: m.id, label: m.name }))

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...templateCategories.map((cat) => ({ value: cat, label: cat })),
  ]

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return templates
    return templates.filter((t) => t.category === categoryFilter)
  }, [categoryFilter])

  // Fetch pricing parameters from API once on mount
  useEffect(() => {
    fetchPricingParameters()
      .then((grouped) => setPricingParams(parsePricingParams(grouped)))
      .catch(() => {
        // API unavailable — client-side will use hardcoded defaults
      })
  }, [])

  const clientPricing = useMemo(() => {
    if (!selectedTemplate || !selectedMaterialId || !selectedThickness) {
      return { unitPrice: 0, discount: 0, subtotal: 0, setupFee: 0 }
    }
    return calculateTotal(selectedMaterialId, selectedThickness, width, height, quantity, selectedServices, pricingParams)
  }, [selectedTemplate, width, height, selectedMaterialId, selectedThickness, quantity, selectedServices, pricingParams])

  const [apiPricing, setApiPricing] = useState<{ unitPrice: number; discount: number; subtotal: number; setupFee?: number } | null>(null)
  const [apiPricingLoading, setApiPricingLoading] = useState(false)
  const apiDebounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setApiPricing(null)
    if (!selectedTemplate || !selectedMaterialId || !selectedThickness) return

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
  }, [selectedTemplate, width, height, selectedMaterialId, selectedThickness, quantity, selectedServices])

  const pricing = apiPricing || clientPricing

  function handleSelectTemplate(template: ShapeTemplate) {
    setSelectedTemplate(template)
    setWidth(template.defaultWidth)
    setHeight(template.defaultHeight)
  }

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
    if (!selectedTemplate || !selectedMaterial) return
    addItem({
      id: Date.now().toString(),
      name: selectedTemplate.name,
      type: 'builder',
      material: selectedMaterial.name,
      materialId: selectedMaterial.id,
      thickness: selectedThickness,
      quantity,
      services: selectedServices,
      dimensions: { width, height },
      unitPrice: pricing.unitPrice,
      subtotal: pricing.subtotal,
    })
  }

  const svgPath = selectedTemplate
    ? selectedTemplate.svgPath(width, height)
    : null

  return (
    <div>
      {/* Header */}
      <section className="bg-offwhite py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-sans font-bold text-charcoal">Parts Builder</h1>
          <p className="mt-2 text-gray-mid font-serif text-lg max-w-2xl">
            Select a template, configure dimensions and materials, then add your custom part to the cart.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Panel */}
          <div className="flex-1 min-w-0">
            {/* Template Gallery */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-sans font-bold text-charcoal">Choose a Template</h2>
                <div className="w-52">
                  <Select
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleSelectTemplate(template)}
                  />
                ))}
              </div>
            </div>

            {/* Configuration */}
            {selectedTemplate && (
              <div className="border border-gray-200 rounded-lg bg-white p-6">
                <h2 className="text-xl font-sans font-bold text-charcoal mb-6 pb-4 border-b border-gray-200">
                  Configure — <span className="text-primary">{selectedTemplate.name}</span>
                </h2>

                <div className="space-y-5">
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

                  <Select
                    label="Material"
                    id="material"
                    options={materialOptions}
                    value={selectedMaterialId}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                  />

                  <Select
                    label="Thickness"
                    id="thickness"
                    options={thicknessOptions}
                    value={selectedThickness}
                    onChange={(e) => setSelectedThickness(e.target.value)}
                  />

                  <Input
                    label="Quantity"
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="max-w-[150px]"
                  />

                  <div>
                    <h3 className="text-sm font-sans font-semibold text-charcoal mb-2">Service Add-ons</h3>
                    <ServiceAddonPicker selectedServices={selectedServices} onToggle={handleToggleService} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Preview */}
              <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="px-5 py-3 bg-charcoal text-white">
                  <h3 className="font-sans font-semibold">Live Preview</h3>
                </div>
                <div className="p-6 flex items-center justify-center min-h-[200px]">
                  {svgPath ? (
                    <ShapePreview path={svgPath} width={width} height={height} className="w-full max-h-48" />
                  ) : (
                    <p className="text-gray-400 italic text-sm font-serif">Select a template to see a preview</p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              {selectedTemplate ? (
                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                  <div className="px-5 py-3 bg-charcoal text-white">
                    <h3 className="font-sans font-semibold">Pricing Summary</h3>
                  </div>
                  <div className="p-6">
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
                      <Button onClick={handleAddToCart} className="w-full" size="lg">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg bg-white p-6 text-center">
                  <p className="text-gray-400 italic text-sm font-serif">
                    Configure your part to see pricing details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
