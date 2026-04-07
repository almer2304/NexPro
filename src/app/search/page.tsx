import type { Metadata } from "next";
import { Suspense } from "react";
import { getProperties } from "@/lib/supabase/actions";
import { PropertyCard } from "@/components/modules/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import type { PropertyFilters, PropertyType, ListingType } from "@/types";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchControls } from "./search-controls";
import { MapViewWrapper } from "./map-view-wrapper";

export const metadata: Metadata = { title: "Cari Properti | NexPro" };

const PAGE_SIZE = 12;

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const offset = (page - 1) * PAGE_SIZE;
  const viewMode = params.view === "map" ? "map" : "grid";

  const filters: PropertyFilters = {
    city: params.city || undefined,
    property_type: (params.property_type as PropertyType) || undefined,
    listing_type: (params.listing_type as ListingType) || undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    min_bedrooms: params.min_bedrooms ? Number(params.min_bedrooms) : undefined,
    min_bathrooms: params.min_bathrooms ? Number(params.min_bathrooms) : undefined,
    search: params.search || undefined,
  };

  // For map view fetch more, for grid use pagination
  const fetchLimit = viewMode === "map" ? 100 : PAGE_SIZE;
  const { properties, count } = await getProperties(filters, fetchLimit, viewMode === "map" ? 0 : offset);
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  function pageUrl(p: number) {
    const q = new URLSearchParams(params);
    q.set("page", String(p));
    return `/search?${q.toString()}`;
  }

  const titleParts: string[] = [];
  if (filters.listing_type) titleParts.push(filters.listing_type === "sale" ? "Dijual" : "Disewa");
  if (filters.property_type) titleParts.unshift(capitalize(filters.property_type));
  if (filters.city) titleParts.push(`di ${filters.city}`);
  const pageTitle = titleParts.length > 0 ? titleParts.join(" ") : "Semua Properti";

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 pt-20">

      {/* Sticky Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-[#e1e3e4] dark:border-slate-800 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <Suspense fallback={<div className="h-[96px]" />}>
            <SearchControls currentParams={params} />
          </Suspense>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#191c1d] dark:text-white">{pageTitle}</h1>
            <p className="text-sm text-[#476083] dark:text-slate-400 font-label mt-0.5">
              <span className="font-bold text-emerald-600">{count ?? 0}</span> properti ditemukan
              {page > 1 && viewMode === "grid" && ` · Halaman ${page} dari ${totalPages}`}
            </p>
          </div>
          {activeFilterCount > 0 && (
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                Hapus filter ({activeFilterCount})
              </Button>
            </Link>
          )}
        </div>

        {/* Map view */}
        {viewMode === "map" ? (
          <MapViewWrapper properties={properties as any} />
        ) : (
          <>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
              }
            >
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, i) => (
                    <PropertyCard key={property.id} property={property as any} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState hasFilters={activeFilterCount > 0} />
              )}
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                {page > 1 && (
                  <Link href={pageUrl(page - 1)}>
                    <Button variant="outline" size="sm"><ChevronLeft size={15} /> Prev</Button>
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link key={pageNum} href={pageUrl(pageNum)}>
                      <Button variant={pageNum === page ? "default" : "outline"} size="sm" className="w-10">{pageNum}</Button>
                    </Link>
                  );
                })}
                {page < totalPages && (
                  <Link href={pageUrl(page + 1)}>
                    <Button variant="outline" size="sm">Next <ChevronRight size={15} /></Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-[#c4c6cf]">
      <div className="w-20 h-20 rounded-full bg-[#f3f4f5] flex items-center justify-center mx-auto mb-6">
        <Building2 size={32} className="text-[#c4c6cf]" />
      </div>
      <h3 className="text-xl font-bold text-[#191c1d] dark:text-white mb-2">Properti tidak ditemukan</h3>
      <p className="text-[#476083] text-sm font-label max-w-xs mx-auto mb-6">
        {hasFilters ? "Coba ubah filter pencarian Anda." : "Belum ada listing. Coba lagi nanti!"}
      </p>
      {hasFilters && <Link href="/search"><Button variant="outline">Hapus Semua Filter</Button></Link>}
    </div>
  );
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
