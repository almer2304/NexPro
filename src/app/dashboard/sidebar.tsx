"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, MessageSquare, Heart,
  Plus, LogOut, User, ChevronRight,
  BarChart3, Moon, Sun, Menu, X,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/supabase/actions";
import { useUIStore } from "@/lib/stores";
import type { Profile } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings", label: "Listing Saya", icon: Building2, agentOnly: true },
  { href: "/dashboard/analytics", label: "Analitik", icon: BarChart3, agentOnly: true },
  { href: "/dashboard/inquiries", label: "Pesan Masuk", icon: MessageSquare },
  { href: "/dashboard/saved", label: "Tersimpan", icon: Heart },
  { href: "/dashboard/profile", label: "Profil Saya", icon: User },
];

const SIDEBAR_KEY = "nexpro-sidebar-collapsed";

export function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_KEY, String(next));
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const navItems = NAV.filter(i => !i.agentOnly || profile?.role === "agent");
  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  // ── Desktop Sidebar Content ──────────────────────────
  const DesktopSidebar = () => (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-[#e1e3e4] dark:border-slate-800 z-40 overflow-hidden"
    >
      {/* Logo + Collapse button */}
      <div className={`flex items-center border-b border-[#e1e3e4] dark:border-slate-800 h-14 ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div key="logo-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Link href="/" className="text-lg font-black text-[#000802] dark:text-white">
                Nex<span className="text-emerald-500">Pro</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="logo-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Link href="/" className="text-lg font-black text-emerald-500">N</Link>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-[#74777f] hover:bg-[#f3f4f5] dark:hover:bg-slate-800 transition-colors"
            title="Tutup sidebar"
          >
            <PanelLeftClose size={17} />
          </button>
        )}
      </div>

      {/* Profile */}
      <div className={`border-b border-[#e1e3e4] dark:border-slate-800 py-3 ${collapsed ? "flex justify-center px-0" : "px-4"}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700 shrink-0">
            {initials}
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                : <span className="text-sm font-black text-emerald-700">{initials}</span>
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#191c1d] dark:text-white truncate">{profile?.full_name ?? "User"}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-label capitalize">
                {profile?.role ?? "customer"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-xl transition-all duration-150 ${
                collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-4 py-2.5"
              } ${
                active
                  ? "bg-[#000802] text-white shadow-sm"
                  : "text-[#476083] dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 hover:text-[#191c1d] dark:hover:text-white"
              }`}
            >
              <item.icon size={17} className={`shrink-0 ${active ? "text-emerald-400" : ""}`} />
              {!collapsed && (
                <>
                  <span className="text-sm font-semibold truncate">{item.label}</span>
                  {active && <ChevronRight size={13} className="ml-auto text-emerald-400 shrink-0" />}
                </>
              )}
            </Link>
          );
        })}

        {profile?.role === "agent" && (
          <Link
            href="/dashboard/new-listing"
            title={collapsed ? "Listing Baru" : undefined}
            className={`flex items-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors mt-1 ${
              collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-4 py-2.5"
            }`}
          >
            <Plus size={17} className="shrink-0" />
            {!collapsed && <span className="text-sm font-bold">Listing Baru</span>}
          </Link>
        )}
      </nav>

      {/* Bottom */}
      <div className={`py-3 border-t border-[#e1e3e4] dark:border-slate-800 space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
        {/* Expand button (only when collapsed) */}
        {collapsed && (
          <button
            onClick={toggleCollapse}
            title="Buka sidebar"
            className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl text-[#476083] dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 transition-colors mb-1"
          >
            <PanelLeftOpen size={17} />
          </button>
        )}

        <button
          onClick={toggleDarkMode}
          title={collapsed ? (isDarkMode ? "Mode Terang" : "Mode Gelap") : undefined}
          className={`flex items-center rounded-xl text-[#476083] dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 hover:text-[#191c1d] dark:hover:text-white transition-colors ${
            collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-4 py-2.5 w-full"
          }`}
        >
          {isDarkMode ? <Sun size={17} className="shrink-0" /> : <Moon size={17} className="shrink-0" />}
          {!collapsed && <span className="text-sm font-semibold">{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>}
        </button>

        <button
          onClick={() => signOut()}
          title={collapsed ? "Keluar" : undefined}
          className={`flex items-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ${
            collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-4 py-2.5 w-full"
          }`}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Keluar</span>}
        </button>
      </div>
    </motion.aside>
  );

  return (
    <>
      <DesktopSidebar />

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white dark:bg-slate-900 border-b border-[#e1e3e4] dark:border-slate-800 flex items-center justify-between px-4">
        <Link href="/" className="text-lg font-black text-[#000802] dark:text-white">
          Nex<span className="text-emerald-500">Pro</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#476083] dark:text-slate-300">
            {profile?.full_name?.split(" ")[0]}
          </span>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl text-[#476083] hover:bg-[#f3f4f5]">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl"
            >
              <div className="px-5 py-4 border-b border-[#e1e3e4] dark:border-slate-800 flex items-center justify-between h-14">
                <span className="text-lg font-black text-[#000802] dark:text-white">Nex<span className="text-emerald-500">Pro</span></span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-[#476083] hover:bg-[#f3f4f5]">
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-[#e1e3e4] dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <span className="text-sm font-black text-emerald-700">{initials}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191c1d] dark:text-white">{profile?.full_name}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider capitalize">{profile?.role}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        active
                          ? "bg-[#000802] text-white"
                          : "text-[#476083] dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 hover:text-[#191c1d] dark:hover:text-white"
                      }`}>
                      <item.icon size={17} className={active ? "text-emerald-400" : ""} />
                      <span className="text-sm font-semibold">{item.label}</span>
                      {active && <ChevronRight size={13} className="ml-auto text-emerald-400" />}
                    </Link>
                  );
                })}
                {profile?.role === "agent" && (
                  <Link href="/dashboard/new-listing" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors mt-1">
                    <Plus size={17} />
                    <span className="text-sm font-bold">Listing Baru</span>
                  </Link>
                )}
              </nav>

              <div className="px-3 py-3 border-t border-[#e1e3e4] dark:border-slate-800 space-y-0.5">
                <button onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#476083] dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 transition-colors">
                  {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                  <span className="text-sm font-semibold">{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
                </button>
                <button onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={17} />
                  <span className="text-sm font-semibold">Keluar</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
