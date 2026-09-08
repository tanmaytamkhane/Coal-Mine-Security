import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          amber: '#f59e0b',
          'amber-hover': '#d97706',
          cyan: '#06b6d4',
          emerald: '#10b981',
          orange: '#f97316',
        },
        mine: {
          surface: '#ffffff',
          'surface-dark': '#080d14',
          bg: '#f8fafc',
          'bg-dark': '#05070b',
          card: '#ffffff',
          'card-dark': '#0b111b',
          border: '#e2e8f0',
          'border-dark': '#252c36',
        }
      },
      borderRadius: {
        'xl': '0.5rem',
        '2xl': '0.5rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 10px 30px -5px rgba(59, 130, 246, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.3)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'scroll-hint': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
