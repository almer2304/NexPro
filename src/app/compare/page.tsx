import { Suspense } from "react";
import { CompareClient } from "./compare-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compare Properties | NexPro" };

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#000802]">Compare Properties</h1>
          <p className="text-[#476083] font-label mt-1">Side-by-side comparison of up to 3 properties</p>
        </div>
        <Suspense>
          <CompareClient />
        </Suspense>
      </div>
    </div>
  );
}
