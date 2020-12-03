module.exports = {
  purge: [
    "./app/**/*.ts",
    "./app/**/*.mdx",
    "./app/**/*.md",
    "./remix.config.js",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};
