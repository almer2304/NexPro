"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Map, Grid3x3 } from "lucide-react";

const CITIES = ["Jakarta", "Bali", "Bandung", "Surabaya", "Yogyakarta", "Medan", "Semarang", "Makassar"];

const PRICE_RANGES_SALE = [
  { label: "Semua Harga", min: "", max: "" },
  { label: "< Rp 1M", min: "", max: "1000000000" },
  { label: "Rp 1M – 5M", min: "1000000000", max: "5000000000" },
  { label: "Rp 5M – 15M", min: "5000000000", max: "15000000000" },
  { label: "Rp 15M – 50M", min: "15000000000", max: "50000000000" },
  { label: "> Rp 50M", min: "50000000000", max: "" },
];

const PRICE_RANGES_RENT = [
  { label: "Semua Harga", min: "", max: "" },
  { label: "< Rp 10Jt/bl", min: "", max: "10000000" },
  { label: "Rp 10–30Jt/bl", min: "10000000", max: "30000000" },
  { label: "Rp 30–70Jt/bl", min: "30000000", max: "70000000" },
  { label: "> Rp 70Jt/bl", min: "70000000", max: "" },
];

interface SearchControlsProps {
  currentParams: Record<string, string>;
}

export function SearchControls({ currentParams }: SearchControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState(currentParams.search || "");

  function update(key: string, value: string) {
    const params = new URLSearchParams(currentParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  function applyPriceRange(min: string, max: string) {
    const params = new URLSearchParams(currentParams);
    if (min) params.set("min_price", min); else params.delete("min_price");
    if (max) params.set("max_price", max); else params.delete("max_price");
    params.delete("page");
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    update("search", search);
  }

  function clearAll() {
    setSearch("");
    startTransition(() => router.push("/search"));
  }

  function toggleView(mode: "grid" | "map") {
    const params = new URLSearchParams(currentParams);
    if (mode === "map") params.set("view", "map"); else params.delete("view");
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  const listingType = currentParams.listing_type || "";
  const city = currentParams.city || "";
  const propertyType = currentParams.property_type || "";
  const minBedrooms = currentParams.min_bedrooms || "";
  const viewMode = currentParams.view === "map" ? "map" : "grid";
  const isRent = listingType === "rent";
  const priceRanges = isRent ? PRICE_RANGES_RENT : PRICE_RANGES_SALE;

  const activeCount = ["city", "property_type", "listing_type", "min_price", "max_price", "min_bedrooms", "search"]
    .filter((k) => currentParams[k]).length;

  return (
    <div className="py-3 space-y-3">
      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kota, area, atau nama properti..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#c4c6cf] dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-[#191c1d] dark:text-white placeholder:text-[#74777f] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {search && (
            <button type="button" onClick={() => { setSearch(""); update("search", ""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#191c1d]">
              <X size={14} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Listing type pills */}
          {[{ value: "", label: "Semua" }, { value: "sale", label: "Dijual" }, { value: "rent", label: "Disewa" }].map((opt) => (
            <button key={opt.value} onClick={() => update("listing_type", opt.value)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold font-label transition-all whitespace-nowrap ${
                listingType === opt.value
                  ? "bg-[#000802] text-white shadow-sm"
                  : "bg-[#f3f4f5] dark:bg-slate-800 text-[#476083] dark:text-slate-300 hover:bg-[#e7e8e9]"
              }`}>{opt.label}</button>
          ))}

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced((v) => !v)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold font-label transition-all border relative ${
              showAdvanced ? "bg-[#000802] text-white border-[#000802]" : "bg-white dark:bg-slate-800 text-[#476083] dark:text-slate-300 border-[#c4c6cf] hover:border-[#000802]"
            }`}>
            <SlidersHorizontal size={12} />
            Filter
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown size={11} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {/* View toggle */}
          <div className="flex rounded-xl border border-[#c4c6cf] dark:border-slate-700 overflow-hidden">
            <button onClick={() => toggleView("grid")}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-bold transition-colors ${
                viewMode === "grid" ? "bg-[#000802] text-white" : "bg-white dark:bg-slate-800 text-[#476083] dark:text-slate-300"
              }`}>
              <Grid3x3 size={13} /> Grid
            </button>
            <button onClick={() => toggleView("map")}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-bold transition-colors border-l border-[#c4c6cf] dark:border-slate-700 ${
                viewMode === "map" ? "bg-[#000802] text-white" : "bg-white dark:bg-slate-800 text-[#476083] dark:text-slate-300"
              }`}>
              <Map size={13} /> Peta
            </button>
          </div>

          {activeCount > 0 && (
            <button onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 font-bold font-label flex items-center gap-1">
              <X size={12} /> Hapus
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Advanced panel */}
      {showAdvanced && (
        <div className="bg-[#f8f9fa] dark:bg-slate-800/50 rounded-2xl p-4 border border-[#e1e3e4] dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* City */}
          <div>
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1.5 font-label">Kota</label>
            <select value={city} onChange={(e) => update("city", e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-[#c4c6cf] dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-[#191c1d] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
              <option value="">Semua Kota</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1.5 font-label">Tipe</label>
            <select value={propertyType} onChange={(e) => update("property_type", e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-[#c4c6cf] dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-[#191c1d] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
              <option value="">Semua Tipe</option>
              <option value="house">Rumah</option>
              <option value="apartment">Apartemen</option>
              <option value="land">Tanah</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1.5 font-label">Rentang Harga</label>
            <select
              value={`${currentParams.min_price || ""}|${currentParams.max_price || ""}`}
              onChange={(e) => { const [min, max] = e.target.value.split("|"); applyPriceRange(min, max); }}
              className="w-full h-9 px-3 rounded-xl border border-[#c4c6cf] dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-[#191c1d] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
              {priceRanges.map((r) => <option key={r.label} value={`${r.min}|${r.max}`}>{r.label}</option>)}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1.5 font-label">Min. Kamar Tidur</label>
            <div className="flex gap-1">
              {["", "1", "2", "3", "4+"].map((n) => {
                const val = n === "4+" ? "4" : n;
                return (
                  <button key={n} onClick={() => update("min_bedrooms", val)}
                    className={`flex-1 h-9 rounded-xl text-xs font-bold border transition-all ${
                      minBedrooms === val ? "bg-[#000802] text-white border-[#000802]" : "bg-white dark:bg-slate-800 text-[#476083] dark:text-slate-300 border-[#c4c6cf] hover:border-[#000802]"
                    }`}>{n || "Any"}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="h-0.5 bg-[#f3f4f5] overflow-hidden rounded-full">
          <div className="h-full bg-emerald-500 animate-pulse rounded-full w-3/5" />
        </div>
      )}
    </div>
  );
}
