/**
 * Zero Core - Logger
 * 日志系统
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

export interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  timestamp?: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

class Logger {
  private _level: LogLevel = 'info'
  private _prefix: string = '[Zero]'
  private _timestamp: boolean = false

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): this {
    this._level = level
    return this
  }

  /**
   * 获取当前日志级别
   */
  getLevel(): LogLevel {
    return this._level
  }

  /**
   * 配置日志选项
   */
  configure(options: LoggerOptions): this {
    if (options.level !== undefined) this._level = options.level
    if (options.prefix !== undefined) this._prefix = options.prefix
    if (options.timestamp !== undefined) this._timestamp = options.timestamp
    return this
  }

  private _shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this._level]
  }

  private _format(level: string, args: unknown[]): unknown[] {
    const parts: string[] = []
    if (this._prefix) parts.push(this._prefix)
    if (this._timestamp) parts.push(`[${new Date().toISOString()}]`)
    parts.push(`[${level.toUpperCase()}]`)
    return [parts.join(' '), ...args]
  }

  /**
   * Debug 级别日志
   */
  debug(...args: unknown[]): void {
    if (this._shouldLog('debug')) {
      console.debug(...this._format('debug', args))
    }
  }

  /**
   * Info 级别日志
   */
  info(...args: unknown[]): void {
    if (this._shouldLog('info')) {
      console.info(...this._format('info', args))
    }
  }

  /**
   * Warn 级别日志
   */
  warn(...args: unknown[]): void {
    if (this._shouldLog('warn')) {
      console.warn(...this._format('warn', args))
    }
  }

  /**
   * Error 级别日志
   */
  error(...args: unknown[]): void {
    if (this._shouldLog('error')) {
      console.error(...this._format('error', args))
    }
  }

  /**
   * 创建子日志器
   */
  child(prefix: string): Logger {
    const child = new Logger()
    child._level = this._level
    child._prefix = `${this._prefix}${prefix}`
    child._timestamp = this._timestamp
    return child
  }
}

export const logger = new Logger()
export type { Logger }
