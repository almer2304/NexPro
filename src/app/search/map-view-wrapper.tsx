"use client";
import dynamic from "next/dynamic";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";

const PropertyMap = dynamic(
  () => import("@/components/modules/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-2xl bg-white border border-[#e1e3e4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#476083] font-label">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

export function MapViewWrapper({ properties }: { properties: Property[] }) {
  return (
    <div className="space-y-4">
      <div className="h-[600px] rounded-2xl overflow-hidden border border-[#e1e3e4] shadow-sm">
        <PropertyMap properties={properties} />
      </div>
      <p className="text-xs text-[#74777f] font-label text-center">
        Menampilkan {properties.length} properti di peta · Klik marker untuk detail
      </p>
    </div>
  );
}
