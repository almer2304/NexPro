import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.vercel.app",
      ],
    },
  },
  // ESLint v8 (which next uses) has conflict with Next.js 15.3+ build runner.
  // We run lint separately — skip during build to prevent false failures.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript errors are caught in development; allow build to complete
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
