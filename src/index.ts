/**
 * Zero
 * 通用、无限可扩展的 JavaScript/TypeScript 工具库
 */

// 核心模块
export * from './core'

// 算法模块
export * as algorithm from './algorithm'
export { LRUCache, Heap, LinkedList, Stack, Queue, Trie } from './algorithm/struct'
export { quickSort, mergeSort, heapSort } from './algorithm/sort'
export { binarySearch, lowerBound, upperBound, linearSearch, dfs, bfs } from './algorithm/search'

// 设计模式模块
export * as pattern from './pattern'
export { Singleton, Factory, Builder, Prototype, createAbstractFactory } from './pattern/creational'
export { Observer, StateMachine, Strategy, CommandHistory, Chain, Mediator } from './pattern/behavioral'
export { createAdapter, Decorator, createProxy, LazyProxy, Facade, Component, Leaf, Composite, FlyweightFactory, Bridge } from './pattern/structural'
export { ObjectPool, Scheduler, ThrottleQueue, Semaphore, ReadWriteLock } from './pattern/concurrency'

// 网络模块
export * from './network'

// 文件模块
export * from './file'

// UI 模块
export * from './ui'

// 预设模块
export * from './preset'