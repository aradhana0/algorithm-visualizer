/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0d12',
          panel: '#12141b',
          hover: '#1a1d26',
        },
        border: {
          subtle: '#242833',
        },
        text: {
          DEFAULT: '#e5e7eb',
          muted: '#9ca3af',
          dim: '#6b7280',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          hover: '#a78bfa',
        },
        viz: {
          bar: '#4b5563',
          compare: '#f59e0b',
          swap: '#ef4444',
          sorted: '#10b981',
          pivot: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
