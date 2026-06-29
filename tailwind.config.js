/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        hotstar: {
          background: '#0B0B0F',
          surface: '#17181D',
          card: '#20212A',
          blue: '#1F80E0',
          pink: '#E0007A',
        },
      },
    },
  },
  plugins: [],
};
