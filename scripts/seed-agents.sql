-- ============================================================
-- NexPro — Full Seeder: 5 Agents × 10 Properties = 50 Listings
-- 
-- CARA PAKAI:
-- Supabase → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ── STEP 1: Buat 5 agent di auth.users ──────────────────────
DO $$
DECLARE
  agents UUID[] := ARRAY[
    '10000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000002'::UUID,
    '10000000-0000-0000-0000-000000000003'::UUID,
    '10000000-0000-0000-0000-000000000004'::UUID,
    '10000000-0000-0000-0000-000000000005'::UUID
  ];
  emails TEXT[] := ARRAY[
    'andi.pratama@nexpro.id',
    'sari.dewi@nexpro.id',
    'budi.santoso@nexpro.id',
    'rina.kusuma@nexpro.id',
    'hendra.wijaya@nexpro.id'
  ];
  i INT;
BEGIN
  FOR i IN 1..5 LOOP
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = agents[i]) THEN
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_user_meta_data, role, aud
      ) VALUES (
        agents[i],
        '00000000-0000-0000-0000-000000000000',
        emails[i],
        crypt('AgentPass123!', gen_salt('bf')),
        NOW(), NOW(), NOW(),
        json_build_object('full_name', 
          CASE i
            WHEN 1 THEN 'Andi Pratama'
            WHEN 2 THEN 'Sari Dewi'
            WHEN 3 THEN 'Budi Santoso'
            WHEN 4 THEN 'Rina Kusuma'
            WHEN 5 THEN 'Hendra Wijaya'
          END,
          'role', 'agent',
          'phone_number',
          CASE i
            WHEN 1 THEN '+62 812-1111-0001'
            WHEN 2 THEN '+62 812-2222-0002'
            WHEN 3 THEN '+62 812-3333-0003'
            WHEN 4 THEN '+62 812-4444-0004'
            WHEN 5 THEN '+62 812-5555-0005'
          END
        )::jsonb,
        'authenticated', 'authenticated'
      );
    END IF;
  END LOOP;
END $$;

