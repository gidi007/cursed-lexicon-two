/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        "shake": "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        "page-turn": "pageTurn 1.5s ease-in-out forwards",
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        pageTurn: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(-180deg)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}