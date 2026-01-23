/**
 * Zero Framework - Cocos Game
 * Cocos 游戏框架
 */

import { EventEmitter } from '../../core/event'
import { ObjectPool } from '../../pattern/concurrency'
import { StateMachine, type StateMachineConfig } from '../../pattern/behavioral'

/**
 * Cocos 应用配置
 */
export interface CocosAppConfig {
  /** 设计分辨率 */
  design?: { width: number; height: number }
  /** 启用的功能 */
  features?: {
    sceneManager?: boolean
    uiManager?: boolean
    audioManager?: boolean
    resourceManager?: boolean
  }
}

/**
 * 游戏管理器基类
 */
export abstract class GameManager {
  protected app: CocosApp

  constructor(app: CocosApp) {
    this.app = app
  }

  abstract init(): void | Promise<void>
  abstract destroy(): void
}

/**
 * 场景管理器
 */
export class SceneManager extends GameManager {
  private scenes: Map<string, unknown> = new Map()
  private currentScene: string = ''

  init(): void {
    // 初始化场景管理器
  }

  destroy(): void {
    this.scenes.clear()
  }

  register(name: string, scene: unknown): void {
    this.scenes.set(name, scene)
  }

  async goto(name: string, data?: unknown): Promise<void> {
    if (!this.scenes.has(name)) {
      throw new Error(`Scene "${name}" not found`)
    }
    this.currentScene = name
    this.app.events.emit('scene:change', { name, data })
  }

  current(): string {
    return this.currentScene
  }
}

/**
 * UI 管理器
 */
export class UIManager extends GameManager {
  private layers: Map<string, unknown[]> = new Map()

  init(): void {
    this.layers.set('default', [])
    this.layers.set('popup', [])
    this.layers.set('toast', [])
  }

  destroy(): void {
    this.layers.clear()
  }

  show(name: string, layer: string = 'default'): void {
    this.app.events.emit('ui:show', { name, layer })
  }

  hide(name: string): void {
    this.app.events.emit('ui:hide', { name })
  }

  hideAll(layer?: string): void {
    this.app.events.emit('ui:hideAll', { layer })
  }
}

/**
 * 音频管理器
 */
export class AudioManager extends GameManager {
  private musicVolume: number = 1
  private effectVolume: number = 1
  private isMusicMuted: boolean = false
  private isEffectMuted: boolean = false

  init(): void {
    // 初始化音频管理器
  }

  destroy(): void {
    // 清理音频资源
  }

  playMusic(name: string, loop: boolean = true): void {
    if (this.isMusicMuted) return
    this.app.events.emit('audio:playMusic', { name, loop, volume: this.musicVolume })
  }

  stopMusic(): void {
    this.app.events.emit('audio:stopMusic', {})
  }

  playEffect(name: string): void {
    if (this.isEffectMuted) return
    this.app.events.emit('audio:playEffect', { name, volume: this.effectVolume })
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume))
  }

  setEffectVolume(volume: number): void {
    this.effectVolume = Math.max(0, Math.min(1, volume))
  }

  muteMusic(mute: boolean): void {
    this.isMusicMuted = mute
  }

  muteEffect(mute: boolean): void {
    this.isEffectMuted = mute
  }
}

/**
 * 资源管理器
 */
export class ResourceManager extends GameManager {
  private cache: Map<string, unknown> = new Map()
  private loading: Map<string, Promise<unknown>> = new Map()

  init(): void {
    // 初始化资源管理器
  }

  destroy(): void {
    this.cache.clear()
    this.loading.clear()
  }

  async load<T>(path: string): Promise<T> {
    if (this.cache.has(path)) {
      return this.cache.get(path) as T
    }

    if (this.loading.has(path)) {
      return this.loading.get(path) as Promise<T>
    }

    const promise = this.doLoad<T>(path)
    this.loading.set(path, promise)

    try {
      const resource = await promise
      this.cache.set(path, resource)
      return resource
    } finally {
      this.loading.delete(path)
    }
  }

  private async doLoad<T>(path: string): Promise<T> {
    // 实际加载逻辑需要 Cocos Creator 环境
    this.app.events.emit('resource:load', { path })
    return Promise.reject(new Error('Not implemented'))
  }

  async preload(paths: string[]): Promise<void> {
    await Promise.all(paths.map((p) => this.load(p).catch(() => {})))
  }

  release(path: string): void {
    this.cache.delete(path)
    this.app.events.emit('resource:release', { path })
  }

  releaseAll(): void {
    this.cache.clear()
    this.app.events.emit('resource:releaseAll', {})
  }
}

/**
 * Cocos 游戏应用
 */
export class CocosApp {
  readonly config: CocosAppConfig
  readonly events: EventEmitter<Record<string, unknown>>

  scene?: SceneManager
  ui?: UIManager
  audio?: AudioManager
  resource?: ResourceManager

  constructor(config: CocosAppConfig = {}) {
    this.config = config
    this.events = new EventEmitter()

    this.initManagers()
  }

  private initManagers(): void {
    const features = this.config.features ?? {}

    if (features.sceneManager !== false) {
      this.scene = new SceneManager(this)
      this.scene.init()
    }

    if (features.uiManager !== false) {
      this.ui = new UIManager(this)
      this.ui.init()
    }

    if (features.audioManager !== false) {
      this.audio = new AudioManager(this)
      this.audio.init()
    }

    if (features.resourceManager !== false) {
      this.resource = new ResourceManager(this)
      this.resource.init()
    }
  }

  /**
   * 启动应用
   */
  async start(initialScene?: string): Promise<void> {
    this.events.emit('app:start', {})
    if (initialScene && this.scene) {
      await this.scene.goto(initialScene)
    }
  }

  /**
   * 销毁应用
   */
  destroy(): void {
    this.scene?.destroy()
    this.ui?.destroy()
    this.audio?.destroy()
    this.resource?.destroy()
    this.events.emit('app:destroy', {})
  }

  /**
   * 创建对象池
   */
  createPool<T>(options: {
    create: () => T
    reset?: (obj: T) => void
    max?: number
    initial?: number
  }): ObjectPool<T> {
    return new ObjectPool(options)
  }

  /**
   * 创建状态机
   */
  createFSM<S extends string, E extends string>(
    config: StateMachineConfig<S, E>
  ): StateMachine<S, E> {
    return new StateMachine(config)
  }
}

/**
 * 创建 Cocos 游戏应用
 */
export function createCocosApp(config?: CocosAppConfig): CocosApp {
  return new CocosApp(config)
}
