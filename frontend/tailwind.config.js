/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f4f7ee",
          100: "#e6edcf",
          200: "#cddba3",
          300: "#aec36e",
          400: "#8eaa45",
          500: "#496C1A",
          600: "#3d5b16",
          700: "#334c13",
          800: "#2a3d10",
          900: "#1f2e0c",
        },
        sky: {
          50: "#eef6fb",
          100: "#d5e9f5",
          200: "#b0d4ec",
          300: "#87bde0",
          400: "#5794CB",
          500: "#4280b5",
          600: "#356a96",
          700: "#295375",
          800: "#1e3d56",
          900: "#132838",
        },
        warm: {
          50: "#fef7ee",
          100: "#fdebd3",
          500: "#f97316",
          600: "#ea580c",
        },
      },
      fontFamily: {
        heebo: ["Heebo", "sans-serif"],
        opensans: ['"Open Sans Hebrew"', '"Open Sans"', "sans-serif"],
      },
      borderRadius: {
        pill: "71px",
      },
    },
  },
  plugins: [],
};
