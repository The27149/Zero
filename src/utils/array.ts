/**
 * Zero Utils - Array
 * 数组工具
 */

import { isArray, isFunction } from './is'

/**
 * 数组去重
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * 按条件去重
 */
export function uniqueBy<T, K>(arr: T[], fn: (item: T) => K): T[] {
  const seen = new Set<K>()
  return arr.filter((item) => {
    const key = fn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * 扁平化数组
 */
export function flatten<T>(arr: unknown[], depth: number = 1): T[] {
  return arr.flat(depth) as T[]
}

/**
 * 深度扁平化
 */
export function flattenDeep<T>(arr: unknown[]): T[] {
  return arr.flat(Infinity) as T[]
}

/**
 * 数组分块
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return []
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/**
 * 移除假值 (false, null, 0, '', undefined, NaN)
 */
export function compact<T>(arr: (T | null | undefined | false | '' | 0)[]): T[] {
  return arr.filter(Boolean) as T[]
}

/**
 * 数组差集
 */
export function difference<T>(arr: T[], ...others: T[][]): T[] {
  const combined = new Set(others.flat())
  return arr.filter((item) => !combined.has(item))
}

/**
 * 按条件差集
 */
export function differenceBy<T, K>(arr: T[], other: T[], fn: (item: T) => K): T[] {
  const otherSet = new Set(other.map(fn))
  return arr.filter((item) => !otherSet.has(fn(item)))
}

/**
 * 数组交集
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return [...arrays[0]]

  const [first, ...rest] = arrays
  const sets = rest.map((arr) => new Set(arr))
  return first.filter((item) => sets.every((set) => set.has(item)))
}

/**
 * 数组并集
 */
export function union<T>(...arrays: T[][]): T[] {
  return [...new Set(arrays.flat())]
}

/**
 * 按键分组
 */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  fn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((result, item) => {
    const key = fn(item)
    if (!result[key]) result[key] = []
    result[key].push(item)
    return result
  }, {} as Record<K, T[]>)
}

/**
 * 按键映射
 */
export function keyBy<T, K extends string | number | symbol>(
  arr: T[],
  fn: (item: T) => K
): Record<K, T> {
  return arr.reduce((result, item) => {
    result[fn(item)] = item
    return result
  }, {} as Record<K, T>)
}

/**
 * 计数
 */
export function countBy<T, K extends string | number | symbol>(
  arr: T[],
  fn: (item: T) => K
): Record<K, number> {
  return arr.reduce((result, item) => {
    const key = fn(item)
    result[key] = (result[key] || 0) + 1
    return result
  }, {} as Record<K, number>)
}

/**
 * 获取第一个元素
 */
export function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

/**
 * 获取最后一个元素
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

/**
 * 获取第 n 个元素 (支持负索引)
 */
export function nth<T>(arr: T[], n: number): T | undefined {
  const index = n < 0 ? arr.length + n : n
  return arr[index]
}

/**
 * 取前 n 个元素
 */
export function take<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(0, n)
}

/**
 * 取后 n 个元素
 */
export function takeRight<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(Math.max(arr.length - n, 0))
}

/**
 * 丢弃前 n 个元素
 */
export function drop<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(n)
}

/**
 * 丢弃后 n 个元素
 */
export function dropRight<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(0, Math.max(arr.length - n, 0))
}

/**
 * 查找元素索引
 */
export function findIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) return i
  }
  return -1
}

/**
 * 从后向前查找索引
 */
export function findLastIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i], i)) return i
  }
  return -1
}

/**
 * 移除指定元素
 */
export function remove<T>(arr: T[], item: T): T[] {
  return arr.filter((i) => i !== item)
}

/**
 * 按条件移除元素
 */
export function removeBy<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter((item) => !predicate(item))
}

/**
 * 在指定位置插入元素
 */
export function insert<T>(arr: T[], index: number, ...items: T[]): T[] {
  const result = [...arr]
  result.splice(index, 0, ...items)
  return result
}

/**
 * 交换两个元素位置
 */
export function swap<T>(arr: T[], i: number, j: number): T[] {
  const result = [...arr]
  ;[result[i], result[j]] = [result[j], result[i]]
  return result
}

/**
 * 移动元素
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

/**
 * 打乱数组 (Fisher-Yates)
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 随机取样
 */
export function sample<T>(arr: T[], count: number = 1): T[] {
  return shuffle(arr).slice(0, count)
}

/**
 * 随机取一个元素
 */
export function sampleOne<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 生成数字范围数组
 */
export function range(start: number, end?: number, step: number = 1): number[] {
  if (end === undefined) {
    end = start
    start = 0
  }
  const result: number[] = []
  if (step > 0) {
    for (let i = start; i < end; i += step) result.push(i)
  } else if (step < 0) {
    for (let i = start; i > end; i += step) result.push(i)
  }
  return result
}

/**
 * 将数组转为对象
 */
export function toObject<T, K extends string | number | symbol, V>(
  arr: T[],
  keyFn: (item: T) => K,
  valueFn?: (item: T) => V
): Record<K, V> {
  return arr.reduce((result, item) => {
    result[keyFn(item)] = (valueFn ? valueFn(item) : item) as V
    return result
  }, {} as Record<K, V>)
}

/**
 * 数组 zip
 */
export function zip<T>(...arrays: T[][]): T[][] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length))
  return range(maxLength).map((i) => arrays.map((arr) => arr[i]))
}

/**
 * 数组 unzip
 */
export function unzip<T>(arr: T[][]): T[][] {
  return zip(...arr)
}

/**
 * 分区
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = []
  const falsy: T[] = []
  arr.forEach((item) => {
    if (predicate(item)) truthy.push(item)
    else falsy.push(item)
  })
  return [truthy, falsy]
}

/**
 * 转为真正的数组
 */
export function toArray<T>(value: Iterable<T> | ArrayLike<T>): T[] {
  return Array.from(value)
}
