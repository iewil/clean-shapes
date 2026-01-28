-- Seed sample orders
INSERT INTO orders (id, order_number, status, customer_first_name, customer_last_name, customer_email, customer_phone, shipping_address1, shipping_address2, shipping_city, shipping_state, shipping_zip, shipping_country, subtotal, shipping_cost, tax, total, notes, created_at, updated_at) VALUES
  ('ord-001', 'CS-2026-0001', 'delivered', 'James', 'Mitchell', 'james.mitchell@example.com', '(503) 555-0142', '1420 NW Flanders St', '', 'Portland', 'OR', '97209', 'US', 342.50, 18.45, 28.88, 389.83, 'Customer requested extra packaging for thin parts.', '2026-01-10T09:23:00Z', '2026-01-18T14:30:00Z'),
  ('ord-002', 'CS-2026-0002', 'shipped', 'Sarah', 'Chen', 'sarah.chen@designlab.io', '(415) 555-0278', '88 Colin P Kelly Jr St', '', 'San Francisco', 'CA', '94107', 'US', 1245.00, 0, 102.71, 1347.71, '', '2026-01-14T15:45:00Z', '2026-01-22T10:15:00Z'),
  ('ord-003', 'CS-2026-0003', 'in_production', 'Robert', 'Kowalski', 'rkowalski@mfgparts.com', '(312) 555-0391', '225 W Wacker Dr', '', 'Chicago', 'IL', '60606', 'US', 876.25, 24.50, 72.05, 972.80, 'Rush order — customer needs by Jan 28.', '2026-01-19T11:00:00Z', '2026-01-23T08:45:00Z'),
  ('ord-004', 'CS-2026-0004', 'confirmed', 'Emily', 'Vasquez', 'emily.v@artisanworks.co', '(512) 555-0187', '401 Congress Ave', '', 'Austin', 'TX', '78701', 'US', 215.00, 14.85, 18.95, 248.80, '', '2026-01-22T08:30:00Z', '2026-01-23T09:00:00Z'),
  ('ord-005', 'CS-2026-0005', 'pending', 'David', 'Park', 'dpark@techshop.net', '(206) 555-0445', '400 Broad St', '', 'Seattle', 'WA', '98109', 'US', 567.50, 0, 55.63, 623.13, '', '2026-01-25T16:12:00Z', '2026-01-25T16:12:00Z'),
  ('ord-006', 'CS-2026-0006', 'pending', 'Lisa', 'Nakamura', 'lisa.n@prototype.studio', '(213) 555-0633', '900 Wilshire Blvd', '', 'Los Angeles', 'CA', '90017', 'US', 89.00, 12.99, 8.42, 110.41, '', '2026-01-26T10:05:00Z', '2026-01-26T10:05:00Z'),
  ('ord-007', 'CS-2026-0007', 'cancelled', 'Marcus', 'Thompson', 'mthompson@buildright.com', '(720) 555-0821', '1600 California St', '', 'Denver', 'CO', '80202', 'US', 450.00, 16.20, 38.42, 504.62, 'Customer cancelled — switching to a different material.', '2026-01-12T14:20:00Z', '2026-01-15T09:30:00Z'),
  ('ord-008', 'CS-2026-0008', 'confirmed', 'Angela', 'Rivera', 'arivera@signcraft.biz', '(305) 555-0574', '200 S Biscayne Blvd', '', 'Miami', 'FL', '33131', 'US', 680.00, 22.30, 47.86, 750.16, 'Laser-cut signage — confirm artwork before production.', '2026-01-24T13:40:00Z', '2026-01-25T11:00:00Z');

-- Seed order line items
INSERT INTO order_items (order_id, name, type, material_id, material_name, thickness, quantity, width, height, services, unit_price, subtotal) VALUES
  ('ord-001', 'Rectangle Bracket', 'template', 'mild-steel', 'Mild Steel', '16 ga (0.060")', 25, 6, 4, '["Deburring"]', 8.20, 205.00),
  ('ord-001', 'Mounting Plate', 'template', 'stainless-304', '304 Stainless Steel', '14 ga (0.075")', 10, 8, 8, '["Deburring","Countersinking"]', 13.75, 137.50),
  ('ord-002', 'Custom CAD Upload', 'upload', 'aluminum-6061', '6061-T6 Aluminum', '0.125"', 50, 12, 10, '["Anodizing","Deburring"]', 18.90, 945.00),
  ('ord-002', 'L-Bracket', 'template', 'aluminum-6061', '6061-T6 Aluminum', '0.125"', 100, 3, 5, '["Bending"]', 3.00, 300.00),
  ('ord-003', 'Gusset Plate', 'template', 'mild-steel', 'Mild Steel', '3/16" (0.188)', 30, 10, 10, '["Deburring","Powder Coating"]', 22.75, 682.50),
  ('ord-003', 'Washer Ring', 'template', 'mild-steel', 'Mild Steel', '11 ga (0.120")', 100, 2, 2, '["Deburring"]', 1.94, 193.75),
  ('ord-004', 'Decorative Panel', 'template', 'copper-110', 'C110 Copper', '0.032"', 5, 8, 12, '["Deburring"]', 28.00, 140.00),
  ('ord-004', 'Name Plate', 'template', 'brass-260', '260 Brass', '0.040"', 10, 4, 2, '["Deburring"]', 7.50, 75.00),
  ('ord-005', 'Enclosure Top', 'template', 'aluminum-5052', '5052 Aluminum', '0.080"', 20, 10, 6, '["Powder Coating","Hardware Insertion"]', 15.25, 305.00),
  ('ord-005', 'Enclosure Bottom', 'template', 'aluminum-5052', '5052 Aluminum', '0.080"', 20, 10, 6, '["Powder Coating","Hardware Insertion"]', 13.13, 262.50),
  ('ord-006', 'Prototype Bracket', 'template', 'acrylic-clear', 'Clear Acrylic', '1/8" (0.118)', 4, 5, 3, '[]', 8.25, 33.00),
  ('ord-006', 'Spacer Ring', 'template', 'delrin', 'Delrin (Acetal)', '1/4" (0.250)', 8, 2, 2, '[]', 7.00, 56.00),
  ('ord-007', 'Frame Side Panel', 'template', 'titanium-gr2', 'Grade 2 Titanium', '0.063"', 4, 14, 8, '["Deburring"]', 112.50, 450.00),
  ('ord-008', 'Sign Letter A', 'template', 'stainless-304', '304 Stainless Steel', '18 ga (0.048")', 8, 12, 14, '["Deburring","Plating"]', 52.50, 420.00),
  ('ord-008', 'Sign Backing Plate', 'template', 'aluminum-5052', '5052 Aluminum', '0.063"', 2, 36, 12, '["Powder Coating"]', 130.00, 260.00);
