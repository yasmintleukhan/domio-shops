import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0d0d",
        surface: "#141414",
        border: "#2a2a2a",
        accent: "#C9A84C",
        text: "#f5f0e8",
        muted: "#888880",
      },
    },
  },
  plugins: [],
};
export default config;
