/**
 * Zero Core - Plugin System
 * 插件系统
 */

export interface ZeroPlugin {
  name: string
  version?: string
  install?: (zero: unknown) => void | Promise<void>
  uninstall?: () => void | Promise<void>
  [key: string]: unknown
}

export interface PluginOptions {
  [key: string]: unknown
}

class PluginManager {
  private _plugins: Map<string, ZeroPlugin> = new Map()
  private _options: Map<string, PluginOptions> = new Map()

  /**
   * 注册插件
   */
  async register(
    name: string,
    plugin: ZeroPlugin | Omit<ZeroPlugin, 'name'>,
    options?: PluginOptions
  ): Promise<this> {
    if (this._plugins.has(name)) {
      throw new Error(`Plugin "${name}" is already registered`)
    }

    const fullPlugin: ZeroPlugin = { name, ...plugin }
    this._plugins.set(name, fullPlugin)

    if (options) {
      this._options.set(name, options)
    }

    // 调用插件的 install 方法
    if (fullPlugin.install) {
      await fullPlugin.install(this._getZeroContext())
    }

    return this
  }

  /**
   * 卸载插件
   */
  async unregister(name: string): Promise<boolean> {
    const plugin = this._plugins.get(name)
    if (!plugin) return false

    // 调用插件的 uninstall 方法
    if (plugin.uninstall) {
      await plugin.uninstall()
    }

    this._plugins.delete(name)
    this._options.delete(name)
    return true
  }

  /**
   * 获取插件
   */
  get<T extends ZeroPlugin>(name: string): T | undefined {
    return this._plugins.get(name) as T | undefined
  }

  /**
   * 获取插件配置
   */
  getOptions(name: string): PluginOptions | undefined {
    return this._options.get(name)
  }

  /**
   * 检查插件是否已注册
   */
  has(name: string): boolean {
    return this._plugins.has(name)
  }

  /**
   * 获取所有已注册插件名
   */
  list(): string[] {
    return Array.from(this._plugins.keys())
  }

  /**
   * 获取所有插件
   */
  all(): Map<string, ZeroPlugin> {
    return new Map(this._plugins)
  }

  /**
   * 清空所有插件
   */
  async clear(): Promise<void> {
    for (const name of this._plugins.keys()) {
      await this.unregister(name)
    }
  }

  /**
   * 获取 Zero 上下文 (供插件使用)
   */
  private _getZeroContext(): unknown {
    // 返回全局 Zero 对象，如果存在的话
    if (typeof globalThis !== 'undefined' && 'Zero' in globalThis) {
      return (globalThis as unknown as { Zero: unknown }).Zero
    }
    return undefined
  }
}

export const plugin = new PluginManager()
export type { PluginManager }
