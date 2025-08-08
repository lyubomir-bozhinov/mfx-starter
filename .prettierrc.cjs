/** @type {import("prettier").Config} */
const config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss", // Must be the last plugin
  ],
  overrides: [
    {
      files: "*.svelte",
      options: { parser: "svelte" },
    },
  ],
};

export default config;
