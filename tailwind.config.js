/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  '#fdf8f0',
          100: '#f5e6d0',
          200: '#e8c99a',
          300: '#d9a96a',
          400: '#c8883e',
          500: '#b5691f',
          600: '#9a5318',
          700: '#7d4014',
          800: '#5e2f0e',
          900: '#3e1d08',
        },
        cream: {
          50:  '#fffef9',
          100: '#fdf9ee',
          200: '#f9f0d8',
          300: '#f3e4bc',
          400: '#ead49a',
          500: '#dfc07a',
        },
        caramel: {
          300: '#e8b86d',
          400: '#d49a3e',
          500: '#bf8520',
          600: '#a37018',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-bottom': 'slideInBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(101, 60, 20, 0.15)',
        'warm-lg': '0 10px 40px -4px rgba(101, 60, 20, 0.2)',
        'warm-xl': '0 20px 60px -8px rgba(101, 60, 20, 0.25)',
        'card': '0 2px 8px rgba(101, 60, 20, 0.08), 0 1px 3px rgba(101, 60, 20, 0.06)',
        'card-hover': '0 8px 25px rgba(101, 60, 20, 0.15), 0 3px 8px rgba(101, 60, 20, 0.08)',
      },
    },
  },
  plugins: [],
}
