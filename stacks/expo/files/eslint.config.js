// https://docs.expo.dev/guides/using-eslint/
// Architecture and design-token rules live here so the AI gets instant, mechanical feedback.
// See docs/architecture/overview.md (dependency rules) and docs/design/identity.md (tokens).
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

// --- Reusable restriction fragments -------------------------------------------------------

const noDeepFeatureImports = {
  group: ['@/features/*/*'],
  message:
    'Import a feature only through its public interface: "@/features/<name>" (its index.ts).',
};

const noRawRNText = {
  name: 'react-native',
  importNames: ['Text'],
  message: 'Use Text from "@/shared/ui" so typography and color come from tokens.',
};

const designTokenSyntax = [
  {
    selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
    message: 'No hex colors outside src/theme/. Use a semantic color from useTheme().',
  },
  {
    selector: 'Literal[value=/^(?:rgb|hsl)a?\\(/i]',
    message: 'No rgb()/hsl() colors outside src/theme/. Use a semantic color from useTheme().',
  },
  {
    selector:
      'Property[key.name=/^(?:margin|padding|gap|rowGap|columnGap|fontSize|lineHeight|letterSpacing|fontWeight|border(?:Top|Bottom)?(?:Left|Right|Start|End)?Radius)/] > Literal[value>0]',
    message:
      'No literal spacing/typography/radius values outside src/theme/. Use spacing, typography or radii tokens.',
  },
];

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', 'coverage/*', '.expo/*'],
  },

  // Design tokens: everywhere in src except the theme itself and tests.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/theme/**', '**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', ...designTokenSyntax] },
  },

  // Routes: compose screens from feature public interfaces and shared/ui only.
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: [noRawRNText], patterns: [noDeepFeatureImports] },
      ],
    },
  },

  // Feature domain: pure TypeScript. No React, no platform, no I/O, no other layers.
  {
    files: ['src/features/*/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-native', 'react-native-*', 'expo', 'expo-*', '@expo/*'],
              message: 'domain/ must be pure TypeScript: no React, React Native or Expo.',
            },
            {
              group: [
                '@/shared/ui',
                '@/shared/ui/*',
                '@/features/*',
                '@/app/*',
                '@/theme',
                '@/theme/*',
              ],
              message: 'domain/ cannot depend on UI, routes, theme or other features.',
            },
            {
              group: ['../data', '../data/*', '../hooks', '../hooks/*', '../ui', '../ui/*'],
              message:
                'domain/ is the innermost layer: data, hooks and ui depend on it, not the reverse.',
            },
          ],
        },
      ],
    },
  },

  // Rest of a feature (data, hooks, ui): other features only through their index.ts.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    ignores: ['src/features/*/domain/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [noRawRNText],
          patterns: [
            noDeepFeatureImports,
            { group: ['@/app/*'], message: 'Features never import routes.' },
          ],
        },
      ],
    },
  },

  // Shared code knows nothing about features or routes.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/app/*'],
              message: 'shared/ is feature-agnostic: it cannot import features or routes.',
            },
          ],
        },
      ],
    },
  },
]);
