"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, User, LogOut, LayoutDashboard, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/actions";
import { useCompareStore } from "@/lib/stores";
import type { Profile } from "@/types";

// Halaman yang TIDAK perlu Navbar global (punya layout sendiri)
const HIDE_NAVBAR = ["/dashboard", "/login", "/signup", "/forgot-password", "/auth/reset-password"];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { compareIds } = useCompareStore();

  const isHidden = HIDE_NAVBAR.some((p) => pathname.startsWith(p));
  const isHome = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (u) {
        const { data } = await supabase.from("profiles").select("*").eq("id", u.id).single();
        setUser(data);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser(data);
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Jangan render sama sekali di halaman dashboard/auth
  if (isHidden) return null;

  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-[#e1e3e4]/50 shadow-sm"
      }`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight shrink-0">
            <span className={transparent ? "text-white" : "text-[#000802] dark:text-white"}>
              Nex<span className="text-emerald-500">Pro</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: "/search?listing_type=sale", label: "Beli" },
              { href: "/search?listing_type=rent", label: "Sewa" },
              { href: "/search", label: "Cari" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-sm font-semibold transition-colors font-label ${
                  transparent ? "text-white/80 hover:text-white" : "text-[#476083] hover:text-[#000802] dark:text-slate-300 dark:hover:text-white"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {compareIds.length > 0 && (
              <Link href="/compare">
                <button className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-label ${
                  transparent ? "text-white hover:bg-white/10" : "text-[#476083] hover:bg-[#f3f4f5]"
                }`}>
                  <BarChart3 size={15} /> Compare
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                    {compareIds.length}
                  </span>
                </button>
              </Link>
            )}

            {user ? (
              <>
                <Link href="/saved">
                  <Button variant={transparent ? "glass" : "ghost"} size="icon"><Heart size={17} /></Button>
                </Link>
                {user.role === "agent" && (
                  <Link href="/dashboard/new-listing">
                    <Button variant="emerald" size="sm"><Plus size={15} /> Listing</Button>
                  </Link>
                )}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(v => !v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                      transparent ? "text-white hover:bg-white/10" : "text-[#191c1d] hover:bg-[#f3f4f5]"
                    }`}>
                    {user.avatar_url
                      ? <img src={user.avatar_url} className="w-7 h-7 rounded-full object-cover" alt="" />
                      : <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"><User size={13} className="text-emerald-700" /></div>
                    }
                    <span className="text-sm font-semibold font-label">{user.full_name?.split(" ")[0]}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-card-hover border border-[#e1e3e4] overflow-hidden z-50"
                      >
                        {[
                          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                          { href: "/dashboard/profile", label: "Profil Saya", icon: User },
                          { href: "/saved", label: "Tersimpan", icon: Heart },
                        ].map(({ href, label, icon: Icon }) => (
                          <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#191c1d] dark:text-white hover:bg-[#f3f4f5] dark:hover:bg-slate-800 transition-colors">
                            <Icon size={14} /> {label}
                          </Link>
                        ))}
                        <button onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-[#e1e3e4]">
                          <LogOut size={14} /> Keluar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant={transparent ? "glass" : "ghost"} size="sm">Masuk</Button></Link>
                <Link href="/signup"><Button variant="default" size="sm">Daftar</Button></Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileOpen(v => !v)}
            className={`md:hidden p-2 rounded-xl ${transparent ? "text-white" : "text-[#191c1d]"}`}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-950 border-t border-[#e1e3e4] overflow-hidden">
              <div className="px-4 py-4 flex flex-col gap-1">
                {[
                  { href: "/search?listing_type=sale", label: "Beli" },
                  { href: "/search?listing_type=rent", label: "Sewa" },
                  { href: "/search", label: "Cari Properti" },
                ].map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-semibold text-[#191c1d] dark:text-white hover:bg-[#f3f4f5] dark:hover:bg-slate-800 rounded-xl">
                    {l.label}
                  </Link>
                ))}
                <div className="flex gap-3 mt-3 pt-3 border-t border-[#e1e3e4]">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full" size="sm">Dashboard</Button>
                      </Link>
                      <button onClick={() => signOut()} className="flex-1 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl">Keluar</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">Masuk</Button>
                      </Link>
                      <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full">Daftar</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
