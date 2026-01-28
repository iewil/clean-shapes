import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminStats, fetchOrders } from '../lib/api'
import type { Stats, Order } from '../types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

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

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData)
        setRecentOrders(ordersData.slice(0, 5))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-serif text-gray-mid">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 font-serif">
        Failed to load dashboard: {error}
      </div>
    )
  }

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, format: 'number' as const },
        { label: 'Pending Orders', value: stats.pendingOrders, format: 'number' as const },
        { label: 'Revenue', value: stats.revenue, format: 'currency' as const },
        { label: 'Active Materials', value: stats.activeMaterials, format: 'number' as const },
      ]
    : []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-sans text-3xl font-bold text-charcoal tracking-wide">
          Dashboard
        </h1>
        <p className="mt-1 font-serif text-gray-mid">
          Overview of your Clean Shapes admin portal.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <p className="text-sm font-sans font-medium text-gray-mid uppercase tracking-wider">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-sans font-bold text-charcoal">
              {card.format === 'currency'
                ? formatCurrency(card.value)
                : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-xl font-bold text-charcoal">
              Recent Orders
            </h2>
            <Link
              to="/orders"
              className="text-sm font-sans font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
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
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-offwhite transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-sans font-medium text-charcoal">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm font-serif text-charcoal">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
