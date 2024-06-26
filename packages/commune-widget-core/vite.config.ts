/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  base: '/',
  build: {
    sourcemap: true,
    outDir: 'build',
    lib: {
      entry: 'src/main.ts',
      formats: ['es']
    }
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**']
  }
});
