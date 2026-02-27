import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',      // 主入口
    'src/*/index.ts',    // 模块入口
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  minify: true,
  sourcemap: true,
  target: 'es2020',
  outDir: 'dist',
  esbuildOptions(options) {
    options.chunkNames = 'chunks/[name]-[hash]'
  },
})
