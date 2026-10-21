const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  { ignores: ['node_modules/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser },
    },
    rules: {
      'no-unused-vars': 'error',
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
];