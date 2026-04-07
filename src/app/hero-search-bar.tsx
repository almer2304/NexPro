"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (propertyType) params.set("property_type", propertyType);
    if (listingType) params.set("listing_type", listingType);
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl">
      {/* Glass outer ring */}
      <div className="bg-white/10 backdrop-blur-md p-2 rounded-[2rem] border border-white/20 shadow-2xl">
        {/* Inner white card */}
        <div className="bg-white rounded-[1.75rem] grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e1e3e4]">
          {/* Location */}
          <div className="px-6 py-4">
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1 font-label">
              Location
            </label>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-emerald-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jakarta, Bali..."
                className="bg-transparent border-none p-0 text-sm font-semibold text-[#191c1d] placeholder:text-[#74777f] focus:ring-0 w-full outline-none"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="px-6 py-4">
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1 font-label">
              Property Type
            </label>
            <div className="flex items-center gap-2">
              <Home size={15} className="text-emerald-500 shrink-0" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-semibold text-[#191c1d] focus:ring-0 w-full outline-none appearance-none cursor-pointer"
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>

          {/* Listing Type */}
          <div className="px-6 py-4">
            <label className="block text-[0.6rem] font-bold text-[#476083] uppercase tracking-widest mb-1 font-label">
              Buy or Rent
            </label>
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-emerald-500 shrink-0" />
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-semibold text-[#191c1d] focus:ring-0 w-full outline-none appearance-none cursor-pointer"
              >
                <option value="">For Sale or Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="p-3">
            <Button
              type="submit"
              size="lg"
              loading={isPending}
              className="w-full h-full rounded-2xl flex items-center justify-center gap-2"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
