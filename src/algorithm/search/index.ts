/**
 * Zero Algorithm - Search
 * 搜索算法
 */

/**
 * 二分查找
 */
export function binarySearch<T>(
  arr: T[],
  target: T,
  compare?: (a: T, b: T) => number
): number {
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const cmp = compareFn(arr[mid], target)

    if (cmp === 0) return mid
    if (cmp < 0) left = mid + 1
    else right = mid - 1
  }

  return -1
}

/**
 * 查找插入位置
 */
export function lowerBound<T>(
  arr: T[],
  target: T,
  compare?: (a: T, b: T) => number
): number {
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))
  let left = 0
  let right = arr.length

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (compareFn(arr[mid], target) < 0) left = mid + 1
    else right = mid
  }

  return left
}

/**
 * 查找上界
 */
export function upperBound<T>(
  arr: T[],
  target: T,
  compare?: (a: T, b: T) => number
): number {
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))
  let left = 0
  let right = arr.length

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (compareFn(arr[mid], target) <= 0) left = mid + 1
    else right = mid
  }

  return left
}

/**
 * 线性查找
 */
export function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i
  }
  return -1
}

/**
 * 深度优先搜索 (图)
 */
export function dfs<T>(
  graph: Map<T, T[]>,
  start: T,
  visit: (node: T) => void
): void {
  const visited = new Set<T>()

  const traverse = (node: T) => {
    if (visited.has(node)) return
    visited.add(node)
    visit(node)

    const neighbors = graph.get(node) || []
    for (const neighbor of neighbors) {
      traverse(neighbor)
    }
  }

  traverse(start)
}

/**
 * 广度优先搜索 (图)
 */
export function bfs<T>(
  graph: Map<T, T[]>,
  start: T,
  visit: (node: T) => void
): void {
  const visited = new Set<T>()
  const queue: T[] = [start]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (visited.has(node)) continue

    visited.add(node)
    visit(node)

    const neighbors = graph.get(node) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor)
      }
    }
  }
}
