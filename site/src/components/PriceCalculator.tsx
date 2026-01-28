interface PriceCalculatorProps {
  unitPrice: number
  quantity: number
  discount?: number
  setupFee?: number
  subtotal: number
}

export default function PriceCalculator({
  unitPrice,
  quantity,
  discount,
  setupFee,
  subtotal,
}: PriceCalculatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm text-gray-600">Unit Price</span>
        <span className="font-sans text-sm font-semibold text-charcoal">
          {'$' + unitPrice.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-sans text-sm text-gray-600">Quantity</span>
        <span className="font-sans text-sm font-semibold text-charcoal">
          {quantity}
        </span>
      </div>

      {discount != null && discount > 0 && (
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-gray-600">Discount</span>
          <span className="font-sans text-sm font-semibold text-green-600">
            {'-' + Math.round(discount * 100) + '%'}
          </span>
        </div>
      )}

      {setupFee != null && setupFee > 0 && (
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-gray-600">Setup Fee</span>
          <span className="font-sans text-sm font-semibold text-charcoal">
            {'$' + setupFee.toFixed(2)}
          </span>
        </div>
      )}

      <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
        <span className="font-sans text-base font-bold text-charcoal">Subtotal</span>
        <span className="font-sans text-base font-bold text-charcoal">
          {'$' + subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
