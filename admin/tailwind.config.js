/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0274be',
        'primary-dark': '#025a94',
        charcoal: '#2a2a2a',
        gray: {
          mid: '#808285',
        },
        offwhite: '#f8f7f4',
        dark: '#1a1a2e',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
