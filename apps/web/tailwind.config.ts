import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(20, 7%, 90%)",
        input: "hsl(20, 7%, 95%)",
        ring: "hsl(13, 71%, 54%)",
        background: "hsl(30, 40%, 99%)",
        foreground: "hsl(0, 0%, 10%)",
        muted: {
          DEFAULT: "hsl(30, 25%, 94%)",
          foreground: "hsl(23, 15%, 45%)"
        },
        primary: {
          DEFAULT: "hsl(27, 88%, 62%)",
          foreground: "hsl(0, 0%, 8%)"
        },
        secondary: {
          DEFAULT: "hsl(18, 47%, 95%)",
          foreground: "hsl(18, 36%, 38%)"
        },
        accent: {
          DEFAULT: "hsl(180, 35%, 96%)",
          foreground: "hsl(181, 30%, 32%)"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans]
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
