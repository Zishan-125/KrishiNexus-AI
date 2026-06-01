import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        agri: {
          50: "hsl(142, 60%, 96%)",
          100: "hsl(142, 55%, 90%)",
          200: "hsl(142, 50%, 80%)",
          300: "hsl(142, 50%, 65%)",
          400: "hsl(142, 60%, 50%)",
          500: "hsl(142, 72%, 38%)", // Primary emerald
          600: "hsl(142, 76%, 30%)",
          700: "hsl(142, 76%, 24%)",
          800: "hsl(142, 72%, 18%)",
          900: "hsl(142, 72%, 12%)",
          950: "hsl(150, 30%, 5%)",   // Dark theme deep background
        },
        market: {
          gold: "hsl(38, 92%, 50%)",
          amber: "hsl(38, 92%, 40%)",
          clay: "hsl(20, 70%, 50%)",
        },
        slateforest: {
          50: "hsl(160, 15%, 96%)",
          100: "hsl(160, 15%, 90%)",
          200: "hsl(160, 12%, 80%)",
          300: "hsl(160, 10%, 65%)",
          400: "hsl(160, 8%, 45%)",
          500: "hsl(160, 10%, 30%)",
          600: "hsl(160, 12%, 22%)",
          700: "hsl(160, 15%, 15%)",
          800: "hsl(160, 15%, 11%)",  // Sleek dark-mode card background
          900: "hsl(160, 20%, 8%)",   // Dark dashboard background
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "laser-scan": "laser 3s ease-in-out infinite",
        "pulse-glow": "glow 2s infinite ease-in-out",
        "radar-pulse": "radar 4s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
      keyframes: {
        laser: {
          "0%, 100%": { transform: "translateY(0%) opacity(0.8)" },
          "50%": { transform: "translateY(100%) opacity(1)" }
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)", borderColor: "rgba(16, 185, 129, 0.6)" },
          "50%": { boxShadow: "0 0 25px rgba(16, 185, 129, 0.8)", borderColor: "rgba(52, 211, 153, 1)" }
        },
        radar: {
          "0%": { transform: "scale(0.9)", opacity: "0.5" },
          "100%": { transform: "scale(2.2)", opacity: "0" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    },
  },
  plugins: [],
};

export default config;
