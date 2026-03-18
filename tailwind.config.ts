import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        reddy: {
          50:  '#fff1f2',
          100: '#ffe0e3',
          200: '#ffc9ce',
          300: '#f3a0a8',
          400: '#e86e7a',
          500: '#6D1325',
          600: '#8B1A2F',
          700: '#4F0C1A',
        },
        surface: '#F9F7F6',
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
