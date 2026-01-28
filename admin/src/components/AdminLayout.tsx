import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  DollarSign,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: Package, end: false },
  { to: '/pricing', label: 'Pricing', icon: DollarSign, end: false },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans font-medium transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-sans text-xl font-bold tracking-wider text-white">
            CLEAN SHAPES
          </span>
          <span className="px-2 py-0.5 text-[10px] font-sans font-bold tracking-widest uppercase bg-primary text-white rounded">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => linkClasses(isActive)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Back to Store */}
      <div className="px-4 py-6 border-t border-white/10">
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </a>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-offwhite">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-dark">
        {sidebar}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark transform transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        {sidebar}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-charcoal hover:text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-sans text-lg font-bold tracking-wider text-charcoal">
            CLEAN SHAPES
          </span>
          <span className="px-2 py-0.5 text-[10px] font-sans font-bold tracking-widest uppercase bg-primary text-white rounded">
            Admin
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
