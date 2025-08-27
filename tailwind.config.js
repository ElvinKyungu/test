/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'onest': ['"Onest"', 'sans-serif'],
      },
      colors: {
        'primary': '#6cd2e7',
        'secondary': '#6FB3B8',
        'beige': '#F6F6F2',
        'skyBlue': '#BADFE7',
        'celadon': '#C2EDCE',
      },
    },
  },
  plugins: [],
}