import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F1ECE2",
        surface: "#FFFFFF",
        ink: "#22281F",
        muted: "#6F7568",
        line: "#DDD5C6",
        accent: "#B8873B",
        "accent-soft": "#F2E6CE",
        confirm: "#3B5A45",
        "confirm-soft": "#E4ECE6",
        cancel: "#8A3A32",
        "cancel-soft": "#F3E3E0",
      },
      fontFamily: {
        display: ["'Bitter'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
