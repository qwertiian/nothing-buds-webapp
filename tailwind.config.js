/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        ndot: ['NDOT-55', 'Courier New', 'monospace'],
        mono: ['Lettera-Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Space-Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        nothing: {
          red: '#d71920',
          redHover: '#b31218',
          bg: '#0a0a0a',
          card: '#141414',
          subcard: '#1c1c1c',
          border: '#282828',
          text: '#f2f2f2',
          muted: '#8e8e93',
          glyph: '#ffffff',
        },
        pokedex: {
          bg: '#c81b2a',
          screen: '#8bac0f',
          dark: '#0f380f',
          accent: '#306230',
          yellow: '#f7d02c',
          blue: '#1e88e5',
        },
        cyberpunk: {
          bg: '#0a0014',
          neon: '#00f0ff',
          pink: '#ff2d95',
          purple: '#9b30ff',
          grid: '#1a0030',
        },
        lofi: {
          bg: '#1a1614',
          cream: '#f5e6d3',
          brown: '#8b7355',
          green: '#7d9b76',
          pink: '#c4a882',
        }
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.0)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(215, 25, 32, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(215, 25, 32, 0.8))' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'radar': 'radar 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 300ms ease-out forwards',
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'scale-in': 'scaleIn 200ms ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      }
    },
  },
  plugins: [],
}
