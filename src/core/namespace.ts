/**
 * Zero Core - Namespace
 * 命名空间管理
 */

import { config, type ConfigManager } from './config'
import { logger, type Logger } from './logger'
import { error, type ErrorManager, ZeroError } from './error'
import { event, EventEmitter } from './event'
import { plugin, type PluginManager } from './plugin'

/**
 * Zero 命名空间接口
 */
export interface ZeroNamespace {
  /** 版本号 */
  version: string
  /** 配置管理 */
  config: ConfigManager
  /** 日志系统 */
  logger: Logger
  /** 错误处理 */
  error: ErrorManager
  /** 事件系统 */
  event: EventEmitter
  /** 插件系统 */
  plugin: PluginManager
  /** 错误类 */
  ZeroError: typeof ZeroError
  /** EventEmitter 类 */
  EventEmitter: typeof EventEmitter
}

/**
 * 创建 Zero 命名空间对象
 */
export function createZeroNamespace(): ZeroNamespace {
  return {
    version: '0.1.0',
    config,
    logger,
    error,
    event,
    plugin,
    ZeroError,
    EventEmitter,
  }
}

/**
 * 挂载到全局
 */
export function mountGlobal(): ZeroNamespace {
  const Zero = createZeroNamespace()

  if (typeof globalThis !== 'undefined') {
    ;(globalThis as unknown as { Zero: ZeroNamespace }).Zero = Zero
  }

  return Zero
}

/**
 * 获取全局 Zero 对象
 */
export function getZero(): ZeroNamespace | undefined {
  if (typeof globalThis !== 'undefined' && 'Zero' in globalThis) {
    return (globalThis as unknown as { Zero: ZeroNamespace }).Zero
  }
  return undefined
}
