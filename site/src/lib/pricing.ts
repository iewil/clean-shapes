import { materials, type Material, type Thickness } from '../data/materials'
import { services as serviceData } from '../data/services'

/**
 * Pricing parameters fetched from /api/pricing/parameters.
 * When provided, the client-side calculation mirrors the server-side engine.
 * When null, falls back to the original simple calculation.
 */
export interface PricingParams {
  base_markup_pct: number
  kerf_waste_pct: number
  minimum_part: number
  setup_fee: number
  complexity_simple: number
  qty_break_10_pct: number
  qty_break_50_pct: number
  qty_break_100_pct: number
  qty_break_500_pct: number
  svc_bending: number
  svc_anodizing: number
  svc_powder_coating: number
  svc_plating: number
  svc_deburring: number
  svc_hardware: number
  svc_countersinking: number
}

const serviceParamMap: Record<string, keyof PricingParams> = {
  'bending': 'svc_bending',
  'anodizing': 'svc_anodizing',
  'powder-coating': 'svc_powder_coating',
  'plating': 'svc_plating',
  'deburring': 'svc_deburring',
  'hardware-insertion': 'svc_hardware',
  'countersinking': 'svc_countersinking',
}

export function getMaterial(materialId: string): Material | undefined {
  return materials.find((m) => m.id === materialId)
}

export function getThickness(material: Material, thicknessLabel: string): Thickness | undefined {
  return material.thicknesses.find((t) => t.label === thicknessLabel)
}

export function calculateBasePrice(
  pricePerSqIn: number,
  widthInches: number,
  heightInches: number
): number {
  const area = widthInches * heightInches
  return area * pricePerSqIn
}

export function getQuantityDiscount(quantity: number, params?: PricingParams | null): number {
  if (params) {
    if (quantity >= 500) return (params.qty_break_500_pct || 0) / 100
    if (quantity >= 100) return (params.qty_break_100_pct || 0) / 100
    if (quantity >= 50) return (params.qty_break_50_pct || 0) / 100
    if (quantity >= 10) return (params.qty_break_10_pct || 0) / 100
    return 0
  }
  // Fallback: hardcoded defaults
  if (quantity >= 100) return 0.20
  if (quantity >= 50) return 0.15
  if (quantity >= 10) return 0.10
  return 0
}

export function calculateServicesTotal(selectedServiceIds: string[], params?: PricingParams | null): number {
  if (params) {
    return selectedServiceIds.reduce((sum, id) => {
      const paramKey = serviceParamMap[id]
      if (paramKey) {
        return sum + (params[paramKey] as number || 0)
      }
      return sum
    }, 0)
  }
  // Fallback: use static data
  return selectedServiceIds.reduce((sum, id) => {
    const service = serviceData.find((s) => s.id === id)
    return sum + (service?.flatFee ?? 0)
  }, 0)
}

export function calculateUnitPrice(
  materialId: string,
  thicknessLabel: string,
  widthInches: number,
  heightInches: number,
  selectedServices: string[],
  params?: PricingParams | null
): number {
  const material = getMaterial(materialId)
  if (!material) return 0

  const thickness = getThickness(material, thicknessLabel)
  if (!thickness) return 0

  const base = calculateBasePrice(thickness.pricePerSqIn, widthInches, heightInches)

  if (params) {
    // Full calculation matching server-side engine
    const wasteFactor = 1 + ((params.kerf_waste_pct || 0) / 100)
    const markupFactor = 1 + ((params.base_markup_pct || 0) / 100)
    const complexityFactor = params.complexity_simple || 1
    const unitBase = base * wasteFactor * markupFactor * complexityFactor
    const servicesTotal = calculateServicesTotal(selectedServices, params)
    return Math.max(unitBase + servicesTotal, params.minimum_part || 0.50)
  }

  // Fallback: simple calculation
  const servicesTotal = calculateServicesTotal(selectedServices)
  return Math.max(base + servicesTotal, 0.50)
}

export function calculateTotal(
  materialId: string,
  thicknessLabel: string,
  widthInches: number,
  heightInches: number,
  quantity: number,
  selectedServices: string[],
  params?: PricingParams | null
): { unitPrice: number; discount: number; subtotal: number; setupFee: number } {
  const unitPrice = calculateUnitPrice(materialId, thicknessLabel, widthInches, heightInches, selectedServices, params)
  const discount = getQuantityDiscount(quantity, params)
  const setupFee = params ? (params.setup_fee || 0) : 0
  const subtotal = (unitPrice * quantity * (1 - discount)) + setupFee

  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    discount,
    subtotal: Math.round(subtotal * 100) / 100,
    setupFee: Math.round(setupFee * 100) / 100,
  }
}

export function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`
}

/**
 * Parse the grouped response from /api/pricing/parameters into a flat PricingParams object.
 */
export function parsePricingParams(grouped: Record<string, Array<{ id: string; value: number }>>): PricingParams {
  const flat: Record<string, number> = {}
  for (const params of Object.values(grouped)) {
    for (const p of params) {
      flat[p.id] = p.value
    }
  }
  return flat as unknown as PricingParams
}
