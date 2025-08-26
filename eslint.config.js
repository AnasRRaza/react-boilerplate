// eslint.config.js
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';

export default tseslint.config(
  // 0) Linter hygiene
  {
    linterOptions: {
      // Warn if there's an unnecessary /* eslint-disable */
      reportUnusedDisableDirectives: true,
    },
  },

  // 1) Global ignores
  {
    ignores: [
      'dist',
      'build',
      'coverage',
      'node_modules',
      '.husky',
      '.vscode',
      '.idea',
      '.prettierrc*',
      'prettier.config.*',
    ],
  },

  // 2) BASE: all source files (JS + TS)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['src'],
        },
      },
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      /* General hygiene (shared) */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'object-shorthand': 'error',
      'prefer-template': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-implicit-coercion': ['warn', { disallowTemplateShorthand: true }],

      /* Import hygiene */
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-unresolved': 'off', // Disable for Vite's public directory imports
      'react-refresh/only-export-components': 'off',

      /* Sorting (don’t use ESLint's built-in sort-imports to avoid conflicts) */
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react', '^next', '^[a-zA-Z]'], // pkgs
            ['^@/'], // @ alias
            ['^~'], // ~ alias
            ['^src/'], // absolute project paths
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // parent
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // same dir
            ['^.+\\.s?css$'], // styles
            ['^\\u0000'], // side-effects
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      /* 🆕 Blank line before return */
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },

  // 3) TS overlay: add typed rules ONLY for TS/TSX
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        // TS 5 project service is easiest; switch to "project" if you prefer
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        // Or:
        // project: ['./tsconfig.json'],
        // tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        { ignoreConditionalTests: true, ignoreMixedLogicalExpressions: true },
      ],
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    },
  },

  // 4) Node context (configs & scripts)
  {
    files: [
      '**/*.{config,cfg}.?(m|c)?[jt]s',
      '**/.*rc.*',
      'scripts/**/*.{js,ts}',
      'eslint.config.*',
      'vite.config.*',
      'vitest.config.*',
    ],
    languageOptions: { globals: globals.node },
  },

  // 5) Prettier LAST
  prettierRecommended,
);
