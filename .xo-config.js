module.exports = {
  overrides: [
    {
      files: '**/*.{ts,tsx}',
      rules: {
        '@typescript-eslint/comma-dangle': [
          'error',
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
          },
        ],
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'none',
            },
          },
        ],
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      },
    },
    {
      files: 'next-env.d.ts',
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      files: ['next.config.js', 'postcss.config.js', 'tailwind.config.js'],
      rules: {
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  rules: {
    'arrow-parens': ['error', 'always'],
    'import/order': [
      'error',
      { alphabetize: { order: 'asc' }, 'newlines-between': 'always' },
    ],
    'object-curly-spacing': ['error', 'always'],
  },
  semicolon: false,
  space: true,
}
