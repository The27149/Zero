/**
 * Zero Pattern - Concurrency
 * 并发模式
 */

/**
 * 对象池
 */
export class ObjectPool<T> {
  private pool: T[] = []
  private inUse: Set<T> = new Set()
  private create: () => T
  private reset?: (obj: T) => void
  private maxSize: number

  constructor(options: {
    create: () => T
    reset?: (obj: T) => void
    max?: number
    initial?: number
  }) {
    this.create = options.create
    this.reset = options.reset
    this.maxSize = options.max ?? Infinity

    // 预创建对象
    const initial = options.initial ?? 0
    for (let i = 0; i < initial; i++) {
      this.pool.push(this.create())
    }
  }

  acquire(): T {
    let obj: T

    if (this.pool.length > 0) {
      obj = this.pool.pop()!
    } else {
      obj = this.create()
    }

    this.inUse.add(obj)
    return obj
  }

  release(obj: T): void {
    if (!this.inUse.has(obj)) return

    this.inUse.delete(obj)
    this.reset?.(obj)

    if (this.pool.length < this.maxSize) {
      this.pool.push(obj)
    }
  }

  get available(): number {
    return this.pool.length
  }

  get active(): number {
    return this.inUse.size
  }

  get size(): number {
    return this.pool.length + this.inUse.size
  }

  clear(): void {
    this.pool = []
    this.inUse.clear()
  }
}

/**
 * 任务调度器
 */
export class Scheduler {
  private queue: (() => Promise<void>)[] = []
  private running: number = 0
  private maxConcurrency: number

  constructor(maxConcurrency: number = 1) {
    this.maxConcurrency = maxConcurrency
  }

  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task())
        } catch (error) {
          reject(error)
        }
      })
      this.run()
    })
  }

  private async run(): Promise<void> {
    while (this.running < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift()!
      this.running++

      task().finally(() => {
        this.running--
        this.run()
      })
    }
  }

  get pending(): number {
    return this.queue.length
  }

  get activeCount(): number {
    return this.running
  }
}

/**
 * 限流队列
 */
export class ThrottleQueue<T> {
  private queue: T[] = []
  private processing: boolean = false
  private interval: number

  constructor(
    private handler: (item: T) => void | Promise<void>,
    options: { interval?: number } = {}
  ) {
    this.interval = options.interval ?? 100
  }

  push(item: T): void {
    this.queue.push(item)
    this.process()
  }

  private async process(): Promise<void> {
    if (this.processing) return
    this.processing = true

    while (this.queue.length > 0) {
      const item = this.queue.shift()!
      await this.handler(item)
      await new Promise((resolve) => setTimeout(resolve, this.interval))
    }

    this.processing = false
  }

  get length(): number {
    return this.queue.length
  }

  clear(): void {
    this.queue = []
  }
}

/**
 * 信号量
 */
export class Semaphore {
  private permits: number
  private waiting: (() => void)[] = []

  constructor(permits: number) {
    this.permits = permits
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--
      return
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve)
    })
  }

  release(): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!
      resolve()
    } else {
      this.permits++
    }
  }

  async withPermit<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()
    }
  }

  get availablePermits(): number {
    return this.permits
  }
}

/**
 * 读写锁
 */
export class ReadWriteLock {
  private readers: number = 0
  private writer: boolean = false
  private waitingWriters: (() => void)[] = []
  private waitingReaders: (() => void)[] = []

  async acquireRead(): Promise<void> {
    while (this.writer || this.waitingWriters.length > 0) {
      await new Promise<void>((resolve) => this.waitingReaders.push(resolve))
    }
    this.readers++
  }

  releaseRead(): void {
    this.readers--
    if (this.readers === 0 && this.waitingWriters.length > 0) {
      const resolve = this.waitingWriters.shift()!
      resolve()
    }
  }

  async acquireWrite(): Promise<void> {
    while (this.writer || this.readers > 0) {
      await new Promise<void>((resolve) => this.waitingWriters.push(resolve))
    }
    this.writer = true
  }

  releaseWrite(): void {
    this.writer = false

    // 优先唤醒读者
    while (this.waitingReaders.length > 0) {
      const resolve = this.waitingReaders.shift()!
      resolve()
    }

    // 如果没有读者在等待，唤醒一个写者
    if (this.waitingWriters.length > 0) {
      const resolve = this.waitingWriters.shift()!
      resolve()
    }
  }
}
