/**
 * Zero Network
 * 网络与数据模块
 */

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer'
}

export interface RequestInterceptor {
  onRequest?: (options: RequestOptions) => RequestOptions | Promise<RequestOptions>
  onResponse?: <T>(response: T) => T | Promise<T>
  onError?: (error: Error) => void
}

/**
 * HTTP 请求客户端
 */
export class HttpClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private interceptors: RequestInterceptor[] = []
  private timeout: number

  constructor(options: {
    baseURL?: string
    headers?: Record<string, string>
    timeout?: number
  } = {}) {
    this.baseURL = options.baseURL ?? ''
    this.defaultHeaders = options.headers ?? {}
    this.timeout = options.timeout ?? 30000
  }

  use(interceptor: RequestInterceptor): this {
    this.interceptors.push(interceptor)
    return this
  }

  async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    let opts: RequestOptions = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      timeout: options.timeout ?? this.timeout,
      responseType: options.responseType ?? 'json',
      ...options,
    }

    // Apply request interceptors
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        opts = await interceptor.onRequest(opts)
      }
    }

    const fullURL = this.baseURL + url

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), opts.timeout)

      const response = await fetch(fullURL, {
        method: opts.method,
        headers: opts.headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      let data: T
      switch (opts.responseType) {
        case 'text':
          data = (await response.text()) as T
          break
        case 'blob':
          data = (await response.blob()) as T
          break
        case 'arrayBuffer':
          data = (await response.arrayBuffer()) as T
          break
        default:
          data = (await response.json()) as T
      }

      // Apply response interceptors
      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          data = await interceptor.onResponse(data)
        }
      }

      return data
    } catch (error) {
      for (const interceptor of this.interceptors) {
        interceptor.onError?.(error as Error)
      }
      throw error
    }
  }

  get<T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  post<T>(url: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', body })
  }

  put<T>(url: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', body })
  }

  delete<T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  patch<T>(url: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PATCH', body })
  }
}

/**
 * 创建 HTTP 客户端
 */
export function createHttp(options?: ConstructorParameters<typeof HttpClient>[0]): HttpClient {
  return new HttpClient(options)
}

/**
 * 默认 HTTP 客户端实例
 */
export const http = createHttp()

/**
 * 缓存
 */
export class Cache<K, V> {
  private store: Map<K, { value: V; expires: number }> = new Map()
  private defaultTTL: number

  constructor(options: { ttl?: number } = {}) {
    this.defaultTTL = options.ttl ?? Infinity
  }

  set(key: K, value: V, ttl?: number): void {
    const expires = Date.now() + (ttl ?? this.defaultTTL)
    this.store.set(key, { value, expires })
  }

  get(key: K): V | undefined {
    const item = this.store.get(key)
    if (!item) return undefined
    if (Date.now() > item.expires) {
      this.store.delete(key)
      return undefined
    }
    return item.value
  }

  has(key: K): boolean {
    return this.get(key) !== undefined
  }

  delete(key: K): boolean {
    return this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.store) {
      if (now > item.expires) {
        this.store.delete(key)
      }
    }
  }
}

/**
 * 创建缓存
 */
export function createCache<K, V>(options?: ConstructorParameters<typeof Cache>[0]): Cache<K, V> {
  return new Cache<K, V>(options)
}

/**
 * 存储抽象
 */
export interface Storage {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  keys(): string[]
}

/**
 * 创建本地存储
 */
export function createStorage(prefix: string = ''): Storage {
  return {
    get<T>(key: string): T | null {
      const item = localStorage.getItem(prefix + key)
      if (!item) return null
      try {
        return JSON.parse(item) as T
      } catch {
        return null
      }
    },
    set<T>(key: string, value: T): void {
      localStorage.setItem(prefix + key, JSON.stringify(value))
    },
    remove(key: string): void {
      localStorage.removeItem(prefix + key)
    },
    clear(): void {
      if (prefix) {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix))
        keys.forEach((k) => localStorage.removeItem(k))
      } else {
        localStorage.clear()
      }
    },
    keys(): string[] {
      return Object.keys(localStorage)
        .filter((k) => k.startsWith(prefix))
        .map((k) => k.slice(prefix.length))
    },
  }
}
