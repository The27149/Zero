/**
 * Zero Utils - Type Checking
 * 类型判断工具
 */

const toString = Object.prototype.toString

/**
 * 获取值的类型标签
 */
export function getTag(value: unknown): string {
  return toString.call(value)
}

/**
 * 判断是否为数组
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * 判断是否为对象 (非 null)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

/**
 * 判断是否为纯对象 (由 Object 构造函数创建或原型为 null)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}

/**
 * 判断是否为字符串
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * 判断是否为数字
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * 判断是否为布尔值
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * 判断是否为函数
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

/**
 * 判断是否为 Symbol
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

/**
 * 判断是否为 undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * 判断是否为 null
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * 判断是否为 null 或 undefined
 */
export function isNil(value: unknown): value is null | undefined {
  return value == null
}

/**
 * 判断是否为 NaN
 */
export function isNaN(value: unknown): boolean {
  return Number.isNaN(value)
}

/**
 * 判断是否为有限数字
 */
export function isFinite(value: unknown): value is number {
  return Number.isFinite(value)
}

/**
 * 判断是否为整数
 */
export function isInteger(value: unknown): value is number {
  return Number.isInteger(value)
}

/**
 * 判断是否为 Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (
    isObject(value) &&
    isFunction((value as { then?: unknown }).then) &&
    isFunction((value as { catch?: unknown }).catch)
  )
}

/**
 * 判断是否为 Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * 判断是否为 RegExp
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp
}

/**
 * 判断是否为 Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * 判断是否为 Map
 */
export function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V> {
  return value instanceof Map
}

/**
 * 判断是否为 Set
 */
export function isSet<T = unknown>(value: unknown): value is Set<T> {
  return value instanceof Set
}

/**
 * 判断是否为 WeakMap
 */
export function isWeakMap<K extends object = object, V = unknown>(
  value: unknown
): value is WeakMap<K, V> {
  return value instanceof WeakMap
}

/**
 * 判断是否为 WeakSet
 */
export function isWeakSet<T extends object = object>(value: unknown): value is WeakSet<T> {
  return value instanceof WeakSet
}

/**
 * 判断是否为空值 (null, undefined, 空字符串, 空数组, 空对象)
 */
export function isEmpty(value: unknown): boolean {
  if (isNil(value)) return true
  if (isString(value) || isArray(value)) return value.length === 0
  if (isMap(value) || isSet(value)) return value.size === 0
  if (isPlainObject(value)) return Object.keys(value).length === 0
  return false
}

/**
 * 判断两个值是否相等 (深度比较)
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return false

  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime()
  }

  if (isRegExp(a) && isRegExp(b)) {
    return a.toString() === b.toString()
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => isEqual(item, b[index]))
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every((key) => isEqual(a[key], b[key]))
  }

  if (isMap(a) && isMap(b)) {
    if (a.size !== b.size) return false
    for (const [key, value] of a) {
      if (!b.has(key) || !isEqual(value, b.get(key))) return false
    }
    return true
  }

  if (isSet(a) && isSet(b)) {
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
export function isPrimitive(value: unknown): value is string | number | boolean | symbol | null | undefined | bigint {
  return value === null || (typeof value !== 'object' && typeof value !== 'function')
}

/**
 * 判断是否为类数组
 */
export function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  if (isNil(value) || isFunction(value)) return false
  const length = (value as { length?: unknown }).length
  return isNumber(length) && length >= 0 && Number.isInteger(length)
}
