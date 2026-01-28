import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../store/cartStore'

interface CartItemProps {
  item: CartItemType
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-sans text-base font-bold text-charcoal truncate">
          {item.name}
        </h3>

        <div className="mt-1 space-y-0.5">
          <p className="font-serif text-sm text-gray-500">
            Material: <span className="text-charcoal">{item.material}</span>
          </p>
          <p className="font-serif text-sm text-gray-500">
            Thickness: <span className="text-charcoal">{item.thickness}</span>
          </p>
          {item.dimensions && (
            <p className="font-serif text-sm text-gray-500">
              Dimensions:{' '}
              <span className="text-charcoal">
                {item.dimensions.width}&quot; &times; {item.dimensions.height}&quot;
              </span>
            </p>
          )}
          {item.services.length > 0 && (
            <p className="font-serif text-sm text-gray-500">
              Services:{' '}
              <span className="text-charcoal">{item.services.join(', ')}</span>
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Pricing */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <label htmlFor={'qty-' + item.id} className="font-sans text-xs text-gray-500">
            Qty
          </label>
          <input
            id={'qty-' + item.id}
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (val > 0) onUpdateQuantity(item.id, val)
            }}
            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center font-sans text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <p className="font-sans text-xs text-gray-500">
          Unit: <span className="font-semibold text-charcoal">{'$' + item.unitPrice.toFixed(2)}</span>
        </p>
        <p className="font-sans text-sm font-bold text-charcoal">
          {'$' + item.subtotal.toFixed(2)}
        </p>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="mt-1 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-sans text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
          aria-label={'Remove ' + item.name}
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  )
}
