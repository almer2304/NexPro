-- ============================================================
-- NexPro — Database Seed Script
-- ============================================================
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor → New Query
--   2. Paste this entire file and click "Run"
--   3. Visit your app — listings will appear immediately
-- ============================================================

-- Step 1: Create a seed agent in auth.users so FK constraints pass
-- (Skip if you already have a real user you want to use as the agent)
DO $$
BEGIN
  -- Only insert if the seed user doesn't exist yet
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  ) THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, role, aud
    ) VALUES (
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000000',
      'agent.seed@nexpro.id',
      crypt('SeedPassword123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"full_name": "Reza Pratama", "role": "agent"}'::jsonb,
      'authenticated', 'authenticated'
    );
  END IF;
END $$;

-- Step 2: Upsert agent profile
INSERT INTO public.profiles (id, full_name, avatar_url, phone_number, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Reza Pratama',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  '+62 812-3456-7890',
  'agent'
)
ON CONFLICT (id) DO UPDATE SET
  full_name  = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  phone_number = EXCLUDED.phone_number,
  role = EXCLUDED.role;

-- Step 3: Insert 10 property listings
INSERT INTO public.properties (
  agent_id, title, slug, description, price,
  address, city, latitude, longitude,
  property_type, listing_type,
  bedrooms, bathrooms, land_size, building_size,
  main_image_url, images_urls,
  is_published, is_featured
) VALUES

-- ── JAKARTA 1: Kemang House ─────────────────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Modern Minimalist House in Kemang',
  'modern-minimalist-house-in-kemang-km001',
  'Nestled in the heart of Kemang, South Jakarta''s most sought-after enclave, this stunning minimalist residence redefines contemporary urban living. Floor-to-ceiling glass walls flood the interiors with natural light, while the open-plan kitchen and living area flow seamlessly onto a private tropical garden. Features include a rooftop terrace with city views, smart home automation, and a private swimming pool.',
  15500000000,
  'Jl. Kemang Raya No. 47', 'Jakarta', -6.2615, 106.8106,
  'house', 'sale', 4, 4, 400, 320,
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
  ],
  true, true
),

-- ── JAKARTA 2: Sudirman Penthouse ───────────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Luxury Penthouse at Sudirman CBD',
  'luxury-penthouse-at-sudirman-cbd-sd002',
  'Experience the pinnacle of Jakarta luxury in this breathtaking full-floor penthouse on the 48th floor of the prestigious Sudirman tower. 360-degree panoramic views of the Jakarta skyline and beyond. The unit features a private elevator lobby, chef''s kitchen with imported Italian marble countertops, a private jacuzzi terrace, and three dedicated parking spaces. Concierge services available 24/7.',
  45000000000,
  'Jl. Jend. Sudirman Kav. 52–53, Lt. 48', 'Jakarta', -6.2088, 106.8180,
  'apartment', 'sale', 3, 3, NULL, 420,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80'
  ],
  true, true
),

-- ── JAKARTA 3: Pondok Indah House ──────────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Tropical Garden House in Pondok Indah',
  'tropical-garden-house-in-pondok-indah-pi003',
  'A rare gem in the exclusive Pondok Indah estate. This sprawling family home is set on a large plot featuring a mature tropical garden, private tennis court, and a resort-style swimming pool. The interior blends classic Javanese motifs with modern sensibilities — hand-carved teak accents, terrazzo floors, and high ceilings throughout.',
  28000000000,
  'Jl. Pondok Indah No. 22', 'Jakarta', -6.2718, 106.7880,
  'house', 'sale', 5, 5, 900, 680,
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
  ],
  true, false
),

-- ── JAKARTA 4: SCBD Apartment for Rent ─────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Serviced Apartment for Rent — SCBD',
  'serviced-apartment-for-rent-scbd-sc004',
  'Fully furnished and serviced studio apartment in the heart of Jakarta''s SCBD financial district. Perfect for young professionals or corporate tenants. Includes access to shared co-working lounge, rooftop pool, gym, and 24-hour security. Walking distance to major office towers, restaurants, and the Pacific Place mall.',
  18000000,
  'Jl. Jend. Sudirman Kav. 45–46, SCBD', 'Jakarta', -6.2248, 106.8081,
  'apartment', 'rent', 1, 1, NULL, 45,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80'
  ],
  true, false
),

