"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, MessageCircle, X } from "lucide-react";

interface ShareButtonProps {
  title: string;
  price?: string;
  city?: string;
  slug?: string;
}

export function ShareButton({ title, price, city, slug }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/properties/${slug}`
    : "";

  const waText = encodeURIComponent(
    `🏠 *${title}*\n📍 ${city ?? ""}\n💰 ${price ?? ""}\n\nLihat selengkapnya: ${url}`
  );

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      setOpen(true);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={nativeShare}
        className="w-10 h-10 rounded-full border border-[#c4c6cf] flex items-center justify-center hover:bg-[#f3f4f5] transition-colors"
        title="Share"
      >
        <Share2 size={15} className="text-[#476083]" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-[#e1e3e4] overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f3f4f5]">
                <p className="text-xs font-bold text-[#191c1d]">Share Property</p>
                <button onClick={() => setOpen(false)}><X size={14} className="text-[#74777f]" /></button>
              </div>
              <div className="p-2 space-y-1">
                <a
                  href={`https://wa.me/?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f3f4f5] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle size={15} className="text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-[#191c1d]">Share via WhatsApp</span>
                </a>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f3f4f5] transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${copied ? "bg-emerald-100" : "bg-[#f3f4f5]"}`}>
                    {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} className="text-[#476083]" />}
                  </div>
                  <span className="text-sm font-semibold text-[#191c1d]">
                    {copied ? "Link copied!" : "Copy Link"}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
