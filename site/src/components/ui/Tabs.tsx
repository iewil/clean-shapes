import { createContext, useContext, useState, type ReactNode } from 'react'

interface TabsContextValue {
  active: string
  setActive: (v: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs compound components must be used inside <Tabs>')
  return ctx
}

export function Tabs({
  defaultValue,
  children,
  className = '',
}: {
  defaultValue: string
  children: ReactNode
  className?: string
}) {
  const [active, setActive] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex gap-1 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className = '',
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const { active, setActive } = useTabs()
  const isActive = active === value
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2.5 text-sm font-sans font-semibold transition-colors border-b-2 -mb-px ${
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-mid hover:text-charcoal hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className = '',
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const { active } = useTabs()
  if (active !== value) return null
  return <div className={`pt-6 ${className}`}>{children}</div>
}
