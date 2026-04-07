import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider font-label transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#000802] text-white",
        emerald: "bg-emerald-500 text-white",
        "emerald-soft": "bg-emerald-100 text-emerald-700",
        glass: "bg-white/90 backdrop-blur text-[#000802]",
        navy: "bg-[#000802]/90 backdrop-blur text-white",
        outline: "border border-[#c4c6cf] text-[#476083] bg-transparent",
        sale: "bg-emerald-500 text-white",
        rent: "bg-blue-500 text-white",
        pending: "bg-amber-100 text-amber-700",
        contacted: "bg-blue-100 text-blue-700",
        closed: "bg-gray-100 text-gray-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
