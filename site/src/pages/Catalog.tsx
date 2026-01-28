import { useState, useEffect, useMemo } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'

const modules = import.meta.glob('../components/**/*.tsx', { eager: true })

interface ComponentEntry {
  name: string
  path: string
  group: string
  Component: React.ComponentType
}

function getGroup(path: string): string {
  // path like ../components/ui/Button.tsx → "ui"
  // path like ../components/Header.tsx → "components"
  const parts = path.replace('../components/', '').split('/')
  return parts.length > 1 ? parts.slice(0, -1).join('/') : 'components'
}

function getFileName(path: string): string {
  return path.split('/').pop()?.replace('.tsx', '') ?? path
}

function buildEntries(): ComponentEntry[] {
  const entries: ComponentEntry[] = []

  for (const [path, mod] of Object.entries(modules)) {
    const module = mod as Record<string, unknown>
    const group = getGroup(path)
    const fileName = getFileName(path)

    for (const [exportName, exported] of Object.entries(module)) {
      if (typeof exported !== 'function') continue
      // Skip non-component exports (lowercase first letter, not a class)
      const name = exportName === 'default' ? fileName : exportName
      if (!/^[A-Z]/.test(name)) continue

      entries.push({
        name,
        path,
        group,
        Component: exported as React.ComponentType,
      })
    }
  }

  entries.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
  return entries
}

export default function Catalog() {
  const entries = useMemo(() => buildEntries(), [])

  const groups = useMemo(() => {
    const map = new Map<string, ComponentEntry[]>()
    for (const entry of entries) {
      const list = map.get(entry.group) ?? []
      list.push(entry)
      map.set(entry.group, list)
    }
    return map
  }, [entries])

  const [selected, setSelected] = useState<string>(() => {
    return window.location.hash.slice(1) || entries[0]?.name || ''
  })

  useEffect(() => {
    const onHash = () => setSelected(window.location.hash.slice(1))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const active = entries.find((e) => e.name === selected)

  return (
    <div className="flex min-h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-offwhite overflow-y-auto p-4">
        <h2 className="font-sans text-lg font-bold text-charcoal mb-4">
          Component Catalog
        </h2>
        <p className="text-sm text-gray-500 mb-4 font-serif">
          {entries.length} components
        </p>
        {Array.from(groups.entries()).map(([group, items]) => (
          <div key={group} className="mb-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              {group}
            </h3>
            <ul>
              {items.map((entry) => (
                <li key={entry.name}>
                  <a
                    href={`#${entry.name}`}
                    onClick={() => setSelected(entry.name)}
                    className={`block px-2 py-1 rounded text-sm font-sans transition-colors ${
                      selected === entry.name
                        ? 'bg-primary text-white'
                        : 'text-charcoal hover:bg-gray-100'
                    }`}
                  >
                    {entry.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main panel */}
      <main className="flex-1 p-8">
        {active ? (
          <div>
            <div className="mb-6">
              <h1 className="font-sans text-2xl font-bold text-charcoal">
                {active.name}
              </h1>
              <p className="text-sm text-gray-500 font-mono mt-1">
                {active.path.replace('../', 'src/')}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <ErrorBoundary key={active.name}>
                <active.Component />
              </ErrorBoundary>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 font-serif">
            Select a component from the sidebar.
          </p>
        )}
      </main>
    </div>
  )
}
