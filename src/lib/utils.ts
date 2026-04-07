import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "IDR"): string {
  if (currency === "IDR") {
    if (price >= 1_000_000_000) return `Rp ${(price / 1_000_000_000).toFixed(1)}M`;
    if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)}Jt`;
    // FIX: Gunakan locale tetap "id-ID" agar server dan client konsisten
    return `Rp ${Math.round(price).toLocaleString("id-ID")}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

// FIX: Hindari toLocaleString() tanpa locale — beda hasil di server vs browser
// Sebelumnya: `${size.toLocaleString()} m²` → "1,800 m²" di server, "1.800 m²" di browser id-ID
// Sekarang: format manual yang konsisten
export function formatArea(size: number): string {
  // Format dengan titik sebagai pemisah ribuan (Indonesia) — konsisten di mana saja
  const formatted = Math.round(size).toLocaleString("id-ID");
  return `${formatted} m²`;
}

// Untuk SSR-safe area format (pakai di server components dan client sekaligus)
export function formatAreaSafe(size: number): string {
  // Manual format: tidak bergantung pada locale environment
  const rounded = Math.round(size);
  if (rounded >= 1000) {
    const thousands = Math.floor(rounded / 1000);
    const remainder = rounded % 1000;
    return remainder > 0
      ? `${thousands}.${remainder.toString().padStart(3, "0")} m²`
      : `${thousands}.000 m²`;
  }
  return `${rounded} m²`;
}

export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return `${Math.floor(diff / 2592000)} bulan lalu`;
}
