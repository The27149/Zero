/**
 * Zero - Module Registry
 * 模块注册表 (用于类型发现和跳转)
 */

import type * as core from './core'
import type * as utils from './utils'
import type * as algorithm from './algorithm'
import type * as pattern from './pattern'
import type * as network from './network'
import type * as ui from './ui'
import type * as file from './file'
import type * as preset from './preset'

// Platform
import type * as platformWeb from './platform/web'
import type * as platformNode from './platform/node'
import type * as platformCocos from './platform/cocos'

// Framework
import type * as frameworkCocosGame from './framework/cocos-game'
import type * as frameworkNodeServer from './framework/node-server'

/**
 * Zero 模块清单
 *
 * 使用方式:
 * 1. 导入此类型: import type { ZeroModules } from 'zero'
 * 2. 在 IDE 中查看各模块, 点击可跳转到对应模块的类型定义
 */
export interface ZeroModules {
  /**
   * 核心层
   *
   * 包含: config, logger, error, event, plugin
   *
   * @example
   * ```ts
   * import 'zero' // 自动挂载到全局 Zero
   * Zero.logger.info('Hello')
   * Zero.config.set('debug', true)
   * ```
   */
  core: typeof core

  /**
   * 通用工具
   *
   * 包含: is, array, object, string, function, date, random, math
   *
   * @example
   * ```ts
   * import { deepClone, debounce, uuid } from 'zero/utils'
   * import { isArray, isNil } from 'zero/utils/is'
   * ```
   */
  utils: typeof utils

  /**
   * 算法模块
   *
   * 包含: sort, search, graph, dp, geometry, struct
   *
   * @example
   * ```ts
   * import { quickSort } from 'zero/algorithm/sort'
   * import { LRUCache, Heap } from 'zero/algorithm/struct'
   * ```
   */
  algorithm: typeof algorithm

  /**
   * 设计模式
   *
   * 包含: creational, structural, behavioral, concurrency
   *
   * @example
   * ```ts
   * import { Singleton, Factory } from 'zero/pattern/creational'
   * import { Observer, StateMachine } from 'zero/pattern/behavioral'
   * import { ObjectPool } from 'zero/pattern/concurrency'
   * ```
   */
  pattern: typeof pattern

  /**
   * 网络与数据
   *
   * 包含: http, websocket, cache, storage
   *
   * @example
   * ```ts
   * import { http, createCache } from 'zero/network'
   * ```
   */
  network: typeof network

  /**
   * UI 与交互
   *
   * 包含: dialog, toast, drag, gesture
   *
   * @example
   * ```ts
   * import { createDrag, createGesture } from 'zero/ui'
   * ```
   */
  ui: typeof ui

  /**
   * 文件与资源
   *
   * 包含: reader, download, upload, resource
   *
   * @example
   * ```ts
   * import { download, upload } from 'zero/file'
   * ```
   */
  file: typeof file

  /**
   * 预设组合
   *
   * 包含: default, game, server, mobile
   *
   * @example
   * ```ts
   * import { usePreset } from 'zero/preset'
   * usePreset('game')
   * ```
   */
  preset: typeof preset

  /**
   * 平台工具
   */
  platform: {
    /**
     * Web 平台工具
     *
     * 包含: dom, event, animation, clipboard, fullscreen
     *
     * @example
     * ```ts
     * import { dom, clipboard } from 'zero/platform/web'
     * ```
     */
    web: typeof platformWeb

    /**
     * Node.js 平台工具
     *
     * 包含: fs, process, path, stream, cli
     *
     * @example
     * ```ts
     * import { fs, cli } from 'zero/platform/node'
     * ```
     */
    node: typeof platformNode

    /**
     * Cocos Creator 平台工具
     *
     * 包含: component, resource, scene, audio, tween
     *
     * @example
     * ```ts
     * import { resource, scene } from 'zero/platform/cocos'
     * ```
     */
    cocos: typeof platformCocos
  }

  /**
   * 应用框架
   */
  framework: {
    /**
     * Cocos 游戏框架
     *
     * 快速搭建 Cocos Creator 游戏应用
     *
     * @example
     * ```ts
     * import { CocosApp } from 'zero/framework/cocos-game'
     * const app = new CocosApp({ ... })
     * ```
     */
    'cocos-game': typeof frameworkCocosGame

    /**
     * Node 服务框架
     *
     * 快速搭建 Node.js 服务端应用
     *
     * @example
     * ```ts
     * import { NodeServer } from 'zero/framework/node-server'
     * const server = new NodeServer({ port: 3000 })
     * ```
     */
    'node-server': typeof frameworkNodeServer
  }
}

/**
 * 获取模块信息
 */
export const moduleInfo = {
  core: {
    name: 'core',
    description: '核心层: config, logger, error, event, plugin',
    path: 'zero/core',
  },
  utils: {
    name: 'utils',
    description: '通用工具: is, array, object, string, function, date, random, math',
    path: 'zero/utils',
  },
  algorithm: {
    name: 'algorithm',
    description: '算法: sort, search, graph, dp, geometry, struct',
    path: 'zero/algorithm',
  },
  pattern: {
    name: 'pattern',
    description: '设计模式: creational, structural, behavioral, concurrency',
    path: 'zero/pattern',
  },
  network: {
    name: 'network',
    description: '网络: http, websocket, cache, storage',
    path: 'zero/network',
  },
  ui: {
    name: 'ui',
    description: 'UI: dialog, toast, drag, gesture',
    path: 'zero/ui',
  },
  file: {
    name: 'file',
    description: '文件: reader, download, upload, resource',
    path: 'zero/file',
  },
  preset: {
    name: 'preset',
    description: '预设: default, game, server, mobile',
    path: 'zero/preset',
  },
  platform: {
    web: { name: 'platform/web', description: 'Web 平台工具', path: 'zero/platform/web' },
    node: { name: 'platform/node', description: 'Node.js 平台工具', path: 'zero/platform/node' },
    cocos: { name: 'platform/cocos', description: 'Cocos 平台工具', path: 'zero/platform/cocos' },
  },
  framework: {
    'cocos-game': { name: 'framework/cocos-game', description: 'Cocos 游戏框架', path: 'zero/framework/cocos-game' },
    'node-server': { name: 'framework/node-server', description: 'Node 服务框架', path: 'zero/framework/node-server' },
  },
} as const
