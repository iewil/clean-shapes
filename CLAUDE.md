# Clean Shapes — Custom Metal Fabrication Ordering Platform

## Project Overview

A full-featured custom metal fabrication ordering site (similar to SendCutSend) with a heritage craftsman design aesthetic (inspired by Ernest Wright). Users can browse materials, configure parts from shape templates, upload CAD files, select finishing services, and check out.

**Live site:** https://clean-shapes.pages.dev
**Repo:** https://github.com/iewil/clean-shapes

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 with custom theme
- **State Management:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages (static SPA)
- **Fonts:** Libre Baskerville (serif body), Rajdhani (sans headings) via Google Fonts
- **Backend (in progress):** Cloudflare Workers (Pages Functions) + D1 database

## Commands

```bash
npm run dev      # Start local dev server (Vite)
npm run build    # TypeScript check + Vite production build → dist/
npm run preview  # Preview production build locally
npx tsc --noEmit # Type-check only
```

### Deployment

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name clean-shapes

# When D1 is set up, apply migrations with:
npx wrangler d1 execute clean-shapes-db --file=migrations/0001_initial.sql
```

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0274be` | Buttons, links, accents |
| Primary Dark | `#025a94` | Button hover |
| Charcoal | `#2a2a2a` | Body text, headings |
| Gray Mid | `#808285` | Secondary text |
| Off-white | `#f8f7f4` | Section backgrounds |
| Dark | `#1a1a2e` | Footer, admin sidebar |

- `font-sans` (Rajdhani) for all headings, labels, buttons, navigation
- `font-serif` (Libre Baskerville) for body text, descriptions, paragraphs
- Generous whitespace, restrained color, heritage/craft feel, subtle transitions

## Project Structure

