/**
 * Zero Utils - Function
 * 函数工具
 */

/**
 * 防抖
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): T & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true, maxWait } = options
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: Parameters<T> | undefined
  let lastThis: unknown
  let result: ReturnType<T>
  let lastCallTime: number | undefined
  let lastInvokeTime = 0

  const invokeFunc = (time: number) => {
    const args = lastArgs!
    const thisArg = lastThis
    lastArgs = undefined
    lastThis = undefined
    lastInvokeTime = time
    result = fn.apply(thisArg, args) as ReturnType<T>
    return result
  }

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = lastCallTime === undefined ? 0 : time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    )
  }

  const timerExpired = () => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    const timeSinceLastCall = time - (lastCallTime ?? 0)
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall
    const remainingWait = maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting

    timeoutId = setTimeout(timerExpired, remainingWait)
  }

  const leadingEdge = (time: number) => {
    lastInvokeTime = time
    timeoutId = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : result
  }

  const trailingEdge = (time: number) => {
    timeoutId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = undefined
    lastThis = undefined
    return result
  }

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    lastInvokeTime = 0
    lastArgs = undefined
    lastCallTime = undefined
    lastThis = undefined
    timeoutId = undefined
  }

  const flush = () => {
    if (timeoutId === undefined) {
      return result
    }
    return trailingEdge(Date.now())
  }

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(time)
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait)
        return invokeFunc(time)
      }
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait)
    }

    return result
  } as T & { cancel: () => void; flush: () => void }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced
}

/**
 * 节流
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  const { leading = true, trailing = true } = options
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: Parameters<T> | undefined
  let lastThis: unknown
  let result: ReturnType<T>
  let lastCallTime = 0

  const invokeFunc = () => {
    const args = lastArgs!
    const thisArg = lastThis
    lastArgs = undefined
    lastThis = undefined
    result = fn.apply(thisArg, args) as ReturnType<T>
    return result
  }

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
    lastCallTime = 0
    lastArgs = undefined
    lastThis = undefined
  }

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - lastCallTime)

    lastArgs = args
    lastThis = this

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      lastCallTime = now
      if (leading || lastCallTime !== 0) {
        result = invokeFunc()
      }
    } else if (timeoutId === undefined && trailing) {
      timeoutId = setTimeout(() => {
        lastCallTime = leading ? Date.now() : 0
        timeoutId = undefined
        result = invokeFunc()
      }, remaining)
    }

    return result
  } as T & { cancel: () => void }

  throttled.cancel = cancel

  return throttled
}

/**
 * 只执行一次
 */
export function once<T extends (...args: unknown[]) => unknown>(fn: T): T {
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
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
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

/**
 * 空函数
 */
export function noop(): void {
  // do nothing
}

/**
 * 返回自身
 */
export function identity<T>(value: T): T {
  return value
}

/**
 * 返回常量
 */
export function constant<T>(value: T): () => T {
  return () => value
}

/**
 * 延迟执行
 */
export function delay<T extends (...args: unknown[]) => unknown>(
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
 * 柯里化
 */
export function curry<T extends (...args: unknown[]) => unknown>(fn: T): unknown {
  const arity = fn.length

  return function curried(...args: unknown[]): unknown {
    if (args.length >= arity) {
      return fn(...args)
    }
    return (...moreArgs: unknown[]) => curried(...args, ...moreArgs)
  }
}

/**
 * 组合函数 (从右到左)
 */
export function compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg: T) => fns.reduceRight((result, fn) => fn(result), arg)
}

/**
 * 管道函数 (从左到右)
 */
export function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg: T) => fns.reduce((result, fn) => fn(result), arg)
}

/**
 * 取反函数
 */
export function negate<T extends (...args: unknown[]) => boolean>(fn: T): T {
  return function (this: unknown, ...args: Parameters<T>) {
    return !fn.apply(this, args)
  } as T
}

/**
 * 限制执行次数
 */
export function before<T extends (...args: unknown[]) => unknown>(n: number, fn: T): T {
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
export function after<T extends (...args: unknown[]) => unknown>(n: number, fn: T): T {
  let count = 0

  return function (this: unknown, ...args: Parameters<T>) {
    count++
    if (count >= n) {
      return fn.apply(this, args)
    }
  } as T
}

/**
 * 重试执行
 */
export async function retry<T>(
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
export function timeout<T>(
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

/**
 * 睡眠
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
