import type { Metadata } from "next";
import Link from "next/link";
import { getUserFavorites } from "@/lib/supabase/actions";
import { PropertyCard } from "@/components/modules/property-card";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Saved Properties" };

export default async function SavedPage() {
  const favorites = await getUserFavorites();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-[#000802]">Saved Properties</h1>
            <p className="text-[#476083] font-label mt-1">
              {favorites.length > 0
                ? `${favorites.length} saved ${favorites.length === 1 ? "property" : "properties"}`
                : "Your wishlist is empty"}
            </p>
          </div>
          <Link href="/search">
            <Button variant="outline" size="sm">
              <Search size={15} /> Browse More
            </Button>
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav, i) =>
              fav.properties ? (
                <PropertyCard
                  key={fav.id}
                  property={fav.properties as any}
                  index={i}
                />
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#c4c6cf]">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-red-300" />
            </div>
            <h3 className="text-xl font-bold text-[#191c1d] mb-2">No saved properties yet</h3>
            <p className="text-[#476083] font-label max-w-xs mx-auto mb-6">
              Browse listings and tap the heart icon to save properties you love.
            </p>
            <Link href="/search">
              <Button>Explore Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
