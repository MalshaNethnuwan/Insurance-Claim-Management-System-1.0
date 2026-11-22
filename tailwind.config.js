/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c3d7e9',
          300: '#94b9d9',
          400: '#5e94c3',
          500: '#3875ab',
          600: '#275c8f',
          700: '#1e4873',
          800: '#193c5f',
          900: '#0f2942',
          950: '#0a1a2c',
        },
      },
    },
  },
  plugins: [],
}
