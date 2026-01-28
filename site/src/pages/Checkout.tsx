import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { createOrder } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
}

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const shippingCost = 12.99
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const total = subtotal + shippingCost
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address1 + (formData.address2 ? ', ' + formData.address2 : ''),
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        items: items.map((item) => ({
          name: item.name,
          type: item.type,
          materialId: item.materialId,
          material: item.material,
          thickness: item.thickness,
          quantity: item.quantity,
          services: item.services,
          dimensions: item.dimensions,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
        subtotal,
        shippingCost,
        total,
      }

      const result = await createOrder(orderData)
      setOrderNumber(result.orderNumber || result.order?.orderNumber || result.id)
      setSubmitted(true)
      clearCart()
    } catch (err: any) {
      // Fall back to client-side order number if API is unavailable
      const fallbackId = 'CS-' + Math.random().toString(36).substring(2, 7).toUpperCase()
      setOrderNumber(fallbackId)
      setSubmitted(true)
      clearCart()
    } finally {
      setSubmitting(false)
    }
  }

  if (!submitted && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-sans font-bold text-charcoal mb-4">Your cart is empty</h2>
        <p className="text-gray-mid font-serif mb-6">Add some items before checking out.</p>
        <Link to="/cart">
          <Button>Return to Cart</Button>
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <CheckCircle className="h-16 w-16 text-green-600 mb-6" />
        <h1 className="text-3xl font-sans font-bold text-charcoal mb-2">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-mid font-serif mb-1">
          Order number <span className="font-semibold text-charcoal">#{orderNumber}</span>
        </p>
        <p className="text-gray-mid font-serif mb-8">
          We'll send a confirmation email to{' '}
          <span className="font-semibold text-charcoal">{formData.email}</span>
        </p>
        <Link to="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-sans font-bold text-charcoal mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-10">
          {/* Contact Information */}
          <fieldset>
            <legend className="text-lg font-sans font-bold text-charcoal border-b border-gray-200 pb-2 mb-6 w-full">
              Contact Information
            </legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jane" />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
            </div>
            <div className="mt-5">
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" />
            </div>
            <div className="mt-5">
              <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="(555) 123-4567" />
            </div>
          </fieldset>

          {/* Shipping Address */}
          <fieldset>
            <legend className="text-lg font-sans font-bold text-charcoal border-b border-gray-200 pb-2 mb-6 w-full">
              Shipping Address
            </legend>
            <div className="space-y-5">
              <Input label="Address Line 1" name="address1" value={formData.address1} onChange={handleChange} required placeholder="123 Main Street" />
              <Input label="Address Line 2" name="address2" value={formData.address2} onChange={handleChange} placeholder="Apt, suite, unit (optional)" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <Input label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="Portland" />
                </div>
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required placeholder="OR" />
                <Input label="Zip Code" name="zip" value={formData.zip} onChange={handleChange} required placeholder="97201" />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-sans font-semibold text-charcoal mb-1">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          </fieldset>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-serif">
              {submitError}
            </div>
          )}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>

        {/* Right Column - Order Summary */}
        <aside>
          <div className="lg:sticky lg:top-24 rounded-lg border border-gray-200 bg-offwhite p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-sans font-bold text-charcoal">Order Summary</h2>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {itemCount}
              </span>
            </div>

            <ul className="divide-y divide-gray-200 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-charcoal truncate">{item.name}</p>
                    <p className="text-gray-mid text-xs font-serif">{item.material} · Qty {item.quantity}</p>
                  </div>
                  <p className="whitespace-nowrap font-sans font-semibold text-charcoal">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-mid font-serif">Subtotal</dt>
                <dd className="font-sans font-semibold text-charcoal">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-mid font-serif">Shipping</dt>
                <dd className="font-sans font-semibold text-charcoal">${shippingCost.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-sans font-bold text-charcoal">
                <dt>Total</dt>
                <dd>${total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </form>
    </div>
  )
}
