/**
 * Zero Pattern - Behavioral
 * 行为型模式
 */

/**
 * 观察者模式
 */
export class Observer<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Set<(data: unknown) => void>> = new Map()

  on<K extends keyof Events>(event: K, callback: (data: Events[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback as (data: unknown) => void)

    return () => this.off(event, callback)
  }

  off<K extends keyof Events>(event: K, callback: (data: Events[K]) => void): void {
    this.listeners.get(event)?.delete(callback as (data: unknown) => void)
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event)?.forEach((callback) => callback(data))
  }

  once<K extends keyof Events>(event: K, callback: (data: Events[K]) => void): () => void {
    const wrapper = (data: Events[K]) => {
      this.off(event, wrapper)
      callback(data)
    }
    return this.on(event, wrapper)
  }
}

/**
 * 状态机配置
 */
export interface StateMachineConfig<S extends string, E extends string> {
  initial: S
  states: {
    [K in S]: {
      on?: { [Key in E]?: S }
      enter?: () => void
      exit?: () => void
    }
  }
}

/**
 * 状态机
 */
export class StateMachine<S extends string, E extends string> {
  private current: S
  private config: StateMachineConfig<S, E>
  private listeners: Set<(state: S, prevState: S) => void> = new Set()

  constructor(config: StateMachineConfig<S, E>) {
    this.config = config
    this.current = config.initial
    this.config.states[this.current]?.enter?.()
  }

  get state(): S {
    return this.current
  }

  can(event: E): boolean {
    const stateConfig = this.config.states[this.current]
    return stateConfig?.on?.[event] !== undefined
  }

  transition(event: E): boolean {
    const stateConfig = this.config.states[this.current]
    const nextState = stateConfig?.on?.[event]

    if (nextState === undefined) return false

    const prevState = this.current

    // Exit current state
    stateConfig?.exit?.()

    // Update state
    this.current = nextState

    // Enter new state
    this.config.states[nextState]?.enter?.()

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.current, prevState))

    return true
  }

  onTransition(callback: (state: S, prevState: S) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  is(state: S): boolean {
    return this.current === state
  }
}

/**
 * 策略模式
 */
export class Strategy<T extends Record<string, (...args: unknown[]) => unknown>> {
  private strategies: T
  private current: keyof T

  constructor(strategies: T, initial: keyof T) {
    this.strategies = strategies
    this.current = initial
  }

  use(name: keyof T): void {
    if (!(name in this.strategies)) {
      throw new Error(`Strategy "${String(name)}" not found`)
    }
    this.current = name
  }

  execute(...args: Parameters<T[keyof T]>): ReturnType<T[keyof T]> {
    return this.strategies[this.current](...args) as ReturnType<T[keyof T]>
  }

  get currentStrategy(): keyof T {
    return this.current
  }
}

/**
 * 命令接口
 */
export interface ICommand {
  execute(): void
  undo(): void
}

/**
 * 命令历史管理器
 */
export class CommandHistory {
  private history: ICommand[] = []
  private position: number = -1

  execute(command: ICommand): void {
    // 移除当前位置之后的历史
    this.history = this.history.slice(0, this.position + 1)

    command.execute()
    this.history.push(command)
    this.position++
  }

  undo(): boolean {
    if (this.position < 0) return false

    this.history[this.position].undo()
    this.position--
    return true
  }

  redo(): boolean {
    if (this.position >= this.history.length - 1) return false

    this.position++
    this.history[this.position].execute()
    return true
  }

  canUndo(): boolean {
    return this.position >= 0
  }

  canRedo(): boolean {
    return this.position < this.history.length - 1
  }

  clear(): void {
    this.history = []
    this.position = -1
  }
}

/**
 * 职责链
 */
export class Chain<T> {
  private handlers: ((data: T, next: () => void) => void)[] = []

  use(handler: (data: T, next: () => void) => void): this {
    this.handlers.push(handler)
    return this
  }

  execute(data: T): void {
    let index = 0

    const next = () => {
      if (index < this.handlers.length) {
        const handler = this.handlers[index++]
        handler(data, next)
      }
    }

    next()
  }
}

/**
 * 中介者
 */
export class Mediator<Events extends Record<string, unknown>> {
  private handlers: Map<keyof Events, Set<(data: unknown) => void>> = new Map()

  register<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as (data: unknown) => void)

    return () => this.handlers.get(event)?.delete(handler as (data: unknown) => void)
  }

  send<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers.get(event)?.forEach((handler) => handler(data))
  }
}
