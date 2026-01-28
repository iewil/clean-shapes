export interface Service {
  id: string
  name: string
  description: string
  priceLabel: string
  flatFee: number
  icon: string
}

export const services: Service[] = [
  {
    id: 'laser-cutting',
    name: 'Laser Cutting',
    description: 'Precision laser cutting with tolerances of +/- 0.005". Available for metals up to 1" and non-metals up to 1/2". Clean edges with minimal heat-affected zone.',
    priceLabel: 'Included in base price',
    flatFee: 0,
    icon: 'Zap',
  },
  {
    id: 'bending',
    name: 'CNC Bending',
    description: 'Precision CNC press brake bending up to 10 ft. length. Minimum bend radius varies by material and thickness. Multiple bends per part available.',
    priceLabel: '$4.50 per bend',
    flatFee: 4.50,
    icon: 'CornerDownRight',
  },
  {
    id: 'anodizing',
    name: 'Anodizing',
    description: 'Type II and Type III hard anodizing for aluminum parts. Available in clear, black, red, blue, and gold. Provides corrosion resistance and decorative finish.',
    priceLabel: '$8.00 per part',
    flatFee: 8.00,
    icon: 'Paintbrush',
  },
  {
    id: 'powder-coating',
    name: 'Powder Coating',
    description: 'Durable thermoset powder coating available in over 200 RAL colors. Excellent UV and corrosion resistance. Suitable for steel and aluminum parts.',
    priceLabel: '$6.00 per part',
    flatFee: 6.00,
    icon: 'Droplets',
  },
  {
    id: 'plating',
    name: 'Plating',
    description: 'Zinc, nickel, and chrome plating services. Provides enhanced corrosion protection and improved appearance. Compliant with RoHS standards.',
    priceLabel: '$10.00 per part',
    flatFee: 10.00,
    icon: 'Layers',
  },
  {
    id: 'deburring',
    name: 'Deburring & Edge Finishing',
    description: 'Mechanical and hand deburring to remove sharp edges and burrs. Tumble deburring for batch processing. Smooth, safe-to-handle edges.',
    priceLabel: '$2.00 per part',
    flatFee: 2.00,
    icon: 'Eraser',
  },
  {
    id: 'hardware-insertion',
    name: 'Hardware Insertion',
    description: 'PEM and other self-clinching fastener insertion. Standoffs, nuts, studs, and pins. Press-fit installation ensures flush, permanent hardware.',
    priceLabel: '$1.50 per insert',
    flatFee: 1.50,
    icon: 'Wrench',
  },
  {
    id: 'countersinking',
    name: 'Countersinking',
    description: 'Precision countersunk holes for flush-mount screws. Standard 82° and 90° countersinks. Available in all materials.',
    priceLabel: '$1.00 per hole',
    flatFee: 1.00,
    icon: 'Target',
  },
]
