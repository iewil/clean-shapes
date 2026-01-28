import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { fetchOrders } from '../lib/api'
import type { Order } from '../types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUSES = [
  { value: '', label: 'All' },
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
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const statusFiltered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders

  const filteredOrders = search
    ? statusFiltered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.customerName.toLowerCase().includes(search.toLowerCase())
      )
    : statusFiltered

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-serif text-gray-mid">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 font-serif">
        Failed to load orders: {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-bold text-charcoal tracking-wide">
          Orders
        </h1>
        <p className="mt-1 font-serif text-gray-mid">
          View and manage customer orders.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-2.5 text-sm font-sans font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              statusFilter === s.value
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-mid hover:text-charcoal hover:border-gray-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order # or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 bg-white text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-sans font-semibold text-gray-mid uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-offwhite transition-colors"
              >
                <td className="px-6 py-4 text-sm font-sans font-medium">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm font-serif text-charcoal">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm font-serif text-gray-mid">
                  {order.customerEmail}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-sans text-charcoal text-right">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 text-sm font-serif text-gray-mid text-right">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-mid font-serif"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
