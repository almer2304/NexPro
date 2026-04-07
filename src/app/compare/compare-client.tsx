"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, BedDouble, Bath, Ruler, TreePine,
  MapPin, CheckCircle2, XCircle, BarChart3, ArrowLeft,
} from "lucide-react";
import { useCompareStore } from "@/lib/stores";
import { getPropertiesByIds } from "@/lib/supabase/actions";
import { formatPrice, formatArea } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";

const AMENITIES = [
  "Private Swimming Pool",
  "Tropical Garden",
  "Smart Home System",
  "24-Hour Security",
  "Private Parking",
  "Open-Plan Living",
  "Modern Kitchen",
  "Building Gym",
  "Rooftop Access",
  "Staff Quarters",
  "Outdoor Lounge",
  "High-Speed Internet",
];

function hasAmenity(p: Property, amenity: string): boolean {
  const checks: Record<string, boolean> = {
    "Private Swimming Pool": p.bedrooms >= 3,
    "Tropical Garden": (p.land_size ?? 0) >= 400,
    "Smart Home System": p.property_type === "house",
    "24-Hour Security": p.property_type !== "land",
    "Private Parking": p.property_type !== "land",
    "Open-Plan Living": (p.building_size ?? 0) >= 200,
    "Modern Kitchen": (p.building_size ?? 0) >= 200,
    "Building Gym": p.property_type === "apartment",
    "Rooftop Access": p.property_type === "apartment",
    "Staff Quarters": p.bedrooms >= 4,
    "Outdoor Lounge": (p.land_size ?? 0) >= 800,
    "High-Speed Internet": p.property_type === "house",
  };
  return checks[amenity] ?? false;
}

