import { jsonResponse, errorResponse, type CFContext } from '../../env'

interface CalculateRequest {
  materialId: string
  thicknessLabel: string
  width: number
  height: number
  quantity: number
  services: string[]
}

const serviceParamMap: Record<string, string> = {
  'bending': 'svc_bending',
  'anodizing': 'svc_anodizing',
  'powder-coating': 'svc_powder_coating',
  'plating': 'svc_plating',
  'deburring': 'svc_deburring',
  'hardware-insertion': 'svc_hardware',
  'countersinking': 'svc_countersinking',
}

export async function onRequestPost(context: CFContext) {
  const db = context.env.DB

  try {
    const body: CalculateRequest = await context.request.json()
    const { materialId, thicknessLabel, width, height, quantity, services } = body

    if (!materialId || !thicknessLabel || !width || !height || !quantity) {
      return errorResponse('Missing required fields: materialId, thicknessLabel, width, height, quantity')
    }

    // Look up base price per square inch from thicknesses table
    const thickness = await db
      .prepare('SELECT base_price_per_sq_in FROM thicknesses WHERE material_id = ? AND label = ? AND active = 1')
      .bind(materialId, thicknessLabel)
      .first()

    if (!thickness) {
      return errorResponse('Thickness not found for the given material and label', 404)
    }

    const basePricePerSqIn = thickness.base_price_per_sq_in as number

    // Fetch all pricing parameters
    const { results: params } = await db
      .prepare('SELECT * FROM pricing_parameters')
      .all()

    const paramMap: Record<string, number> = {}
    for (const p of params) {
      paramMap[p.id as string] = p.value as number
    }

    // Calculate pricing
    const area = width * height
    const materialCost = area * basePricePerSqIn
    const wasteFactor = 1 + ((paramMap['kerf_waste_pct'] || 0) / 100)
    const markupFactor = 1 + ((paramMap['base_markup_pct'] || 0) / 100)
    let unitBase = materialCost * wasteFactor * markupFactor

    // Apply complexity multiplier (simple for builder parts)
    const complexityMultiplier = paramMap['complexity_simple'] || 1
    unitBase *= complexityMultiplier

    // Add service costs
    let serviceCost = 0
    if (services && services.length > 0) {
      for (const svc of services) {
        const paramKey = serviceParamMap[svc]
        if (paramKey && paramMap[paramKey] !== undefined) {
          serviceCost += paramMap[paramKey]
        }
      }
    }

    let unitPrice = unitBase + serviceCost

    // Enforce minimum part charge
    const minimumPart = paramMap['minimum_part'] || 0
    if (unitPrice < minimumPart) {
      unitPrice = minimumPart
    }

    // Apply quantity discount
    let discount = 0
    const qtyBreaks = Object.keys(paramMap)
      .filter((k) => k.startsWith('qty_break_'))
      .sort()

    for (const key of qtyBreaks) {
      const qtyThreshold = parseInt(key.replace('qty_break_', ''), 10)
      if (quantity >= qtyThreshold) {
        discount = paramMap[key] / 100
      }
    }

    // Setup fee (once, not per part)
    const setupFee = paramMap['setup_fee'] || 0

    // Total calculation
    const total = (unitPrice * quantity * (1 - discount)) + setupFee

    return jsonResponse({
      unitPrice: Math.round(unitPrice * 100) / 100,
      quantity,
      discount: Math.round(discount * 10000) / 10000,
      setupFee: Math.round(setupFee * 100) / 100,
      subtotal: Math.round(total * 100) / 100,
    })
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to calculate pricing: ' + message, 500)
  }
}
