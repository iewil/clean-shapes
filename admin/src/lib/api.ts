import type { Order, OrderItem, PricingParam, Stats } from '../types'

const API_BASE = '/api'

async function fetchJSON(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// --- Response mappers (snake_case DB rows → camelCase frontend types) ---

function mapOrderItem(raw: Record<string, unknown>): OrderItem {
  return {
    id: String(raw.id),
    name: raw.name as string,
    materialName: (raw.material_name as string) || '',
    thickness: (raw.thickness as string) || '',
    width: raw.width as number,
    height: raw.height as number,
    quantity: raw.quantity as number,
    services: typeof raw.services === 'string' ? raw.services : JSON.stringify(raw.services),
    unitPrice: raw.unit_price as number,
    subtotal: raw.subtotal as number,
  }
}

function mapOrder(raw: Record<string, unknown>): Order {
  const firstName = (raw.customer_first_name as string) || ''
  const lastName = (raw.customer_last_name as string) || ''
  return {
    id: raw.id as string,
    orderNumber: (raw.order_number as string) || '',
    customerName: `${firstName} ${lastName}`.trim(),
    customerEmail: (raw.customer_email as string) || '',
    customerPhone: (raw.customer_phone as string) || '',
    shippingAddress: (raw.shipping_address1 as string) || '',
    shippingCity: (raw.shipping_city as string) || '',
    shippingState: (raw.shipping_state as string) || '',
    shippingZip: (raw.shipping_zip as string) || '',
    shippingCountry: (raw.shipping_country as string) || 'US',
    status: raw.status as string,
    notes: (raw.notes as string) || '',
    subtotal: raw.subtotal as number,
    shippingCost: (raw.shipping_cost as number) || 0,
    tax: (raw.tax as number) || 0,
    total: raw.total as number,
    createdAt: (raw.created_at as string) || '',
    updatedAt: (raw.updated_at as string) || '',
    items: Array.isArray(raw.items)
      ? (raw.items as Record<string, unknown>[]).map(mapOrderItem)
      : [],
  }
}

// --- API functions ---

// Pricing
export async function fetchPricingParameters(): Promise<PricingParam[]> {
  const grouped: Record<string, PricingParam[]> = await fetchJSON('/pricing/parameters')
  const flat: PricingParam[] = []
  for (const params of Object.values(grouped)) {
    flat.push(...params)
  }
  return flat
}

export async function updatePricingParameters(
  updates: Array<{ id: string; value: number }>
): Promise<PricingParam[]> {
  const grouped: Record<string, PricingParam[]> = await fetchJSON('/pricing/parameters', {
    method: 'PUT',
    body: JSON.stringify({ updates }),
  })
  const flat: PricingParam[] = []
  for (const params of Object.values(grouped)) {
    flat.push(...params)
  }
  return flat
}

// Orders
export async function fetchOrders(): Promise<Order[]> {
  const rows: Record<string, unknown>[] = await fetchJSON('/orders')
  return rows.map(mapOrder)
}

export async function fetchOrder(id: string): Promise<Order> {
  const raw: Record<string, unknown> = await fetchJSON(`/orders/${id}`)
  return mapOrder(raw)
}

export async function updateOrder(
  id: string,
  data: { status?: string; notes?: string }
): Promise<void> {
  await fetchJSON(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Admin stats
export async function fetchAdminStats(): Promise<Stats> {
  const raw = await fetchJSON('/admin/stats')
  const ordersByStatus: Record<string, number> = raw.ordersByStatus || {}
  return {
    totalOrders: raw.totalOrders || 0,
    pendingOrders: ordersByStatus.pending || 0,
    revenue: raw.totalRevenue || 0,
    activeMaterials: raw.activeMaterials || 0,
  }
}
