import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchOrder, updateOrder } from '../lib/api'
import type { Order, OrderItem } from '../types'
import Button from '../components/ui/Button'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_production', label: 'In Production' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    if (!id) return
    fetchOrder(id)
      .then((data) => {
        setOrder(data)
        setEditStatus(data.status)
        setEditNotes(data.notes || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave() {
    if (!order || !id) return
    setSaving(true)
    try {
      await updateOrder(id, { status: editStatus, notes: editNotes })
      setOrder({ ...order, status: editStatus, notes: editNotes })
      setToast({ type: 'success', message: 'Order updated successfully.' })
    } catch (err) {
      setToast({ type: 'error', message: (err as Error).message })
    } finally {
      setSaving(false)
    }
  }

  const isDirty = order && (editStatus !== order.status || editNotes !== (order.notes || ''))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-serif text-gray-mid">Loading order...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-sans font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 font-serif">
          {error || 'Order not found.'}
        </div>
      </div>
    )
  }

  const parsedServices = (item: OrderItem) => {
    try {
      const svc = JSON.parse(item.services)
      return Array.isArray(svc) ? svc.join(', ') : item.services
    } catch {
      return item.services || 'None'
    }
  }

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

      {/* Back Link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-sans font-medium text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-bold text-charcoal tracking-wide">
            Order {order.orderNumber}
          </h1>
          <p className="mt-1 font-serif text-gray-mid">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-sans font-medium ${
            STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {formatStatus(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Line Items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-sans text-lg font-bold text-charcoal">Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(order.items || []).map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-offwhite transition-colors">
                      <td className="px-6 py-4 text-sm font-sans font-medium text-charcoal">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-serif text-charcoal">
                        {item.materialName}
                        {item.thickness && (
                          <span className="text-gray-mid"> / {item.thickness}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-serif text-gray-mid">
                        {item.width}" x {item.height}"
                      </td>
                      <td className="px-6 py-4 text-sm font-sans text-charcoal text-center">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-serif text-gray-mid">
                        {parsedServices(item)}
                      </td>
                      <td className="px-6 py-4 text-sm font-sans text-charcoal text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-sm font-sans font-medium text-charcoal text-right">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-mid font-serif">
                        No line items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="px-6 py-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-serif text-gray-mid">Subtotal</span>
                <span className="font-sans font-semibold text-charcoal">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-serif text-gray-mid">Shipping</span>
                <span className="font-sans font-semibold text-charcoal">
                  {formatCurrency(order.shippingCost)}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-serif text-gray-mid">Tax</span>
                  <span className="font-sans font-semibold text-charcoal">
                    {formatCurrency(order.tax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <span className="font-sans font-bold text-charcoal">Total</span>
                <span className="font-sans font-bold text-charcoal">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-sans text-sm font-semibold text-gray-mid uppercase tracking-wider mb-4">
                Customer Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-serif text-gray-mid">Name</dt>
                  <dd className="font-sans font-medium text-charcoal">{order.customerName}</dd>
                </div>
                <div>
                  <dt className="font-serif text-gray-mid">Email</dt>
                  <dd className="font-sans font-medium text-charcoal">{order.customerEmail}</dd>
                </div>
                {order.customerPhone && (
                  <div>
                    <dt className="font-serif text-gray-mid">Phone</dt>
                    <dd className="font-sans font-medium text-charcoal">{order.customerPhone}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-sans text-sm font-semibold text-gray-mid uppercase tracking-wider mb-4">
                Shipping Address
              </h3>
              <p className="text-sm font-serif text-charcoal leading-relaxed">
                {order.shippingAddress}
                <br />
                {order.shippingCity}, {order.shippingState} {order.shippingZip}
                <br />
                {order.shippingCountry}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Status & Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
            <h3 className="font-sans text-lg font-bold text-charcoal">Update Order</h3>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-sans font-semibold text-charcoal mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-sans font-semibold text-charcoal mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                rows={5}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Internal notes about this order..."
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
