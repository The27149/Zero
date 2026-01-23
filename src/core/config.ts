/**
 * Zero Core - Configuration Management
 * 配置管理模块
 */

export interface ConfigOptions {
  [key: string]: unknown
}

class ConfigManager {
  private _config: Map<string, unknown> = new Map()
  private _defaults: Map<string, unknown> = new Map()

  /**
   * 设置配置项
   */
  set<T>(key: string, value: T): this {
    this._config.set(key, value)
    return this
  }

  /**
   * 获取配置项
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    if (this._config.has(key)) {
      return this._config.get(key) as T
    }
    if (this._defaults.has(key)) {
      return this._defaults.get(key) as T
    }
    return defaultValue
  }

  /**
   * 检查配置项是否存在
   */
  has(key: string): boolean {
    return this._config.has(key) || this._defaults.has(key)
  }

  /**
   * 删除配置项
   */
  delete(key: string): boolean {
    return this._config.delete(key)
  }

  /**
   * 批量合并配置
   */
  merge(options: ConfigOptions): this {
    for (const [key, value] of Object.entries(options)) {
      this._config.set(key, value)
    }
    return this
  }

  /**
   * 设置默认值
   */
  defaults(options: ConfigOptions): this {
    for (const [key, value] of Object.entries(options)) {
      this._defaults.set(key, value)
    }
    return this
  }

  /**
   * 获取所有配置
   */
  all(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    this._defaults.forEach((v, k) => (result[k] = v))
    this._config.forEach((v, k) => (result[k] = v))
    return result
  }

  /**
   * 清空配置
   */
  clear(): this {
    this._config.clear()
    return this
  }

  /**
   * 重置为默认值
   */
  reset(): this {
    this._config.clear()
    return this
  }
}

export const config = new ConfigManager()
export type { ConfigManager }
