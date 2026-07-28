/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        garamond: ['"EB Garamond"', 'serif'],
      },
      colors: {
        cp: {
          bg: 'oklch(0.14 0.02 30)',
          'bg-nav': 'oklch(0.14 0.02 30 / 0.94)',
          surface: 'oklch(0.19 0.025 30)',
          border: 'oklch(0.30 0.04 25)',
          crimson: 'oklch(0.42 0.17 20)',
          'crimson-bright': 'oklch(0.52 0.19 20)',
          gold: 'oklch(0.74 0.11 85)',
          'gold-bright': 'oklch(0.85 0.10 85)',
          'gold-dim': 'oklch(0.55 0.09 82)',
          cream: 'oklch(0.93 0.015 80)',
          'cream-bright': 'oklch(0.95 0.01 80)',
          'cream-dim': 'oklch(0.85 0.01 80)',
          muted: 'oklch(0.72 0.02 60)',
          'muted-2': 'oklch(0.68 0.02 60)',
          'muted-3': 'oklch(0.60 0.02 60)',
        },
      },
      keyframes: {
        'cp-fade': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'cp-fade': 'cp-fade 0.35s ease',
      },
    },
  },
  plugins: [],
}
