/**
 * Zero Core - ArrayUtils
 * 数组处理工具类
 */


export class ArrayUtils {

  // #region 转换

  /**
   * 转为真正的数组
   * @returns 新数组
   */
  static toArray<T>(value: Iterable<T> | ArrayLike<T>): T[] {
    return Array.from(value)
  }

  /**
   * 将数组转为对象
   * @returns 新对象
   */
  static toObject<T, K extends string | number | symbol, V>(
    arr: T[],
    keyFn: (item: T) => K,
    valueFn?: (item: T) => V
  ): Record<K, V> {
    return arr.reduce((result, item) => {
      result[keyFn(item)] = (valueFn ? valueFn(item) : item) as V
      return result
    }, {} as Record<K, V>)
  }

  // #endregion

  // #region 去重与集合

  /**
   * 数组去重
   * @returns 新数组
   */
  static unique<T>(arr: T[]): T[] {
    return [...new Set(arr)]
  }

  /**
   * 按条件去重
   * @returns 新数组
   */
  static uniqueBy<T, K>(arr: T[], fn: (item: T) => K): T[] {
    const seen = new Set<K>()
    return arr.filter((item) => {
      const key = fn(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  /**
   * 数组并集
   * @returns 新数组
   */
  static union<T>(...arrays: T[][]): T[] {
    return [...new Set(arrays.flat())]
  }

  /**
   * 数组交集
   * @returns 新数组
   */
  static intersection<T>(...arrays: T[][]): T[] {
    if (arrays.length === 0) return []
    if (arrays.length === 1) return [...arrays[0]]

    const [first, ...rest] = arrays
    const sets = rest.map((arr) => new Set(arr))
    return first.filter((item) => sets.every((set) => set.has(item)))
  }

  /**
   * 数组差集
   * @returns 新数组
   */
  static difference<T>(arr: T[], ...others: T[][]): T[] {
    const combined = new Set(others.flat())
    return arr.filter((item) => !combined.has(item))
  }

  /**
   * 按条件差集
   * @returns 新数组
   */
  static differenceBy<T, K>(arr: T[], other: T[], fn: (item: T) => K): T[] {
    const otherSet = new Set(other.map(fn))
    return arr.filter((item) => !otherSet.has(fn(item)))
  }

  // #endregion

  // #region 分组统计

  /**
   * 按条件分组
   * @example
   * ArrayUtils.groupBy([1, 2, 3, 4, 5], n => n % 2) // { '0': [2, 4], '1': [1, 3, 5] }
   * @returns 新对象
   */
  static groupBy<T, K extends string | number | symbol>(
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
   * 按条件映射
   * @example
   * ArrayUtils.keyBy(['a', 'b', 'c'], s => s.toUpperCase()) // { 'A': 'a', 'B': 'b', 'C': 'c' }
   * @returns 新对象
   */
  static keyBy<T, K extends string | number | symbol>(
    arr: T[],
    fn: (item: T) => K
  ): Record<K, T> {
    return arr.reduce((result, item) => {
      result[fn(item)] = item
      return result
    }, {} as Record<K, T>)
  }

  /**
   * 按条件计数
   * @example
   * ArrayUtils.countBy(['a', 'b', 'a', 'c', 'b', 'a'], x => x) // { 'a': 3, 'b': 2, 'c': 1 }
   * @returns 新对象
   */
  static countBy<T, K extends string | number | symbol>(
    arr: T[],
    fn: (item: T) => K
  ): Record<K, number> {
    return arr.reduce((result, item) => {
      const key = fn(item)
      result[key] = (result[key] || 0) + 1
      return result
    }, {} as Record<K, number>)
  }

  // #endregion

  // #region 获取元素

  /**
   * 获取最后一个元素
   * @returns 元素值或 undefined
   */
  static last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1]
  }

  /**
   * 获取第 n 个元素 (支持负索引)
   * @returns 元素值或 undefined
   */
  static nth<T>(arr: T[], n: number): T | undefined {
    const index = n < 0 ? arr.length + n : n
    return arr[index]
  }

  /**
   * 取前 n 个元素
   * @returns 新数组
   */
  static take<T>(arr: T[], n: number = 1): T[] {
    return arr.slice(0, n)
  }

  /**
   * 取后 n 个元素
   * @returns 新数组
   */
  static takeRight<T>(arr: T[], n: number = 1): T[] {
    return arr.slice(Math.max(arr.length - n, 0))
  }

  /**
   * 丢弃前 n 个元素
   * @returns 新数组
   */
  static drop<T>(arr: T[], n: number = 1): T[] {
    return arr.slice(n)
  }

  /**
   * 丢弃后 n 个元素
   * @returns 新数组
   */
  static dropRight<T>(arr: T[], n: number = 1): T[] {
    return arr.slice(0, Math.max(arr.length - n, 0))
  }

  // #endregion

  // #region 增删改

  /**
   * 移除假值 (false, null, 0, '', undefined, NaN)
   * @returns 新数组
   */
  static clear<T>(arr: (T | null | undefined | false | '' | 0)[]): T[] {
    return arr.filter(Boolean) as T[]
  }

  /**
   * 移除指定元素
   * @param arr - 源数组
   * @param item - 要移除的元素
   * @param mutate - 是否修改原数组，默认 false 返回新数组
   * @returns 根据 mutate 参数返回新数组或修改后的原数组
   */
  static remove<T>(arr: T[], item: T, mutate: boolean = false): T[] {
    if (mutate) {
      const index = arr.indexOf(item)
      if (index !== -1) arr.splice(index, 1)
      return arr
    }
    return arr.filter((i) => i !== item)
  }

  /**
   * 按条件移除元素
   * @param arr - 源数组
   * @param predicate - 判断条件
   * @param mutate - 是否修改原数组，默认 false 返回新数组
   * @returns 根据 mutate 参数返回新数组或修改后的原数组
   */
  static removeBy<T>(arr: T[], predicate: (item: T) => boolean, mutate: boolean = false): T[] {
    if (mutate) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
          arr.splice(i, 1)
        }
      }
      return arr
    }
    return arr.filter((item) => !predicate(item))
  }

