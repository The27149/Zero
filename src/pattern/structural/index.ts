/**
 * Zero Pattern - Structural
 * 结构型模式
 */

/**
 * 适配器
 */
export function createAdapter<Source, Target>(
  source: Source,
  adapter: (source: Source) => Target
): Target {
  return adapter(source)
}

/**
 * 装饰器工厂
 */
export function Decorator<T extends object>(
  target: T,
  decorator: (target: T) => Partial<T>
): T {
  return { ...target, ...decorator(target) }
}

/**
 * 代理工厂
 */
export function createProxy<T extends object>(
  target: T,
  handler: ProxyHandler<T>
): T {
  return new Proxy(target, handler)
}

/**
 * 懒加载代理
 */
export function LazyProxy<T extends object>(factory: () => T): T {
  let instance: T | null = null

  return new Proxy({} as T, {
    get(_, prop) {
      if (!instance) instance = factory()
      return Reflect.get(instance, prop)
    },
    set(_, prop, value) {
      if (!instance) instance = factory()
      return Reflect.set(instance, prop, value)
    },
  })
}

/**
 * 外观模式
 */
export class Facade<T extends Record<string, object>> {
  private subsystems: T

  constructor(subsystems: T) {
    this.subsystems = subsystems
  }

  get<K extends keyof T>(name: K): T[K] {
    return this.subsystems[name]
  }

  execute<K extends keyof T, M extends keyof T[K]>(
    subsystem: K,
    method: M,
    ...args: T[K][M] extends (...args: infer A) => unknown ? A : never
  ): T[K][M] extends (...args: unknown[]) => infer R ? R : never {
    const sys = this.subsystems[subsystem]
    const fn = sys[method]
    if (typeof fn === 'function') {
      return fn.apply(sys, args)
    }
    throw new Error(`Method ${String(method)} not found in ${String(subsystem)}`)
  }
}

/**
 * 组合模式 - 组件基类
 */
export abstract class Component<T> {
  abstract operation(): T
}

/**
 * 组合模式 - 叶子节点
 */
export class Leaf<T> extends Component<T> {
  constructor(private value: T) {
    super()
  }

  operation(): T {
    return this.value
  }
}

/**
 * 组合模式 - 组合节点
 */
export class Composite<T> extends Component<T[]> {
  private children: Component<T>[] = []

  add(component: Component<T>): void {
    this.children.push(component)
  }

  remove(component: Component<T>): void {
    const index = this.children.indexOf(component)
    if (index !== -1) {
      this.children.splice(index, 1)
    }
  }

  operation(): T[] {
    return this.children.map((child) => child.operation())
  }
}

/**
 * 享元工厂
 */
export class FlyweightFactory<K, V> {
  private flyweights: Map<K, V> = new Map()

  constructor(private factory: (key: K) => V) {}

  get(key: K): V {
    if (!this.flyweights.has(key)) {
      this.flyweights.set(key, this.factory(key))
    }
    return this.flyweights.get(key)!
  }

  has(key: K): boolean {
    return this.flyweights.has(key)
  }

  clear(): void {
    this.flyweights.clear()
  }

  get size(): number {
    return this.flyweights.size
  }
}

/**
 * 桥接模式
 */
export abstract class Bridge<I> {
  protected implementation: I

  constructor(implementation: I) {
    this.implementation = implementation
  }

  setImplementation(implementation: I): void {
    this.implementation = implementation
  }
}
