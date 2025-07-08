module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: '*.{json,md,yml,yaml}',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.html',
      options: {
        parser: 'html',
        printWidth: 120,
      },
    },
  ],
};