export function CompareClient() {
  const { compareIds, removeFromCompare, clearCompare, addToCompare } = useCompareStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (compareIds.length === 0) { setProperties([]); return; }
    setLoading(true);
    getPropertiesByIds(compareIds)
      .then((data) => setProperties(data as Property[]))
      .finally(() => setLoading(false));
  }, [compareIds]);

  if (compareIds.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#c4c6cf]">
        <BarChart3 size={48} className="text-[#c4c6cf] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#000802] mb-2">No properties to compare</h2>
        <p className="text-[#476083] font-label text-sm mb-6 max-w-xs mx-auto">
          Browse listings and click the compare button on any property card to add it here.
        </p>
        <Link href="/search">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }

  // Placeholder slots
  const slots = [...properties];
  while (slots.length < 3) slots.push(null as unknown as Property);

  const best = {
    price: Math.min(...properties.map((p) => p.price)),
    bedrooms: Math.max(...properties.map((p) => p.bedrooms)),
    bathrooms: Math.max(...properties.map((p) => p.bathrooms)),
    building_size: Math.max(...properties.map((p) => p.building_size ?? 0)),
    land_size: Math.max(...properties.map((p) => p.land_size ?? 0)),
  };

  return (
    <div className="space-y-6">
      {/* Actions row */}
      <div className="flex items-center justify-between">
        <Link href="/search" className="flex items-center gap-1.5 text-sm text-[#476083] hover:text-emerald-600 transition-colors font-label">
          <ArrowLeft size={15} /> Back to Search
        </Link>
        <Button variant="ghost" size="sm" onClick={clearCompare} className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <X size={14} /> Clear All
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">

            {/* Property Header Row */}
            <thead>
              <tr className="border-b border-[#e1e3e4]">
                <th className="w-40 px-6 py-4 text-left text-xs font-bold text-[#476083] uppercase tracking-wider font-label">
                  Feature
                </th>
                {slots.map((p, i) => (
                  <th key={i} className="px-4 py-4 text-left border-l border-[#f3f4f5]">
                    {p ? (
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors z-10"
                        >
                          <X size={12} />
                        </button>
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                          <Image
                            src={p.main_image_url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-2 left-2">
                            <Badge variant={p.listing_type === "sale" ? "emerald" : "navy"}>
                              {p.listing_type === "sale" ? "For Sale" : "For Rent"}
                            </Badge>
                          </div>
                        </div>
                        <Link href={`/properties/${p.slug}`} className="block hover:text-emerald-600 transition-colors">
                          <p className="text-sm font-bold text-[#191c1d] line-clamp-2 leading-tight">{p.title}</p>
                        </Link>
                        <p className="text-xs text-[#476083] font-label mt-1 flex items-center gap-1">
                          <MapPin size={11} className="text-emerald-500" /> {p.city}
                        </p>
                      </div>
                    ) : (
                      <Link href="/search">
                        <div className="h-32 rounded-xl border-2 border-dashed border-[#e1e3e4] flex flex-col items-center justify-center hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer">
                          <Plus size={20} className="text-[#c4c6cf] mb-1" />
                          <p className="text-xs text-[#74777f] font-label">Add property</p>
                        </div>
                      </Link>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f3f4f5]">
              {/* Price */}
              <CompareRow label="Price" icon={null}>
                {slots.map((p, i) => (
                  <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                    {p ? (
                      <div>
                        <p className={`text-lg font-black ${p.price === best.price ? "text-emerald-600" : "text-[#191c1d]"}`}>
                          {formatPrice(p.price)}
                        </p>
                        {p.price === best.price && <p className="text-[10px] text-emerald-600 font-bold font-label">Best Price</p>}
                      </div>
                    ) : <EmptyCell />}
                  </td>
                ))}
              </CompareRow>

              {/* Bedrooms */}
              <CompareRow label="Bedrooms" icon={<BedDouble size={14} className="text-emerald-500" />}>
                {slots.map((p, i) => (
                  <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                    {p ? (
                      <p className={`text-sm font-bold ${p.bedrooms === best.bedrooms && best.bedrooms > 0 ? "text-emerald-600" : "text-[#191c1d]"}`}>
                        {p.bedrooms > 0 ? `${p.bedrooms} rooms` : "—"}
                      </p>
                    ) : <EmptyCell />}
                  </td>
                ))}
              </CompareRow>

              {/* Bathrooms */}
              <CompareRow label="Bathrooms" icon={<Bath size={14} className="text-emerald-500" />}>
                {slots.map((p, i) => (
                  <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                    {p ? (
                      <p className={`text-sm font-bold ${p.bathrooms === best.bathrooms && best.bathrooms > 0 ? "text-emerald-600" : "text-[#191c1d]"}`}>
                        {p.bathrooms > 0 ? `${p.bathrooms} rooms` : "—"}
                      </p>
                    ) : <EmptyCell />}
                  </td>
                ))}
              </CompareRow>

              {/* Building Size */}
              <CompareRow label="Building Size" icon={<Ruler size={14} className="text-emerald-500" />}>
                {slots.map((p, i) => (
                  <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                    {p ? (
                      <p className={`text-sm font-bold ${(p.building_size ?? 0) === best.building_size && best.building_size > 0 ? "text-emerald-600" : "text-[#191c1d]"}`}>
                        {p.building_size ? formatArea(p.building_size) : "—"}
                      </p>
                    ) : <EmptyCell />}
                  </td>
                ))}
              </CompareRow>

              {/* Land Size */}
              <CompareRow label="Land Size" icon={<TreePine size={14} className="text-emerald-500" />}>
                {slots.map((p, i) => (
                  <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                    {p ? (
                      <p className={`text-sm font-bold ${(p.land_size ?? 0) === best.land_size && best.land_size > 0 ? "text-emerald-600" : "text-[#191c1d]"}`}>
                        {p.land_size ? formatArea(p.land_size) : "—"}
                      </p>
                    ) : <EmptyCell />}
                  </td>
                ))}
              </CompareRow>

              {/* Amenities */}
              {AMENITIES.map((amenity) => (
                <CompareRow key={amenity} label={amenity} icon={<CheckCircle2 size={13} className="text-[#c4c6cf]" />}>
                  {slots.map((p, i) => (
                    <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                      {p ? (
                        hasAmenity(p, amenity)
                          ? <CheckCircle2 size={18} className="text-emerald-500" />
                          : <XCircle size={18} className="text-[#e1e3e4]" />
                      ) : <EmptyCell />}
                    </td>
                  ))}
                </CompareRow>
              ))}

              {/* CTA Row */}
              <tr>
                <td className="px-6 py-4 text-xs font-bold text-[#476083] uppercase tracking-wider font-label" />
                {slots.map((p, i) => (
                  <td key={i} className="px-4 py-4 border-l border-[#f3f4f5]">
                    {p ? (
                      <Link href={`/properties/${p.slug}`}>
                        <Button size="sm" variant="emerald" className="w-full">View Listing</Button>
                      </Link>
                    ) : null}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <tr className="hover:bg-[#f8f9fa] transition-colors">
      <td className="px-6 py-4 text-xs font-semibold text-[#476083] font-label">
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
      </td>
      {children}
    </tr>
  );
}

function EmptyCell() {
  return <span className="text-[#c4c6cf] text-sm font-label">—</span>;
}
