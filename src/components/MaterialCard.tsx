import type { Material } from '../data/materials'
import { Card, CardContent } from './ui/Card'
import Badge from './ui/Badge'

interface MaterialCardProps {
  material: Material
}

export default function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Card className="group cursor-pointer transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Color swatch */}
          <div
            className="w-10 h-10 rounded-md border border-gray-200 shrink-0"
            style={{ backgroundColor: material.color }}
            aria-label={`${material.name} color swatch`}
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-sans text-lg font-bold text-charcoal truncate">
              {material.name}
            </h3>
            <p className="font-serif text-sm text-gray-500 mt-1 line-clamp-2">
              {material.description}
            </p>
            <div className="mt-3">
              <Badge variant="secondary">
                {material.thicknesses.length} thickness{material.thicknesses.length !== 1 ? 'es' : ''} available
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
