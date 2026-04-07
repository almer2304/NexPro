-- ============================================================
-- NexPro — Migrate: rent_period + property_status
-- Jalankan di Supabase → SQL Editor
-- ============================================================

-- 1. Tambah kolom rent_period (harian/mingguan/bulanan)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS rent_period TEXT
    CHECK (rent_period IN ('day', 'week', 'month'))
    DEFAULT 'month';

-- 2. Tambah kolom property_status (available/sold/rented)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS property_status TEXT
    NOT NULL DEFAULT 'available'
    CHECK (property_status IN ('available', 'sold', 'rented'));

-- 3. Set default rent_period untuk properti sewa yang sudah ada
UPDATE public.properties
SET rent_period = 'month'
WHERE listing_type = 'rent' AND rent_period IS NULL;

-- 4. Verifikasi
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'properties'
  AND column_name IN ('rent_period', 'property_status');

SELECT 'Migration selesai! ✅' AS status;
