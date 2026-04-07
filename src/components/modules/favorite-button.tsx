"use client";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/stores";
import { toggleFavorite } from "@/lib/supabase/actions";
import { toast } from "@/components/ui/toast";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  /** Server-rendered initial favorite state for hydration accuracy */
  initialState?: boolean;
  /** Whether the current user is logged in */
  isLoggedIn?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteButton({
  propertyId,
  initialState = false,
  isLoggedIn = false,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite, setFavorites, favoriteIds } = useFavoritesStore();

  // Hydrate Zustand with server-rendered initial state on first mount
  useEffect(() => {
    if (initialState && !favoriteIds.includes(propertyId)) {
      addFavorite(propertyId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favorited = isFavorite(propertyId);

  const sizeMap = { sm: 15, md: 18, lg: 22 };
  const containerSize = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-13 h-13",
  };
  const iconSize = sizeMap[size];

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast("error", "Please log in to save properties");
      return;
    }

    // Optimistic update
    if (favorited) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }

    try {
      const result = await toggleFavorite(propertyId);
      if (result.action === "added") {
        toast("success", "Saved to your wishlist ❤️");
      } else {
        toast("success", "Removed from wishlist");
      }
    } catch (err) {
      // Revert optimistic update on error
      if (favorited) {
        addFavorite(propertyId);
      } else {
        removeFavorite(propertyId);
      }
      toast("error", err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <button
      onClick={handleClick}
      title={favorited ? "Remove from saved" : "Save property"}
      className={cn(
        containerSize[size],
        "rounded-full flex items-center justify-center border transition-all duration-200",
        "active:scale-90 hover:scale-110",
        favorited
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-white border-[#c4c6cf] text-[#74777f] hover:text-red-400 hover:border-red-200",
        className
      )}
    >
      <Heart
        size={iconSize}
        fill={favorited ? "currentColor" : "none"}
        className="transition-all duration-200"
      />
    </button>
  );
}
