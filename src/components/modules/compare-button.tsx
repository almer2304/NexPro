"use client";
import { BarChart3, X } from "lucide-react";
import { useCompareStore } from "@/lib/stores";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  propertyId: string;
  className?: string;
}

export function CompareButton({ propertyId, className }: CompareButtonProps) {
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } = useCompareStore();
  const inCompare = isInCompare(propertyId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(propertyId);
    } else if (!canAddMore()) {
      toast("error", "You can compare up to 3 properties at a time");
    } else {
      addToCompare(propertyId);
      toast("success", "Added to comparison");
    }
  }

  return (
    <button
      onClick={handleClick}
      title={inCompare ? "Remove from compare" : "Add to compare"}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold font-label transition-all border",
        inCompare
          ? "bg-[#000802] text-white border-[#000802]"
          : "bg-white/80 backdrop-blur text-[#476083] border-[#c4c6cf] hover:border-[#000802] hover:text-[#000802]",
        className
      )}
    >
      {inCompare ? <X size={11} /> : <BarChart3 size={11} />}
      {inCompare ? "Remove" : "Compare"}
    </button>
  );
}
