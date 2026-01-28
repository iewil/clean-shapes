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

// Materials
export function fetchMaterials() {
  return fetchJSON('/materials')
}

// Pricing
export function calculatePrice(data: {
  materialId: string
  thicknessLabel: string
  width: number
  height: number
  quantity: number
  services: string[]
}) {
  return fetchJSON('/pricing/calculate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function fetchPricingParameters() {
  return fetchJSON('/pricing/parameters')
}

export function updatePricingParameters(
  updates: Array<{ id: string; value: number }>
) {
  return fetchJSON('/pricing/parameters', {
    method: 'PUT',
    body: JSON.stringify({ updates }),
  })
}

// Orders
export function fetchOrders(status?: string) {
  const qs = status ? `?status=${status}` : ''
  return fetchJSON(`/orders${qs}`)
}

export function fetchOrder(id: string) {
  return fetchJSON(`/orders/${id}`)
}

export function createOrder(data: any) {
  return fetchJSON('/orders', { method: 'POST', body: JSON.stringify(data) })
}

export function updateOrder(
  id: string,
  data: { status?: string; notes?: string }
) {
  return fetchJSON(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Admin stats
export function fetchAdminStats() {
  return fetchJSON('/admin/stats')
}
