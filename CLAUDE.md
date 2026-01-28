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

## Local Development

The project consists of three services that run locally:

```bash
# Terminal 1: Public site (port 5173)
cd site
npm run dev

# Terminal 2: Admin site (port 5174)
cd admin
npm run dev

# Terminal 3: API backend + D1 database (port 8788)
cd admin
npm run dev:api
```

**Service URLs:**
- Public site: http://localhost:5173
- Admin portal: http://localhost:5174
- API backend: http://localhost:8788/api/*

### Database Setup

```bash
cd admin

# Seed local D1 database with schema and initial data
npm run db:seed

# Optional: Seed with additional test orders
npm run db:seed-orders
```

### Build & Deploy

```bash
# Build public site
cd site
npm run build    # TypeScript check + Vite production build → dist/

# Build admin site
cd admin
npm run build    # TypeScript check + Vite production build → dist/

# Deploy public site to Cloudflare Pages
cd site
npx wrangler pages deploy dist --project-name clean-shapes

# Apply migrations to production D1 database
cd ..
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

The project uses a **dual-app architecture** with separate public site and admin portal:

```
clean-shapes-2/
├── site/                       # Public-facing customer site (port 5173)
│   ├── public/
│   │   ├── _redirects          # SPA catch-all for Cloudflare Pages
│   │   └── vite.svg
│   ├── src/
│   │   ├── main.tsx            # Entry point, BrowserRouter
│   │   ├── App.tsx             # Route definitions
│   │   ├── index.css           # Tailwind directives + base styles
│   │   ├── components/
│   │   │   ├── Layout.tsx      # Header + Outlet + Footer shell
│   │   │   ├── Header.tsx      # Sticky responsive nav with cart badge
│   │   │   ├── Footer.tsx      # Heritage-style dark footer
│   │   │   ├── MaterialCard.tsx, TemplateCard.tsx, etc.
│   │   │   └── ui/             # Shared UI primitives (no external deps)
│   │   │       └── Button.tsx, Input.tsx, Select.tsx, Card.tsx, etc.
│   │   ├── pages/
│   │   │   ├── Home.tsx, Materials.tsx, Builder.tsx, Upload.tsx
│   │   │   ├── Services.tsx, Cart.tsx, Checkout.tsx
│   │   ├── store/
│   │   │   └── cartStore.ts    # Zustand: cart state management
│   │   ├── data/               # Static data (to be replaced by API calls)
│   │   │   ├── materials.ts, templates.ts, services.ts
│   │   └── lib/
│   │       └── pricing.ts      # Client-side price calculation
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── admin/                      # Admin portal (port 5174)
│   ├── src/
│   │   ├── main.tsx            # Entry point, BrowserRouter
│   │   ├── App.tsx             # Admin route definitions
│   │   ├── index.css           # Tailwind directives + base styles
│   │   ├── components/
│   │   │   ├── AdminLayout.tsx # Dark sidebar layout with nav
│   │   │   └── ui/             # Shared UI components
│   │   │       └── Button.tsx, Input.tsx, Select.tsx, etc.
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx   # Stats cards + recent orders table
│   │   │   ├── Orders.tsx      # Order list with filtering and search
│   │   │   ├── OrderDetail.tsx # Single order view with status editing
│   │   │   └── Pricing.tsx     # Pricing parameters with sliders
│   │   ├── lib/
│   │   │   └── api.ts          # API client (fetch wrappers)
│   │   └── types.ts            # TypeScript types for API responses
│   ├── package.json
│   ├── vite.config.ts          # Configured for port 5174, proxies /api → 8788
│   └── tailwind.config.js
│
├── functions/                  # Cloudflare Pages Functions (Workers API, port 8788)
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
│
├── migrations/
│   ├── 0001_initial.sql        # D1 schema + seed data
│   └── 0002_seed_orders.sql    # Optional: test order data
├── wrangler.toml               # Cloudflare config with D1 binding
└── CLAUDE.md                   # This file
```

## Current State

### Completed & Working Locally

**Public Site (site/):**
- All customer-facing pages: Home, Materials, Builder, Upload, Services, Cart, Checkout
- Full client-side ordering flow with Zustand cart
- Client-side pricing engine with material rates and quantity discounts
- 30+ shape templates with live SVG preview
- Drag-and-drop file upload with SVG preview
- Responsive layout with heritage design
- Deployed to Cloudflare Pages at clean-shapes.pages.dev

**Admin Portal (admin/):**
- Complete admin site as separate app running on port 5174
- AdminLayout with dark sidebar navigation and mobile support
- Dashboard page with stats cards (orders, revenue, materials) and recent orders table
- Orders page with status filtering, search, and order list table
- OrderDetail page with full order view, status editing, and notes
- Pricing page with all pricing parameters grouped by category, slider + number inputs, bulk save
- Full API integration with backend via proxy

**API Backend (functions/):**
- All Cloudflare Pages Functions endpoints implemented:
  - `/api/materials` - List materials
  - `/api/pricing/parameters` - Get/update pricing params
  - `/api/pricing/calculate` - Server-side price calculation
  - `/api/orders` - List/create orders
  - `/api/orders/:id` - Get/update single order
  - `/api/admin/stats` - Dashboard statistics
- CORS middleware configured
- Local development running on port 8788 with Wrangler Pages Dev
- D1 database with full schema and seed data (26 pricing params, 15 materials, 80+ thickness options)

**Infrastructure:**
- Dual-app architecture with separate Vite configs for site and admin
- Admin Vite configured for port 5174 with API proxy to 8788
- D1 local database seeded and working
- All three services (public site, admin site, API) running concurrently in development

### Not Yet Deployed to Production
- API backend (functions/) - Need to deploy Pages Functions
- Admin portal (admin/) - Need to deploy to separate subdomain or path
- D1 production database - Need to create and apply migrations to production
- Integration of public site with API endpoints (still using static data)

## Production Deployment TODO

The following steps are needed to deploy the API and admin portal to production:

1. **Create Production D1 Database:**
   - Run `npx wrangler d1 create clean-shapes-db` to create production database
   - Update `wrangler.toml` with production `database_id`
   - Apply migrations: `npx wrangler d1 execute clean-shapes-db --file=migrations/0001_initial.sql`

2. **Deploy API Backend:**
   - Deploy Pages Functions alongside static site (automatic with Cloudflare Pages)
   - Verify D1 binding works in production

3. **Deploy Admin Portal:**
   - Build admin site: `cd admin && npm run build`
   - Deploy to separate subdomain (e.g., admin.clean-shapes.pages.dev) or
   - Deploy as separate Cloudflare Pages project

4. **Integrate Public Site with API:**
   - Update Checkout page to POST to `/api/orders`
   - Optionally update Builder/Upload to use `/api/pricing/calculate`
   - Optionally update Materials page to fetch from `/api/materials`

## API Reference

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
