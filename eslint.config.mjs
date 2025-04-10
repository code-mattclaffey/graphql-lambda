import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import jestPlugin from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{mjs,ts}"],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...jestPlugin.environments.globals.globals,
      },
    },
    ignores: [
      ".next/*",
      "node_modules/*",
      "next-env.d.ts",
      "coverage/",
      "dist/",
      "*.config.js",
      "jest*.js",
      "jest*.ts",
      ".eslintrc.js",
      "*.d.ts",
      "src/mocks/**/*",
    ],
  },
  ...tseslint.configs.recommended,
];
