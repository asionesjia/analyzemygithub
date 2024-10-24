/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  semi: false
};

export default config;
