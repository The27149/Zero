/**
 * Zero Utils - Math Base
 * 数学基础函数
 */

/**
 * 限制数值范围
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 线性插值
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * 反向线性插值
 */
export function inverseLerp(a: number, b: number, value: number): number {
  return (value - a) / (b - a)
}

/**
 * 范围映射
 */
export function remap(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  return lerp(toMin, toMax, inverseLerp(fromMin, fromMax, value))
}

/**
 * 四舍五入到指定精度
 */
export function round(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * 向下取整到指定精度
 */
export function floor(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision)
  return Math.floor(value * factor) / factor
}

/**
 * 向上取整到指定精度
 */
export function ceil(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision)
  return Math.ceil(value * factor) / factor
}

/**
 * 取模 (处理负数)
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

/**
 * 角度转弧度
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * 弧度转角度
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * 判断是否为偶数
 */
export function isEven(n: number): boolean {
  return n % 2 === 0
}

/**
 * 判断是否为奇数
 */
export function isOdd(n: number): boolean {
  return n % 2 !== 0
}

/**
 * 判断是否为质数
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

/**
 * 最大公约数
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    [a, b] = [b, a % b]
  }
  return a
}

/**
 * 最小公倍数
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

/**
 * 阶乘
 */
export function factorial(n: number): number {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

/**
 * 斐波那契数
 */
export function fibonacci(n: number): number {
  if (n < 0) return NaN
  if (n <= 1) return n
  let a = 0, b = 1
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}

/**
 * 数字符号
 */
export function sign(n: number): -1 | 0 | 1 {
  if (n > 0) return 1
  if (n < 0) return -1
  return 0
}

/**
 * 平滑步进 (Smooth Step)
 */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/**
 * 更平滑的步进 (Smoother Step)
 */
export function smootherStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * 判断两个浮点数是否近似相等
 */
export function approximately(a: number, b: number, epsilon: number = 1e-6): boolean {
  return Math.abs(a - b) < epsilon
}

/**
 * 求和
 */
export function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}

/**
 * 平均值
 */
export function mean(...numbers: number[]): number {
  if (numbers.length === 0) return NaN
  return sum(...numbers) / numbers.length
}

/**
 * 中位数
 */
export function median(...numbers: number[]): number {
  if (numbers.length === 0) return NaN
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * 众数
 */
export function mode(...numbers: number[]): number[] {
  if (numbers.length === 0) return []
  const counts = new Map<number, number>()
  let maxCount = 0

  for (const n of numbers) {
    const count = (counts.get(n) || 0) + 1
    counts.set(n, count)
    if (count > maxCount) maxCount = count
  }

  const result: number[] = []
  counts.forEach((count, n) => {
    if (count === maxCount) result.push(n)
  })

  return result
}

/**
 * 方差
 */
export function variance(...numbers: number[]): number {
  if (numbers.length === 0) return NaN
  const avg = mean(...numbers)
  return mean(...numbers.map((n) => (n - avg) ** 2))
}

/**
 * 标准差
 */
export function standardDeviation(...numbers: number[]): number {
  return Math.sqrt(variance(...numbers))
}

/**
 * 范围
 */
export function range(numbers: number[]): number {
  if (numbers.length === 0) return NaN
  return Math.max(...numbers) - Math.min(...numbers)
}

/**
 * 百分位数
 */
export function percentile(numbers: number[], p: number): number {
  if (numbers.length === 0) return NaN
  const sorted = [...numbers].sort((a, b) => a - b)
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}
