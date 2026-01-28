import { useEffect, useState } from 'react'
import { fetchPricingParameters, updatePricingParameters } from '../lib/api'
import type { PricingParam } from '../types'
import Button from '../components/ui/Button'

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  cutting: 'Cutting & Laser',
  complexity: 'Complexity Factors',
  quantity: 'Quantity Breaks',
  rush: 'Rush & Expedite',
  shipping: 'Shipping',
  services: 'Service Add-ons',
}

const UNIT_DISPLAY: Record<string, string> = {
  percent: '%',
  dollars: '$',
  multiplier: '×',
  dollars_per_min: '$/min',
  dollars_per_lb: '$/lb',
}

export default function Pricing() {
  const [parameters, setParameters] = useState<PricingParam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modified, setModified] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    fetchPricingParameters()
      .then(setParameters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleValueChange(id: string, value: number) {
    setModified((prev) => ({ ...prev, [id]: value }))
  }

  function getCurrentValue(param: PricingParam) {
    return modified[param.id] !== undefined ? modified[param.id] : param.value
  }

  function formatUnit(unit: string) {
    return UNIT_DISPLAY[unit] || unit
  }

  async function handleSave() {
    const updates = Object.entries(modified).map(([id, value]) => ({ id, value }))
    if (updates.length === 0) return
    setSaving(true)
    try {
      const fresh = await updatePricingParameters(updates)
      setParameters(fresh)
      setModified({})
      setToast({ type: 'success', message: 'Pricing parameters saved successfully.' })
    } catch (err) {
      setToast({ type: 'error', message: (err as Error).message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-serif text-gray-mid">Loading pricing parameters...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 font-serif">
        Failed to load pricing parameters: {error}
      </div>
    )
  }

  const grouped: Record<string, PricingParam[]> = {}
  for (const param of parameters) {
    if (!grouped[param.category]) grouped[param.category] = []
    grouped[param.category].push(param)
  }

  const categoryOrder = ['general', 'cutting', 'complexity', 'quantity', 'rush', 'shipping', 'services']
  const sortedCategories = categoryOrder.filter((c) => grouped[c])
  const dirtyCount = Object.keys(modified).length

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-sans text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-sans text-3xl font-bold text-charcoal tracking-wide">Pricing Parameters</h1>
          <p className="mt-1 font-serif text-gray-mid">Adjust pricing rules and multipliers for the quoting engine.</p>
        </div>
        <Button onClick={handleSave} disabled={dirtyCount === 0 || saving}>
          {saving ? 'Saving...' : `Save Changes${dirtyCount > 0 ? ` (${dirtyCount})` : ''}`}
        </Button>
      </div>

      {sortedCategories.map((category) => (
        <div key={category} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-sans text-lg font-bold text-charcoal">{CATEGORY_LABELS[category] || category}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {grouped[category].map((param) => {
              const currentVal = getCurrentValue(param)
              const isDirty = modified[param.id] !== undefined
              return (
                <div key={param.id} className="px-6 py-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-sans font-semibold text-charcoal">{param.name}</h3>
                        {isDirty && (
                          <span className="px-1.5 py-0.5 text-[10px] font-sans font-bold bg-yellow-100 text-yellow-700 rounded">Modified</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm font-serif text-gray-mid">{param.description}</p>
                    </div>
                    <div className="flex items-center gap-4 lg:w-96">
                      <input type="range" min={param.min_value} max={param.max_value} step={param.step} value={currentVal}
                        onChange={(e) => handleValueChange(param.id, parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                      <div className="flex items-center gap-1 shrink-0">
                        {(param.unit === 'dollars' || param.unit === 'dollars_per_min' || param.unit === 'dollars_per_lb') && (
                          <span className="text-sm font-sans text-gray-mid">$</span>
                        )}
                        <input type="number" min={param.min_value} max={param.max_value} step={param.step} value={currentVal}
                          onChange={(e) => handleValueChange(param.id, parseFloat(e.target.value))}
                          className="w-20 px-2 py-1.5 text-sm font-sans text-charcoal bg-offwhite border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        {param.unit !== 'dollars' && (
                          <span className="text-sm font-sans text-gray-mid">{formatUnit(param.unit)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
