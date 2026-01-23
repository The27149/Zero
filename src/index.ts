/**
 * Zero - Universal JavaScript/TypeScript Toolkit
 *
 * 一个通用、无限可扩展的 JavaScript/TypeScript 工具库
 *
 * @packageDocumentation
 */

// ============================================
// Core - 核心层
// ============================================
export {
  // 配置管理
  config,
  type ConfigManager,
  type ConfigOptions,
  // 日志系统
  logger,
  type Logger,
  type LogLevel,
  type LoggerOptions,
  // 错误处理
  error,
  ZeroError,
  type ErrorManager,
  type ZeroErrorOptions,
  // 事件系统
  event,
  EventEmitter,
  type EventCallback,
  type EventMap,
  // 插件系统
  plugin,
  type PluginManager,
  type ZeroPlugin,
  type PluginOptions,
  // 命名空间
  createZeroNamespace,
  mountGlobal,
  getZero,
  type ZeroNamespace,
} from './core'

// ============================================
// Utils - 常用工具 (直接导出最常用的)
// ============================================
export {
  // 类型判断
  isArray,
  isObject,
  isString,
  isNumber,
  isFunction,
  isNil,
  isEmpty,
  isEqual,
  // 对象操作
  deepClone,
  merge,
  pick,
  omit,
  get,
  set,
  // 数组操作
  unique,
  groupBy,
  chunk,
  flatten,
  // 字符串操作
  camelCase,
  kebabCase,
  template,
  truncate,
  // 函数工具
  debounce,
  throttle,
  memoize,
  sleep,
  retry,
  // 随机工具
  uuid,
  randomInt,
  // 数学工具
  clamp,
  lerp,
} from './utils'

// ============================================
// 模块发现
// ============================================
export type { ZeroModules } from './_registry'
export { moduleInfo } from './_registry'

// ============================================
// 版本信息
// ============================================
export const VERSION = '0.1.0'

// ============================================
// 全局挂载 (副作用)
// ============================================
import './global'
