"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid2x2 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const main = images[0];
  const secondaries = images.slice(1, 4);
  const totalCount = images.length;

  function openLightbox(idx: number) {
    setActiveIndex(idx);
    setLightboxOpen(true);
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + totalCount) % totalCount);
  }
  function next() {
    setActiveIndex((i) => (i + 1) % totalCount);
  }

  return (
    <>
      {/* Grid Layout */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        {/* Main image — 2 cols, 2 rows */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-zoom-in group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={main}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Secondary images */}
        {secondaries.map((src, i) => (
          <div
            key={i}
            className="hidden md:block relative cursor-zoom-in group overflow-hidden"
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={src}
              alt={`${title} photo ${i + 2}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Last slot: show +N overlay */}
            {i === 2 && totalCount > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                <div className="text-center text-white">
                  <Grid2x2 size={24} className="mx-auto mb-1" />
                  <p className="text-sm font-bold">+{totalCount - 4} more</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Fill empty slots if fewer than 4 secondary images */}
        {Array.from({ length: Math.max(0, 3 - secondaries.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="hidden md:block bg-[#f3f4f5]" />
        ))}

        {/* View all button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-[#191c1d] hover:bg-white transition-colors shadow-sm"
          style={{ position: "absolute" }}
        >
          <Grid2x2 size={14} />
          View all {totalCount} photos
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={18} />
            </button>

            {/* Counter */}
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-label">
              {activeIndex + 1} / {totalCount}
            </p>

            {/* Image */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl h-[80vh] px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} ${activeIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Prev/Next */}
            {totalCount > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto no-scrollbar px-4">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                    i === activeIndex ? "ring-2 ring-emerald-400 scale-110" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
