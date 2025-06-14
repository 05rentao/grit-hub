/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgba(var(--bg-color-primary))", "bg-secondary": "rgba(var(--bg-color-secondary))",
        border: "rgba(var(--border-color))",
        card: "rgba(var(--card-color))",
        txt: "rgba(var(--txt-color-primary))",
        "txt-secondary": "rgba(var(--txt-color-secondary))",
        primary: "rgba(var(--primary-color))",
        secondary: "rgba(var(--secondary-color))",
        red: "rgba(255, 0, 0)",
      }
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],
}