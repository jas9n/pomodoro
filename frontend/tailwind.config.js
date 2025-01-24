/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/main.jsx",
    "./src/App.jsx",
    './index.html',
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  safelist:[
    'font-roboto', 
    'font-courier', 
    'font-dm',
    'font-cutive', 
    'font-major', 
    'font-doto',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#000000",
          primary: '#e4e4e7',
          secondary: '#f4f4f5',
          tertiary: '#a1a1aa', 
        },
        dark: {
          background: "#18181b",
          text: "#f9fafb",
          primary: '#27272a',
          secondary: '#27272a',
          tertiary: '#71717a', 
        },
      },
      fontFamily: {
        'roboto': ['Roboto Mono', 'serif'],
        'courier': ['Courier Prime', 'serif'],
        'dm': ['DM Mono', 'serif'],
        'cutive': ['Cutive Mono', 'serif'],
        'major': ['Major Mono Display', 'serif'],
        'doto': ['Doto', 'serif'],
      },
    },
  },
  plugins: [],
};