  /**
   * 交换两个元素位置
   * @param arr - 源数组
   * @param i - 第一个索引
   * @param j - 第二个索引
   * @param mutate - 是否修改原数组，默认 false 返回新数组
   * @returns 根据 mutate 参数返回新数组或修改后的原数组
   */
  static swap<T>(arr: T[], i: number, j: number, mutate: boolean = false): T[] {
    if (mutate) {
      [arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    }
    const result = [...arr];
    [result[i], result[j]] = [result[j], result[i]]
    return result
  }

  /**
   * 移动元素
   * @example
   * ArrayUtils.move([1, 2, 3, 4], 1, 3) // [1, 3, 4, 2]
   * @param arr - 源数组
   * @param from - 源位置
   * @param to - 目标位置
   * @param mutate - 是否修改原数组，默认 false 返回新数组
   * @returns 根据 mutate 参数返回新数组或修改后的原数组
   */
  static move<T>(arr: T[], from: number, to: number, mutate: boolean = false): T[] {
    if (mutate) {
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    }
    const result = [...arr]
    const [item] = result.splice(from, 1)
    result.splice(to, 0, item)
    return result
  }

  // #endregion

  // #region 随机

  /**
   * 打乱数组 (Fisher-Yates)
   * @param arr - 源数组
   * @param mutate - 是否修改原数组，默认 false 返回新数组
   * @returns 根据 mutate 参数返回新数组或修改后的原数组
   */
  static shuffle<T>(arr: T[], mutate: boolean = false): T[] {
    if (mutate) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  /**
   * 随机取样
   * @returns 新数组
   */
  static randomSome<T>(arr: T[], count: number = 1): T[] {
    return this.shuffle(arr).slice(0, count)
  }

  /**
   * 随机取一个元素
   * @returns 元素值或 undefined
   */
  static randomOne<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined
    return arr[Math.floor(Math.random() * arr.length)]
  }

  /**
   * 加权随机选择一个元素
   */
  static randomOneByWeight<T>(items: T[], weights: number[]): T | undefined {
    if (items.length === 0 || items.length !== weights.length) return undefined

    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < items.length; i++) {
      random -= weights[i]
      if (random <= 0) return items[i]
    }

    return items[items.length - 1]
  }

  // #endregion

  // #region 结构变换

  /**
   * 数组按数量分块
   * @returns 新的二维数组
   */
  static chunk<T>(arr: T[], size: number): T[][] {
    if (size <= 0) return []
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  /**
   * 扁平化数组
   * @param arr - 要扁平化的数组
   * @param depth - 扁平化深度，默认为 1，传 -1 实现深度扁平化
   * @returns 新数组
   */
  static flatten<T>(arr: unknown[], depth: number = 1): T[] {
    if (depth < 0) return arr.flat(Infinity) as T[];
    else return arr.flat(depth) as T[]
  }

  /**
   * 生成数字范围数组
   * @example
   * ArrayUtils.range(5)        // [0, 1, 2, 3, 4]
   * ArrayUtils.range(1, 5)     // [1, 2, 3, 4]
   * ArrayUtils.range(0, 10, 2) // [0, 2, 4, 6, 8]
   * @returns 新数组
   */
  static range(start: number, end?: number, step: number = 1): number[] {
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
   * 数组 zip （转置）
   * [1,2,3]，['a','b','c']，[true,false,true] ->
   * [
      [1, 'a', true],
      [2, 'b', false],
      [3, 'c', true]
    ]
   * @returns 新的二维数组
   */
  static zip<T>(...arrays: T[][]): T[][] {
    const maxLength = Math.max(...arrays.map((arr) => arr.length))
    return this.range(maxLength).map((i) => arrays.map((arr) => arr[i]))
  }

  /**
   * 数组 unzip
   * @returns 新的二维数组
   */
  static unzip<T>(arr: T[][]): T[][] {
    return this.zip(...arr)
  }

  /**
   * 分区
   * @example
   * ArrayUtils.partition([1, 2, 3, 4, 5], n => n % 2 === 0) // [[2, 4], [1, 3, 5]]
   * @returns 包含两个数组的元组 [满足条件的数组, 不满足条件的数组]
   */
  static partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const truthy: T[] = []
    const falsy: T[] = []
    arr.forEach((item) => {
      if (predicate(item)) truthy.push(item)
      else falsy.push(item)
    })
    return [truthy, falsy]
  }

  // #endregion

}