/**
 * Zero Core - FunctionUtils
 * 函数处理工具类
 */


export class FunctionUtils {

  // #region 执行控制

  /**
   * 防抖
   * @param fn - 要防抖的函数
   * @param wait - 等待时间（毫秒）
   * @returns 防抖后的函数，带 cancel 方法
   */
  static debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    wait: number
  ): T & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const debounced = function (this: unknown, ...args: Parameters<T>) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => fn.apply(this, args), wait)
    } as T & { cancel: () => void }

    debounced.cancel = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
    }

    return debounced
  }

  /**
   * 节流
   * @param fn - 要节流的函数
   * @param wait - 等待时间（毫秒）
   * @returns 节流后的函数，带 cancel 方法
   */
  static throttle<T extends (...args: unknown[]) => unknown>(
    fn: T,
    wait: number
  ): T & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let lastTime = 0

    const throttled = function (this: unknown, ...args: Parameters<T>) {
      const now = Date.now()
      const remaining = wait - (now - lastTime)

      if (remaining <= 0) {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId)
          timeoutId = undefined
        }
        lastTime = now
        fn.apply(this, args)
      } else if (timeoutId === undefined) {
        timeoutId = setTimeout(() => {
          lastTime = Date.now()
          timeoutId = undefined
          fn.apply(this, args)
        }, remaining)
      }
    } as T & { cancel: () => void }

    throttled.cancel = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
    }

    return throttled
  }

  /**
   * 只执行一次
   */
  static once<T extends (...args: unknown[]) => unknown>(fn: T): T {
    let called = false
    let result: ReturnType<T>

    return function (this: unknown, ...args: Parameters<T>) {
      if (!called) {
        called = true
        result = fn.apply(this, args) as ReturnType<T>
      }
      return result
    } as T
  }

  /**
   * 缓存函数结果
   * @example
   * const fibonacci = FunctionUtils.memoize((n: number): number => {
   *   if (n <= 1) return n
   *   return fibonacci(n - 1) + fibonacci(n - 2)
   * })
   * fibonacci(10) // 55 (只计算一次，后续从缓存读取)
   */
  static memoize<T extends (...args: unknown[]) => unknown>(
    fn: T,
    resolver?: (...args: Parameters<T>) => unknown
  ): T & { cache: Map<unknown, ReturnType<T>> } {
    const cache = new Map<unknown, ReturnType<T>>()

    const memoized = function (this: unknown, ...args: Parameters<T>) {
      const key = resolver ? resolver(...args) : args[0]

      if (cache.has(key)) {
        return cache.get(key)!
      }

      const result = fn.apply(this, args) as ReturnType<T>
      cache.set(key, result)
      return result
    } as T & { cache: Map<unknown, ReturnType<T>> }

    memoized.cache = cache

    return memoized
  }

  // #endregion

  // #region 函数组合

  /**
   * 柯里化
   * @example
   * const add = (a: number, b: number, c: number) => a + b + c
   * const curriedAdd = FunctionUtils.curry(add)
   * curriedAdd(1)(2)(3)           // 6
   * curriedAdd(1, 2)(3)           // 6
   * curriedAdd(1)(2, 3)           // 6
   * const add5 = curriedAdd(2, 3) // 创建 add5(x) = x + 2 + 3
   * add5(5)                       // 10
   */
  static curry<T extends (...args: unknown[]) => unknown>(fn: T, arityCount?: number): unknown {
    const arity = arityCount || fn.length;

    return function curried(...args: unknown[]): unknown {
      if (args.length >= arity) {
        return fn(...args)
      }
      return (...moreArgs: unknown[]) => curried(...args, ...moreArgs)
    }
  }

  /**
   * 组合函数 (从右到左)
   * compose(f, g, h)(x) 等价于 f(g(h(x)))
   */
  static compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
    return (arg: T) => fns.reduceRight((result, fn) => fn(result), arg)
  }

  /**
   * 管道函数 (从左到右)
   * pipe(f, g, h)(x) 等价于 h(g(f(x)))
   */
  static pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
    return (arg: T) => fns.reduce((result, fn) => fn(result), arg)
  }

  /**
   * 取反函数，方便直接包装原函数
   */
  static negate<T extends (...args: unknown[]) => boolean>(fn: T): T {
    return function (this: unknown, ...args: Parameters<T>) {
      return !fn.apply(this, args)
    } as T
  }

  // #endregion

  // #region 异步控制

  /**
   * 延迟执行
   */
  static delay<T extends (...args: unknown[]) => unknown>(
    fn: T,
    wait: number,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn(...args) as ReturnType<T>)
      }, wait)
    })
  }

  /**
   * 睡眠
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 重试执行
   */
  static async retry<T>(
    fn: () => T | Promise<T>,
    options: { times?: number; delay?: number; onError?: (error: Error, attempt: number) => void } = {}
  ): Promise<T> {
    const { times = 3, delay: delayMs = 0, onError } = options
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= times; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        onError?.(lastError, attempt)
        if (attempt < times && delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
    }

    throw lastError
  }

  /**
   * 超时包装
   */
  static timeout<T>(
    fn: () => Promise<T>,
    ms: number,
    errorMessage: string = 'Operation timed out'
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), ms)
      ),
    ])
  }

  // #endregion

  // #region 执行次数控制

  /**
   * 限制执行次数
   */
  static before<T extends (...args: unknown[]) => unknown>(n: number, fn: T): T {
    let count = 0
    let result: ReturnType<T>

    return function (this: unknown, ...args: Parameters<T>) {
      if (count < n) {
        count++
        result = fn.apply(this, args) as ReturnType<T>
      }
      return result
    } as T
  }

  /**
   * 在第 n 次后开始执行
   */
  static after<T extends (...args: unknown[]) => unknown>(n: number, fn: T): T {
    let count = 0

    return function (this: unknown, ...args: Parameters<T>) {
      count++
      if (count >= n) {
        return fn.apply(this, args)
      }
      return null;
    } as T
  }

  // #endregion

}