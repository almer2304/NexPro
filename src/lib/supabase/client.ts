"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

// ── Singleton pattern ────────────────────────────────────────
// WAJIB: hanya boleh ada SATU instance Supabase client di browser.
// Jika createClient() dipanggil berkali-kali, setiap instance
// berebut auth lock yang sama → error "lock was released because
// another request stole it".
//
// Solusi: simpan instance di module-level variable, return
// instance yang sama setiap kali createClient() dipanggil.

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}
