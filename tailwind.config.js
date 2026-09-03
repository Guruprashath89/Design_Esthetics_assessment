/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          dark: "#0D0D0E",
          card: "#141416",
          "card-hover": "#1D1D22",
          border: "#24242A",
          sand: "#FAF8F5",
          "sand-muted": "#EFECE6",
          charcoal: "#171719",
          terracotta: "#C87A57",
          "terracotta-dark": "#B06544",
          slate: "#2C4A3E",
          gold: "#C59B27",
          muted: "#9E9EA8",
          subtle: "#3F3F46"
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      lineHeight: {
        tightest: '1.05',
      },
      boxShadow: {
        'glow': '0 0 30px -5px rgba(200, 122, 87, 0.15)',
        'card': '0 12px 32px -8px rgba(0, 0, 0, 0.4)',
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