```
clean-shapes-2/
├── public/
│   ├── _redirects              # SPA catch-all for Cloudflare Pages
│   └── vite.svg
├── src/
│   ├── main.tsx                # Entry point, BrowserRouter
│   ├── App.tsx                 # Route definitions
│   ├── index.css               # Tailwind directives + base styles
│   ├── components/
│   │   ├── Layout.tsx          # Header + Outlet + Footer shell
│   │   ├── Header.tsx          # Sticky responsive nav with cart badge
│   │   ├── Footer.tsx          # Heritage-style dark footer
│   │   ├── MaterialCard.tsx    # Material display card
│   │   ├── TemplateCard.tsx    # Shape template card with SVG preview
│   │   ├── ShapePreview.tsx    # SVG path renderer
│   │   ├── FileDropzone.tsx    # Drag-and-drop file upload
│   │   ├── PriceCalculator.tsx # Price breakdown display
│   │   ├── ServiceAddonPicker.tsx # Service checkbox list
│   │   ├── CartItem.tsx        # Cart line item display
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx # (in progress) Admin sidebar layout
│   │   └── ui/                 # Shared UI primitives (no external deps)
│   │       ├── Button.tsx      # variant: primary|secondary|outline|ghost
│   │       ├── Input.tsx       # Labeled text input
│   │       ├── Select.tsx      # Labeled native select
│   │       ├── Card.tsx        # Card, CardHeader, CardTitle, CardContent, CardFooter
│   │       ├── Badge.tsx       # Colored badge/pill
│   │       └── Tabs.tsx        # Tabs, TabsList, TabsTrigger, TabsContent
│   ├── pages/
│   │   ├── Home.tsx            # Hero, 3 ordering paths, materials showcase, trust badges
│   │   ├── Materials.tsx       # Category tabs, material cards, thickness/pricing detail
│   │   ├── Builder.tsx         # Template gallery, configurator, live preview, pricing, add-to-cart
│   │   ├── Upload.tsx          # File dropzone, material/thickness, services, pricing, add-to-cart
│   │   ├── Services.tsx        # Service cards grid with icons and pricing
│   │   ├── Cart.tsx            # Cart items, order summary, checkout link
│   │   ├── Checkout.tsx        # Contact + shipping form, order summary, mock confirmation
│   │   └── admin/              # (in progress)
│   │       ├── Dashboard.tsx
│   │       └── Pricing.tsx
│   ├── store/
│   │   └── cartStore.ts        # Zustand: items[], addItem, removeItem, updateQuantity, clearCart
│   ├── data/                   # Static data (to be replaced by API)
│   │   ├── materials.ts        # 15 materials with thicknesses and pricing
│   │   ├── templates.ts        # 30+ shape templates with SVG path generators
│   │   └── services.ts         # 8 fabrication services with flat fees
│   └── lib/
│       ├── pricing.ts          # Client-side price calculation (current)
│       └── api.ts              # (in progress) API client for backend
├── functions/                  # (in progress) Cloudflare Pages Functions (Workers API)
│   ├── env.ts                  # Shared Env type, jsonResponse/errorResponse helpers
│   └── api/
│       ├── _middleware.ts      # CORS middleware
│       ├── materials/
│       │   └── index.ts        # GET /api/materials
│       ├── pricing/
│       │   ├── calculate.ts    # POST /api/pricing/calculate
│       │   └── parameters.ts   # GET/PUT /api/pricing/parameters
│       ├── orders/
│       │   ├── index.ts        # GET/POST /api/orders
│       │   └── [id].ts         # GET/PUT /api/orders/:id
│       └── admin/
│           └── stats.ts        # GET /api/admin/stats
├── migrations/
│   └── 0001_initial.sql        # D1 schema: pricing_parameters, materials, thicknesses, orders, order_items
├── wrangler.toml               # Cloudflare config with D1 binding (database_id needs filling)
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Current State

### Completed (deployed)
- All customer-facing pages: Home, Materials, Builder, Upload, Services, Cart, Checkout
- Full client-side ordering flow with Zustand cart
- Client-side pricing engine (lib/pricing.ts) with material rates and quantity discounts
- 30+ shape templates with live SVG preview
- Drag-and-drop file upload with SVG preview
- Responsive layout with heritage design
- Deployed to Cloudflare Pages at clean-shapes.pages.dev

### In Progress (partially written, not yet wired up or deployed)
The following files exist but are incomplete or have not been reviewed/tested:
- `functions/` — Cloudflare Workers API endpoints (all 7 route files written by agent, need review)
- `migrations/0001_initial.sql` — D1 schema with seed data (written, not applied)
- `wrangler.toml` — Config exists but `database_id` is empty (D1 not yet created)
- `src/lib/api.ts` — Frontend API client (written by agent, needs review)
- `src/components/admin/AdminLayout.tsx` — Admin sidebar layout (written by agent, needs review)
- `src/pages/admin/Dashboard.tsx` — Admin dashboard (written by agent, needs review)
- `src/pages/admin/Pricing.tsx` — Pricing parameter editor (written by agent, needs review)

### Not Yet Started
- `src/pages/admin/Orders.tsx` — Order management list page
- `src/pages/admin/OrderDetail.tsx` — Single order view/edit
- `src/pages/admin/Materials.tsx` — Admin material management (optional)
- Admin routes in App.tsx (need to add /admin/* routes with AdminLayout)
- Frontend pages updated to call API instead of using static data/client-side pricing
- D1 database creation and migration
- Redeployment with Pages Functions + D1

## Pending Requirements: API & Admin Portal

### API Service (Cloudflare Workers via Pages Functions)

All API routes live under `functions/api/` and are automatically deployed as Cloudflare Workers when using Pages Functions.

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/materials` | List active materials with thicknesses from D1 |
| POST | `/api/pricing/calculate` | Server-side price calculation |
| GET | `/api/pricing/parameters` | Fetch all pricing parameters grouped by category |
| PUT | `/api/pricing/parameters` | Bulk-update pricing parameter values |
| GET | `/api/orders` | List orders (optional `?status=` filter) |
| POST | `/api/orders` | Create order (from checkout) |
| GET | `/api/orders/:id` | Get order with line items |
| PUT | `/api/orders/:id` | Update order status/notes |
| GET | `/api/admin/stats` | Dashboard aggregates |

