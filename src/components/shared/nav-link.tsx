"use client";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Link yang menampilkan loading indicator saat diklik
export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const [clicking, setClicking] = useState(false);

  return (
    <Link
      href={href}
      onClick={() => {
        setClicking(true);
        onClick?.();
        // Reset after navigation
        setTimeout(() => setClicking(false), 1500);
      }}
      className={cn("relative", clicking && "opacity-70 pointer-events-none", className)}
    >
      {clicking && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 size={12} className="animate-spin text-emerald-500" />
        </span>
      )}
      {children}
    </Link>
  );
}
