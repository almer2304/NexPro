import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NexPro Design System — from Stitch export
        "navy": {
          DEFAULT: "#000802",
          50: "#f0fdf4",
          100: "#dcfce7",
          900: "#000802",
          950: "#000401",
        },
        "emerald": {
          50: "#ecfdf5",
          100: "#d1fae5",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        "slate-surface": {
          lowest: "#ffffff",
          low: "#f3f4f5",
          DEFAULT: "#edeeef",
          high: "#e7e8e9",
          highest: "#e1e3e4",
        },
        // Design token aliases
        primary: "#000802",
        "primary-fixed": "#83fba5",
        "primary-fixed-dim": "#66dd8b",
        "on-primary": "#ffffff",
        "on-primary-container": "#109a50",
        secondary: "#476083",
        "on-secondary": "#ffffff",
        surface: "#f8f9fa",
        "on-surface": "#191c1d",
        "on-surface-variant": "#43474e",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        outline: "#74777f",
        "outline-variant": "#c4c6cf",
        error: "#ba1a1a",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        label: ["Inter", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        "navy-gradient": "linear-gradient(135deg, #000802 0%, #00250e 50%, #006d36 100%)",
        "emerald-glow": "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 8, 2, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
        "card-hover": "0 20px 60px rgba(0, 8, 2, 0.15)",
        "emerald": "0 4px 20px rgba(16, 185, 129, 0.3)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
