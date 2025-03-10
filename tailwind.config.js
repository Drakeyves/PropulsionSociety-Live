/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          DEFAULT: '#0D0D14',
          secondary: '#141421',
        },
        // Accent colors
        purple: {
          light: '#9F7AEA',
          DEFAULT: '#7A6FE3',
          dark: '#553C9A',
        },
        teal: {
          light: '#2ED6A7',
          DEFAULT: '#2BB592',
          dark: '#1C8870',
        },
        gold: {
          light: '#F7B731',
          DEFAULT: '#F5A623',
          dark: '#D48806',
        },
        metallic: {
          light: '#C5C5D3',
          DEFAULT: '#A1A1B5',
          dark: '#71718A',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 