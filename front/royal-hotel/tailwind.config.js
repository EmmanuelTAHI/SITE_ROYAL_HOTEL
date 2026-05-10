/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Accent rose mauve ──────────────────────────────────────────
        gold:         '#cd9ab6',   // rose mauve (accent principal)
        'gold-light': '#e8cad9',   // rose pâle
        'gold-dark':  '#b0789a',   // rose profond
        // ── Fonds & textes ────────────────────────────────────────────
        dark:         '#0F0F0F',
        charcoal:     '#1A1A1A',
        'charcoal-2': '#2D2D2D',
        cream:        '#FAF6F8',   // crème légèrement rosé (harmonie)
        'cream-dark': '#F0E8EC',
        text:         '#3D3035',   // brun légèrement rosé
        muted:        '#7A6B72',   // gris mauve neutre
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter:     ['Inter', 'sans-serif'],
        jost:      ['Jost', 'sans-serif'],
      },
      animation: {
        'fade-up':      'fadeUp 0.8s ease both',
        'pulse-line':   'pulseLine 2s infinite',
        'spin-slow':    'spin 8s linear infinite',
        'loader-bar':   'loaderBar 1.8s ease-in-out',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLine: {
          '0%, 100%': { transform: 'translateX(-50%) scaleY(1)' },
          '50%':      { transform: 'translateX(-50%) scaleY(0.5)' },
        },
        loaderBar: {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
        '105': '1.05',
        '107': '1.07',
        '108': '1.08',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #cd9ab6 0%, #e8cad9 50%, #cd9ab6 100%)',
      },
      boxShadow: {
        'gold':       '0 4px 32px rgba(205,154,182,0.28)',
        'rose-glow':  '0 0 40px rgba(205,154,182,0.15)',
        'card':       '0 8px 32px rgba(0,0,0,0.07)',
        'card-hover': '0 24px 64px rgba(0,0,0,0.13)',
      },
    },
  },
  plugins: [],
}
