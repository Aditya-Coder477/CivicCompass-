/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#020B18', 900: '#050E1F', 800: '#0A1628', 700: '#0F2040', 600: '#162A52' },
        primary: { DEFAULT: '#3B82F6', dark: '#1D4ED8', light: '#60A5FA' },
        accent: { DEFAULT: '#F97316', light: '#FB923C' },
        success: { DEFAULT: '#10B981', light: '#34D399' },
        warning: { DEFAULT: '#F59E0B' },
        saffron: '#FF9933',
        indiaGreen: '#138808',
        indiaBlue: '#000080',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #020B18 0%, #0A1628 40%, #0F2040 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(249,115,22,0.05))',
        'glow-blue': 'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(59,130,246,0.35)',
        'glow-accent': '0 0 30px rgba(249,115,22,0.35)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};
