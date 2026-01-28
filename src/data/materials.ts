export interface Material {
  id: string
  name: string
  category: 'metals' | 'plastics' | 'composites' | 'wood'
  description: string
  thicknesses: Thickness[]
  color: string
}

export interface Thickness {
  label: string
  inches: number
  pricePerSqIn: number
}

export const materials: Material[] = [
  {
    id: 'mild-steel',
    name: 'Mild Steel',
    category: 'metals',
    description: 'Versatile carbon steel suitable for general fabrication, structural parts, and brackets.',
    color: '#71797E',
    thicknesses: [
      { label: '22 ga (0.030")', inches: 0.030, pricePerSqIn: 0.03 },
      { label: '20 ga (0.036")', inches: 0.036, pricePerSqIn: 0.035 },
      { label: '18 ga (0.048")', inches: 0.048, pricePerSqIn: 0.045 },
      { label: '16 ga (0.060")', inches: 0.060, pricePerSqIn: 0.055 },
      { label: '14 ga (0.075")', inches: 0.075, pricePerSqIn: 0.07 },
      { label: '11 ga (0.120")', inches: 0.120, pricePerSqIn: 0.10 },
      { label: '3/16" (0.188)', inches: 0.188, pricePerSqIn: 0.15 },
      { label: '1/4" (0.250)', inches: 0.250, pricePerSqIn: 0.20 },
    ],
  },
  {
    id: 'stainless-304',
    name: '304 Stainless Steel',
    category: 'metals',
    description: 'Corrosion-resistant austenitic stainless steel. Ideal for food equipment, marine, and architectural use.',
    color: '#C0C0C0',
    thicknesses: [
      { label: '22 ga (0.030")', inches: 0.030, pricePerSqIn: 0.06 },
      { label: '20 ga (0.036")', inches: 0.036, pricePerSqIn: 0.07 },
      { label: '18 ga (0.048")', inches: 0.048, pricePerSqIn: 0.09 },
      { label: '16 ga (0.060")', inches: 0.060, pricePerSqIn: 0.11 },
      { label: '14 ga (0.075")', inches: 0.075, pricePerSqIn: 0.14 },
      { label: '11 ga (0.120")', inches: 0.120, pricePerSqIn: 0.20 },
      { label: '3/16" (0.188)', inches: 0.188, pricePerSqIn: 0.30 },
      { label: '1/4" (0.250)', inches: 0.250, pricePerSqIn: 0.40 },
    ],
  },
  {
    id: 'stainless-316',
    name: '316 Stainless Steel',
    category: 'metals',
    description: 'Superior corrosion resistance with molybdenum. Best for marine, chemical processing, and medical.',
    color: '#B8B8B8',
    thicknesses: [
      { label: '20 ga (0.036")', inches: 0.036, pricePerSqIn: 0.09 },
      { label: '18 ga (0.048")', inches: 0.048, pricePerSqIn: 0.12 },
      { label: '16 ga (0.060")', inches: 0.060, pricePerSqIn: 0.15 },
      { label: '14 ga (0.075")', inches: 0.075, pricePerSqIn: 0.18 },
      { label: '11 ga (0.120")', inches: 0.120, pricePerSqIn: 0.26 },
      { label: '1/4" (0.250)', inches: 0.250, pricePerSqIn: 0.50 },
    ],
  },
  {
    id: 'aluminum-5052',
    name: '5052 Aluminum',
    category: 'metals',
    description: 'Good workability and corrosion resistance. Popular for sheet metal work and marine applications.',
    color: '#A8A9AD',
    thicknesses: [
      { label: '0.040"', inches: 0.040, pricePerSqIn: 0.04 },
      { label: '0.063"', inches: 0.063, pricePerSqIn: 0.05 },
      { label: '0.080"', inches: 0.080, pricePerSqIn: 0.06 },
      { label: '0.100"', inches: 0.100, pricePerSqIn: 0.08 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.10 },
      { label: '0.190"', inches: 0.190, pricePerSqIn: 0.14 },
      { label: '0.250"', inches: 0.250, pricePerSqIn: 0.18 },
    ],
  },
  {
    id: 'aluminum-6061',
    name: '6061-T6 Aluminum',
    category: 'metals',
    description: 'Heat-treatable alloy with excellent machinability. Ideal for structural and precision parts.',
    color: '#B0B0B0',
    thicknesses: [
      { label: '0.063"', inches: 0.063, pricePerSqIn: 0.06 },
      { label: '0.080"', inches: 0.080, pricePerSqIn: 0.07 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.11 },
      { label: '0.190"', inches: 0.190, pricePerSqIn: 0.16 },
      { label: '0.250"', inches: 0.250, pricePerSqIn: 0.22 },
      { label: '0.375"', inches: 0.375, pricePerSqIn: 0.32 },
      { label: '0.500"', inches: 0.500, pricePerSqIn: 0.42 },
    ],
  },
  {
    id: 'copper-110',
    name: 'C110 Copper',
    category: 'metals',
    description: 'High-purity electrolytic copper. Excellent conductivity for electrical and decorative applications.',
    color: '#B87333',
    thicknesses: [
      { label: '0.032"', inches: 0.032, pricePerSqIn: 0.08 },
      { label: '0.040"', inches: 0.040, pricePerSqIn: 0.10 },
      { label: '0.063"', inches: 0.063, pricePerSqIn: 0.14 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.25 },
      { label: '0.190"', inches: 0.190, pricePerSqIn: 0.38 },
    ],
  },
  {
    id: 'brass-260',
    name: '260 Brass',
    category: 'metals',
    description: 'Cartridge brass with excellent formability. Used for decorative, electrical, and hardware applications.',
    color: '#C9B037',
    thicknesses: [
      { label: '0.032"', inches: 0.032, pricePerSqIn: 0.07 },
      { label: '0.040"', inches: 0.040, pricePerSqIn: 0.08 },
      { label: '0.063"', inches: 0.063, pricePerSqIn: 0.12 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.22 },
      { label: '0.190"', inches: 0.190, pricePerSqIn: 0.32 },
    ],
  },
  {
    id: 'titanium-gr2',
    name: 'Grade 2 Titanium',
    category: 'metals',
    description: 'Commercially pure titanium. Excellent strength-to-weight ratio and corrosion resistance.',
    color: '#878681',
    thicknesses: [
      { label: '0.040"', inches: 0.040, pricePerSqIn: 0.20 },
      { label: '0.063"', inches: 0.063, pricePerSqIn: 0.30 },
      { label: '0.080"', inches: 0.080, pricePerSqIn: 0.38 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.55 },
      { label: '0.250"', inches: 0.250, pricePerSqIn: 1.00 },
    ],
  },
  {
    id: 'acrylic-clear',
    name: 'Clear Acrylic',
    category: 'plastics',
    description: 'Optically clear cast acrylic. Lightweight, shatter-resistant alternative to glass.',
    color: '#E8F4FD',
    thicknesses: [
      { label: '1/16" (0.060)', inches: 0.060, pricePerSqIn: 0.02 },
      { label: '1/8" (0.118)', inches: 0.118, pricePerSqIn: 0.03 },
      { label: '3/16" (0.177)', inches: 0.177, pricePerSqIn: 0.04 },
      { label: '1/4" (0.236)', inches: 0.236, pricePerSqIn: 0.05 },
      { label: '3/8" (0.354)', inches: 0.354, pricePerSqIn: 0.07 },
      { label: '1/2" (0.472)', inches: 0.472, pricePerSqIn: 0.09 },
    ],
  },
  {
    id: 'delrin',
    name: 'Delrin (Acetal)',
    category: 'plastics',
    description: 'High-performance engineering thermoplastic. Low friction, excellent dimensional stability.',
    color: '#F5F5DC',
    thicknesses: [
      { label: '1/16" (0.060)', inches: 0.060, pricePerSqIn: 0.03 },
      { label: '1/8" (0.125)', inches: 0.125, pricePerSqIn: 0.05 },
      { label: '1/4" (0.250)', inches: 0.250, pricePerSqIn: 0.08 },
      { label: '3/8" (0.375)', inches: 0.375, pricePerSqIn: 0.12 },
      { label: '1/2" (0.500)', inches: 0.500, pricePerSqIn: 0.15 },
    ],
  },
  {
    id: 'hdpe',
    name: 'HDPE',
    category: 'plastics',
    description: 'High-density polyethylene. Chemical resistant, food-safe, and impact-resistant.',
    color: '#FFFDD0',
    thicknesses: [
      { label: '1/8" (0.125)', inches: 0.125, pricePerSqIn: 0.02 },
      { label: '1/4" (0.250)', inches: 0.250, pricePerSqIn: 0.04 },
      { label: '3/8" (0.375)', inches: 0.375, pricePerSqIn: 0.05 },
      { label: '1/2" (0.500)', inches: 0.500, pricePerSqIn: 0.07 },
    ],
  },
  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber Sheet',
    category: 'composites',
    description: 'Woven carbon fiber composite panel. Extreme stiffness and strength at minimal weight.',
    color: '#2C2C2C',
    thicknesses: [
      { label: '0.020"', inches: 0.020, pricePerSqIn: 0.15 },
      { label: '0.040"', inches: 0.040, pricePerSqIn: 0.25 },
      { label: '0.060"', inches: 0.060, pricePerSqIn: 0.35 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.60 },
      { label: '0.250"', inches: 0.250, pricePerSqIn: 1.10 },
    ],
  },
  {
    id: 'g10-fr4',
    name: 'G10/FR4 Fiberglass',
    category: 'composites',
    description: 'Glass-reinforced epoxy laminate. High strength, excellent electrical insulation.',
    color: '#9ACD32',
    thicknesses: [
      { label: '0.031"', inches: 0.031, pricePerSqIn: 0.04 },
      { label: '0.063"', inches: 0.063, pricePerSqIn: 0.06 },
      { label: '0.093"', inches: 0.093, pricePerSqIn: 0.08 },
      { label: '0.125"', inches: 0.125, pricePerSqIn: 0.10 },
      { label: '0.250"', inches: 0.250, pricePerSqIn: 0.18 },
    ],
  },
  {
    id: 'baltic-birch',
    name: 'Baltic Birch Plywood',
    category: 'wood',
    description: 'Premium multi-ply birch. Clean laser-cut edges, excellent for prototypes and decorative parts.',
    color: '#DEB887',
    thicknesses: [
      { label: '1/8" (3mm)', inches: 0.125, pricePerSqIn: 0.015 },
      { label: '1/4" (6mm)', inches: 0.250, pricePerSqIn: 0.025 },
      { label: '3/8" (9mm)', inches: 0.375, pricePerSqIn: 0.035 },
      { label: '1/2" (12mm)', inches: 0.500, pricePerSqIn: 0.045 },
    ],
  },
  {
    id: 'walnut',
    name: 'Walnut Hardwood',
    category: 'wood',
    description: 'Rich dark hardwood. Beautiful grain for decorative, signage, and craft applications.',
    color: '#5C4033',
    thicknesses: [
      { label: '1/8" (3mm)', inches: 0.125, pricePerSqIn: 0.03 },
      { label: '1/4" (6mm)', inches: 0.250, pricePerSqIn: 0.05 },
    ],
  },
]

export const materialCategories = [
  { id: 'metals', label: 'Metals' },
  { id: 'plastics', label: 'Plastics' },
  { id: 'composites', label: 'Composites' },
  { id: 'wood', label: 'Wood' },
] as const
