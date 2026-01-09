/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { blue: '#1e3a8a', teal: '#2dd4bf' }
      },
    },
  },
  plugins: [],
}