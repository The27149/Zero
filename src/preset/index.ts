/**
 * Zero Preset
 * 预设组合模块
 */

export interface PresetConfig {
  core?: boolean
  utils?: boolean | string[]
  algorithm?: boolean | string[]
  pattern?: boolean | string[]
  network?: boolean
  ui?: boolean
  file?: boolean
}

export type PresetName = 'default' | 'minimal' | 'game' | 'server' | 'mobile'

const presets: Record<PresetName, PresetConfig> = {
  /**
   * 默认预设：核心 + 常用工具
   */
  default: {
    core: true,
    utils: true,
    algorithm: ['struct'],
    pattern: ['behavioral', 'concurrency'],
    network: true,
  },

  /**
   * 最小预设：仅核心
   */
  minimal: {
    core: true,
    utils: ['is', 'array', 'object'],
  },

  /**
   * 游戏预设：核心 + 工具 + 算法 + 模式
   */
  game: {
    core: true,
    utils: true,
    algorithm: true,
    pattern: true,
  },

  /**
   * 服务端预设：核心 + 工具 + 网络
   */
  server: {
    core: true,
    utils: true,
    algorithm: ['struct', 'search'],
    pattern: ['creational', 'behavioral'],
    network: true,
    file: true,
  },

  /**
   * 移动端预设：核心 + 工具 + UI
   */
  mobile: {
    core: true,
    utils: true,
    pattern: ['behavioral'],
    network: true,
    ui: true,
    file: true,
  },
}

/**
 * 获取预设配置
 */
export function getPreset(name: PresetName): PresetConfig {
  return presets[name] ?? presets.default
}

/**
 * 使用预设
 */
export function usePreset(name: PresetName | PresetConfig): PresetConfig {
  const config = typeof name === 'string' ? getPreset(name) : name

  // 这里可以根据配置动态加载模块
  // 目前仅返回配置，实际加载逻辑由使用方决定

  return config
}

/**
 * 列出所有预设
 */
export function listPresets(): PresetName[] {
  return Object.keys(presets) as PresetName[]
}

/**
 * 注册自定义预设
 */
export function registerPreset(name: string, config: PresetConfig): void {
  ;(presets as Record<string, PresetConfig>)[name] = config
}
