/**
 * Zero Core - TypeCheck
 * 类型判断工具类
 */

export class TypeCheck {
  private static readonly _toString = Object.prototype.toString

  /**
   * 获取值的类型标签
   */
  static getTag(value: unknown): string {
    return this._toString.call(value)
  }

  /**
   * 判断是否为数组
   */
  static isArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
  }

  /**
   * 判断是否为对象 (非 null)
   */
  static isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object'
  }

  /**
   * 判断是否为纯对象 (由 Object 构造函数创建或原型为 null)
   */
  static isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!this.isObject(value)) return false
    const proto = Object.getPrototypeOf(value)
    return proto === null || proto === Object.prototype
  }

  /**
   * 判断是否为字符串
   */
  static isString(value: unknown): value is string {
    return typeof value === 'string'
  }

  /**
   * 判断是否为数字
   */
  static isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value)
  }

  /**
   * 判断是否为布尔值
   */
  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }

  /**
   * 判断是否为函数
   */
  static isFunction(value: unknown): value is (...args: unknown[]) => unknown {
    return typeof value === 'function'
  }

  /**
   * 判断是否为 Symbol
   */
  static isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
  }

  /**
   * 判断是否为 undefined
   */
  static isUndefined(value: unknown): value is undefined {
    return value === undefined
  }

  /**
   * 判断是否为 null
   */
  static isNull(value: unknown): value is null {
    return value === null
  }

  /**
   * 判断是否为 null 或 undefined
   */
  static isNil(value: unknown): value is null | undefined {
    return value == null
  }

  /**
   * 判断是否为 NaN
   */
  static isNaN(value: unknown): boolean {
    return Number.isNaN(value)
  }

  /**
   * 判断是否为有限数字
   */
  static isFinite(value: unknown): value is number {
    return Number.isFinite(value)
  }

  /**
   * 判断是否为整数
   */
  static isInteger(value: unknown): value is number {
    return Number.isInteger(value)
  }

  /**
   * 判断是否为 Promise
   */
  static isPromise<T = unknown>(value: unknown): value is Promise<T> {
    return value instanceof Promise || (
      this.isObject(value) &&
      this.isFunction((value as { then?: unknown }).then) &&
      this.isFunction((value as { catch?: unknown }).catch)
    )
  }

  /**
   * 判断是否为 Date
   */
  static isDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime())
  }

  /**
   * 判断是否为 RegExp
   */
  static isRegExp(value: unknown): value is RegExp {
    return value instanceof RegExp
  }

  /**
   * 判断是否为 Error
   */
  static isError(value: unknown): value is Error {
    return value instanceof Error
  }

  /**
   * 判断是否为 Map
   */
  static isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V> {
    return value instanceof Map
  }

  /**
   * 判断是否为 Set
   */
  static isSet<T = unknown>(value: unknown): value is Set<T> {
    return value instanceof Set
  }

  /**
   * 判断是否为 WeakMap
   */
  static isWeakMap<K extends object = object, V = unknown>(
    value: unknown
  ): value is WeakMap<K, V> {
    return value instanceof WeakMap
  }

  /**
   * 判断是否为 WeakSet
   */
  static isWeakSet<T extends object = object>(value: unknown): value is WeakSet<T> {
    return value instanceof WeakSet
  }

  /**
   * 判断是否为空值 (null, undefined, 空字符串, 空数组, 空对象)
   */
  static isEmpty(value: unknown): boolean {
    if (this.isNil(value)) return true
    if (this.isString(value) || this.isArray(value)) return value.length === 0
    if (this.isMap(value) || this.isSet(value)) return value.size === 0
    if (this.isPlainObject(value)) return Object.keys(value).length === 0
    return false
  }

  /**
   * 判断两个值是否相等 (深度比较)
   */
  static isEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true
    if (typeof a !== typeof b) return false
    if (a === null || b === null) return false

    if (this.isDate(a) && this.isDate(b)) {
      return a.getTime() === b.getTime()
    }

    if (this.isRegExp(a) && this.isRegExp(b)) {
      return a.toString() === b.toString()
    }

    if (this.isArray(a) && this.isArray(b)) {
      if (a.length !== b.length) return false
      return a.every((item, index) => this.isEqual(item, b[index]))
    }

    if (this.isPlainObject(a) && this.isPlainObject(b)) {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)
      if (keysA.length !== keysB.length) return false
      return keysA.every((key) => this.isEqual(a[key], b[key]))
    }

    if (this.isMap(a) && this.isMap(b)) {
      if (a.size !== b.size) return false
      for (const [key, value] of a) {
        if (!b.has(key) || !this.isEqual(value, b.get(key))) return false
      }
      return true
    }

    if (this.isSet(a) && this.isSet(b)) {
      if (a.size !== b.size) return false
      for (const value of a) {
        if (!b.has(value)) return false
      }
      return true
    }

    return false
  }

  /**
   * 判断是否为原始类型
   */
  static isPrimitive(value: unknown): value is string | number | boolean | symbol | null | undefined | bigint {
    return value === null || (typeof value !== 'object' && typeof value !== 'function')
  }

  /**
   * 判断是否为类数组
   */
  static isArrayLike(value: unknown): value is ArrayLike<unknown> {
    if (this.isNil(value) || this.isFunction(value)) return false
    const length = (value as { length?: unknown }).length
    return this.isNumber(length) && length >= 0 && Number.isInteger(length)
  }
}