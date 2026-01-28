-- Pricing parameters for metal fabrication quoting
CREATE TABLE IF NOT EXISTS pricing_parameters (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  value REAL NOT NULL,
  unit TEXT,
  min_value REAL,
  max_value REAL,
  step REAL DEFAULT 0.01,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Materials catalog
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  color TEXT,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Thickness options per material
CREATE TABLE IF NOT EXISTS thicknesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id TEXT NOT NULL REFERENCES materials(id),
  label TEXT NOT NULL,
  inches REAL NOT NULL,
  base_price_per_sq_in REAL NOT NULL,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address1 TEXT,
  shipping_address2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_country TEXT DEFAULT 'US',
  subtotal REAL NOT NULL DEFAULT 0,
  shipping_cost REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id),
  name TEXT NOT NULL,
  type TEXT,
  material_id TEXT,
  material_name TEXT,
  thickness TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  width REAL,
  height REAL,
  services TEXT,
  unit_price REAL NOT NULL DEFAULT 0,
  subtotal REAL NOT NULL DEFAULT 0,
  file_name TEXT,
  file_size INTEGER
);

-- Seed pricing parameters
INSERT INTO pricing_parameters (id, category, name, description, value, unit, min_value, max_value, step) VALUES
  -- General
  ('base_markup_pct', 'general', 'Base Markup', 'Overall margin applied to material cost', 35, 'percent', 0, 100, 1),
  ('minimum_order', 'general', 'Minimum Order Charge', 'Minimum charge per order regardless of part cost', 25.00, 'dollars', 0, 500, 1),
  ('minimum_part', 'general', 'Minimum Part Charge', 'Minimum charge per individual part', 0.50, 'dollars', 0, 50, 0.10),
  ('setup_fee', 'general', 'Setup Fee', 'One-time setup fee per unique part in an order', 15.00, 'dollars', 0, 200, 1),

  -- Cutting
  ('laser_rate_per_min', 'cutting', 'Laser Rate per Minute', 'Cost per minute of laser cutting time', 2.50, 'dollars_per_min', 0, 20, 0.25),
  ('pierce_cost', 'cutting', 'Pierce Cost', 'Cost per laser pierce (hole start)', 0.15, 'dollars', 0, 5, 0.05),
  ('kerf_waste_pct', 'cutting', 'Kerf/Waste Factor', 'Extra material percentage for cutting kerf and waste', 12, 'percent', 0, 50, 1),

  -- Complexity
  ('complexity_simple', 'complexity', 'Simple Shape Factor', 'Multiplier for basic rectangles, circles, etc.', 1.0, 'multiplier', 0.5, 3, 0.05),
  ('complexity_moderate', 'complexity', 'Moderate Shape Factor', 'Multiplier for brackets, gussets, common profiles', 1.15, 'multiplier', 0.5, 3, 0.05),
  ('complexity_complex', 'complexity', 'Complex Shape Factor', 'Multiplier for intricate custom uploads and designs', 1.35, 'multiplier', 0.5, 3, 0.05),

  -- Quantity breaks
  ('qty_break_10_pct', 'quantity', '10+ Unit Discount', 'Discount percentage for orders of 10 or more', 10, 'percent', 0, 50, 1),
  ('qty_break_50_pct', 'quantity', '50+ Unit Discount', 'Discount percentage for orders of 50 or more', 15, 'percent', 0, 50, 1),
  ('qty_break_100_pct', 'quantity', '100+ Unit Discount', 'Discount percentage for orders of 100 or more', 20, 'percent', 0, 50, 1),
  ('qty_break_500_pct', 'quantity', '500+ Unit Discount', 'Discount percentage for orders of 500 or more', 25, 'percent', 0, 50, 1),

  -- Rush
  ('rush_multiplier', 'rush', 'Rush Order Multiplier', 'Price multiplier for expedited processing (1-2 day)', 1.50, 'multiplier', 1, 3, 0.05),
  ('expedite_multiplier', 'rush', 'Expedite Multiplier', 'Price multiplier for faster processing (3-day)', 1.25, 'multiplier', 1, 3, 0.05),

  -- Shipping
  ('shipping_base', 'shipping', 'Base Shipping Cost', 'Flat base cost for domestic shipping', 12.99, 'dollars', 0, 100, 0.50),
  ('shipping_per_lb', 'shipping', 'Shipping per Pound', 'Additional cost per pound of order weight', 0.85, 'dollars_per_lb', 0, 20, 0.05),
  ('free_shipping_threshold', 'shipping', 'Free Shipping Threshold', 'Order subtotal above which shipping is free', 500, 'dollars', 0, 5000, 25),

  -- Service add-ons
  ('svc_bending', 'services', 'Bending (per bend)', 'Cost per CNC press brake bend', 4.50, 'dollars', 0, 50, 0.50),
  ('svc_anodizing', 'services', 'Anodizing (per part)', 'Anodizing cost per part', 8.00, 'dollars', 0, 100, 0.50),
  ('svc_powder_coating', 'services', 'Powder Coating (per part)', 'Powder coat cost per part', 6.00, 'dollars', 0, 100, 0.50),
  ('svc_plating', 'services', 'Plating (per part)', 'Plating cost per part', 10.00, 'dollars', 0, 100, 0.50),
  ('svc_deburring', 'services', 'Deburring (per part)', 'Deburring cost per part', 2.00, 'dollars', 0, 50, 0.25),
  ('svc_hardware', 'services', 'Hardware Insertion (per insert)', 'PEM fastener insertion cost', 1.50, 'dollars', 0, 20, 0.25),
  ('svc_countersinking', 'services', 'Countersinking (per hole)', 'Countersink cost per hole', 1.00, 'dollars', 0, 20, 0.25);

