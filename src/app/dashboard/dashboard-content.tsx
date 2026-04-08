"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SIDEBAR_KEY = "nexpro-sidebar-collapsed";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const sync = () => {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "true");
    };
    sync();
    setMounted(true);

    const interval = setInterval(sync, 150);
    window.addEventListener("storage", sync);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", sync);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Mobile: no left margin (drawer sidebar), just top padding for the mobile top bar
  // Desktop: left margin matches sidebar width (256 expanded / 72 collapsed)
  const desktopMargin = collapsed ? 72 : 256;

  return (
    <motion.main
      animate={mounted && !isMobile ? { marginLeft: desktopMargin } : { marginLeft: 0 }}
      initial={false}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      // pt-14 = mobile top bar height (56px), md:pt-0 because desktop has no top bar
      className="flex-1 min-w-0 w-full pt-14 md:pt-0"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
}
