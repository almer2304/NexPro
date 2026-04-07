<div align="center">

<img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop" alt="NexPro Banner" width="100%" style="border-radius: 12px; max-height: 300px; object-fit: cover;" />

<br />
<br />

# NexPro

**Marketplace Properti Premium Indonesia**

NexPro menghubungkan jutaan pencari properti dengan agen-agen terpercaya di seluruh Indonesia — dari Jakarta hingga Bali, dari Bandung hingga Makassar.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055ff?style=flat-square&logo=framer)](https://www.framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[**Demo Live**](http://localhost:3000) · [**Dokumentasi**](#-quick-start) · [**Lapor Bug**](#) · [**Request Fitur**](#)

</div>

---

## ✨ Fitur Utama

| Kategori | Fitur |
|----------|-------|
| 🔍 **Pencarian** | Filter multi-kriteria (kota, tipe, harga, kamar), view grid & peta interaktif |
| 🏠 **Listing** | Galeri foto fullscreen, kalkulator KPR, peta Leaflet, bagikan via link |
| 👤 **Autentikasi** | Signup/Login, reset password, role-based (agent vs customer) |
| 🏢 **Dashboard Agent** | Kelola listing, status properti (terjual/disewa), analitik view & inquiry |
| 💬 **Komunikasi** | Form inquiry, kontak via WhatsApp langsung dari halaman properti |
| ❤️ **Wishlist** | Simpan properti favorit dengan optimistic UI |
| ⚖️ **Bandingkan** | Side-by-side comparison hingga 3 properti |
| 🌙 **Dark Mode** | Toggle light/dark dengan Zustand state persistence |
| 📱 **Responsif** | Mobile-first, sidebar collapsible, drawer navigasi |
| ⚡ **Performa** | Server Components, streaming SSR, loading skeletons |

---

## 🛠️ Tech Stack

```
Frontend          Next.js 15 (App Router) + TypeScript
Styling           Tailwind CSS + Framer Motion (animasi)
Backend           Supabase (PostgreSQL + Auth + Storage + RLS)
State             Zustand (favorites, compare, dark mode)
Forms             React Hook Form + Zod validation
Maps              Leaflet.js (vanilla, no peer dep issues)
Icons             Lucide React
Fonts             Plus Jakarta Sans + Inter (via next/font)
```

---

## 🚀 Quick Start

### Prasyarat

- **Node.js** ≥ 18.17
- **npm** ≥ 9
- Akun [Supabase](https://supabase.com) (gratis)

### 1. Clone & Install

```bash
git clone https://github.com/username/nexpro.git
cd nexpro
npm install
```

### 2. Setup Environment

Buat file `.env.local` di root project:

```bash
# ── Supabase (Wajib) ─────────────────────────────────────────
# Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY

# ── Service Role (hanya untuk seed script) ───────────────────
# Supabase Dashboard → Settings → API → service_role secret
SUPABASE_SERVICE_ROLE_KEY=eyJ...YOUR_SERVICE_ROLE_KEY

# ── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Database Supabase

Jalankan script berikut secara **berurutan** di **Supabase → SQL Editor → New Query**:

| Urutan | File | Deskripsi |
|--------|------|-----------|
| 1 | `scripts/fix-rls-final.sql` | Buat skema tabel + RLS policies |
| 2 | `scripts/migrate-v3.sql` | Auth trigger + tabel chat |
| 3 | `scripts/migrate-v4.sql` | Kolom `rent_period` + `property_status` |
| 4 | `scripts/enable-realtime.sql` | Aktifkan Supabase Realtime |
| 5 | `scripts/seed-agents.sql` | Seed 5 agent + 50 properti |

> **⚠️ Penting:** Pada `fix-rls-final.sql`, ganti `EMAIL_KAMU@gmail.com` dengan email akun kamu sebelum Run.

### 4. Setup Supabase Storage

Di **Supabase Dashboard → Storage**:

1. Buat bucket baru bernama `property-images` (set ke **Public**)
2. Tambahkan policies berikut di tab **Policies**:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'property-images');

-- Allow public to view
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public USING (bucket_id = 'property-images');
```

### 5. Setup Supabase Auth

Di **Supabase Dashboard → Authentication → URL Configuration**:

```
Site URL:      http://localhost:3000
Redirect URLs: http://localhost:3000/auth/callback
```

### 6. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Struktur Project

```
nexpro/
├── scripts/                    # SQL migrations & seeders
│   ├── fix-rls-final.sql       # Schema + RLS policies
│   ├── migrate-v3.sql          # Auth trigger update
│   ├── migrate-v4.sql          # rent_period + property_status
│   ├── enable-realtime.sql     # Supabase Realtime setup
│   └── seed-agents.sql         # 5 agents × 10 properties
│
└── src/
    ├── app/
    │   ├── (auth)/             # Login, Signup, Forgot Password
    │   ├── auth/callback/      # Supabase email verification handler
    │   ├── dashboard/          # Protected dashboard (agent & customer)
    │   │   ├── listings/       # Kelola listing + status properti
    │   │   ├── analytics/      # Statistik view & inquiry per properti
    │   │   ├── inquiries/      # Manajemen pesan masuk
    │   │   ├── saved/          # Wishlist tersimpan
    │   │   ├── new-listing/    # Form 3-step buat listing baru
    │   │   ├── edit/[id]/      # Edit listing yang ada
    │   │   └── profile/        # Edit profil + upload avatar
    │   ├── properties/[slug]/  # Halaman detail properti (SSR)
    │   ├── search/             # Pencarian + filter + peta
    │   ├── compare/            # Bandingkan properti
    │   ├── saved/              # Halaman wishlist publik
    │   ├── about/              # Tentang Kami
    │   ├── privacy/            # Kebijakan Privasi
    │   └── terms/              # Syarat & Ketentuan
    │
    ├── components/
    │   ├── ui/                 # Atom: Button, Input, Badge, Toast, Skeleton
    │   ├── shared/             # Navbar, Footer, NavigationProgress
    │   └── modules/            # PropertyCard, KPR Calculator, PropertyMap,
    │                           # FavoriteButton, CompareBar, ShareButton
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts       # Browser Supabase client
    │   │   ├── server.ts       # Server Component client
    │   │   ├── middleware.ts   # Session refresh
    │   │   └── actions.ts      # Server Actions (30+ fungsi)
    │   ├── stores/index.ts     # Zustand stores
    │   ├── validations/        # Zod schemas
    │   └── utils.ts            # formatPrice, formatArea, timeAgo, cn
    │
    ├── middleware.ts            # Proteksi route /dashboard
    └── types/index.ts          # TypeScript types lengkap
```

---

## 🗄️ Database Schema

```sql
profiles          -- Data pengguna (sync dari auth.users via trigger)
properties        -- Listing properti dengan rent_period & property_status
favorites         -- Properti tersimpan per user
inquiries         -- Pesan dari calon pembeli ke agen
property_views    -- Tracking view per properti untuk analitik
notifications     -- Notifikasi sistem
```

### Kolom Penting di `properties`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `listing_type` | `sale` \| `rent` | Jenis listing |
| `rent_period` | `day` \| `week` \| `month` | Periode sewa (harian/mingguan/bulanan) |
| `property_status` | `available` \| `sold` \| `rented` | Status ketersediaan |
| `is_published` | `boolean` | Tampil di pencarian atau tidak |
| `is_featured` | `boolean` | Tampil di homepage |

---

## 👥 Role & Akses

```
customer  →  Cari properti, simpan favorit, kirim inquiry, bandingkan
agent     →  Semua customer + buat/edit/hapus listing, ubah status
              properti, lihat analitik, kelola pesan masuk
```

### Cara set role agent
Setelah signup, jalankan di SQL Editor:
```sql
UPDATE public.profiles
SET role = 'agent'
WHERE id = (SELECT id FROM auth.users WHERE email = 'emailkamu@gmail.com');
```

---

## 🎨 Design System

<table>
<tr>
<td>

**Warna**
| Token | Hex | Penggunaan |
|-------|-----|------------|
| Primary | `#000802` | CTA, nav aktif, teks utama |
| Emerald | `#10b981` | Accent, badge, highlight |
| Slate | `#476083` | Teks sekunder |
| Surface | `#f8f9fa` | Background halaman |
| Border | `#e1e3e4` | Garis pembatas |

</td>
<td>

**Tipografi**
| Font | Penggunaan |
|------|------------|
| Plus Jakarta Sans | Heading, tombol |
| Inter | Label, metadata |

**Animasi**
| Jenis | Library |
|-------|---------|
| Page transition | Framer Motion |
| Loading state | Tailwind animate |
| Sidebar collapse | Framer Motion |

</td>
</tr>
</table>

---

## 🚢 Deployment ke Vercel

```bash
# 1. Push ke GitHub
git add . && git commit -m "feat: initial deployment" && git push

# 2. Import project di vercel.com
# 3. Tambahkan environment variables di Vercel:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY
#    NEXT_PUBLIC_APP_URL (URL production kamu)

# 4. Deploy → Vercel auto-detects Next.js
```

Setelah deploy, update **Supabase Auth → URL Configuration**:
```
Site URL:      https://nexpro.vercel.app
Redirect URLs: https://nexpro.vercel.app/auth/callback
```

---

## 📦 Dependencies Utama

| Package | Versi | Kegunaan |
|---------|-------|----------|
| `next` | 15.x | Framework React |
| `@supabase/ssr` | latest | Supabase SSR client |
| `zustand` | 5.x | Global state management |
| `react-hook-form` | 7.x | Form handling |
| `zod` | 3.x | Schema validation |
| `framer-motion` | 11.x | Animasi & transisi |
| `leaflet` | 1.9.x | Peta interaktif |
| `lucide-react` | 0.4xx | Icon library |
| `tailwindcss` | 3.x | Utility-first CSS |

---

## 🔧 Scripts

```bash
npm run dev       # Development server (localhost:3000)
npm run build     # Production build
npm run start     # Jalankan production build
npm run lint      # ESLint check
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>❌ "Failed to fetch" saat login</strong></summary>

File `.env.local` tidak terbaca. Pastikan:
- File ada di root project (sama level dengan `package.json`)
- Tidak ada spasi di sekitar `=`
- Restart dev server setelah mengubah `.env.local`

</details>

<details>
<summary><strong>❌ Listing tidak bisa disimpan (RLS error)</strong></summary>

Role akun belum di-set ke `agent`. Jalankan:
```sql
UPDATE public.profiles SET role = 'agent'
WHERE id = (SELECT id FROM auth.users WHERE email = 'emailkamu@gmail.com');
```

</details>

<details>
<summary><strong>❌ Upload foto gagal</strong></summary>

Storage bucket belum ada atau policy belum dibuat. Pastikan:
1. Bucket `property-images` sudah dibuat dan di-set **Public**
2. Policy INSERT untuk `authenticated` sudah ditambahkan

</details>

<details>
<summary><strong>❌ Hydration error di browser</strong></summary>

Biasanya disebabkan browser extension (password manager, dll.) yang menambahkan attribute ke form. Ini bukan bug kode — coba buka di Incognito mode untuk konfirmasi.

</details>

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat [`LICENSE`](LICENSE) untuk informasi lengkap.

---

<div align="center">

Dibuat dengan ❤️ untuk pasar properti Indonesia

**[NexPro](http://localhost:3000)** · [Tentang Kami](/about) · [Kebijakan Privasi](/privacy) · [Syarat & Ketentuan](/terms)

</div>
