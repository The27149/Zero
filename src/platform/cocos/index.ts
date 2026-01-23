/**
 * Zero Platform - Cocos
 * Cocos Creator 平台工具 (占位)
 */

/**
 * 资源管理工具
 * @description 需要在 Cocos Creator 环境中使用
 */
export const resource = {
  /**
   * 加载资源
   */
  async load<T>(path: string, type?: unknown): Promise<T> {
    // 占位实现，实际使用时需要 Cocos Creator 环境
    console.warn('[Zero/Cocos] resource.load requires Cocos Creator environment')
    return Promise.reject(new Error('Not in Cocos Creator environment'))
  },

  /**
   * 预加载资源
   */
  async preload(paths: string | string[]): Promise<void> {
    console.warn('[Zero/Cocos] resource.preload requires Cocos Creator environment')
  },

  /**
   * 释放资源
   */
  release(path: string): void {
    console.warn('[Zero/Cocos] resource.release requires Cocos Creator environment')
  },
}

/**
 * 场景管理工具
 */
export const scene = {
  /**
   * 跳转场景
   */
  async goto(name: string, data?: unknown): Promise<void> {
    console.warn('[Zero/Cocos] scene.goto requires Cocos Creator environment')
  },

  /**
   * 获取当前场景名
   */
  current(): string {
    console.warn('[Zero/Cocos] scene.current requires Cocos Creator environment')
    return ''
  },

  /**
   * 重载当前场景
   */
  async reload(): Promise<void> {
    console.warn('[Zero/Cocos] scene.reload requires Cocos Creator environment')
  },
}

/**
 * 音频管理工具
 */
export const audio = {
  /**
   * 播放音效
   */
  playEffect(path: string, volume?: number): void {
    console.warn('[Zero/Cocos] audio.playEffect requires Cocos Creator environment')
  },

  /**
   * 播放背景音乐
   */
  playMusic(path: string, loop?: boolean): void {
    console.warn('[Zero/Cocos] audio.playMusic requires Cocos Creator environment')
  },

  /**
   * 停止背景音乐
   */
  stopMusic(): void {
    console.warn('[Zero/Cocos] audio.stopMusic requires Cocos Creator environment')
  },

  /**
   * 暂停背景音乐
   */
  pauseMusic(): void {
    console.warn('[Zero/Cocos] audio.pauseMusic requires Cocos Creator environment')
  },

  /**
   * 恢复背景音乐
   */
  resumeMusic(): void {
    console.warn('[Zero/Cocos] audio.resumeMusic requires Cocos Creator environment')
  },

  /**
   * 设置音效音量
   */
  setEffectVolume(volume: number): void {
    console.warn('[Zero/Cocos] audio.setEffectVolume requires Cocos Creator environment')
  },

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume: number): void {
    console.warn('[Zero/Cocos] audio.setMusicVolume requires Cocos Creator environment')
  },
}

/**
 * 缓动工具
 */
export const tween = {
  /**
   * 创建缓动
   */
  create<T>(target: T): unknown {
    console.warn('[Zero/Cocos] tween.create requires Cocos Creator environment')
    return {
      to: () => tween.create(target),
      by: () => tween.create(target),
      delay: () => tween.create(target),
      call: () => tween.create(target),
      start: () => {},
      stop: () => {},
    }
  },
}

/**
 * 存储工具
 */
export const storage = {
  /**
   * 获取数据
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch {
      return defaultValue
    }
  },

  /**
   * 设置数据
   */
  set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * 删除数据
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  },

  /**
   * 清空数据
   */
  clear(): void {
    localStorage.clear()
  },
}
