/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  safelist: [
    'bg-brand-blue', 'bg-brand-green', 'bg-brand-orange',
    'text-brand-blue', 'text-brand-green', 'text-brand-orange',
    'bg-brand-blue/10', 'bg-brand-green/10', 'bg-brand-orange/10',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          blueDark: '#1D4ED8',
          green: '#10B981',
          orange: '#F59E0B',
          ink: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(17,24,39,0.04), 0 4px 16px -4px rgba(17,24,39,0.08)',
        float: '0 8px 30px -6px rgba(37,99,235,0.35)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
