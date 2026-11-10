
import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/**",
      "client/node_modules/**",
      "dist/**",
      "coverage/**",
    ],
  },

  js.configs.recommended,

  // Konfigurasi umum JavaScript frontend
  {
    files: ["client/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      eqeqeq: "error",
      "prefer-const": "error",
      "no-console": "warn",
    },
  },

  // File yang menggunakan Node.js / CommonJS
  {
    files: ["client/**/validation.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },

  // File testing Jest
  {
    files: ["client/**/*.test.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },

  prettier,
];
