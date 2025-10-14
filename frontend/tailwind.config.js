/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nevada: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dae6',
          300: '#a7bbce',
          400: '#7897b1',
          500: '#577a97',
          600: '#43607d',
          700: '#374e66',
          800: '#2f4156',
          900: '#2c3a49',
        },
      },
    },
  },
  plugins: [],
}
