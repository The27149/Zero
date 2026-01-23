/**
 * Zero Core
 * 核心层入口
 */

// 导出所有核心模块
export { config, type ConfigManager, type ConfigOptions } from './config'
export { logger, type Logger, type LogLevel, type LoggerOptions } from './logger'
export { error, type ErrorManager, ZeroError, type ZeroErrorOptions } from './error'
export { event, EventEmitter, type EventCallback, type EventMap } from './event'
export { plugin, type PluginManager, type ZeroPlugin, type PluginOptions } from './plugin'
export {
  createZeroNamespace,
  mountGlobal,
  getZero,
  type ZeroNamespace,
} from './namespace'
