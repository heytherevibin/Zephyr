/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2D3748', // Custom gray shade between gray-700 (#4a5568) and gray-800 (#2d3748)
        }
      },
    },
  },
  plugins: [],
}
