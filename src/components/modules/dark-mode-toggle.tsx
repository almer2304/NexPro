"use client";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/lib/stores";

export function DarkModeToggle({ className }: { className?: string }) {
  const { isDarkMode, toggleDarkMode } = useUIStore();

  // Apply on mount from persisted state
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        isDarkMode
          ? "bg-white/10 text-yellow-300 hover:bg-white/20"
          : "text-[#476083] hover:bg-[#f3f4f5]"
      } ${className ?? ""}`}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
