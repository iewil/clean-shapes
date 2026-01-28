export interface ShapeTemplate {
  id: string
  name: string
  category: string
  description: string
  defaultWidth: number
  defaultHeight: number
  svgPath: (w: number, h: number) => string
}

export const templateCategories = [
  'Basic Shapes',
  'Brackets & Angles',
  'Plates & Panels',
  'Gussets & Reinforcements',
  'Hardware & Fastener Plates',
  'Custom Profiles',
] as const

export const templates: ShapeTemplate[] = [
  // Basic Shapes
  {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'Basic Shapes',
    description: 'Standard rectangular flat part',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} V ${h} H 0 Z`,
  },
  {
    id: 'square',
    name: 'Square',
    category: 'Basic Shapes',
    description: 'Equal-sided square plate',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} V ${h} H 0 Z`,
  },
  {
    id: 'circle',
    name: 'Circle',
    category: 'Basic Shapes',
    description: 'Circular disc or blank',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w) => {
      const r = w / 2
      return `M ${r} 0 A ${r} ${r} 0 1 1 ${r} ${w} A ${r} ${r} 0 1 1 ${r} 0 Z`
    },
  },
  {
    id: 'rounded-rect',
    name: 'Rounded Rectangle',
    category: 'Basic Shapes',
    description: 'Rectangle with rounded corners',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const r = Math.min(w, h) * 0.15
      return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    },
  },
  {
    id: 'oval',
    name: 'Oval',
    category: 'Basic Shapes',
    description: 'Elliptical flat part',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const rx = w / 2
      const ry = h / 2
      return `M ${rx} 0 A ${rx} ${ry} 0 1 1 ${rx} ${h} A ${rx} ${ry} 0 1 1 ${rx} 0 Z`
    },
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'Basic Shapes',
    description: 'Equilateral triangle plate',
    defaultWidth: 5,
    defaultHeight: 4.33,
    svgPath: (w, h) => `M ${w / 2} 0 L ${w} ${h} L 0 ${h} Z`,
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'Basic Shapes',
    description: 'Regular six-sided plate',
    defaultWidth: 4,
    defaultHeight: 3.46,
    svgPath: (w, h) => {
      const cx = w / 2, cy = h / 2
      const r = w / 2
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2
        return `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`
      })
      return `M ${pts[0]} L ${pts[1]} L ${pts[2]} L ${pts[3]} L ${pts[4]} L ${pts[5]} Z`
    },
  },
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'Basic Shapes',
    description: 'Regular eight-sided plate',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const cx = w / 2, cy = h / 2
      const r = w / 2
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 4) * i - Math.PI / 2
        return `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`
      })
      return `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} Z`
    },
  },
  {
    id: 'ring',
    name: 'Ring / Washer',
    category: 'Basic Shapes',
    description: 'Circular ring with center cutout',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w) => {
      const R = w / 2
      const r = w / 4
      return `M ${R} 0 A ${R} ${R} 0 1 1 ${R} ${w} A ${R} ${R} 0 1 1 ${R} 0 Z M ${R} ${R - r} A ${r} ${r} 0 1 0 ${R} ${R + r} A ${r} ${r} 0 1 0 ${R} ${R - r} Z`
    },
  },
  {
    id: 'stadium',
    name: 'Stadium / Oblong',
    category: 'Basic Shapes',
    description: 'Rectangle with semicircle ends',
    defaultWidth: 6,
    defaultHeight: 3,
    svgPath: (w, h) => {
      const r = h / 2
      return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    },
  },

  // Brackets & Angles
  {
    id: 'l-bracket',
    name: 'L-Bracket',
    category: 'Brackets & Angles',
    description: 'Right-angle bracket for corner mounting',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const t = Math.min(w, h) * 0.3
      return `M 0 0 H ${t} V ${h - t} H ${w} V ${h} H 0 Z`
    },
  },
  {
    id: 'u-bracket',
    name: 'U-Bracket',
    category: 'Brackets & Angles',
    description: 'U-shaped channel bracket',
    defaultWidth: 5,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const t = w * 0.2
      return `M 0 0 H ${t} V ${h - t} H ${w - t} V 0 H ${w} V ${h} H 0 Z`
    },
  },
  {
    id: 'z-bracket',
    name: 'Z-Bracket',
    category: 'Brackets & Angles',
    description: 'Z-shaped offset mounting bracket',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const t = h * 0.25
      const mid = w * 0.4
      return `M 0 0 H ${mid} V ${h - t - t} H ${w - mid + mid * 0.3} V ${h - t} H ${w} V ${h} H ${w - mid} V ${t + t} H ${mid - mid * 0.3} V ${t} H 0 Z`
    },
  },
  {
    id: 't-bracket',
    name: 'T-Bracket',
    category: 'Brackets & Angles',
    description: 'T-shaped structural bracket',
    defaultWidth: 5,
    defaultHeight: 5,
    svgPath: (w, h) => {
      const tw = w * 0.3
      const th = h * 0.35
      const cx = w / 2
      return `M 0 0 H ${w} V ${th} H ${cx + tw / 2} V ${h} H ${cx - tw / 2} V ${th} H 0 Z`
    },
  },
  {
    id: 'corner-bracket',
    name: 'Corner Bracket',
    category: 'Brackets & Angles',
    description: 'Reinforced corner mounting bracket',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} L 0 ${h} Z`,
  },
  {
    id: 'flat-bracket',
    name: 'Flat Bracket with Holes',
    category: 'Brackets & Angles',
    description: 'Flat mounting strip',
    defaultWidth: 8,
    defaultHeight: 2,
    svgPath: (w, h) => {
      const r = h * 0.2
      return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    },
  },

  // Plates & Panels
  {
    id: 'base-plate',
    name: 'Base Plate',
    category: 'Plates & Panels',
    description: 'Flat mounting base plate with corner holes',
    defaultWidth: 8,
    defaultHeight: 6,
    svgPath: (w, h) => `M 0 0 H ${w} V ${h} H 0 Z`,
  },
  {
    id: 'cover-plate',
    name: 'Cover Plate',
    category: 'Plates & Panels',
    description: 'Cover panel with rounded corners',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const r = Math.min(w, h) * 0.08
      return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    },
  },
  {
    id: 'slotted-plate',
    name: 'Slotted Plate',
    category: 'Plates & Panels',
    description: 'Plate with elongated mounting slots',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} V ${h} H 0 Z`,
  },
  {
    id: 'face-plate',
    name: 'Face Plate',
    category: 'Plates & Panels',
    description: 'Equipment face plate with cutouts',
    defaultWidth: 6,
    defaultHeight: 8,
    svgPath: (w, h) => {
      const r = Math.min(w, h) * 0.05
      return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    },
  },

  // Gussets & Reinforcements
  {
    id: 'triangle-gusset',
    name: 'Triangle Gusset',
    category: 'Gussets & Reinforcements',
    description: 'Right-triangle corner reinforcement',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} V ${h} Z`,
  },
  {
    id: 'curved-gusset',
    name: 'Curved Gusset',
    category: 'Gussets & Reinforcements',
    description: 'Concave-edged gusset for smooth load transfer',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} Q ${w * 0.1} ${h * 0.1} 0 ${h} Z`,
  },
  {
    id: 'diamond-gusset',
    name: 'Diamond Gusset',
    category: 'Gussets & Reinforcements',
    description: 'Diamond-shaped reinforcement plate',
    defaultWidth: 4,
    defaultHeight: 6,
    svgPath: (w, h) => `M ${w / 2} 0 L ${w} ${h / 2} L ${w / 2} ${h} L 0 ${h / 2} Z`,
  },
  {
    id: 'trapezoidal-gusset',
    name: 'Trapezoidal Gusset',
    category: 'Gussets & Reinforcements',
    description: 'Trapezoidal reinforcement plate',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const inset = w * 0.2
      return `M ${inset} 0 H ${w - inset} L ${w} ${h} H 0 Z`
    },
  },

  // Hardware & Fastener Plates
  {
    id: 'mounting-tab',
    name: 'Mounting Tab',
    category: 'Hardware & Fastener Plates',
    description: 'Single-hole mounting tab',
    defaultWidth: 2,
    defaultHeight: 3,
    svgPath: (w, h) => {
      const r = w / 2
      return `M 0 ${r} V ${h} H ${w} V ${r} A ${r} ${r} 0 0 0 0 ${r} Z`
    },
  },
  {
    id: 'double-tab',
    name: 'Double Mounting Tab',
    category: 'Hardware & Fastener Plates',
    description: 'Two-hole mounting tab',
    defaultWidth: 2,
    defaultHeight: 5,
    svgPath: (w, h) => {
      const r = w / 2
      return `M 0 ${r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 0 ${h - r} Z`
    },
  },
  {
    id: 'hinge-plate',
    name: 'Hinge Plate',
    category: 'Hardware & Fastener Plates',
    description: 'Flat hinge leaf plate',
    defaultWidth: 3,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const r = w / 2
      return `M 0 0 H ${w} V ${h - r} A ${r} ${r} 0 0 1 0 ${h - r} Z`
    },
  },
  {
    id: 'spacer',
    name: 'Spacer / Shim',
    category: 'Hardware & Fastener Plates',
    description: 'Thin spacer with center hole',
    defaultWidth: 3,
    defaultHeight: 3,
    svgPath: (w) => {
      const R = w / 2
      const r = w / 6
      return `M ${R} 0 A ${R} ${R} 0 1 1 ${R} ${w} A ${R} ${R} 0 1 1 ${R} 0 Z M ${R} ${R - r} A ${r} ${r} 0 1 0 ${R} ${R + r} A ${r} ${r} 0 1 0 ${R} ${R - r} Z`
    },
  },

  // Custom Profiles
  {
    id: 'arrow',
    name: 'Arrow / Pointer',
    category: 'Custom Profiles',
    description: 'Directional arrow sign plate',
    defaultWidth: 6,
    defaultHeight: 3,
    svgPath: (w, h) => {
      const mid = h / 2
      const neck = w * 0.55
      const inset = h * 0.25
      return `M 0 ${inset} H ${neck} V 0 L ${w} ${mid} L ${neck} ${h} V ${h - inset} H 0 Z`
    },
  },
  {
    id: 'cross',
    name: 'Cross / Plus',
    category: 'Custom Profiles',
    description: 'Plus-shaped cross plate',
    defaultWidth: 5,
    defaultHeight: 5,
    svgPath: (w, h) => {
      const a = w / 3, b = (2 * w) / 3
      const c = h / 3, d = (2 * h) / 3
      return `M ${a} 0 H ${b} V ${c} H ${w} V ${d} H ${b} V ${h} H ${a} V ${d} H 0 V ${c} H ${a} Z`
    },
  },
  {
    id: 'star',
    name: 'Star',
    category: 'Custom Profiles',
    description: 'Five-pointed star plate',
    defaultWidth: 5,
    defaultHeight: 5,
    svgPath: (w, h) => {
      const cx = w / 2, cy = h / 2
      const R = w / 2, r = w / 5
      const pts = Array.from({ length: 10 }, (_, i) => {
        const rad = i % 2 === 0 ? R : r
        const a = (Math.PI / 5) * i - Math.PI / 2
        return `${cx + rad * Math.cos(a)} ${cy + rad * Math.sin(a)}`
      })
      return `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} Z`
    },
  },
  {
    id: 'keyhole',
    name: 'Keyhole Slot',
    category: 'Custom Profiles',
    description: 'Keyhole-shaped mounting slot',
    defaultWidth: 3,
    defaultHeight: 5,
    svgPath: (w, h) => {
      const R = w / 2
      const r = w / 4
      const cx = w / 2
      return `M ${cx} 0 A ${R} ${R} 0 1 1 ${cx - 0.01} 0 Z M ${cx - r} ${R} V ${h} H ${cx + r} V ${R} Z`
    },
  },
  {
    id: 'half-circle',
    name: 'Half Circle',
    category: 'Custom Profiles',
    description: 'Semicircular plate',
    defaultWidth: 5,
    defaultHeight: 2.5,
    svgPath: (w, h) => {
      const r = w / 2
      return `M 0 ${h} A ${r} ${r} 0 0 1 ${w} ${h} H 0 Z`
    },
  },
  {
    id: 'quarter-circle',
    name: 'Quarter Circle',
    category: 'Custom Profiles',
    description: 'Quarter-circle fan plate',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => `M 0 0 H ${w} A ${w} ${h} 0 0 1 0 ${h} Z`,
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'Custom Profiles',
    description: 'Skewed rectangular plate',
    defaultWidth: 6,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const s = w * 0.2
      return `M ${s} 0 H ${w} L ${w - s} ${h} H 0 Z`
    },
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'Custom Profiles',
    description: 'Regular five-sided plate',
    defaultWidth: 4,
    defaultHeight: 4,
    svgPath: (w, h) => {
      const cx = w / 2, cy = h / 2
      const r = w / 2
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = (2 * Math.PI / 5) * i - Math.PI / 2
        return `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`
      })
      return `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} Z`
    },
  },
  {
    id: 'shield',
    name: 'Shield',
    category: 'Custom Profiles',
    description: 'Shield-shaped decorative plate',
    defaultWidth: 4,
    defaultHeight: 5,
    svgPath: (w, h) => {
      const cx = w / 2
      return `M 0 0 H ${w} V ${h * 0.6} L ${cx} ${h} L 0 ${h * 0.6} Z`
    },
  },
]
