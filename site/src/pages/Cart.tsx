import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import CartItemComponent from '../components/CartItem'
import Button from '../components/ui/Button'

const SHIPPING_COST = 12.99

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const total = subtotal + (items.length > 0 ? SHIPPING_COST : 0)

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.5} />
        <h1 className="text-3xl font-sans font-bold text-charcoal mb-3">Your Cart</h1>
        <p className="text-gray-mid text-lg font-serif mb-8">Your cart is empty</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/builder">
            <Button>Design a Shape</Button>
          </Link>
          <Link to="/upload">
            <Button variant="outline">Upload a Design</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-sans font-bold text-charcoal mb-8">Your Cart</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onRemove={(id) => removeItem(id)}
              onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
            />
          ))}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 text-sm font-sans text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-10 lg:mt-0">
          <div className="bg-offwhite border border-gray-200 rounded-lg p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-sans font-bold text-charcoal mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-mid font-serif">Subtotal</span>
                <span className="font-sans font-semibold text-charcoal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-mid font-serif">Estimated Shipping</span>
                <span className="font-sans font-semibold text-charcoal">${SHIPPING_COST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-mid font-serif">Estimated Ship Date</span>
                <span className="font-sans font-semibold text-charcoal">3–5 business days</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-5 pt-5">
              <div className="flex justify-between text-charcoal font-sans font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </Link>

            <Link
              to="/builder"
              className="block text-center text-sm text-gray-mid hover:text-charcoal transition-colors mt-4 font-serif"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
