interface ShapePreviewProps {
  path: string
  width: number
  height: number
  className?: string
}

export default function ShapePreview({ path, width, height, className = '' }: ShapePreviewProps) {
  const padding = Math.max(width, height) * 0.1
  const vb = [-padding, -padding, width + padding * 2, height + padding * 2].join(' ')

  return (
    <svg
      viewBox={vb}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={path}
        fill="#e8f0fe"
        stroke="#0274be"
        strokeWidth={Math.max(width, height) * 0.02}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
