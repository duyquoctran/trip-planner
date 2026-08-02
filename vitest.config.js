import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      include: [
        'src/js/api.js',
        'src/js/data.js',
        'src/js/i18n.js',
        'src/js/state.js',
        'src/js/utils.js',
      ],
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
