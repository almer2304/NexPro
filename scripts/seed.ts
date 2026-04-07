/**
 * NexPro Database Seed Script
 * ─────────────────────────────────────────────────────────────
 * Usage (two options):
 *
 * Option A — Direct SQL (recommended, no auth needed):
 *   Paste the contents of scripts/seed.sql into your Supabase SQL editor and run it.
 *
 * Option B — Node script (requires service role key):
 *   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 *   2. npx tsx scripts/seed.ts
 * ─────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌  Missing env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local"
  );
  process.exit(1);
}

// ── Service-role client bypasses RLS ─────────────────────────
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Seed Agent Profile ────────────────────────────────────────
// We create a fake agent UUID that doesn't need to exist in auth.users
// because the service role bypasses FK enforcement for seeding purposes.
// In production, this should be a real authenticated user's UUID.
const SEED_AGENT_ID = "00000000-0000-0000-0000-000000000001";

const agentProfile = {
  id: SEED_AGENT_ID,
  full_name: "Reza Pratama",
  avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  phone_number: "+62 812-3456-7890",
  role: "agent" as const,
};

// ── Property Seed Data ────────────────────────────────────────
function slug(title: string, suffix: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + suffix;
}

const properties = [
  // ── JAKARTA ──────────────────────────────────────────────
  {
    agent_id: SEED_AGENT_ID,
    title: "Modern Minimalist House in Kemang",
    slug: slug("Modern Minimalist House in Kemang", "km001"),
    description:
      "Nestled in the heart of Kemang, South Jakarta's most sought-after enclave, this stunning minimalist residence redefines contemporary urban living. Floor-to-ceiling glass walls flood the interiors with natural light, while the open-plan kitchen and living area flow seamlessly onto a private tropical garden. Features include a rooftop terrace with city views, smart home automation, and a private swimming pool.",
    price: 15_500_000_000,
    address: "Jl. Kemang Raya No. 47",
    city: "Jakarta",
    latitude: -6.2615,
    longitude: 106.8106,
    property_type: "house",
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 4,
    land_size: 400,
    building_size: 320,
    main_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    ],
    is_published: true,
    is_featured: true,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Luxury Penthouse at Sudirman CBD",
    slug: slug("Luxury Penthouse at Sudirman CBD", "sd002"),
    description:
      "Experience the pinnacle of Jakarta luxury in this breathtaking full-floor penthouse on the 48th floor of the prestigious Sudirman tower. 360-degree panoramic views of the Jakarta skyline and beyond. The unit features a private elevator lobby, chef's kitchen with imported Italian marble countertops, a private jacuzzi terrace, and three dedicated parking spaces. Concierge services available 24/7.",
    price: 45_000_000_000,
    address: "Jl. Jend. Sudirman Kav. 52–53, Lt. 48",
    city: "Jakarta",
    latitude: -6.2088,
    longitude: 106.8180,
    property_type: "apartment",
    listing_type: "sale",
    bedrooms: 3,
    bathrooms: 3,
    land_size: null,
    building_size: 420,
    main_image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    ],
    is_published: true,
    is_featured: true,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Tropical Garden House in Pondok Indah",
    slug: slug("Tropical Garden House in Pondok Indah", "pi003"),
    description:
      "A rare gem in the exclusive Pondok Indah estate. This sprawling family home is set on a large plot featuring a mature tropical garden, private tennis court, and a resort-style swimming pool. The interior blends classic Javanese motifs with modern sensibilities — hand-carved teak accents, terrazzo floors, and high ceilings throughout.",
    price: 28_000_000_000,
    address: "Jl. Pondok Indah No. 22, Pondok Indah",
    city: "Jakarta",
    latitude: -6.2718,
    longitude: 106.7880,
    property_type: "house",
    listing_type: "sale",
    bedrooms: 5,
    bathrooms: 5,
    land_size: 900,
    building_size: 680,
    main_image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
    is_published: true,
    is_featured: false,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Serviced Apartment for Rent — SCBD",
    slug: slug("Serviced Apartment for Rent SCBD", "sc004"),
    description:
      "Fully furnished and serviced studio apartment in the heart of Jakarta's SCBD financial district. Perfect for young professionals or corporate tenants. Includes access to shared co-working lounge, rooftop pool, gym, and 24-hour security. Walking distance to major office towers, restaurants, and the Pacific Place mall.",
    price: 18_000_000,
    address: "Jl. Jend. Sudirman Kav. 45–46, SCBD",
    city: "Jakarta",
    latitude: -6.2248,
    longitude: 106.8081,
    property_type: "apartment",
    listing_type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    land_size: null,
    building_size: 45,
    main_image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80",
    ],
    is_published: true,
    is_featured: false,
  },

  // ── BALI ─────────────────────────────────────────────────
  {
    agent_id: SEED_AGENT_ID,
    title: "Clifftop Villa with Infinity Pool in Uluwatu",
    slug: slug("Clifftop Villa with Infinity Pool in Uluwatu", "ul005"),
    description:
      "Perched dramatically on the edge of the Uluwatu cliffs, this extraordinary villa offers unobstructed Indian Ocean views from every room. The open-plan living pavilion, master suite, and infinity pool all face the sea — an endless blue horizon that turns gold at sunset. Features include a private chef's kitchen, outdoor Bali-style shower, and a dedicated meditation deck.",
    price: 32_000_000_000,
    address: "Jl. Pantai Suluban, Pecatu, Uluwatu",
    city: "Bali",
    latitude: -8.8291,
    longitude: 115.0849,
    property_type: "house",
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 4,
    land_size: 1200,
    building_size: 450,
    main_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338537-1e70700da78a?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    is_published: true,
    is_featured: true,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Rice Terrace Villa for Rent in Ubud",
    slug: slug("Rice Terrace Villa for Rent in Ubud", "ub006"),
    description:
      "Immerse yourself in Bali's spiritual heartland with this stunning villa overlooking lush green rice terraces. Designed by a renowned Balinese architect, the property blends traditional joglo structures with contemporary comforts. Features include two private pools, an outdoor yoga shala, and a bespoke Balinese garden tended daily. Ideal for wellness retreats or long-stay remote workers.",
    price: 65_000_000,
    address: "Jl. Raya Tegallalang, Ubud",
    city: "Bali",
    latitude: -8.4095,
    longitude: 115.2814,
    property_type: "house",
    listing_type: "rent",
    bedrooms: 3,
    bathrooms: 3,
    land_size: 800,
    building_size: 300,
    main_image_url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    ],
    is_published: true,
    is_featured: true,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Beachfront Land Plot in Canggu",
    slug: slug("Beachfront Land Plot in Canggu", "cg007"),
    description:
      "A rare, once-in-a-generation opportunity to acquire a prime beachfront land parcel in Canggu — Bali's most dynamic lifestyle district. The 2,500 sqm plot has direct beach access, full zoning approval for resort or residential development, and existing utility connections. Surrounded by world-class surf breaks, artisan cafes, and Bali's thriving digital nomad community.",
    price: 55_000_000_000,
    address: "Jl. Batu Bolong, Canggu",
    city: "Bali",
    latitude: -8.6478,
    longitude: 115.1347,
    property_type: "land",
    listing_type: "sale",
    bedrooms: 0,
    bathrooms: 0,
    land_size: 2500,
    building_size: null,
    main_image_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    ],
    is_published: true,
    is_featured: false,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Boutique Villa Complex in Seminyak",
    slug: slug("Boutique Villa Complex in Seminyak", "sm008"),
    description:
      "A fully operational boutique villa complex in the prestigious Seminyak area, comprising five private pool villas. Each villa features a private 8m pool, open-plan living, and Balinese-crafted furnishings. Currently generating strong rental income with an established booking system. Ideal as a turnkey hospitality investment or a private family estate.",
    price: 85_000_000_000,
    address: "Jl. Kayu Aya, Seminyak",
    city: "Bali",
    latitude: -8.6906,
    longitude: 115.1619,
    property_type: "house",
    listing_type: "sale",
    bedrooms: 10,
    bathrooms: 10,
    land_size: 3000,
    building_size: 1800,
    main_image_url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    ],
    is_published: true,
    is_featured: true,
  },

  // ── BANDUNG ───────────────────────────────────────────────
  {
    agent_id: SEED_AGENT_ID,
    title: "Mountain-View House in Dago Pakar",
    slug: slug("Mountain-View House in Dago Pakar", "dp009"),
    description:
      "Escape the city in this serene hill retreat in Bandung's exclusive Dago Pakar district. Set at 750m elevation, the property enjoys cool mountain air year-round and sweeping valley views. The house features a wrap-around veranda, stone fireplace, large wooden deck, and a terraced garden. Close to popular hiking trails, weekend markets, and Bandung's renowned culinary scene.",
    price: 8_500_000_000,
    address: "Jl. Dago Pakar Timur No. 18",
    city: "Bandung",
    latitude: -6.8548,
    longitude: 107.6381,
    property_type: "house",
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    land_size: 600,
    building_size: 280,
    main_image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    ],
    is_published: true,
    is_featured: false,
  },
  {
    agent_id: SEED_AGENT_ID,
    title: "Contemporary Townhouse for Rent in Buah Batu",
    slug: slug("Contemporary Townhouse for Rent in Buah Batu", "bb010"),
    description:
      "A stylish two-storey townhouse in Bandung's vibrant Buah Batu creative district. Newly renovated with Scandinavian-inspired interiors — concrete floors, white-washed walls, and warm wood accents throughout. The house includes a private courtyard garden, modern fitted kitchen, and a rooftop terrace perfect for Bandung's mild evenings. Walking distance to coffee shops, galleries, and boutiques.",
    price: 12_000_000,
    address: "Jl. Buah Batu No. 56",
    city: "Bandung",
    latitude: -6.9407,
    longitude: 107.6348,
    property_type: "house",
    listing_type: "rent",
    bedrooms: 3,
    bathrooms: 2,
    land_size: 150,
    building_size: 180,
    main_image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    images_urls: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80",
    ],
    is_published: true,
    is_featured: false,
  },
];

// ── Run Seed ──────────────────────────────────────────────────
async function seed() {
  console.log("🌱  Starting NexPro database seed...\n");

  // 1. Upsert agent profile
  console.log("👤  Creating seed agent profile...");
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(agentProfile, { onConflict: "id" });

  if (profileError) {
    // If FK constraint prevents this, user needs to use the SQL script instead
    console.warn("⚠️  Could not upsert profile (likely FK constraint to auth.users).");
    console.warn("   → Use the SQL seed script instead: scripts/seed.sql");
    console.warn("   Error:", profileError.message);
    // Continue anyway — try inserting properties with an existing user ID
  } else {
    console.log("   ✓ Agent profile upserted\n");
  }

  // 2. Upsert properties
  console.log("🏠  Inserting 10 property listings...");
  const { data, error: propError } = await supabase
    .from("properties")
    .upsert(properties, { onConflict: "slug", ignoreDuplicates: false })
    .select("id, title, city");

  if (propError) {
    console.error("❌  Error inserting properties:", propError.message);
    process.exit(1);
  }

  console.log(`\n✅  Seed complete! Inserted/updated ${data?.length ?? 0} properties:\n`);
  data?.forEach((p, i) => console.log(`   ${i + 1}. [${p.city}] ${p.title}`));
  console.log("\n🚀  Visit http://localhost:3000 to see your listings!");
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
