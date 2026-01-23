/**
 * Zero Core - Event System
 * 事件机制
 */

type EventCallback<T = unknown> = (data: T) => void
type EventMap = Record<string, unknown>

class EventEmitter<Events extends EventMap = EventMap> {
  private _events: Map<keyof Events, Set<EventCallback>> = new Map()
  private _onceEvents: Map<keyof Events, Set<EventCallback>> = new Map()

  /**
   * 注册事件监听器
   */
  on<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): this {
    if (!this._events.has(event)) {
      this._events.set(event, new Set())
    }
    this._events.get(event)!.add(callback as EventCallback)
    return this
  }

  /**
   * 注册一次性事件监听器
   */
  once<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): this {
    if (!this._onceEvents.has(event)) {
      this._onceEvents.set(event, new Set())
    }
    this._onceEvents.get(event)!.add(callback as EventCallback)
    return this
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof Events>(event: K, callback?: EventCallback<Events[K]>): this {
    if (callback) {
      this._events.get(event)?.delete(callback as EventCallback)
      this._onceEvents.get(event)?.delete(callback as EventCallback)
    } else {
      this._events.delete(event)
      this._onceEvents.delete(event)
    }
    return this
  }

  /**
   * 触发事件
   */
  emit<K extends keyof Events>(event: K, data?: Events[K]): this {
    // 触发普通监听器
    this._events.get(event)?.forEach((callback) => {
      callback(data)
    })

    // 触发一次性监听器
    const onceCallbacks = this._onceEvents.get(event)
    if (onceCallbacks) {
      onceCallbacks.forEach((callback) => {
        callback(data)
      })
      this._onceEvents.delete(event)
    }

    return this
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount<K extends keyof Events>(event: K): number {
    const regular = this._events.get(event)?.size ?? 0
    const once = this._onceEvents.get(event)?.size ?? 0
    return regular + once
  }

  /**
   * 检查是否有监听器
   */
  hasListeners<K extends keyof Events>(event: K): boolean {
    return this.listenerCount(event) > 0
  }

  /**
   * 获取所有事件名
   */
  eventNames(): (keyof Events)[] {
    const names = new Set<keyof Events>()
    this._events.forEach((_, key) => names.add(key))
    this._onceEvents.forEach((_, key) => names.add(key))
    return Array.from(names)
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners<K extends keyof Events>(event?: K): this {
    if (event) {
      this._events.delete(event)
      this._onceEvents.delete(event)
    } else {
      this._events.clear()
      this._onceEvents.clear()
    }
    return this
  }

  /**
   * 等待事件触发
   */
  wait<K extends keyof Events>(event: K, timeout?: number): Promise<Events[K]> {
    return new Promise((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined

      const handler: EventCallback<Events[K]> = (data) => {
        if (timeoutId) clearTimeout(timeoutId)
        resolve(data)
      }

      this.once(event, handler)

      if (timeout !== undefined) {
        timeoutId = setTimeout(() => {
          this.off(event, handler)
          reject(new Error(`Event "${String(event)}" timed out after ${timeout}ms`))
        }, timeout)
      }
    })
  }
}

// 全局事件总线
export const event = new EventEmitter()

export { EventEmitter }
export type { EventCallback, EventMap }
