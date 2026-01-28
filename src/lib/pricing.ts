import { materials, type Material, type Thickness } from '../data/materials'
import { services as serviceData } from '../data/services'

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

export function getQuantityDiscount(quantity: number): number {
  if (quantity >= 100) return 0.20
  if (quantity >= 50) return 0.15
  if (quantity >= 10) return 0.10
  return 0
}

export function calculateServicesTotal(selectedServiceIds: string[]): number {
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
  selectedServices: string[]
): number {
  const material = getMaterial(materialId)
  if (!material) return 0

  const thickness = getThickness(material, thicknessLabel)
  if (!thickness) return 0

  const base = calculateBasePrice(thickness.pricePerSqIn, widthInches, heightInches)
  const servicesTotal = calculateServicesTotal(selectedServices)

  return Math.max(base + servicesTotal, 0.50) // minimum $0.50 per part
}

export function calculateTotal(
  materialId: string,
  thicknessLabel: string,
  widthInches: number,
  heightInches: number,
  quantity: number,
  selectedServices: string[]
): { unitPrice: number; discount: number; subtotal: number } {
  const unitPrice = calculateUnitPrice(materialId, thicknessLabel, widthInches, heightInches, selectedServices)
  const discount = getQuantityDiscount(quantity)
  const subtotal = unitPrice * quantity * (1 - discount)

  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    discount,
    subtotal: Math.round(subtotal * 100) / 100,
  }
}

export function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`
}
