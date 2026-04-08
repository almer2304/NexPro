"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, BedDouble, Bath, Ruler, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompareButton } from "@/components/modules/compare-button";
import { useFavoritesStore } from "@/lib/stores";
import { toggleFavorite } from "@/lib/supabase/actions";
import { formatPrice, formatAreaSafe, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  index?: number;
  variant?: "default" | "compact" | "featured";
}

const rentPeriodLabel: Record<string, string> = { day: "/hari", week: "/mgg", month: "/bln" };

export function PropertyCard({ property, index = 0, variant = "default" }: PropertyCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorited = isFavorite(property.id);

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleFavorite(property.id);
      if (result.action === "added") {
        addFavorite(property.id);
        toast("success", "Tersimpan di wishlist ❤️");
      } else {
        removeFavorite(property.id);
        toast("success", "Dihapus dari wishlist");
      }
    } catch {
      toast("error", "Login dulu untuk menyimpan properti");
    }
  }

  const imageUrl =
    property.main_image_url ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

  const agent = property.profiles as { phone_number?: string | null } | null;
  const propStatus = (property as any).property_status as string | undefined;
  const rentPeriod = (property as any).rent_period as string | undefined;
  const periodSuffix =
    property.listing_type === "rent"
      ? (rentPeriodLabel[rentPeriod ?? "month"] ?? "/bln")
      : "";

  if (variant === "compact") {
    return (
      <Link href={`/properties/${property.slug}`}>
        <div className="group flex gap-4 p-3 rounded-2xl hover:bg-[#f3f4f5] transition-colors cursor-pointer">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
            {/* Use plain img to avoid sizes warning in small fixed containers */}
            <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#191c1d] truncate">{property.title}</p>
            <p className="text-xs text-[#476083] mt-0.5 flex items-center gap-1 font-label">
              <MapPin size={11} /> {property.city}
            </p>
            <p className="text-sm font-black text-emerald-600 mt-1">{formatPrice(property.price)}</p>
          </div>
        </div>
      </Link>
    );
  }

  const imgHeight = variant === "featured" ? 300 : 220;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4), ease: "easeOut" }}
    >
      <Link href={`/properties/${property.slug}`} className="block group">
        <div
          className={cn(
            "bg-white rounded-2xl overflow-hidden border border-[#e1e3e4] transition-all duration-300",
            "hover:-translate-y-1.5 hover:shadow-card-hover hover:border-transparent"
          )}
        >
          {/* Image — plain img with explicit size to suppress Next.js warning */}
          <div className="relative overflow-hidden" style={{ height: imgHeight }}>
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Top-left badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {property.is_featured && (
                <Badge variant="emerald">⭐ Featured</Badge>
              )}
              <Badge variant={property.listing_type === "sale" ? "glass" : "navy"}>
                {property.listing_type === "sale" ? "Dijual" : "Disewa"}
              </Badge>
              {propStatus === "sold" && (
                <span className="px-2 py-1 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wide">
                  Terjual
                </span>
              )}
              {propStatus === "rented" && (
                <span className="px-2 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wide">
                  Disewa
                </span>
              )}
            </div>

            {/* Top-right: favorite */}
            <div className="absolute top-3 right-3 flex gap-1.5">
              <button
                onClick={handleFavorite}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  "bg-white/80 backdrop-blur hover:scale-110 active:scale-90",
                  favorited ? "text-red-500" : "text-[#74777f] hover:text-red-400"
                )}
              >
                <Heart size={15} fill={favorited ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Bottom-left: compare */}
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <CompareButton propertyId={property.id} />
            </div>

            {/* Bottom-right: WhatsApp */}
            {agent?.phone_number && (
              <a
                href={`https://wa.me/${agent.phone_number.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${property.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md hover:bg-green-600 transition-colors">
                  <MessageCircle size={14} className="text-white" />
                </div>
              </a>
            )}

            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-bold text-[#191c1d] leading-tight line-clamp-1 group-hover:text-emerald-700 transition-colors">
                {property.title}
              </h3>
              <p className="text-emerald-600 font-black text-base shrink-0">
                {formatPrice(property.price)}
                {property.listing_type === "rent" && (
                  <span className="text-xs font-medium text-[#74777f]">{periodSuffix}</span>
                )}
              </p>
            </div>

            <p className="text-xs text-[#476083] flex items-center gap-1.5 mb-4 font-label">
              <MapPin size={12} className="text-emerald-500 shrink-0" />
              <span className="truncate">{property.address}, {property.city}</span>
            </p>

            <div className="flex items-center gap-4 pt-3.5 border-t border-[#f3f4f5]">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 text-[#43474e]">
                  <BedDouble size={14} className="text-[#74777f]" />
                  <span className="text-xs font-bold font-label">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 text-[#43474e]">
                  <Bath size={14} className="text-[#74777f]" />
                  <span className="text-xs font-bold font-label">{property.bathrooms}</span>
                </div>
              )}
              {property.building_size && (
                <div className="flex items-center gap-1.5 text-[#43474e]">
                  <Ruler size={14} className="text-[#74777f]" />
                  <span className="text-xs font-bold font-label">{formatAreaSafe(property.building_size)}</span>
                </div>
              )}
              <div className="ml-auto">
                <Badge variant="outline" className="capitalize text-[10px]">
                  {property.property_type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
