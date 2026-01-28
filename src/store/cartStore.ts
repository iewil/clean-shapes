import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  type: 'upload' | 'builder' | 'template'
  material: string
  materialId: string
  thickness: string
  quantity: number
  services: string[]
  dimensions?: { width: number; height: number }
  fileInfo?: { name: string; size: number; type: string }
  unitPrice: number
  subtotal: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item
        const unitPrice = item.subtotal / item.quantity
        return {
          ...item,
          quantity,
          unitPrice,
          subtotal: unitPrice * quantity,
        }
      }),
    })),

  clearCart: () => set({ items: [] }),
}))
