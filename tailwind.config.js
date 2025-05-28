/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",            // ← needed for Vite
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        zendy: ['Zen Dots', 'cursive'],
      },
      colors: {
        'grit-green': '#4CAF50',
        'grit-black': '#000000',
        'grit-white': '#FFFFFF',
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}