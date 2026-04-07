import { getUserFavorites } from "@/lib/supabase/actions";
import { PropertyCard } from "@/components/modules/property-card";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types";

export const metadata = { title: "Saved Properties | Dashboard" };

export default async function DashboardSavedPage() {
  const favorites = await getUserFavorites();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#000802]">Saved Properties</h1>
          <p className="text-sm text-[#476083] font-label mt-0.5">
            {favorites.length} saved {favorites.length === 1 ? "property" : "properties"}
          </p>
        </div>
        <Link href="/search">
          <Button variant="outline" size="sm">
            <Search size={14} /> Browse More
          </Button>
        </Link>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((fav, i) =>
            fav.properties ? (
              <PropertyCard
                key={fav.id}
                property={fav.properties as unknown as Property}
                index={i}
              />
            ) : null
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-[#c4c6cf] py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Heart size={28} className="text-red-300" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1d] mb-2">No saved properties yet</h3>
          <p className="text-sm text-[#476083] font-label max-w-xs mx-auto mb-6">
            Browse listings and click the heart icon to save properties you love.
          </p>
          <Link href="/search">
            <Button>Explore Properties</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