**Server-side pricing engine** should use these parameters from the `pricing_parameters` table:
- `base_markup_pct` — Overall margin on material cost (default 35%)
- `kerf_waste_pct` — Material waste allowance (default 12%)
- `minimum_part` — Minimum charge per part ($0.50)
- `minimum_order` — Minimum charge per order ($25.00)
- `setup_fee` — Per-job setup fee ($15.00)
- `complexity_simple/moderate/complex` — Shape complexity multipliers (1.0 / 1.15 / 1.35)
- `qty_break_10/50/100/500_pct` — Quantity tier discounts (10% / 15% / 20% / 25%)
- `rush_multiplier / expedite_multiplier` — Rush pricing (1.50× / 1.25×)
- `shipping_base / shipping_per_lb / free_shipping_threshold` — Shipping cost calc
- `svc_*` — Individual service add-on costs

**Price calculation formula:**
```
area = width × height
materialCost = area × basePricePerSqIn (from thickness table)
adjustedCost = materialCost × (1 + kerf_waste_pct/100) × (1 + base_markup_pct/100)
unitPrice = max(adjustedCost × complexityFactor + serviceCosts, minimum_part)
discount = quantity tier discount percentage
subtotal = (unitPrice × quantity × (1 - discount)) + setup_fee
```

### Database (Cloudflare D1)

Schema in `migrations/0001_initial.sql` includes:
- `pricing_parameters` — 26 tunable parameters with category, min/max/step for UI sliders
- `materials` — Material catalog (15 seeded)
- `thicknesses` — Per-material thickness options with base pricing (80 seeded)
- `orders` — Order records with customer/shipping info and status tracking
- `order_items` — Line items with material, dimensions, services (JSON), pricing

Order statuses: `pending → confirmed → in_production → shipped → delivered` (also `cancelled`)

### Admin Portal

Admin pages at `/admin/*` using a sidebar layout with the same heritage styling as the main site but with a dark sidebar nav.

**Pages needed:**

1. **Dashboard** (`/admin`) — Stat cards (total orders, pending, revenue, materials count), recent orders table
2. **Pricing** (`/admin/pricing`) — All pricing parameters grouped by category, each with name/description/slider+number input, bulk save
3. **Orders** (`/admin/orders`) — Filterable order table with status tabs, search, click-through to detail
4. **Order Detail** (`/admin/orders/:id`) — Full order view, editable status dropdown, notes textarea, line items table, save button
5. **Materials** (`/admin/materials`) — Optional: manage materials and thickness pricing from admin UI

**Admin pricing parameter categories and their display labels:**
- `general` → "General"
- `cutting` → "Cutting & Laser"
- `complexity` → "Complexity Factors"
- `quantity` → "Quantity Breaks"
- `rush` → "Rush & Expedite"
- `shipping` → "Shipping"
- `services` → "Service Add-ons"

**Unit display formatting:**
- `percent` → "%" suffix
- `dollars` → "$" prefix
- `multiplier` → "×" prefix
- `dollars_per_min` → "$/min"
- `dollars_per_lb` → "$/lb"

**Status badge colors (Tailwind):**
- pending → yellow (bg-yellow-100 text-yellow-800)
- confirmed → blue (bg-blue-100 text-blue-800)
- in_production → purple (bg-purple-100 text-purple-800)
- shipped → indigo (bg-indigo-100 text-indigo-800)
- delivered → green (bg-green-100 text-green-800)
- cancelled → red (bg-red-100 text-red-800)

### Frontend Integration

Once the API is deployed:
1. Checkout page should POST to `/api/orders` instead of mock submission
2. Builder and Upload pages should call `/api/pricing/calculate` for server-side pricing (keep client-side as fallback)
3. Materials page could optionally fetch from `/api/materials` instead of static `data/materials.ts`

## Architecture Notes

- UI primitives in `src/components/ui/` have zero external dependencies beyond React — no class-variance-authority, no @/lib/utils, no shadcn
- All icons use explicit named imports from lucide-react (not `import *`) to keep bundle small (243 KB / 72 KB gzip)
- Zustand store is minimal: just cart items array with add/remove/update/clear
- Shape templates use SVG path generator functions: `(width, height) => string`
- Pages Functions in `functions/` directory auto-deploy as Workers alongside the static site
- D1 binding name is `DB` (configured in wrangler.toml)
