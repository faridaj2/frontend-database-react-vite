/** @type {import('tailwindcss').Config} */
const { nextui, colors } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['"Inter"', 'sans-serif'],
      'times': ['"Arial"', 'serif'],
      'lexend' : ['Lexend', 'sans-serif']
    },

    extend: {
      colors: {
        primary: '#338ef7'
      }
    },
  },
  plugins: [nextui({
    themes:{
      light: {
        colors: {
         
        }
      }
    }
  })],
}

