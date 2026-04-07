-- ============================================================
-- NexPro — FIX LENGKAP: Role Agent + RLS Policies
-- 
-- CARA PAKAI:
-- 1. Buka Supabase Dashboard → SQL Editor → New Query
-- 2. Paste SELURUH isi file ini
-- 3. Ganti 'EMAIL_KAMU@gmail.com' dengan email akun kamu
-- 4. Klik Run
-- ============================================================

-- ── STEP 1: Set role kamu menjadi 'agent' ─────────────────
-- GANTI EMAIL DI BAWAH INI!
UPDATE public.profiles
SET role = 'agent'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'EMAIL_KAMU@gmail.com'  -- ← GANTI INI
  LIMIT 1
);

-- Verifikasi hasilnya
SELECT 
  p.id,
  p.full_name,
  p.role,
  u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'EMAIL_KAMU@gmail.com';  -- ← GANTI INI JUGA

-- ── STEP 2: Drop semua policy lama yang mungkin konflik ───
DROP POLICY IF EXISTS "Agents can manage their own properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can view own properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can insert own properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ── STEP 3: Buat ulang semua RLS policies ─────────────────

-- PROFILES
CREATE POLICY "Public profiles viewable by all"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- PROPERTIES: Siapa saja bisa lihat yang published
CREATE POLICY "Published properties viewable by all"
  ON public.properties FOR SELECT
  USING (is_published = true);

-- PROPERTIES: Agent bisa lihat SEMUA milik sendiri (termasuk draft)
CREATE POLICY "Agent view own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = agent_id);

-- PROPERTIES: Agent bisa buat listing baru
CREATE POLICY "Agent insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

-- PROPERTIES: Agent bisa update milik sendiri
CREATE POLICY "Agent update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

-- PROPERTIES: Agent bisa hapus milik sendiri
CREATE POLICY "Agent delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = agent_id);

-- ── STEP 4: Verifikasi policies ───────────────────────────
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'properties'
ORDER BY policyname;

-- ── STEP 5: Test — coba lihat apakah bisa insert ──────────
-- Jika step ini berhasil tanpa error, berarti RLS sudah benar
-- (Akan ada error karena agent_id tidak match, itu normal)
-- Test insert akan dilakukan dari aplikasi setelah login

-- ── STEP 6: Fix property_views table (kalau belum ada) ────
CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can insert views"
  ON public.property_views FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Agents view property stats"
  ON public.property_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE public.properties.id = property_views.property_id
      AND public.properties.agent_id = auth.uid()
    )
  );

-- ── STEP 7: Fix notifications table (kalau belum ada) ─────
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inquiry', 'favorite', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

-- ── DONE ──────────────────────────────────────────────────
SELECT 'Fix berhasil! Coba login ulang dan buat listing.' AS status;
