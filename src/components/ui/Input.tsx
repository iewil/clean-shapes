import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-sans font-semibold text-charcoal mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}
