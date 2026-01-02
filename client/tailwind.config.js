/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#007bff',
          600: '#0056b3',
          700: '#004085',
        },
        medical: {
          blue: '#007bff',
          dark: '#072231',
          light: '#f7f9fb',
        }
      },
    },
  },
  plugins: [],
}

