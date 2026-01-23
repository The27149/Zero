/**
 * Zero - 全局挂载
 *
 * import 'zero' 时自动执行，将 Zero 挂载到全局
 */

import { mountGlobal } from './core/namespace'

// 挂载到全局
mountGlobal()

// 声明全局类型
declare global {
  const Zero: import('./core/namespace').ZeroNamespace
}
