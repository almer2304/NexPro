-- ================================================================
-- NexPro — FINAL RLS FIX (hapus semua duplikat, buat ulang bersih)
-- 
-- JALANKAN INI DI: Supabase → SQL Editor → New Query → Run
-- ================================================================

-- ── STEP 1: Hapus SEMUA policy lama di tabel properties ─────────
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'properties' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.properties', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- ── STEP 2: Hapus semua policy lama di profiles ─────────────────
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- ── STEP 3: Buat ulang policies PROPERTIES ──────────────────────

-- Semua orang bisa lihat properti yang published
CREATE POLICY "select_published"
  ON public.properties FOR SELECT
  USING (is_published = true);

-- Agent bisa lihat semua properti milik sendiri (termasuk draft)
CREATE POLICY "select_own"
  ON public.properties FOR SELECT
  USING (auth.uid() = agent_id);

-- Agent bisa insert properti baru (agent_id HARUS sama dengan user login)
CREATE POLICY "insert_own"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

-- Agent bisa update properti miliknya
CREATE POLICY "update_own"
  ON public.properties FOR UPDATE
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

-- Agent bisa hapus properti miliknya
CREATE POLICY "delete_own"
  ON public.properties FOR DELETE
  USING (auth.uid() = agent_id);

-- ── STEP 4: Buat ulang policies PROFILES ────────────────────────

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── STEP 5: Pastikan role 'agent' untuk akun kamu ───────────────
-- GANTI 'kucing@gmail.com' dengan email akun kamu!
UPDATE public.profiles
SET role = 'agent'
WHERE id = (SELECT id FROM auth.users WHERE email = 'kucing@gmail.com' LIMIT 1);

-- Verifikasi
SELECT p.id, p.full_name, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'kucing@gmail.com';

-- ── STEP 6: Cek hasil ───────────────────────────────────────────
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'properties'
ORDER BY cmd, policyname;

-- ── STEP 7: Test RLS dengan simulasi user ───────────────────────
-- Ganti UUID di bawah dengan ID dari profil 'kucing' di tabel profiles
-- (lihat di Supabase → Table Editor → profiles)
-- SET LOCAL role = authenticated;
-- SET LOCAL "request.jwt.claims" = '{"sub": "UUID-KUCING-DISINI"}';

SELECT 'Fix selesai! Sekarang coba login ulang dan buat listing.' AS status;