-- ── BALI 1: Uluwatu Clifftop Villa ──────────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Clifftop Villa with Infinity Pool in Uluwatu',
  'clifftop-villa-with-infinity-pool-in-uluwatu-ul005',
  'Perched dramatically on the edge of the Uluwatu cliffs, this extraordinary villa offers unobstructed Indian Ocean views from every room. The open-plan living pavilion, master suite, and infinity pool all face the sea — an endless blue horizon that turns gold at sunset. Features include a private chef''s kitchen, outdoor Bali-style shower, and a dedicated meditation deck.',
  32000000000,
  'Jl. Pantai Suluban, Pecatu, Uluwatu', 'Bali', -8.8291, 115.0849,
  'house', 'sale', 4, 4, 1200, 450,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1540541338537-1e70700da78a?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
  ],
  true, true
),

-- ── BALI 2: Ubud Rice Terrace Villa for Rent ────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Rice Terrace Villa for Rent in Ubud',
  'rice-terrace-villa-for-rent-in-ubud-ub006',
  'Immerse yourself in Bali''s spiritual heartland with this stunning villa overlooking lush green rice terraces. Designed by a renowned Balinese architect, the property blends traditional joglo structures with contemporary comforts. Features include two private pools, an outdoor yoga shala, and a bespoke Balinese garden tended daily.',
  65000000,
  'Jl. Raya Tegallalang, Ubud', 'Bali', -8.4095, 115.2814,
  'house', 'rent', 3, 3, 800, 300,
  'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
  ],
  true, true
),

-- ── BALI 3: Canggu Beachfront Land ─────────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Beachfront Land Plot in Canggu',
  'beachfront-land-plot-in-canggu-cg007',
  'A rare, once-in-a-generation opportunity to acquire a prime beachfront land parcel in Canggu — Bali''s most dynamic lifestyle district. The 2,500 sqm plot has direct beach access, full zoning approval for resort or residential development, and existing utility connections.',
  55000000000,
  'Jl. Batu Bolong, Canggu', 'Bali', -8.6478, 115.1347,
  'land', 'sale', 0, 0, 2500, NULL,
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80'
  ],
  true, false
),

-- ── BALI 4: Seminyak Villa Complex ──────────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Boutique Villa Complex in Seminyak',
  'boutique-villa-complex-in-seminyak-sm008',
  'A fully operational boutique villa complex in the prestigious Seminyak area, comprising five private pool villas. Currently generating strong rental income with an established booking system. Ideal as a turnkey hospitality investment or private family estate.',
  85000000000,
  'Jl. Kayu Aya, Seminyak', 'Bali', -8.6906, 115.1619,
  'house', 'sale', 10, 10, 3000, 1800,
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80'
  ],
  true, true
),

-- ── BANDUNG 1: Dago Pakar Mountain House ────────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Mountain-View House in Dago Pakar',
  'mountain-view-house-in-dago-pakar-dp009',
  'Escape the city in this serene hill retreat in Bandung''s exclusive Dago Pakar district. Set at 750m elevation, the property enjoys cool mountain air year-round and sweeping valley views. Features a wrap-around veranda, stone fireplace, large wooden deck, and a terraced garden.',
  8500000000,
  'Jl. Dago Pakar Timur No. 18', 'Bandung', -6.8548, 107.6381,
  'house', 'sale', 4, 3, 600, 280,
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80'
  ],
  true, false
),

-- ── BANDUNG 2: Buah Batu Townhouse for Rent ─────────────────
(
  '00000000-0000-0000-0000-000000000001',
  'Contemporary Townhouse for Rent in Buah Batu',
  'contemporary-townhouse-for-rent-in-buah-batu-bb010',
  'A stylish two-storey townhouse in Bandung''s vibrant Buah Batu creative district. Newly renovated with Scandinavian-inspired interiors — concrete floors, white-washed walls, and warm wood accents throughout. The house includes a private courtyard garden, modern fitted kitchen, and a rooftop terrace perfect for Bandung''s mild evenings.',
  12000000,
  'Jl. Buah Batu No. 56', 'Bandung', -6.9407, 107.6348,
  'house', 'rent', 3, 2, 150, 180,
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80'
  ],
  true, false
)

ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  price        = EXCLUDED.price,
  main_image_url = EXCLUDED.main_image_url,
  images_urls  = EXCLUDED.images_urls,
  is_published = EXCLUDED.is_published,
  is_featured  = EXCLUDED.is_featured,
  updated_at   = NOW();

-- Verify
SELECT id, title, city, price, listing_type, is_published, is_featured
FROM public.properties
ORDER BY city, created_at;
