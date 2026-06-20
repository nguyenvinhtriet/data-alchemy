// `vitest/config` re-exports `defineConfig` with the test field typed —
// no triple-slash directive needed (and tsconfig.json's `types` array would block it anyway).
import { defineConfig } from 'vitest/config';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Cast to `any[]`: the Vite Plugin type can come from either the top-level
  // `vite` package or vitest's bundled copy, and TS treats them as nominally
  // distinct even when they're structurally identical. The cast unblocks
  // typecheck without affecting runtime — react() is a regular Vite plugin
  // either way.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react()] as any[],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
