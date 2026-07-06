export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gm: {
          navy: '#0e2544',
          blue: '#174a7c',
          sky: '#15a9e0',
          green: '#1fb978',
          mint: '#e9f8f3',
          ink: '#122033'
        }
      },
      boxShadow: {
        soft: '0 24px 70px rgba(14, 37, 68, 0.12)'
      }
    }
  },
  plugins: []
};
