/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6045F4',
          mint: '#53E6D4',
          gray: '#EBEBED',
          carbon: '#0F1417',
          card: '#161C22',
        }
      }
    },
  },
  plugins: [],
}