-- ── STEP 2: Upsert profiles ──────────────────────────────────
INSERT INTO public.profiles (id, full_name, avatar_url, phone_number, role)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Andi Pratama',   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', '+62 812-1111-0001', 'agent'),
  ('10000000-0000-0000-0000-000000000002', 'Sari Dewi',      'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=200&q=80', '+62 812-2222-0002', 'agent'),
  ('10000000-0000-0000-0000-000000000003', 'Budi Santoso',   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', '+62 812-3333-0003', 'agent'),
  ('10000000-0000-0000-0000-000000000004', 'Rina Kusuma',    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', '+62 812-4444-0004', 'agent'),
  ('10000000-0000-0000-0000-000000000005', 'Hendra Wijaya',  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', '+62 812-5555-0005', 'agent')
ON CONFLICT (id) DO UPDATE SET
  full_name    = EXCLUDED.full_name,
  avatar_url   = EXCLUDED.avatar_url,
  phone_number = EXCLUDED.phone_number,
  role         = EXCLUDED.role;

-- ── STEP 3: Insert 50 properties (5 agents × 10 each) ────────
INSERT INTO public.properties (
  agent_id, title, slug, description, price,
  address, city, latitude, longitude,
  property_type, listing_type,
  bedrooms, bathrooms, land_size, building_size,
  main_image_url, images_urls, is_published, is_featured
) VALUES

-- ════════════════════════════════════════════════
-- AGENT 1: Andi Pratama — Jakarta (Luxury)
-- ════════════════════════════════════════════════

('10000000-0000-0000-0000-000000000001',
 'Modern Minimalist House in Kemang',
 'modern-minimalist-house-kemang-a1p01',
 'Rumah minimalis modern di Kemang dengan desain kontemporer. Dilengkapi kolam renang pribadi, smart home system, dan taman tropis yang asri.',
 15500000000, 'Jl. Kemang Raya No. 47', 'Jakarta', -6.2615, 106.8106,
 'house', 'sale', 4, 4, 400, 320,
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000001',
 'Luxury Penthouse Sudirman CBD',
 'luxury-penthouse-sudirman-a1p02',
 'Penthouse full-floor di lantai 48 menara Sudirman. Pemandangan 360° kota Jakarta, dapur Italia, jacuzzi terrace, 3 parkir.',
 45000000000, 'Jl. Jend. Sudirman Kav. 52-53, Lt. 48', 'Jakarta', -6.2088, 106.8180,
 'apartment', 'sale', 3, 3, NULL, 420,
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000001',
 'Tropical Garden House Pondok Indah',
 'tropical-garden-house-pondokindah-a1p03',
 'Rumah keluarga besar di Pondok Indah dengan taman tropis matang, lapangan tenis, dan kolam renang resort.',
 28000000000, 'Jl. Pondok Indah No. 22', 'Jakarta', -6.2718, 106.7880,
 'house', 'sale', 5, 5, 900, 680,
 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000001',
 'Serviced Apartment Sewa SCBD',
 'serviced-apartment-scbd-a1p04',
 'Studio fully furnished di SCBD. Akses gym, rooftop pool, co-working, keamanan 24 jam.',
 18000000, 'Jl. Jend. Sudirman Kav. 45-46', 'Jakarta', -6.2248, 106.8081,
 'apartment', 'rent', 1, 1, NULL, 45,
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000001',
 'Rumah Vintage di Jakarta Pusat',
 'rumah-vintage-jakarta-pusat-a1p05',
 'Rumah heritage bergaya kolonial Belanda direnovasi modern. Detail kayu jati asli, plafon tinggi, halaman luas.',
 12000000000, 'Jl. Cikini Raya No. 18', 'Jakarta', -6.1944, 106.8413,
 'house', 'sale', 4, 3, 600, 450,
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000001',
 'Apartemen 2BR Disewa Kuningan',
 'apartemen-2br-kuningan-a1p06',
 'Apartemen 2 kamar view Kuningan Business District. Furnished lengkap, akses mall dan MRT.',
 25000000, 'Jl. HR Rasuna Said Kav. 10', 'Jakarta', -6.2311, 106.8297,
 'apartment', 'rent', 2, 2, NULL, 78,
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000001',
 'Townhouse Thamrin City',
 'townhouse-thamrin-city-a1p07',
 'Townhouse 3 lantai di Thamrin, pusat kota Jakarta. Modern, strategis, akses mudah ke semua fasilitas.',
 8500000000, 'Jl. Thamrin No. 55', 'Jakarta', -6.1864, 106.8233,
 'house', 'sale', 3, 3, 150, 240,
 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000001',
 'Kavling Premium Kelapa Gading',
 'kavling-premium-kelapa-gading-a1p08',
 'Kavling siap bangun di kawasan elit Kelapa Gading. Area residensial terpadu, 24 jam security, infrastruktur lengkap.',
 6000000000, 'Jl. Boulevard Raya, Kelapa Gading', 'Jakarta', -6.1567, 106.9071,
 'land', 'sale', 0, 0, 350, NULL,
 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000001',
 'Rumah Mewah Pantai Indah Kapuk',
 'rumah-mewah-pik-a1p09',
 'Rumah cluster premium PIK dengan kolam renang, 5 kamar, garasi 3 mobil. Dekat pantai dan pusat perbelanjaan.',
 22000000000, 'Jl. PIK Avenue No. 7', 'Jakarta', -6.1082, 106.7415,
 'house', 'sale', 5, 5, 500, 450,
 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000001',
 'Studio Apartment Sewa Fatmawati',
 'studio-fatmawati-a1p10',
 'Studio minimalis di Fatmawati, dekat MRT. Cocok untuk profesional muda. Sudah include internet dan air.',
 7500000, 'Jl. RS Fatmawati No. 88', 'Jakarta', -6.2932, 106.7942,
 'apartment', 'rent', 1, 1, NULL, 32,
 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=80'],
 true, false),

-- ════════════════════════════════════════════════
-- AGENT 2: Sari Dewi — Bali (Villa & Resort)
-- ════════════════════════════════════════════════

('10000000-0000-0000-0000-000000000002',
 'Clifftop Villa Infinity Pool Uluwatu',
 'clifftop-villa-uluwatu-a2p01',
 'Villa di tepi tebing Uluwatu dengan pemandangan Samudra Hindia. Kolam infinity, pavilion terbuka, deck meditasi.',
 32000000000, 'Jl. Pantai Suluban, Pecatu', 'Bali', -8.8291, 115.0849,
 'house', 'sale', 4, 4, 1200, 450,
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80','https://images.unsplash.com/photo-1540541338537-1e70700da78a?w=800&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000002',
 'Rice Terrace Villa Rent Ubud',
 'rice-terrace-villa-ubud-a2p02',
 'Villa Bali tradisional dengan pemandangan sawah di Ubud. Dua kolam pribadi, yoga shala, taman Bali terawat.',
 65000000, 'Jl. Raya Tegallalang', 'Bali', -8.4095, 115.2814,
 'house', 'rent', 3, 3, 800, 300,
 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000002',
 'Beachfront Land Canggu Premium',
 'beachfront-land-canggu-a2p03',
 'Tanah beachfront di Canggu 2500m². Akses langsung pantai, IMB resort sudah ada, utilitas terpasang.',
 55000000000, 'Jl. Batu Bolong', 'Bali', -8.6478, 115.1347,
 'land', 'sale', 0, 0, 2500, NULL,
 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000002',
 'Boutique Villa Complex Seminyak',
 'boutique-villa-seminyak-a2p04',
 '5 villa pool mewah di Seminyak. Fully operational, booking system terestablish. ROI tinggi sebagai investasi.',
 85000000000, 'Jl. Kayu Aya', 'Bali', -8.6906, 115.1619,
 'house', 'sale', 10, 10, 3000, 1800,
 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000002',
 'Modern Villa Disewa Seminyak',
 'modern-villa-sewa-seminyak-a2p05',
 'Villa modern 3 kamar di Seminyak. Kolam privat, fully furnished, akses jalan besar. Cocok untuk keluarga.',
 45000000, 'Jl. Petitenget No. 77', 'Bali', -8.6869, 115.1542,
 'house', 'rent', 3, 3, 400, 280,
 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000002',
 'Eco Jungle Villa Ubud',
 'eco-jungle-villa-ubud-a2p06',
 'Villa eco-luxury di dalam hutan Ubud. Arsitektur menyatu dengan alam, kolam alami, view sungai.',
 18000000000, 'Jl. Monkey Forest, Ubud', 'Bali', -8.5069, 115.2625,
 'house', 'sale', 2, 2, 600, 200,
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000002',
 'Tanah Investasi Nusa Dua',
 'tanah-investasi-nusa-dua-a2p07',
 'Tanah 1800m² di kawasan hotel Nusa Dua. Zona resort, SHM, dekat pantai Nusa Dua yang ekslusif.',
 38000000000, 'Kawasan ITDC, Nusa Dua', 'Bali', -8.8024, 115.2310,
 'land', 'sale', 0, 0, 1800, NULL,
 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000002',
 'Kuta Beach House Dijual',
 'kuta-beach-house-a2p08',
 'Rumah 4 kamar 200m dari Pantai Kuta. Garasi 2 mobil, rooftop lounge, sudah dipakai villa rental aktif.',
 9500000000, 'Jl. Legian No. 33', 'Bali', -8.7203, 115.1691,
 'house', 'sale', 4, 3, 300, 260,
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000002',
 'Jungle Retreat Disewa Payangan',
 'jungle-retreat-payangan-a2p09',
 'Retreat pribadi di Payangan dengan view lembah hijau. Cocok untuk yoga retreat, staycation, atau nomad digital.',
 35000000, 'Jl. Raya Payangan', 'Bali', -8.3765, 115.2543,
 'house', 'rent', 2, 2, 500, 180,
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000002',
 'Sanur Beach Cottage',
 'sanur-beach-cottage-a2p10',
 'Cottage 2 kamar 100m dari pantai Sanur. Suasana tenang, pemandangan laut, cocok untuk keluarga.',
 4500000000, 'Jl. Danau Tamblingan, Sanur', 'Bali', -8.6820, 115.2625,
 'house', 'sale', 2, 2, 200, 150,
 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80'],
 true, false),

-- ════════════════════════════════════════════════
-- AGENT 3: Budi Santoso — Bandung (Mountain & Creative)
-- ════════════════════════════════════════════════

('10000000-0000-0000-0000-000000000003',
 'Mountain View House Dago Pakar',
 'mountain-view-dago-pakar-a3p01',
 'Rumah di ketinggian 750m Dago Pakar. Udara sejuk sepanjang tahun, view lembah, terrace kayu, perapian batu.',
 8500000000, 'Jl. Dago Pakar Timur No. 18', 'Bandung', -6.8548, 107.6381,
 'house', 'sale', 4, 3, 600, 280,
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Contemporary Townhouse Buah Batu',
 'townhouse-buah-batu-a3p02',
 'Townhouse 2 lantai di kawasan kreatif Buah Batu. Interior Skandinavia, courtyard, rooftop. Dekat kafe dan galeri.',
 12000000, 'Jl. Buah Batu No. 56', 'Bandung', -6.9407, 107.6348,
 'house', 'rent', 3, 2, 150, 180,
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Villa Resort Lembang View',
 'villa-lembang-view-a3p03',
 'Villa resort di Lembang dengan view gunung dan kebun teh. Kolam renang outdoor, saung, cocok untuk gathering.',
 14000000000, 'Jl. Grand Hotel Lembang', 'Bandung', -6.8120, 107.6155,
 'house', 'sale', 5, 4, 1000, 500,
 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000003',
 'Apartemen Sudirman Bandung',
 'apartemen-sudirman-bandung-a3p04',
 'Apartemen 2BR di Sudirman Bandung. Strategis, dekat kampus dan pusat kota, fasilitas lengkap.',
 9000000, 'Jl. Jend. Sudirman No. 100', 'Bandung', -6.9175, 107.6191,
 'apartment', 'rent', 2, 1, NULL, 65,
 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Kavling Perumahan Cimahi',
 'kavling-cimahi-a3p05',
 'Kavling 250m² di perumahan baru Cimahi. Akses tol, lingkungan asri, cocok untuk hunian keluarga.',
 850000000, 'Perumahan Griya Cimahi Asri', 'Bandung', -6.8715, 107.5436,
 'land', 'sale', 0, 0, 250, NULL,
 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Rumah Klasik Cipaganti',
 'rumah-klasik-cipaganti-a3p06',
 'Rumah gaya klasik Belanda di Cipaganti, kawasan heritage Bandung. Teras luas, plafon tinggi, taman rindang.',
 5500000000, 'Jl. Cipaganti No. 88', 'Bandung', -6.8976, 107.6083,
 'house', 'sale', 4, 3, 450, 380,
 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Kost Eksklusif Setiabudi',
 'kost-eksklusif-setiabudi-a3p07',
 'Kamar kost premium di Setiabudi Bandung. AC, wifi, kamar mandi dalam, dapur bersama. Strategis dekat kampus.',
 3500000, 'Jl. Setiabudi No. 44', 'Bandung', -6.8702, 107.6244,
 'apartment', 'rent', 1, 1, NULL, 20,
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Villa Sewa Ciwidey',
 'villa-ciwidey-a3p08',
 'Villa 4 kamar di Ciwidey dekat kawah Putih. Pemandangan gunung, taman bunga, fireplace. Booking mingguan.',
 25000000, 'Jl. Raya Ciwidey', 'Bandung', -7.1162, 107.4274,
 'house', 'rent', 4, 3, 700, 300,
 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Ruko 3 Lantai Pasteur',
 'ruko-pasteur-a3p09',
 'Ruko strategis di Pasteur, jalur utama menuju Tol Pasteur. Cocok untuk usaha kuliner, retail, atau kantor.',
 4200000000, 'Jl. Dr. Djundjunan (Pasteur) No. 22', 'Bandung', -6.8880, 107.5820,
 'house', 'sale', 0, 2, 120, 360,
 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000003',
 'Cluster Baru Arcamanik',
 'cluster-arcamanik-a3p10',
 'Rumah cluster baru Arcamanik. 2 kamar, garasi, taman kecil. One gate security, akses tol timur.',
 1200000000, 'Perumahan Arcamanik Endah', 'Bandung', -6.9250, 107.6843,
 'house', 'sale', 2, 1, 90, 70,
 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80'],
 true, false),

-- ════════════════════════════════════════════════
-- AGENT 4: Rina Kusuma — Surabaya & Yogyakarta
-- ════════════════════════════════════════════════

('10000000-0000-0000-0000-000000000004',
 'Rumah Mewah Pakuwon City',
 'rumah-pakuwon-city-a4p01',
 'Rumah mewah di Pakuwon City Surabaya. Cluster eksklusif, kolam renang, 5 kamar, garasi 3 mobil.',
 16000000000, 'Jl. Pakuwon Indah', 'Surabaya', -7.2871, 112.6649,
 'house', 'sale', 5, 4, 600, 500,
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000004',
 'Apartemen Surabaya CBD',
 'apartemen-surabaya-cbd-a4p02',
 'Apartemen 2BR di pusat bisnis Surabaya. Dekat Tunjungan Plaza, fully furnished, fasilitas bintang 5.',
 22000000, 'Jl. Basuki Rahmat No. 100', 'Surabaya', -7.2635, 112.7478,
 'apartment', 'rent', 2, 1, NULL, 72,
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Villa Jogja View Merapi',
 'villa-jogja-merapi-a4p03',
 'Villa premium dengan view langsung Gunung Merapi. Konsep resort, kolam alami, gazebo, sarana yoga.',
 9500000000, 'Jl. Kaliurang Km 12', 'Yogyakarta', -7.6821, 110.4327,
 'house', 'sale', 4, 4, 800, 380,
 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000004',
 'Rumah Jogja Heritage Kotagede',
 'rumah-heritage-kotagede-a4p04',
 'Rumah Jawa kuno di Kotagede yang direnovasi. Joglo asli, ukiran kayu, halaman luas. Nilai historis tinggi.',
 7500000000, 'Jl. Mondorakan, Kotagede', 'Yogyakarta', -7.8287, 110.4151,
 'house', 'sale', 4, 3, 550, 420,
 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Tanah SHM Kota Baru Surabaya',
 'tanah-kota-baru-sby-a4p05',
 'Tanah SHM 400m² di Kota Baru Surabaya Barat. Zona perumahan, akses tol MERR, nilai investasi tinggi.',
 3200000000, 'Jl. HR Muhammad', 'Surabaya', -7.2827, 112.6815,
 'land', 'sale', 0, 0, 400, NULL,
 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Kos Eksklusif Jogja Dekat UGM',
 'kos-jogja-ugm-a4p06',
 'Kamar kos premium dekat UGM. AC, wifi 100 Mbps, kamar mandi dalam, parkir motor, dapur bersama.',
 2800000, 'Jl. Kaliurang Km 5', 'Yogyakarta', -7.7683, 110.3784,
 'apartment', 'rent', 1, 1, NULL, 18,
 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Rumah Cluster Citraland Surabaya',
 'rumah-citraland-a4p07',
 'Rumah 2 lantai di Citraland Surabaya. Cluster aman, 3 kamar, carport, taman kecil, dekat sekolah.',
 2800000000, 'Perumahan Citraland', 'Surabaya', -7.2951, 112.6598,
 'house', 'sale', 3, 2, 150, 175,
 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Villa Prambanan Jogja',
 'villa-prambanan-a4p08',
 'Villa 3 kamar dengan view Candi Prambanan. Desain modern-Jawa, kolam renang, taman luas, akses mudah.',
 8000000000, 'Jl. Raya Prambanan', 'Yogyakarta', -7.7520, 110.4913,
 'house', 'sale', 3, 3, 700, 320,
 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Ruko Strategis Malioboro',
 'ruko-malioboro-a4p09',
 'Ruko 3 lantai di belakang Malioboro. Traffic tinggi, cocok untuk restoran, toko, atau penginapan.',
 6500000000, 'Jl. Mataram, Yogyakarta', 'Yogyakarta', -7.7944, 110.3661,
 'house', 'sale', 0, 2, 130, 390,
 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000004',
 'Apartemen Studio Sewa Surabaya Barat',
 'studio-sby-barat-a4p10',
 'Studio modern di Surabaya Barat. Dekat mall, RS, kampus. Pet-friendly. Tersedia kontrak 6 atau 12 bulan.',
 6000000, 'Jl. Mayjen Sungkono', 'Surabaya', -7.2897, 112.7104,
 'apartment', 'rent', 1, 1, NULL, 28,
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
 true, false),

-- ════════════════════════════════════════════════
-- AGENT 5: Hendra Wijaya — Medan & Makassar
-- ════════════════════════════════════════════════

('10000000-0000-0000-0000-000000000005',
 'Rumah Mewah Medan Sunggal',
 'rumah-mewah-sunggal-a5p01',
 'Rumah mewah 4 lantai di Sunggal Medan. Smart home, kolam renang, gym pribadi, home theater.',
 12000000000, 'Jl. Setia Budi, Sunggal', 'Medan', 3.5952, 98.6722,
 'house', 'sale', 5, 5, 600, 700,
 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000005',
 'Apartemen CBD Medan',
 'apartemen-cbd-medan-a5p02',
 'Apartemen 2BR di CBD Medan. View kota, fully furnished, akses mudah ke pusat bisnis dan pusat perbelanjaan.',
 18000000, 'Jl. Gatot Subroto No. 55', 'Medan', 3.5952, 98.6772,
 'apartment', 'rent', 2, 1, NULL, 68,
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Rumah Cluster Ciputra Medan',
 'rumah-ciputra-medan-a5p03',
 'Rumah cluster premium Ciputra Medan. 3 kamar, garasi 2 mobil, taman, keamanan 24 jam.',
 3500000000, 'Ciputra Podomoro City, Medan', 'Medan', 3.5867, 98.6234,
 'house', 'sale', 3, 2, 180, 160,
 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Tanah Strategis Medan Helvetia',
 'tanah-helvetia-a5p04',
 'Kavling 300m² di Helvetia Medan. Zona perumahan, infrastruktur lengkap, nilai investasi terus meningkat.',
 1500000000, 'Jl. Helvetia Timur', 'Medan', 3.6215, 98.6489,
 'land', 'sale', 0, 0, 300, NULL,
 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Villa Pantai Makassar',
 'villa-pantai-makassar-a5p05',
 'Villa eksklusif di tepi Pantai Losari Makassar. View sunset langsung, kolam renang, 4 kamar mewah.',
 18000000000, 'Jl. Penghibur, Pantai Losari', 'Makassar', -5.1477, 119.4247,
 'house', 'sale', 4, 4, 800, 500,
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'],
 true, true),

('10000000-0000-0000-0000-000000000005',
 'Apartemen Disewa Makassar',
 'apartemen-sewa-makassar-a5p06',
 'Studio modern dekat Trans Studio Mall Makassar. Furnished, akses mudah, cocok untuk ekspatriat.',
 8500000, 'Jl. Metro Tanjung Bunga', 'Makassar', -5.1636, 119.4059,
 'apartment', 'rent', 1, 1, NULL, 35,
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Rumah Townhouse Makassar',
 'townhouse-makassar-a5p07',
 'Townhouse 2 lantai di Makassar. Desain modern, 3 kamar, carport, lokasi dekat sekolah internasional.',
 2200000000, 'Jl. Abdullah Dg. Sirua', 'Makassar', -5.1356, 119.4479,
 'house', 'sale', 3, 2, 120, 150,
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Tanah Makassar Tallo',
 'tanah-tallo-makassar-a5p08',
 'Tanah 500m² di Tallo, Makassar Utara. Dekat pelabuhan, cocok untuk gudang atau investasi jangka panjang.',
 2800000000, 'Jl. Sultan Abdullah, Tallo', 'Makassar', -5.1219, 119.4378,
 'land', 'sale', 0, 0, 500, NULL,
 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Ruko 2 Lantai Medan Polonia',
 'ruko-polonia-medan-a5p09',
 'Ruko 2 lantai dekat Bandara Kualanamu lama, kawasan Polonia. Parkir luas, cocok untuk kantor atau usaha.',
 2500000000, 'Jl. Listrik, Polonia', 'Medan', 3.5675, 98.6785,
 'house', 'sale', 0, 2, 100, 200,
 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=80'],
 true, false),

('10000000-0000-0000-0000-000000000005',
 'Villa Sewa Makassar Premium',
 'villa-sewa-makassar-a5p10',
 'Villa 5 kamar dengan kolam renang di perumahan elite Makassar. Cocok untuk keluarga besar, acara private.',
 30000000, 'Jl. Hertasning Baru', 'Makassar', -5.1761, 119.4631,
 'house', 'rent', 5, 4, 600, 400,
 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
 ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80'],
 true, false)

ON CONFLICT (slug) DO UPDATE SET
  title          = EXCLUDED.title,
  description    = EXCLUDED.description,
  price          = EXCLUDED.price,
  main_image_url = EXCLUDED.main_image_url,
  is_published   = EXCLUDED.is_published,
  is_featured    = EXCLUDED.is_featured,
  updated_at     = NOW();

-- ── VERIFY ────────────────────────────────────────────────────
SELECT
  p.full_name AS agent,
  COUNT(pr.id) AS listing_count
FROM public.profiles p
LEFT JOIN public.properties pr ON pr.agent_id = p.id
WHERE p.role = 'agent'
  AND p.id LIKE '10000000%'
GROUP BY p.full_name
ORDER BY p.full_name;
