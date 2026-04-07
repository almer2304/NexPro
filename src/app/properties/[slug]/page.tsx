import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble, Bath, Ruler, MapPin, Phone,
  ChevronLeft, TreePine, Calendar, CheckCircle2,
  Building2, Layers, ArrowRight, MessageCircle,
} from "lucide-react";
import { getPropertyBySlug, getProperties, getUserFavoriteIds, recordPropertyView } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/server";
import { FavoriteButton } from "@/components/modules/favorite-button";
import { PropertyCard } from "@/components/modules/property-card";
import { InquirySection } from "./inquiry-section";
import { ImageGallery } from "./image-gallery";
import { KPRCalculator } from "@/components/modules/kpr-calculator";
import { ShareButton } from "@/components/modules/share-button";
import { CompareButton } from "@/components/modules/compare-button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatArea } from "@/lib/utils";
import type { Property } from "@/types";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} | NexPro`,
    description: property.description?.slice(0, 160) ??
      `${property.property_type} for ${property.listing_type} in ${property.city}`,
    openGraph: {
      images: property.main_image_url ? [property.main_image_url] : [],
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  const [property, supabase] = await Promise.all([
    getPropertyBySlug(slug),
    createClient(),
  ]);
  if (!property) notFound();

  // Record view (fire & forget)
  recordPropertyView(property.id).catch(() => {});

  const { data: { user } } = await supabase.auth.getUser();
  const favoriteIds = user ? await getUserFavoriteIds() : [];
  const isFavorited = favoriteIds.includes(property.id);

  const { properties: related } = await getProperties({ city: property.city }, 4, 0);
  const relatedFiltered = related.filter((p) => p.id !== property.id).slice(0, 3);

  const fallback = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";
  const allImages = [property.main_image_url, ...(property.images_urls ?? [])].filter(Boolean) as string[];
  if (allImages.length === 0) allImages.push(fallback);

  const agent = property.profiles as { full_name?: string; avatar_url?: string; phone_number?: string } | null;
  const amenities = buildAmenities(property);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-20">

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-sm">
        <Link href="/search" className="flex items-center gap-1.5 text-[#476083] hover:text-emerald-600 transition-colors font-label">
          <ChevronLeft size={15} /> Search
        </Link>
        <span className="text-[#c4c6cf]">/</span>
        <Link href={`/search?city=${property.city}`} className="text-[#476083] hover:text-emerald-600 transition-colors font-label">
          {property.city}
        </Link>
        <span className="text-[#c4c6cf]">/</span>
        <span className="text-[#191c1d] font-medium truncate max-w-[180px]">{property.title}</span>
      </div>

      {/* Gallery */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 mb-10">
        <ImageGallery images={allImages} title={property.title} />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">

            {/* Title + Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={property.listing_type === "sale" ? "emerald" : "navy"}>
                    {property.listing_type === "sale" ? "For Sale" : "For Rent"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">{property.property_type}</Badge>
                  {property.is_featured && <Badge variant="emerald-soft">⭐ Featured</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#000802] tracking-tight leading-tight">
                  {property.title}
                </h1>
                <p className="flex items-center gap-2 text-[#476083] mt-2 font-label text-sm">
                  <MapPin size={14} className="text-emerald-500 shrink-0" />
                  {property.address}, {property.city}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 mt-1">
                <CompareButton propertyId={property.id} />
                <ShareButton
                  title={property.title}
                  price={formatPrice(property.price)}
                  city={property.city}
                  slug={property.slug}
                />
                <FavoriteButton
                  propertyId={property.id}
                  initialState={isFavorited}
                  isLoggedIn={!!user}
                />
              </div>
            </div>

            {/* Price + Stats */}
            <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <p className="text-[10px] font-bold text-[#476083] uppercase tracking-widest font-label mb-0.5">
                    {property.listing_type === "rent" ? "Monthly Rent" : "Asking Price"}
                  </p>
                  <p className="text-3xl md:text-4xl font-black text-emerald-600 leading-none">
                    {formatPrice(property.price)}
                    {property.listing_type === "rent" && (
                      <span className="text-sm font-medium text-[#74777f] ml-1">/mo</span>
                    )}
                  </p>
                  {property.listing_type === "sale" && property.building_size && property.building_size > 0 && (
                    <p className="text-xs text-[#74777f] font-label mt-1">
                      ≈ {formatPrice(Math.round(property.price / property.building_size))}/m²
                    </p>
                  )}
                </div>
                <div className="hidden sm:block h-10 w-px bg-[#e1e3e4]" />
                <div className="flex flex-wrap gap-5">
                  {property.bedrooms > 0 && (
                    <StatItem icon={<BedDouble size={18} className="text-emerald-500" />} value={property.bedrooms} label="Bedrooms" />
                  )}
                  {property.bathrooms > 0 && (
                    <StatItem icon={<Bath size={18} className="text-emerald-500" />} value={property.bathrooms} label="Bathrooms" />
                  )}
                  {property.building_size && (
                    <StatItem icon={<Ruler size={18} className="text-emerald-500" />} value={formatArea(property.building_size)} label="Building" />
                  )}
                  {property.land_size && (
                    <StatItem icon={<TreePine size={18} className="text-emerald-500" />} value={formatArea(property.land_size)} label="Land" />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
                <h2 className="text-base font-bold text-[#000802] mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-500" /> About This Property
                </h2>
                <p className="text-[#476083] leading-relaxed font-label text-sm whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            )}

            {/* Specs */}
            <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
              <h2 className="text-base font-bold text-[#000802] mb-5 flex items-center gap-2">
                <Layers size={16} className="text-emerald-500" /> Spesifikasi Properti
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div className="divide-y divide-[#f3f4f5]">
                  <SpecRow label="Tipe Properti" value={property.property_type ?? "—"} capitalize />
                  <SpecRow label="Tipe Listing" value={`For ${property.listing_type}`} capitalize />
                  <SpecRow label="Kamar Tidur" value={property.bedrooms > 0 ? `${property.bedrooms} kamar` : "—"} />
                  <SpecRow label="Kamar Mandi" value={property.bathrooms > 0 ? `${property.bathrooms} kamar` : "—"} />
                </div>
                <div className="divide-y divide-[#f3f4f5]">
                  <SpecRow label="Luas Bangunan" value={property.building_size ? formatArea(property.building_size) : "—"} />
                  <SpecRow label="Luas Tanah" value={property.land_size ? formatArea(property.land_size) : "—"} />
                  <SpecRow label="Kota" value={property.city} />
                  <SpecRow label="Dipasang" value={new Date(property.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long" })} />
                </div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
                <h2 className="text-base font-bold text-[#000802] mb-5 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Fasilitas & Fitur
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-[#476083] font-label">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KPR Calculator */}
            {property.listing_type === "sale" && (
              <KPRCalculator propertyPrice={property.price} />
            )}

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
              <h2 className="text-base font-bold text-[#000802] mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" /> Lokasi
              </h2>
              <p className="text-sm text-[#476083] font-label mb-4">{property.address}, {property.city}</p>
              {property.latitude && property.longitude ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden border border-[#e1e3e4] hover:shadow-md transition-shadow"
                >
                  <div className="h-52 bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 flex flex-col items-center justify-center gap-2">
                    <MapPin size={32} className="text-emerald-500" />
                    <p className="text-sm font-semibold text-[#191c1d]">
                      {property.latitude.toFixed(5)}, {property.longitude.toFixed(5)}
                    </p>
                    <p className="text-xs text-emerald-600 font-bold font-label">Buka di Google Maps ↗</p>
                  </div>
                </a>
              ) : (
                <div className="h-44 rounded-xl bg-[#f3f4f5] flex items-center justify-center">
                  <p className="text-sm text-[#74777f] font-label">Koordinat tidak tersedia</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
                <p className="text-[10px] font-bold text-[#476083] uppercase tracking-widest mb-4 font-label">
                  Listing oleh
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 shrink-0 flex items-center justify-center">
                    {agent?.avatar_url ? (
                      <Image src={agent.avatar_url} alt={agent.full_name ?? "Agent"} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-lg font-black text-emerald-600">{agent?.full_name?.[0] ?? "A"}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#191c1d] text-sm">{agent?.full_name ?? "NexPro Agent"}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-[10px] font-bold text-emerald-600 font-label uppercase tracking-wide">Verified Agent</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {agent?.phone_number && (
                    <a
                      href={`https://wa.me/${agent.phone_number.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan "${property.title}". Bisa info lebih lanjut?`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors border border-green-100"
                    >
                      <MessageCircle size={16} className="text-green-600 shrink-0" />
                      <span className="text-sm font-bold text-green-800 font-label">Chat via WhatsApp</span>
                    </a>
                  )}
                  {agent?.phone_number && (
                    <a
                      href={`tel:${agent.phone_number}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] transition-colors"
                    >
                      <Phone size={14} className="text-[#476083] shrink-0" />
                      <span className="text-sm font-semibold text-[#191c1d] font-label">{agent.phone_number}</span>
                    </a>
                  )}
                </div>

                <InquirySection
                  propertyId={property.id}
                  propertyTitle={property.title}
                  agentPhone={agent?.phone_number ?? null}
                  isLoggedIn={!!user}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#e1e3e4] flex items-center gap-3">
                <Calendar size={13} className="text-emerald-500 shrink-0" />
                <p className="text-xs text-[#476083] font-label">
                  Dipasang {new Date(property.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  {" · "}Listing terverifikasi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedFiltered.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="section-label">Lebih di {property.city}</span>
                <h2 className="text-2xl font-bold text-[#000802]">Properti Serupa</h2>
              </div>
              <Link href={`/search?city=${property.city}`}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Lihat semua <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedFiltered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <p className="text-xl font-black text-[#000802] leading-none">{value}</p>
        <p className="text-xs text-[#476083] font-label mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <p className="text-xs font-semibold text-[#74777f] font-label shrink-0">{label}</p>
      <p className={`text-sm font-bold text-[#191c1d] text-right ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function buildAmenities(p: Property): string[] {
  const list: string[] = [];
  if (p.property_type !== "land") { list.push("Keamanan 24 Jam"); list.push("Parkir Pribadi"); }
  if (p.bedrooms >= 3) list.push("Kolam Renang Pribadi");
  if ((p.land_size ?? 0) >= 400) list.push("Taman Tropis");
  if ((p.building_size ?? 0) >= 200) { list.push("Dapur Modern"); list.push("Open-Plan Living"); }
  if (p.property_type === "apartment") { list.push("Gym Gedung"); list.push("Akses Rooftop"); list.push("Layanan Concierge"); }
  if (p.property_type === "house") { list.push("Smart Home System"); list.push("Internet Cepat"); }
  if (p.bedrooms >= 4) { list.push("Kamar Asisten"); list.push("Ruang Penyimpanan"); }
  if ((p.land_size ?? 0) >= 800) { list.push("Area Outdoor Lounge"); list.push("Gazebo / Bale"); }
  return list.slice(0, 12);
}
