import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    // 主入口
    'index': 'src/index.ts',
    'global': 'src/global.ts',

    // Core
    'core/index': 'src/core/index.ts',

    // Utils
    'utils/index': 'src/utils/index.ts',
    'utils/is': 'src/utils/is.ts',
    'utils/array': 'src/utils/array.ts',
    'utils/object': 'src/utils/object.ts',
    'utils/string': 'src/utils/string.ts',
    'utils/function': 'src/utils/function.ts',
    'utils/date': 'src/utils/date.ts',
    'utils/random': 'src/utils/random.ts',
    'utils/math/index': 'src/utils/math/index.ts',

    // Algorithm
    'algorithm/index': 'src/algorithm/index.ts',
    'algorithm/sort/index': 'src/algorithm/sort/index.ts',
    'algorithm/search/index': 'src/algorithm/search/index.ts',
    'algorithm/struct/index': 'src/algorithm/struct/index.ts',

    // Pattern
    'pattern/index': 'src/pattern/index.ts',
    'pattern/creational/index': 'src/pattern/creational/index.ts',
    'pattern/behavioral/index': 'src/pattern/behavioral/index.ts',
    'pattern/structural/index': 'src/pattern/structural/index.ts',
    'pattern/concurrency/index': 'src/pattern/concurrency/index.ts',

    // Network
    'network/index': 'src/network/index.ts',

    // UI
    'ui/index': 'src/ui/index.ts',

    // File
    'file/index': 'src/file/index.ts',

    // Platform
    'platform/web/index': 'src/platform/web/index.ts',
    'platform/node/index': 'src/platform/node/index.ts',
    'platform/cocos/index': 'src/platform/cocos/index.ts',

    // Preset
    'preset/index': 'src/preset/index.ts',

    // Framework
    'framework/cocos-game/index': 'src/framework/cocos-game/index.ts',
    'framework/node-server/index': 'src/framework/node-server/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  minify: false,
  sourcemap: true,
  target: 'es2020',
  outDir: 'dist',
  esbuildOptions(options) {
    options.chunkNames = 'chunks/[name]-[hash]'
  },
})
