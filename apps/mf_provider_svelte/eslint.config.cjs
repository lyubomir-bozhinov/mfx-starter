const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,

  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-console': 'warn',
    },
  },

  {
    ignores: ['dist/', 'node_modules/', '*.config.js'],
  },
];
