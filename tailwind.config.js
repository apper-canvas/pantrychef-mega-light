/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E85D04',
        secondary: '#370617',
        accent: '#9D4EDD',
        surface: '#FFF3E0',
        background: '#FFFBF5',
        success: '#43A047',
        warning: '#FB8C00',
        error: '#E53935',
        info: '#1E88E5'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      transitionDuration: {
        '200': '200ms'
      }
    },
  },
  plugins: [],
}