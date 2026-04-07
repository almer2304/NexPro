"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSearchStore, useUIStore } from "@/lib/stores";

const CITIES = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Bali", "Yogyakarta", "Semarang", "Makassar",
];

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("search", query);
    else params.delete("search");
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, neighborhood, or property name..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c4c6cf] bg-white text-sm text-[#191c1d] placeholder:text-[#74777f] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      <Button type="submit" loading={isPending}>Search</Button>
    </form>
  );
}

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleFilterSidebar } = useUIStore();
  const [isPending, startTransition] = useTransition();

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  const activeFilters = ["city", "property_type", "listing_type", "min_price", "max_price"]
    .filter((key) => searchParams.get(key));

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Listing type quick filters */}
      {(["all", "sale", "rent"] as const).map((type) => {
        const val = searchParams.get("listing_type") ?? "all";
        const isActive = val === type || (type === "all" && !searchParams.get("listing_type"));
        return (
          <button
            key={type}
            onClick={() => applyFilter("listing_type", type === "all" ? "" : type)}
            className={`px-4 py-2 rounded-full text-xs font-bold font-label transition-all capitalize ${
              isActive
                ? "bg-[#000802] text-white shadow-md"
                : "bg-white border border-[#c4c6cf] text-[#476083] hover:border-[#000802]"
            }`}
          >
            {type === "all" ? "All" : `For ${type === "sale" ? "Sale" : "Rent"}`}
          </button>
        );
      })}

      <div className="h-5 w-px bg-[#c4c6cf]" />

      {/* City dropdown */}
      <select
        value={searchParams.get("city") || ""}
        onChange={(e) => applyFilter("city", e.target.value)}
        className="h-9 px-3 rounded-full border border-[#c4c6cf] bg-white text-xs font-semibold font-label text-[#476083] focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
      >
        <option value="">All Cities</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Property type */}
      <select
        value={searchParams.get("property_type") || ""}
        onChange={(e) => applyFilter("property_type", e.target.value)}
        className="h-9 px-3 rounded-full border border-[#c4c6cf] bg-white text-xs font-semibold font-label text-[#476083] focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
      >
        <option value="">All Types</option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="land">Land</option>
      </select>

      {/* Advanced filters sidebar toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleFilterSidebar}
        className="ml-auto relative"
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeFilters.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
            {activeFilters.length}
          </span>
        )}
      </Button>

      {/* Clear filters */}
      {activeFilters.length > 0 && (
        <button
          onClick={() => startTransition(() => router.push("/search"))}
          className="text-xs text-[#476083] flex items-center gap-1 hover:text-red-500 transition-colors font-label"
        >
          <X size={12} /> Clear all
        </button>
      )}
    </div>
  );
}

export function FilterSidebar() {
  const { isFilterSidebarOpen, toggleFilterSidebar } = useUIStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localFilters, setLocalFilters] = useState({
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    min_bedrooms: searchParams.get("min_bedrooms") || "",
    min_bathrooms: searchParams.get("min_bathrooms") || "",
  });

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(localFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
      toggleFilterSidebar();
    });
  }

  return (
    <>
      {/* Backdrop */}
      {isFilterSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleFilterSidebar}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        />
      )}
      {/* Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isFilterSidebarOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-80 z-50 bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#e1e3e4]">
          <h2 className="text-lg font-bold text-[#191c1d]">Advanced Filters</h2>
          <button
            onClick={toggleFilterSidebar}
            className="w-8 h-8 rounded-full bg-[#f3f4f5] flex items-center justify-center hover:bg-[#e7e8e9] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Price Range */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#476083] mb-4 font-label">Price Range (IDR)</p>
            <div className="flex gap-3">
              <Input
                label="Minimum"
                type="number"
                placeholder="0"
                value={localFilters.min_price}
                onChange={(e) => setLocalFilters((f) => ({ ...f, min_price: e.target.value }))}
              />
              <Input
                label="Maximum"
                type="number"
                placeholder="No limit"
                value={localFilters.max_price}
                onChange={(e) => setLocalFilters((f) => ({ ...f, max_price: e.target.value }))}
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#476083] mb-4 font-label">Minimum Bedrooms</p>
            <div className="flex gap-2">
              {["", "1", "2", "3", "4", "5+"].map((n) => (
                <button
                  key={n}
                  onClick={() => setLocalFilters((f) => ({ ...f, min_bedrooms: n === "5+" ? "5" : n }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    localFilters.min_bedrooms === (n === "5+" ? "5" : n)
                      ? "bg-[#000802] text-white border-[#000802]"
                      : "bg-white text-[#476083] border-[#c4c6cf] hover:border-[#000802]"
                  }`}
                >
                  {n || "Any"}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#476083] mb-4 font-label">Minimum Bathrooms</p>
            <div className="flex gap-2">
              {["", "1", "2", "3", "4+"].map((n) => (
                <button
                  key={n}
                  onClick={() => setLocalFilters((f) => ({ ...f, min_bathrooms: n === "4+" ? "4" : n }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    localFilters.min_bathrooms === (n === "4+" ? "4" : n)
                      ? "bg-[#000802] text-white border-[#000802]"
                      : "bg-white text-[#476083] border-[#c4c6cf] hover:border-[#000802]"
                  }`}
                >
                  {n || "Any"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#e1e3e4]">
          <Button className="w-full" size="lg" onClick={applyFilters} loading={isPending}>
            Apply Filters
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
