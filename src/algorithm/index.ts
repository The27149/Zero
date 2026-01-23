/**
 * Zero Algorithm
 * 算法模块入口
 */

export * as sort from './sort'
export * as search from './search'
export * as struct from './struct'

// 导出常用结构
export { LRUCache, Heap, LinkedList, Stack, Queue, Trie } from './struct'

// 导出常用排序
export { quickSort, mergeSort, heapSort } from './sort'

// 导出常用搜索
export { binarySearch, dfs, bfs } from './search'
