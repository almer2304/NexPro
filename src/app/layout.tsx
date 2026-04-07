import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { NavigationProgress } from "@/components/shared/navigation-progress";
import { Toaster } from "@/components/ui/toast";
import { CompareBar } from "@/components/modules/compare-bar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NexPro — Marketplace Properti Premium Indonesia",
    template: "%s | NexPro",
  },
  description: "Temukan properti impian Anda. Jual, beli, dan sewa properti terbaik di seluruh Indonesia.",
  keywords: ["properti", "rumah", "apartemen", "tanah", "Jakarta", "Bali", "Bandung"],
  openGraph: { type: "website", locale: "id_ID", url: "https://nexpro.id", siteName: "NexPro" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-body bg-[#f8f9fa] dark:bg-slate-950 text-[#191c1d] dark:text-slate-100 antialiased">
        {/* Progress bar hijau di top saat navigasi */}
        <NavigationProgress />
        <Navbar />
        {children}
        <Footer />
        <Toaster />
        <CompareBar />
      </body>
    </html>
  );
}
