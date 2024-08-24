/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'#0ea5e9',
        secondary:'#082f49',
        dark:'#27272a',
        bright:'#fafafa'
      }
    },
  },
  plugins: [],
}

