import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e6ecff",
          200: "#c5ceff",
          300: "#9da7ff",
          400: "#7680ff",
          500: "#4f59f5",
          600: "#3a42d8",
          700: "#2b32ab",
          800: "#1e237c",
          900: "#11144c"
        }
      },
      boxShadow: {
        card: "0 10px 25px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

