/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefaf9',
          100: '#d4f1ee',
          200: '#a9e3dd',
          300: '#78cdc4',
          400: '#4bb0a6',
          500: '#2f938b',
          600: '#227872',
          700: '#1b615d',
          800: '#154744', // core brand teal (headers, nav, primary text)
          900: '#0d3230', // deepest teal (buttons, footer)
        },
        gold: {
          50: '#fdf8e9',
          100: '#faedc0',
          200: '#f5dc8a',
          300: '#eec758',
          400: '#e5b332', // badges / accents
          500: '#d29a1e',
          600: '#a97815',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(13, 50, 48, 0.08)',
        cardHover: '0 8px 24px rgba(13, 50, 48, 0.14)',
      },
    },
  },
  plugins: [],
};
