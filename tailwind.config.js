/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        float: "float 15s ease-in-out infinite",
        "float-delayed": "float-delayed 18s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-10px) scale(1.05)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0) scale(1.25)" },
          "50%": { transform: "translateY(-15px) scale(1.3)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
