/**
 * Zero Core - ObjectHandler
 * 对象处理工具类
 */

import { TypeCheck } from './TypeCheck'

export class ObjectHandler {
  /**
   * 深拷贝
   */
  static deepClone<T>(value: T): T {
    if (TypeCheck.isNil(value) || typeof value !== 'object') {
      return value
    }

    if (value instanceof Date) {
      return new Date(value.getTime()) as T
    }

    if (value instanceof RegExp) {
      return new RegExp(value.source, value.flags) as T
    }

    if (value instanceof Map) {
      const result = new Map()
      value.forEach((v, k) => result.set(this.deepClone(k), this.deepClone(v)))
      return result as T
    }

    if (value instanceof Set) {
      const result = new Set()
      value.forEach((v) => result.add(this.deepClone(v)))
      return result as T
    }

    if (TypeCheck.isArray(value)) {
      return value.map((item) => this.deepClone(item)) as T
    }

    if (TypeCheck.isPlainObject(value)) {
      const result: Record<string, unknown> = {}
      for (const key of Object.keys(value)) {
        result[key] = this.deepClone((value as Record<string, unknown>)[key])
      }
      return result as T
    }

    return value
  }

  /**
   * 浅合并对象
   */
  static assign<T extends object, S extends object[]>(target: T, ...sources: S): T & S[number] {
    return Object.assign(target, ...sources)
  }

  /**
   * 深合并对象
   */
  static merge<T extends Record<string, unknown>>(...objects: Partial<T>[]): T {
    const result: Record<string, unknown> = {}

    for (const obj of objects) {
      if (!obj) continue

      for (const key of Object.keys(obj)) {
        const targetVal = result[key]
        const sourceVal = obj[key]

        if (TypeCheck.isPlainObject(targetVal) && TypeCheck.isPlainObject(sourceVal)) {
          result[key] = this.merge(targetVal as Record<string, unknown>, sourceVal as Record<string, unknown>)
        } else if (TypeCheck.isArray(targetVal) && TypeCheck.isArray(sourceVal)) {
          result[key] = [...targetVal, ...sourceVal]
        } else {
          result[key] = sourceVal
        }
      }
    }

    return result as T
  }

