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
        safety: {
          50: '#fff5f0',
          100: '#ffe8de',
          200: '#ffd0bc',
          300: '#ffaa8a',
          400: '#ff774d',
          500: '#f95721', // Primary safety orange from reference
          600: '#e53f0d',
          700: '#bf2d09',
          800: '#99250e',
          900: '#7c220f',
        },
        mine: {
          surface: '#ffffff',
          'surface-dark': '#111726',
          bg: '#f4f5f8',
          'bg-dark': '#090d16',
          card: '#ffffff',
          'card-dark': '#131929',
          border: '#e8edf3',
          'border-dark': '#1e293b',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 10px 25px -5px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 8px 25px rgba(249, 87, 33, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'orange-glow': '0 0 25px rgba(249, 87, 33, 0.35)',
      }
    },
  },
  plugins: [],
};
export default config;
