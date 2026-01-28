export interface PricingParam {
  id: string
  name: string
  description: string
  category: string
  value: number
  unit: string
  min_value: number
  max_value: number
  step: number
}

export interface OrderItem {
  id: string
  name: string
  materialName: string
  thickness: string
  width: number
  height: number
  quantity: number
  services: string
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string
  status: string
  notes: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface Stats {
  totalOrders: number
  pendingOrders: number
  revenue: number
  activeMaterials: number
}