  /**
   * 选取指定键
   */
  static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key]
      }
    }
    return result
  }

  /**
   * 排除指定键
   */
  static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj }
    for (const key of keys) {
      delete result[key]
    }
    return result
  }

  /**
   * 按条件选取
   */
  static pickBy<T extends object>(
    obj: T,
    predicate: (value: T[keyof T], key: keyof T) => boolean
  ): Partial<T> {
    const result: Partial<T> = {}
    for (const key of Object.keys(obj) as (keyof T)[]) {
      if (predicate(obj[key], key)) {
        result[key] = obj[key]
      }
    }
    return result
  }

  /**
   * 按条件排除
   */
  static omitBy<T extends object>(
    obj: T,
    predicate: (value: T[keyof T], key: keyof T) => boolean
  ): Partial<T> {
    return this.pickBy(obj, (value, key) => !predicate(value, key))
  }

  /**
   * 获取嵌套属性
   */
  static get<T = unknown>(
    obj: unknown,
    path: string | (string | number)[],
    defaultValue?: T
  ): T | undefined {
    const keys = TypeCheck.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.')
    let result: unknown = obj

    for (const key of keys) {
      if (TypeCheck.isNil(result)) return defaultValue
      result = (result as Record<string | number, unknown>)[key]
    }

    return (result === undefined ? defaultValue : result) as T
  }

  /**
   * 设置嵌套属性
   */
  static set<T extends object>(
    obj: T,
    path: string | (string | number)[],
    value: unknown
  ): T {
    const keys = TypeCheck.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.')
    const result = this.deepClone(obj)
    let current: unknown = result

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const next = (current as Record<string | number, unknown>)[key]

      if (TypeCheck.isNil(next)) {
        const nextKey = keys[i + 1]
        ;(current as Record<string | number, unknown>)[key] =
          typeof nextKey === 'number' || /^\d+$/.test(String(nextKey)) ? [] : {}
      }

      current = (current as Record<string | number, unknown>)[key]
    }

    ;(current as Record<string | number, unknown>)[keys[keys.length - 1]] = value
    return result
  }

  /**
   * 检查嵌套属性是否存在
   */
  static has(obj: unknown, path: string | (string | number)[]): boolean {
    const keys = TypeCheck.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.')
    let current: unknown = obj

    for (const key of keys) {
      if (TypeCheck.isNil(current) || !(key in (current as object))) return false
      current = (current as Record<string | number, unknown>)[key]
    }

    return true
  }

  /**
   * 删除嵌套属性
   */
  static unset<T extends object>(obj: T, path: string | (string | number)[]): T {
    const keys = TypeCheck.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.')
    const result = this.deepClone(obj)
    let current: unknown = result

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      current = (current as Record<string | number, unknown>)[key]
      if (TypeCheck.isNil(current)) return result
    }

    delete (current as Record<string | number, unknown>)[keys[keys.length - 1]]
    return result
  }

  /**
   * 对象扁平化
   */
  static flatten(
    obj: Record<string, unknown>,
    prefix: string = '',
    delimiter: string = '.'
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const key of Object.keys(obj)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key

      if (TypeCheck.isPlainObject(value)) {
        Object.assign(result, this.flatten(value as Record<string, unknown>, newKey, delimiter))
      } else if (TypeCheck.isArray(value)) {
        value.forEach((item, index) => {
          if (TypeCheck.isPlainObject(item)) {
            Object.assign(result, this.flatten(item as Record<string, unknown>, `${newKey}[${index}]`, delimiter))
          } else {
            result[`${newKey}[${index}]`] = item
          }
        })
      } else {
        result[newKey] = value
      }
    }

    return result
  }

  /**
   * 对象展开 (扁平化的逆操作)
   */
  static unflatten(
    obj: Record<string, unknown>,
    delimiter: string = '.'
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const key of Object.keys(obj)) {
      this.set(result, key.replace(/\[(\d+)]/g, `${delimiter}$1`).split(delimiter), obj[key])
    }

    return result
  }

  /**
   * 获取所有键 (递归)
   */
  static keys(obj: Record<string, unknown>, prefix: string = ''): string[] {
    const result: string[] = []

    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      result.push(fullKey)

      if (TypeCheck.isPlainObject(obj[key])) {
        result.push(...this.keys(obj[key] as Record<string, unknown>, fullKey))
      }
    }

    return result
  }

  /**
   * 获取所有值 (递归)
   */
  static values(obj: Record<string, unknown>): unknown[] {
    const result: unknown[] = []

    for (const value of Object.values(obj)) {
      if (TypeCheck.isPlainObject(value)) {
        result.push(...this.values(value as Record<string, unknown>))
      } else {
        result.push(value)
      }
    }

    return result
  }

  /**
   * 对象映射
   */
  static mapKeys<T extends object>(
    obj: T,
    fn: (key: keyof T, value: T[keyof T]) => string
  ): Record<string, T[keyof T]> {
    const result: Record<string, T[keyof T]> = {}
    for (const key of Object.keys(obj) as (keyof T)[]) {
      result[fn(key, obj[key])] = obj[key]
    }
    return result
  }

  /**
   * 值映射
   */
  static mapValues<T extends object, R>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => R
  ): Record<keyof T, R> {
    const result = {} as Record<keyof T, R>
    for (const key of Object.keys(obj) as (keyof T)[]) {
      result[key] = fn(obj[key], key)
    }
    return result
  }

  /**
   * 对象遍历
   */
  static forEach<T extends object>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => void
  ): void {
    for (const key of Object.keys(obj) as (keyof T)[]) {
      fn(obj[key], key)
    }
  }

  /**
   * 反转键值
   */
  static invert<T extends Record<string, string | number>>(
    obj: T
  ): Record<string, keyof T> {
    const result: Record<string, keyof T> = {}
    for (const key of Object.keys(obj)) {
      result[String(obj[key])] = key
    }
    return result
  }

  /**
   * 默认值填充
   */
  static defaults<T extends object>(obj: Partial<T>, ...sources: Partial<T>[]): T {
    const result = { ...obj }
    for (const source of sources) {
      for (const key of Object.keys(source) as (keyof T)[]) {
        if (result[key] === undefined) {
          result[key] = source[key]
        }
      }
    }
    return result as T
  }
}