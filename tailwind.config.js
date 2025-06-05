module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      boxShadow: {
        neumorph:
          '8px 8px 15px #bebebe, -8px -8px 15px #ffffff',
        'neumorph-inset':
          'inset 8px 8px 15px #bebebe, inset -8px -8px 15px #ffffff',
        'neumorph-hover':
          '6px 6px 10px #a3a3a3, -6px -6px 10px #ffffff',
      },
      colors: {
        gray: {
          100: '#e0e0e0',
          200: '#c7c7c7',
          300: '#a0a0a0',
          600: '#636363',
          700: '#4b4b4b',
          900: '#222222',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
