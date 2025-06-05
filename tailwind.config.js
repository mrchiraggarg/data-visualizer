export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        darkBg: '#0f172a',
        cardBg: '#1e293b',
        accent: '#38bdf8',
        softBlue: '#3b82f6',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
        neumorph: '4px 4px 15px #0e1119, -4px -4px 15px #1a1e2a',
      },
    },
  },
  plugins: [],
};
