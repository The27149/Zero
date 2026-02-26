// /**
//  * Zero Core - Error Handling
//  * 错误处理模块
//  */

// export interface ZeroErrorOptions {
//   code?: string | number
//   cause?: Error
//   data?: unknown
// }

// /**
//  * Zero 基础错误类
//  */
// export class ZeroError extends Error {
//   readonly code?: string | number
//   readonly data?: unknown
//   readonly timestamp: number

//   constructor(message: string, options: ZeroErrorOptions = {}) {
//     super(message, { cause: options.cause })
//     this.name = 'ZeroError'
//     this.code = options.code
//     this.data = options.data
//     this.timestamp = Date.now()

//     // 修复原型链
//     Object.setPrototypeOf(this, new.target.prototype)
//   }

//   toJSON(): Record<string, unknown> {
//     return {
//       name: this.name,
//       message: this.message,
//       code: this.code,
//       data: this.data,
//       timestamp: this.timestamp,
//       stack: this.stack,
//     }
//   }
// }

// type ErrorHandler = (error: Error) => void

// class ErrorManager {
//   private _handlers: Set<ErrorHandler> = new Set()

//   /**
//    * 创建自定义错误类
//    */
//   create(name: string, options: ZeroErrorOptions = {}): ZeroError {
//     const error = new ZeroError(name, options)
//     error.name = name
//     return error
//   }

//   /**
//    * 创建错误类工厂
//    */
//   define<T extends ZeroErrorOptions>(
//     name: string,
//     defaultOptions?: T
//   ): (message: string, options?: Partial<T>) => ZeroError {
//     return (message: string, options?: Partial<T>) => {
//       const error = new ZeroError(message, { ...defaultOptions, ...options })
//       error.name = name
//       return error
//     }
//   }

//   /**
//    * 安全执行函数，捕获错误
//    */
//   handle<T>(fn: () => T, fallback: T): T
//   handle<T>(fn: () => Promise<T>, fallback: T): Promise<T>
//   handle<T>(fn: () => T | Promise<T>, fallback: T): T | Promise<T> {
//     try {
//       const result = fn()
//       if (result instanceof Promise) {
//         return result.catch((err) => {
//           this._emit(err)
//           return fallback
//         })
//       }
//       return result
//     } catch (err) {
//       this._emit(err as Error)
//       return fallback
//     }
//   }

//   /**
//    * 尝试执行，返回 [error, result] 元组
//    */
//   async try<T>(fn: () => T | Promise<T>): Promise<[Error | null, T | null]> {
//     try {
//       const result = await fn()
//       return [null, result]
//     } catch (err) {
//       return [err as Error, null]
//     }
//   }

//   /**
//    * 注册全局错误处理器
//    */
//   onError(handler: ErrorHandler): () => void {
//     this._handlers.add(handler)
//     return () => this._handlers.delete(handler)
//   }

//   /**
//    * 触发错误处理
//    */
//   private _emit(error: Error): void {
//     this._handlers.forEach((handler) => {
//       try {
//         handler(error)
//       } catch {
//         // 忽略处理器中的错误
//       }
//     })
//   }

//   /**
//    * 断言
//    */
//   assert(condition: unknown, message: string, options?: ZeroErrorOptions): asserts condition {
//     if (!condition) {
//       throw this.create(message, options)
//     }
//   }
// }

// export const error = new ErrorManager()
// export type { ErrorManager }
