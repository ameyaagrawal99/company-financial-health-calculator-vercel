/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system from PRT
        base: "#F8F7F4",
        card: "#FFFFFF",
        subtle: "#F1F0ED",
        border: "#E4E2DC",
        primary: "#1C1917",
        secondary: "#6B6560",
        muted: "#A8A29E",
        accent: "#3D5A80",
        "accent-light": "#E8EEF5",
        // Status colors
        "status-green": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
        "status-yellow": { bg: "#FEFCE8", text: "#854D0E", border: "#FEF08A" },
        "status-orange": { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
        "status-red": { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
        // Chart colors
        chart1: "#3D5A80",
        chart2: "#98C1D9",
        chart3: "#6B9E78",
        chart4: "#C17B5A",
        chart5: "#8B7BB5",
        chart6: "#B5A642",
        chart7: "#A0A0A0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontVariantNumeric: {
        tabular: "tabular-nums",
      },
      borderRadius: {
        card: "10px",
        badge: "6px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08)",
        tooltip: "0 4px 12px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
