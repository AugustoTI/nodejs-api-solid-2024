import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.mts'],
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
})