-- Seed materials
INSERT INTO materials (id, name, category, description, color, sort_order) VALUES
  ('mild-steel', 'Mild Steel', 'metals', 'Versatile carbon steel suitable for general fabrication, structural parts, and brackets.', '#71797E', 1),
  ('stainless-304', '304 Stainless Steel', 'metals', 'Corrosion-resistant austenitic stainless steel. Ideal for food equipment, marine, and architectural use.', '#C0C0C0', 2),
  ('stainless-316', '316 Stainless Steel', 'metals', 'Superior corrosion resistance with molybdenum. Best for marine, chemical processing, and medical.', '#B8B8B8', 3),
  ('aluminum-5052', '5052 Aluminum', 'metals', 'Good workability and corrosion resistance. Popular for sheet metal work and marine applications.', '#A8A9AD', 4),
  ('aluminum-6061', '6061-T6 Aluminum', 'metals', 'Heat-treatable alloy with excellent machinability. Ideal for structural and precision parts.', '#B0B0B0', 5),
  ('copper-110', 'C110 Copper', 'metals', 'High-purity electrolytic copper. Excellent conductivity for electrical and decorative applications.', '#B87333', 6),
  ('brass-260', '260 Brass', 'metals', 'Cartridge brass with excellent formability. Used for decorative, electrical, and hardware applications.', '#C9B037', 7),
  ('titanium-gr2', 'Grade 2 Titanium', 'metals', 'Commercially pure titanium. Excellent strength-to-weight ratio and corrosion resistance.', '#878681', 8),
  ('acrylic-clear', 'Clear Acrylic', 'plastics', 'Optically clear cast acrylic. Lightweight, shatter-resistant alternative to glass.', '#E8F4FD', 10),
  ('delrin', 'Delrin (Acetal)', 'plastics', 'High-performance engineering thermoplastic. Low friction, excellent dimensional stability.', '#F5F5DC', 11),
  ('hdpe', 'HDPE', 'plastics', 'High-density polyethylene. Chemical resistant, food-safe, and impact-resistant.', '#FFFDD0', 12),
  ('carbon-fiber', 'Carbon Fiber Sheet', 'composites', 'Woven carbon fiber composite panel. Extreme stiffness and strength at minimal weight.', '#2C2C2C', 20),
  ('g10-fr4', 'G10/FR4 Fiberglass', 'composites', 'Glass-reinforced epoxy laminate. High strength, excellent electrical insulation.', '#9ACD32', 21),
  ('baltic-birch', 'Baltic Birch Plywood', 'wood', 'Premium multi-ply birch. Clean laser-cut edges, excellent for prototypes and decorative parts.', '#DEB887', 30),
  ('walnut', 'Walnut Hardwood', 'wood', 'Rich dark hardwood. Beautiful grain for decorative, signage, and craft applications.', '#5C4033', 31);

