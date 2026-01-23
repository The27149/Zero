/**
 * Zero Algorithm - Sort
 * 排序算法
 */

/**
 * 快速排序
 */
export function quickSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
  const result = [...arr]
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))

  const sort = (left: number, right: number) => {
    if (left >= right) return

    const pivot = result[Math.floor((left + right) / 2)]
    let i = left
    let j = right

    while (i <= j) {
      while (compareFn(result[i], pivot) < 0) i++
      while (compareFn(result[j], pivot) > 0) j--
      if (i <= j) {
        [result[i], result[j]] = [result[j], result[i]]
        i++
        j--
      }
    }

    sort(left, j)
    sort(i, right)
  }

  sort(0, result.length - 1)
  return result
}

/**
 * 归并排序
 */
export function mergeSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))

  const merge = (left: T[], right: T[]): T[] => {
    const result: T[] = []
    let i = 0, j = 0

    while (i < left.length && j < right.length) {
      if (compareFn(left[i], right[j]) <= 0) {
        result.push(left[i++])
      } else {
        result.push(right[j++])
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j))
  }

  const sort = (arr: T[]): T[] => {
    if (arr.length <= 1) return arr
    const mid = Math.floor(arr.length / 2)
    return merge(sort(arr.slice(0, mid)), sort(arr.slice(mid)))
  }

  return sort(arr)
}

/**
 * 堆排序
 */
export function heapSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
  const result = [...arr]
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))

  const heapify = (n: number, i: number) => {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < n && compareFn(result[left], result[largest]) > 0) largest = left
    if (right < n && compareFn(result[right], result[largest]) > 0) largest = right

    if (largest !== i) {
      [result[i], result[largest]] = [result[largest], result[i]]
      heapify(n, largest)
    }
  }

  // Build heap
  for (let i = Math.floor(result.length / 2) - 1; i >= 0; i--) {
    heapify(result.length, i)
  }

  // Extract elements
  for (let i = result.length - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]]
    heapify(i, 0)
  }

  return result
}

/**
 * 插入排序
 */
export function insertionSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
  const result = [...arr]
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))

  for (let i = 1; i < result.length; i++) {
    const current = result[i]
    let j = i - 1
    while (j >= 0 && compareFn(result[j], current) > 0) {
      result[j + 1] = result[j]
      j--
    }
    result[j + 1] = current
  }

  return result
}

/**
 * 冒泡排序
 */
export function bubbleSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
  const result = [...arr]
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (compareFn(result[j], result[j + 1]) > 0) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]]
      }
    }
  }

  return result
}

/**
 * 选择排序
 */
export function selectionSort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
  const result = [...arr]
  const compareFn = compare || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0))

  for (let i = 0; i < result.length - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < result.length; j++) {
      if (compareFn(result[j], result[minIdx]) < 0) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]]
    }
  }

  return result
}
