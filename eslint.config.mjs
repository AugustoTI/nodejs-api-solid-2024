import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { languageOptions: { globals: globals.node }, files: ['**/*.{ts,js}'] },
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      '**/*.d.ts',
      'node_modules',
      'public/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.vscode/**',
      '.public/**',
      '*.tsbuildinfo',
      'pnpm-lock.yaml',
    ],
  },

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
)