-- Seed thicknesses
INSERT INTO thicknesses (material_id, label, inches, base_price_per_sq_in, sort_order) VALUES
  ('mild-steel', '22 ga (0.030")', 0.030, 0.03, 1),
  ('mild-steel', '20 ga (0.036")', 0.036, 0.035, 2),
  ('mild-steel', '18 ga (0.048")', 0.048, 0.045, 3),
  ('mild-steel', '16 ga (0.060")', 0.060, 0.055, 4),
  ('mild-steel', '14 ga (0.075")', 0.075, 0.07, 5),
  ('mild-steel', '11 ga (0.120")', 0.120, 0.10, 6),
  ('mild-steel', '3/16" (0.188)', 0.188, 0.15, 7),
  ('mild-steel', '1/4" (0.250)', 0.250, 0.20, 8),
  ('stainless-304', '22 ga (0.030")', 0.030, 0.06, 1),
  ('stainless-304', '20 ga (0.036")', 0.036, 0.07, 2),
  ('stainless-304', '18 ga (0.048")', 0.048, 0.09, 3),
  ('stainless-304', '16 ga (0.060")', 0.060, 0.11, 4),
  ('stainless-304', '14 ga (0.075")', 0.075, 0.14, 5),
  ('stainless-304', '11 ga (0.120")', 0.120, 0.20, 6),
  ('stainless-304', '3/16" (0.188)', 0.188, 0.30, 7),
  ('stainless-304', '1/4" (0.250)', 0.250, 0.40, 8),
  ('stainless-316', '20 ga (0.036")', 0.036, 0.09, 1),
  ('stainless-316', '18 ga (0.048")', 0.048, 0.12, 2),
  ('stainless-316', '16 ga (0.060")', 0.060, 0.15, 3),
  ('stainless-316', '14 ga (0.075")', 0.075, 0.18, 4),
  ('stainless-316', '11 ga (0.120")', 0.120, 0.26, 5),
  ('stainless-316', '1/4" (0.250)', 0.250, 0.50, 6),
  ('aluminum-5052', '0.040"', 0.040, 0.04, 1),
  ('aluminum-5052', '0.063"', 0.063, 0.05, 2),
  ('aluminum-5052', '0.080"', 0.080, 0.06, 3),
  ('aluminum-5052', '0.100"', 0.100, 0.08, 4),
  ('aluminum-5052', '0.125"', 0.125, 0.10, 5),
  ('aluminum-5052', '0.190"', 0.190, 0.14, 6),
  ('aluminum-5052', '0.250"', 0.250, 0.18, 7),
  ('aluminum-6061', '0.063"', 0.063, 0.06, 1),
  ('aluminum-6061', '0.080"', 0.080, 0.07, 2),
  ('aluminum-6061', '0.125"', 0.125, 0.11, 3),
  ('aluminum-6061', '0.190"', 0.190, 0.16, 4),
  ('aluminum-6061', '0.250"', 0.250, 0.22, 5),
  ('aluminum-6061', '0.375"', 0.375, 0.32, 6),
  ('aluminum-6061', '0.500"', 0.500, 0.42, 7),
  ('copper-110', '0.032"', 0.032, 0.08, 1),
  ('copper-110', '0.040"', 0.040, 0.10, 2),
  ('copper-110', '0.063"', 0.063, 0.14, 3),
  ('copper-110', '0.125"', 0.125, 0.25, 4),
  ('copper-110', '0.190"', 0.190, 0.38, 5),
  ('brass-260', '0.032"', 0.032, 0.07, 1),
  ('brass-260', '0.040"', 0.040, 0.08, 2),
  ('brass-260', '0.063"', 0.063, 0.12, 3),
  ('brass-260', '0.125"', 0.125, 0.22, 4),
  ('brass-260', '0.190"', 0.190, 0.32, 5),
  ('titanium-gr2', '0.040"', 0.040, 0.20, 1),
  ('titanium-gr2', '0.063"', 0.063, 0.30, 2),
  ('titanium-gr2', '0.080"', 0.080, 0.38, 3),
  ('titanium-gr2', '0.125"', 0.125, 0.55, 4),
  ('titanium-gr2', '0.250"', 0.250, 1.00, 5),
  ('acrylic-clear', '1/16" (0.060)', 0.060, 0.02, 1),
  ('acrylic-clear', '1/8" (0.118)', 0.118, 0.03, 2),
  ('acrylic-clear', '3/16" (0.177)', 0.177, 0.04, 3),
  ('acrylic-clear', '1/4" (0.236)', 0.236, 0.05, 4),
  ('acrylic-clear', '3/8" (0.354)', 0.354, 0.07, 5),
  ('acrylic-clear', '1/2" (0.472)', 0.472, 0.09, 6),
  ('delrin', '1/16" (0.060)', 0.060, 0.03, 1),
  ('delrin', '1/8" (0.125)', 0.125, 0.05, 2),
  ('delrin', '1/4" (0.250)', 0.250, 0.08, 3),
  ('delrin', '3/8" (0.375)', 0.375, 0.12, 4),
  ('delrin', '1/2" (0.500)', 0.500, 0.15, 5),
  ('hdpe', '1/8" (0.125)', 0.125, 0.02, 1),
  ('hdpe', '1/4" (0.250)', 0.250, 0.04, 2),
  ('hdpe', '3/8" (0.375)', 0.375, 0.05, 3),
  ('hdpe', '1/2" (0.500)', 0.500, 0.07, 4),
  ('carbon-fiber', '0.020"', 0.020, 0.15, 1),
  ('carbon-fiber', '0.040"', 0.040, 0.25, 2),
  ('carbon-fiber', '0.060"', 0.060, 0.35, 3),
  ('carbon-fiber', '0.125"', 0.125, 0.60, 4),
  ('carbon-fiber', '0.250"', 0.250, 1.10, 5),
  ('g10-fr4', '0.031"', 0.031, 0.04, 1),
  ('g10-fr4', '0.063"', 0.063, 0.06, 2),
  ('g10-fr4', '0.093"', 0.093, 0.08, 3),
  ('g10-fr4', '0.125"', 0.125, 0.10, 4),
  ('g10-fr4', '0.250"', 0.250, 0.18, 5),
  ('baltic-birch', '1/8" (3mm)', 0.125, 0.015, 1),
  ('baltic-birch', '1/4" (6mm)', 0.250, 0.025, 2),
  ('baltic-birch', '3/8" (9mm)', 0.375, 0.035, 3),
  ('baltic-birch', '1/2" (12mm)', 0.500, 0.045, 4),
  ('walnut', '1/8" (3mm)', 0.125, 0.03, 1),
  ('walnut', '1/4" (6mm)', 0.250, 0.05, 2);
