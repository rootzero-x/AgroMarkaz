/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2faed',
          100: '#e1f4d7',
          200: '#c5e8b4',
          300: '#9ed687',
          400: '#72be55',
          500: '#4e9f35',
          600: '#3c8126',
          700: '#326522',
          800: '#2a501f',
          900: '#23421b',
          950: '#11230c',
        },
        surface: '#F5F7F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
