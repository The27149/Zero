/**
 * Zero Framework - Node Server
 * Node 服务框架
 */

import { EventEmitter } from '../../core/event'

/**
 * 中间件类型
 */
export type Middleware = (
  ctx: RequestContext,
  next: () => Promise<void>
) => void | Promise<void>

/**
 * 请求上下文
 */
export interface RequestContext {
  req: unknown
  res: unknown
  path: string
  method: string
  params: Record<string, string>
  query: Record<string, string>
  body: unknown
  headers: Record<string, string>
  state: Record<string, unknown>
  send: (data: unknown, status?: number) => void
  json: (data: unknown, status?: number) => void
  redirect: (url: string) => void
}

/**
 * 路由处理器
 */
export type RouteHandler = (ctx: RequestContext) => void | Promise<void>

/**
 * 路由定义
 */
interface Route {
  method: string
  path: string
  pattern: RegExp
  params: string[]
  handler: RouteHandler
}

/**
 * 服务器配置
 */
export interface ServerConfig {
  port?: number
  host?: string
  cors?: boolean | {
    origin?: string | string[]
    methods?: string[]
    headers?: string[]
  }
}

/**
 * Node 服务器
 */
export class NodeServer {
  private config: ServerConfig
  private middlewares: Middleware[] = []
  private routes: Route[] = []
  private server: unknown = null
  readonly events: EventEmitter<{
    start: { port: number; host: string }
    request: RequestContext
    error: Error
    stop: void
  }>

  constructor(config: ServerConfig = {}) {
    this.config = {
      port: 3000,
      host: '0.0.0.0',
      ...config,
    }
    this.events = new EventEmitter()
  }

  /**
   * 使用中间件
   */
  use(middleware: Middleware): this {
    this.middlewares.push(middleware)
    return this
  }

  /**
   * 注册路由
   */
  route(method: string, path: string, handler: RouteHandler): this {
    const params: string[] = []
    const pattern = new RegExp(
      '^' +
        path.replace(/:(\w+)/g, (_, name) => {
          params.push(name)
          return '([^/]+)'
        }) +
        '$'
    )

    this.routes.push({ method: method.toUpperCase(), path, pattern, params, handler })
    return this
  }

  /**
   * GET 路由
   */
  get(path: string, handler: RouteHandler): this {
    return this.route('GET', path, handler)
  }

  /**
   * POST 路由
   */
  post(path: string, handler: RouteHandler): this {
    return this.route('POST', path, handler)
  }

  /**
   * PUT 路由
   */
  put(path: string, handler: RouteHandler): this {
    return this.route('PUT', path, handler)
  }

  /**
   * DELETE 路由
   */
  delete(path: string, handler: RouteHandler): this {
    return this.route('DELETE', path, handler)
  }

  /**
   * PATCH 路由
   */
  patch(path: string, handler: RouteHandler): this {
    return this.route('PATCH', path, handler)
  }

  /**
   * 匹配路由
   */
  private matchRoute(method: string, path: string): { route: Route; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue

      const match = path.match(route.pattern)
      if (match) {
        const params: Record<string, string> = {}
        route.params.forEach((name, i) => {
          params[name] = match[i + 1]
        })
        return { route, params }
      }
    }
    return null
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    const { port, host } = this.config

    // 这里需要 Node.js 环境的 http 模块
    // 以下是伪代码示例
    console.log(`[Zero Server] Starting server on ${host}:${port}`)
    console.log('[Zero Server] Note: Full implementation requires Node.js environment')

    this.events.emit('start', { port: port!, host: host! })
  }

  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    this.events.emit('stop', undefined)
    console.log('[Zero Server] Server stopped')
  }

  /**
   * 路由分组
   */
  group(prefix: string, setup: (router: NodeServer) => void): this {
    const originalRoute = this.route.bind(this)

    this.route = (method: string, path: string, handler: RouteHandler) => {
      return originalRoute(method, prefix + path, handler)
    }

    setup(this)

    this.route = originalRoute
    return this
  }
}

/**
 * 内置中间件：CORS
 */
export function cors(options: ServerConfig['cors'] = true): Middleware {
  return async (ctx, next) => {
    const config = typeof options === 'object' ? options : {}
    const origin = config.origin ?? '*'
    const methods = config.methods ?? ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    const headers = config.headers ?? ['Content-Type', 'Authorization']

    // 设置 CORS 头
    ctx.state['cors'] = {
      'Access-Control-Allow-Origin': Array.isArray(origin) ? origin.join(', ') : origin,
      'Access-Control-Allow-Methods': methods.join(', '),
      'Access-Control-Allow-Headers': headers.join(', '),
    }

    await next()
  }
}

/**
 * 内置中间件：请求日志
 */
export function logger(): Middleware {
  return async (ctx, next) => {
    const start = Date.now()
    await next()
    const duration = Date.now() - start
    console.log(`[${ctx.method}] ${ctx.path} - ${duration}ms`)
  }
}

/**
 * 内置中间件：Body 解析
 */
export function bodyParser(): Middleware {
  return async (ctx, next) => {
    // Body 解析逻辑
    await next()
  }
}

/**
 * 创建服务器
 */
export function createServer(config?: ServerConfig): NodeServer {
  return new NodeServer(config)
}
