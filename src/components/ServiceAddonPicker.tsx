import {
  Zap,
  CornerDownRight,
  Paintbrush,
  Droplets,
  Layers,
  Eraser,
  Wrench,
  Target,
  CircleDot,
  type LucideIcon,
} from 'lucide-react'
import { services } from '../data/services'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  CornerDownRight,
  Paintbrush,
  Droplets,
  Layers,
  Eraser,
  Wrench,
  Target,
}

interface ServiceAddonPickerProps {
  selectedServices: string[]
  onToggle: (serviceId: string) => void
}

export default function ServiceAddonPicker({ selectedServices, onToggle }: ServiceAddonPickerProps) {
  return (
    <div className="space-y-2">
      {services.map((service) => {
        const Icon = iconMap[service.icon] ?? CircleDot
        const isSelected = selectedServices.includes(service.id)

        return (
          <label
            key={service.id}
            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors duration-150 ${
              isSelected ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(service.id)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Icon className="w-5 h-5 text-gray-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-sans text-sm font-semibold text-charcoal">{service.name}</span>
              <span className="font-serif text-xs text-gray-500 ml-2">{service.priceLabel}</span>
            </div>
          </label>
        )
      })}
    </div>
  )
}
