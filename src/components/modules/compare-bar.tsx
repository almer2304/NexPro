"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, ArrowRight } from "lucide-react";
import { useCompareStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const { compareIds, removeFromCompare, clearCompare } = useCompareStore();

  return (
    <AnimatePresence>
      {compareIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-[#000802] text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 border border-white/10">
            <BarChart3 size={18} className="text-emerald-400 shrink-0" />
            <p className="text-sm font-bold">
              Comparing <span className="text-emerald-400">{compareIds.length}</span>/3 properties
            </p>
            <div className="flex gap-1.5">
              {compareIds.map((id) => (
                <div key={id} className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              ))}
              {Array.from({ length: 3 - compareIds.length }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/20" />
              ))}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={clearCompare}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
              <Link href="/compare">
                <Button size="sm" variant="emerald">
                  Compare <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
