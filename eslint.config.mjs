import eslint from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintPluginPrettier,
  { languageOptions: { globals: globals.node }, files: ['**/*.{ts,js}'] },
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
