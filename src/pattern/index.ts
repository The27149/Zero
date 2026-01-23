/**
 * Zero Pattern
 * 设计模式入口
 */

export * as creational from './creational'
export * as behavioral from './behavioral'
export * as structural from './structural'
export * as concurrency from './concurrency'

// 创建型模式
export { Singleton, Factory, Builder, Prototype, createAbstractFactory } from './creational'

// 行为型模式
export { Observer, StateMachine, Strategy, CommandHistory, Chain, Mediator } from './behavioral'
export type { ICommand, StateMachineConfig } from './behavioral'

// 结构型模式
export {
  createAdapter,
  Decorator,
  createProxy,
  LazyProxy,
  Facade,
  Component,
  Leaf,
  Composite,
  FlyweightFactory,
  Bridge,
} from './structural'

// 并发模式
export { ObjectPool, Scheduler, ThrottleQueue, Semaphore, ReadWriteLock } from './concurrency'
