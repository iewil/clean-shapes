import type { ShapeTemplate } from '../data/templates'
import ShapePreview from './ShapePreview'

interface TemplateCardProps {
  template: ShapeTemplate
  onClick: () => void
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  const path = template.svgPath(template.defaultWidth, template.defaultHeight)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <div className="flex items-center justify-center bg-gray-50 rounded-md p-4 mb-3 group-hover:bg-blue-50 transition-colors duration-200">
        <ShapePreview
          path={path}
          width={template.defaultWidth}
          height={template.defaultHeight}
          className="w-20 h-20"
        />
      </div>
      <h3 className="font-sans text-sm font-bold text-charcoal truncate">
        {template.name}
      </h3>
      <p className="font-serif text-xs text-gray-500 mt-1 line-clamp-2">
        {template.description}
      </p>
    </button>
  )
}
