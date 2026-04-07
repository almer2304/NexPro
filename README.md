# NexPro — Indonesia's Premium Property Marketplace

Built with **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS** · **Supabase** · **Zustand** · **Framer Motion**

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.local` and fill in your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key

# Only needed for the Node seed script (Option B below)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Seed the database (choose one)

#### ✅ Option A — SQL Editor (Recommended, no extra keys needed)
1. Open **Supabase Dashboard → SQL Editor → New Query**
2. Paste the entire contents of `scripts/seed.sql`
3. Click **Run**
4. Done! 10 listings will appear immediately.

#### Option B — Node script
```bash
# Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
npm run seed
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/               # Login & Signup with glassmorphism layout
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── auth/callback/        # Supabase email verification handler
│   ├── dashboard/            # Protected agent/user dashboard
│   │   ├── page.tsx          # Overview with live stats
│   │   ├── listings/         # Agent listing management table
│   │   ├── inquiries/        # Lead management with status controls
│   │   ├── saved/            # User wishlist
│   │   ├── new-listing/      # 3-step listing creation form
│   │   └── edit/[id]/        # Edit existing listing
│   ├── properties/[slug]/    # Full property detail page
│   │   ├── page.tsx          # Server Component (SEO)
│   │   ├── image-gallery.tsx # Interactive lightbox gallery
│   │   └── inquiry-section.tsx # Auth-aware inquiry form
│   ├── search/               # Property search + filters
│   │   ├── page.tsx          # Server Component
│   │   └── search-controls.tsx # Client filter bar
│   ├── saved/                # Public saved properties page
│   └── page.tsx              # Landing page
│
├── components/
│   ├── ui/                   # Atomic: Button, Input, Badge, Skeleton, Toast
│   ├── shared/               # Navbar (transparent/scrolled), Footer
│   └── modules/              # PropertyCard, FilterBar, FavoriteButton
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server Component client
│   │   ├── middleware.ts     # Session management
│   │   └── actions.ts        # All Server Actions (15 functions)
│   ├── stores/index.ts       # Zustand: favorites, search filters, UI
│   ├── validations/index.ts  # Zod schemas
│   └── utils.ts              # formatPrice, formatArea, timeAgo, cn
│
├── middleware.ts              # Route protection for /dashboard
└── types/index.ts             # TypeScript types matching Supabase schema
```

---

## 🌱 Seed Data

The seed script creates **10 realistic Indonesian property listings**:

| # | Title | City | Type | Price |
|---|-------|------|------|-------|
| 1 | Modern Minimalist House in Kemang | Jakarta | House / Sale | Rp 15.5M |
| 2 | Luxury Penthouse at Sudirman CBD | Jakarta | Apartment / Sale | Rp 45M |
| 3 | Tropical Garden House in Pondok Indah | Jakarta | House / Sale | Rp 28M |
| 4 | Serviced Apartment for Rent — SCBD | Jakarta | Apartment / Rent | Rp 18Jt/mo |
| 5 | Clifftop Villa with Infinity Pool, Uluwatu | Bali | House / Sale | Rp 32M |
| 6 | Rice Terrace Villa for Rent in Ubud | Bali | House / Rent | Rp 65Jt/mo |
| 7 | Beachfront Land Plot in Canggu | Bali | Land / Sale | Rp 55M |
| 8 | Boutique Villa Complex in Seminyak | Bali | House / Sale | Rp 85M |
| 9 | Mountain-View House in Dago Pakar | Bandung | House / Sale | Rp 8.5M |
| 10 | Contemporary Townhouse in Buah Batu | Bandung | House / Rent | Rp 12Jt/mo |

All images use high-quality **Unsplash** URLs.

---

## 🔐 Authentication Flow

1. User signs up at `/signup` (role: `customer` or `agent`)
2. Supabase triggers `handle_new_user()` → creates profile in `public.profiles`
3. Email verification link → hits `/auth/callback` → redirects to `/dashboard`
4. `middleware.ts` protects `/dashboard` — unauthenticated users → `/login`

### Auth-Aware Features
- **Favorites**: Optimistic UI via Zustand + server toggle via `toggleFavorite()` action. Shows login prompt if unauthenticated.
- **Inquiries**: `InquirySection` shows login CTA for guests, form for authenticated users. `buyer_id` is automatically set from `auth.getUser()` — never from client input.
- **Dashboard**: Sidebar adapts to `agent` vs `customer` role. Agents see Listings + New Listing nav items.

---

## 🗄️ Supabase Configuration Checklist

### Tables (run the provided schema SQL)
- [x] `profiles` — synced from `auth.users` via trigger
- [x] `properties` — with `slug` unique constraint
- [x] `favorites` — unique `(user_id, property_id)`
- [x] `inquiries`

### RLS Policies
- [x] `profiles`: public SELECT, owner UPDATE
- [x] `properties`: published SELECT for all, ALL for owner agent
- [x] `favorites`: ALL for owner
- [x] `inquiries`: buyer SELECT/INSERT, agent SELECT for their properties

### Storage
- [x] Bucket: `property-images` (public)
- [x] Policy: authenticated users can upload to their own folder (`{user_id}/*`)

### Auth Settings
- Set **Site URL**: `http://localhost:3000` (dev) / your production URL
- Set **Redirect URLs**: `http://localhost:3000/auth/callback`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#000802` (Deep Navy) |
| Accent | `#10b981` (Emerald) |
| Secondary text | `#476083` (Slate Blue) |
| Surface | `#f8f9fa` |
| Border | `#e1e3e4` |
| Fonts | Plus Jakarta Sans + Inter |

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/ssr` | SSR-compatible Supabase client |
| `zustand` | Favorites + filter global state |
| `react-hook-form` | All forms |
| `zod` | Schema validation |
| `framer-motion` | Page transitions, gallery, filter animations |
| `lucide-react` | All icons |
| `tailwindcss-animate` | CSS animation utilities |

---

## 🚢 Deployment (Vercel)

```bash
# 1. Push to GitHub
# 2. Import project in Vercel
# 3. Add environment variables:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
# 4. Deploy
```

Update Supabase Auth → Site URL and Redirect URLs to your production domain.
