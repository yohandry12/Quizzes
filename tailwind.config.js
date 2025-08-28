/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme"); // <-- ADD THIS LINE

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/pages/Dashboard.jsx"],
  theme: {
    extend: {
      fontFamily: {
        // 'sans' sera maintenant Montserrat
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Les couleurs exactes clonées depuis l'image
        "cv-primary": "#0d5c63",
        "cv-text-dark": "#333333",
        "cv-text-light": "#666666",
      },
    },
  },
  plugins: [],
};
