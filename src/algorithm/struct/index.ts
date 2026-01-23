/**
 * Zero Algorithm - Data Structures
 * 数据结构
 */

/**
 * LRU 缓存
 */
export class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, V>

  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined

    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
}

/**
 * 堆 (优先队列)
 */
export class Heap<T> {
  private data: T[] = []
  private compare: (a: T, b: T) => number

  constructor(compare: (a: T, b: T) => number = (a, b) => (a > b ? 1 : a < b ? -1 : 0)) {
    this.compare = compare
  }

  get size(): number {
    return this.data.length
  }

  isEmpty(): boolean {
    return this.data.length === 0
  }

  peek(): T | undefined {
    return this.data[0]
  }

  push(value: T): void {
    this.data.push(value)
    this.bubbleUp(this.data.length - 1)
  }

  pop(): T | undefined {
    if (this.isEmpty()) return undefined

    const result = this.data[0]
    const last = this.data.pop()!

    if (this.data.length > 0) {
      this.data[0] = last
      this.bubbleDown(0)
    }

    return result
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.compare(this.data[index], this.data[parent]) >= 0) break
      [this.data[index], this.data[parent]] = [this.data[parent], this.data[index]]
      index = parent
    }
  }

  private bubbleDown(index: number): void {
    const length = this.data.length

    while (true) {
      const left = 2 * index + 1
      const right = 2 * index + 2
      let smallest = index

      if (left < length && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left
      }
      if (right < length && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right
      }

      if (smallest === index) break

      [this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]]
      index = smallest
    }
  }

  static from<T>(arr: T[], compare?: (a: T, b: T) => number): Heap<T> {
    const heap = new Heap<T>(compare)
    for (const item of arr) {
      heap.push(item)
    }
    return heap
  }
}

/**
 * 链表节点
 */
class LinkedListNode<T> {
  value: T
  next: LinkedListNode<T> | null = null
  prev: LinkedListNode<T> | null = null

  constructor(value: T) {
    this.value = value
  }
}

/**
 * 双向链表
 */
export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null
  private tail: LinkedListNode<T> | null = null
  private _size: number = 0

  get size(): number {
    return this._size
  }

  isEmpty(): boolean {
    return this._size === 0
  }

  pushFront(value: T): void {
    const node = new LinkedListNode(value)
    if (!this.head) {
      this.head = this.tail = node
    } else {
      node.next = this.head
      this.head.prev = node
      this.head = node
    }
    this._size++
  }

  pushBack(value: T): void {
    const node = new LinkedListNode(value)
    if (!this.tail) {
      this.head = this.tail = node
    } else {
      node.prev = this.tail
      this.tail.next = node
      this.tail = node
    }
    this._size++
  }

  popFront(): T | undefined {
    if (!this.head) return undefined

    const value = this.head.value
    this.head = this.head.next
    if (this.head) {
      this.head.prev = null
    } else {
      this.tail = null
    }
    this._size--
    return value
  }

  popBack(): T | undefined {
    if (!this.tail) return undefined

    const value = this.tail.value
    this.tail = this.tail.prev
    if (this.tail) {
      this.tail.next = null
    } else {
      this.head = null
    }
    this._size--
    return value
  }

  peekFront(): T | undefined {
    return this.head?.value
  }

  peekBack(): T | undefined {
    return this.tail?.value
  }

  toArray(): T[] {
    const result: T[] = []
    let current = this.head
    while (current) {
      result.push(current.value)
      current = current.next
    }
    return result
  }

  clear(): void {
    this.head = null
    this.tail = null
    this._size = 0
  }
}

/**
 * 栈
 */
export class Stack<T> {
  private data: T[] = []

  get size(): number {
    return this.data.length
  }

  isEmpty(): boolean {
    return this.data.length === 0
  }

  push(value: T): void {
    this.data.push(value)
  }

  pop(): T | undefined {
    return this.data.pop()
  }

  peek(): T | undefined {
    return this.data[this.data.length - 1]
  }

  clear(): void {
    this.data = []
  }
}

/**
 * 队列
 */
export class Queue<T> {
  private data: T[] = []

  get size(): number {
    return this.data.length
  }

  isEmpty(): boolean {
    return this.data.length === 0
  }

  enqueue(value: T): void {
    this.data.push(value)
  }

  dequeue(): T | undefined {
    return this.data.shift()
  }

  peek(): T | undefined {
    return this.data[0]
  }

  clear(): void {
    this.data = []
  }
}

/**
 * Trie (前缀树)
 */
export class Trie {
  private root: Map<string, unknown> = new Map()
  private endSymbol = Symbol('end')

  insert(word: string): void {
    let node = this.root
    for (const char of word) {
      if (!node.has(char)) {
        node.set(char, new Map())
      }
      node = node.get(char) as Map<string, unknown>
    }
    node.set(this.endSymbol as unknown as string, true)
  }

  search(word: string): boolean {
    const node = this.findNode(word)
    return node !== null && node.has(this.endSymbol as unknown as string)
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null
  }

  private findNode(str: string): Map<string, unknown> | null {
    let node = this.root
    for (const char of str) {
      if (!node.has(char)) return null
      node = node.get(char) as Map<string, unknown>
    }
    return node
  }
}
