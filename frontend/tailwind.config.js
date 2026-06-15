/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf9f4',
          100: '#f5ede0',
          200: '#e8d5b8',
          300: '#d4b48a',
          400: '#c09060',
          500: '#b87c4a',
          600: '#9a6438',
          700: '#8a5c32',
          800: '#6b4828',
          900: '#1a1208',
        },
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(44,28,8,0.06), 0 2px 8px rgba(44,28,8,0.04)',
        'warm-md': '0 4px 16px rgba(44,28,8,0.08)',
        'warm-lg': '0 16px 48px rgba(44,28,8,0.14)',
      },
    },
  },
  plugins: [],
}
