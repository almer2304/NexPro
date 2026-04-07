"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SIDEBAR_KEY = "nexpro-sidebar-collapsed";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Sync with sidebar collapse state
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    setCollapsed(saved === "true");

    // Listen for storage changes (when sidebar toggles)
    const handler = () => {
      const val = localStorage.getItem(SIDEBAR_KEY);
      setCollapsed(val === "true");
    };
    window.addEventListener("storage", handler);

    // Also poll every 100ms for same-tab updates
    const interval = setInterval(handler, 100);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.main
      animate={{ marginLeft: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex-1 min-w-0 mt-14 md:mt-0 hidden md:block"
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

// Mobile content (no margin needed, uses pt-14 for top bar)
export function DashboardMobileContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="md:hidden mt-14 px-4 py-6"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
