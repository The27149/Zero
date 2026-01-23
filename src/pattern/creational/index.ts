/**
 * Zero Pattern - Creational
 * 创建型模式
 */

/**
 * 单例装饰器
 */
export function Singleton<T extends new (...args: unknown[]) => unknown>(
  constructor: T
): T {
  let instance: InstanceType<T> | null = null

  return class extends (constructor as new (...args: unknown[]) => object) {
    constructor(...args: unknown[]) {
      if (instance) return instance
      super(...args)
      instance = this as InstanceType<T>
    }
  } as T
}

/**
 * 单例工具
 */
Singleton.create = <T>(factory: () => T): (() => T) => {
  let instance: T | null = null
  return () => {
    if (instance === null) {
      instance = factory()
    }
    return instance
  }
}

/**
 * 工厂模式
 */
export class Factory<T extends Record<string, () => unknown>> {
  private creators: T

  constructor(creators: T) {
    this.creators = creators
  }

  create<K extends keyof T>(type: K): ReturnType<T[K]> {
    const creator = this.creators[type]
    if (!creator) {
      throw new Error(`Unknown type: ${String(type)}`)
    }
    return creator() as ReturnType<T[K]>
  }

  register<K extends string, V>(type: K, creator: () => V): Factory<T & Record<K, () => V>> {
    return new Factory({ ...this.creators, [type]: creator } as T & Record<K, () => V>)
  }

  static create<T extends Record<string, () => unknown>>(creators: T): Factory<T> {
    return new Factory(creators)
  }
}

/**
 * 建造者模式
 */
export class Builder<T extends object> {
  private obj: Partial<T> = {}

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.obj[key] = value
    return this
  }

  build(): T {
    return this.obj as T
  }

  static create<T extends object>(): Builder<T> {
    return new Builder<T>()
  }
}

/**
 * 原型模式
 */
export function Prototype<T extends object>(proto: T): { clone: () => T } {
  return {
    clone(): T {
      return Object.create(proto)
    },
  }
}

/**
 * 抽象工厂接口
 */
export interface AbstractFactory<Products extends Record<string, unknown>> {
  create<K extends keyof Products>(type: K): Products[K]
}

/**
 * 创建抽象工厂
 */
export function createAbstractFactory<Products extends Record<string, unknown>>(
  factories: { [K in keyof Products]: () => Products[K] }
): AbstractFactory<Products> {
  return {
    create<K extends keyof Products>(type: K): Products[K] {
      return factories[type]()
    },
  }
}
