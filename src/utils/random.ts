/**
 * Zero Utils - Random
 * 随机工具
 */

/**
 * 生成随机整数 [min, max]
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机浮点数 [min, max)
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * 生成随机布尔值
 */
export function randomBool(probability: number = 0.5): boolean {
  return Math.random() < probability
}

/**
 * 从数组随机取一个元素
 */
export function randomPick<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 从数组随机取多个元素
 */
export function randomSample<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * 加权随机选择
 */
export function randomWeighted<T>(items: T[], weights: number[]): T | undefined {
  if (items.length === 0 || items.length !== weights.length) return undefined

  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight

  for (let i = 0; i < items.length; i++) {
    random -= weights[i]
    if (random <= 0) return items[i]
  }

  return items[items.length - 1]
}

/**
 * 生成 UUID v4
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 生成 NanoID
 */
export function nanoid(size: number = 21): string {
  const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
  let id = ''
  const bytes = new Uint8Array(size)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] & 63]
  }
  return id
}

/**
 * 生成简短 ID
 */
export function shortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成随机颜色 (十六进制)
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * 生成随机 RGB 颜色
 */
export function randomRgb(): { r: number; g: number; b: number } {
  return {
    r: randomInt(0, 255),
    g: randomInt(0, 255),
    b: randomInt(0, 255),
  }
}

/**
 * 生成随机 HSL 颜色
 */
export function randomHsl(): { h: number; s: number; l: number } {
  return {
    h: randomInt(0, 360),
    s: randomInt(0, 100),
    l: randomInt(0, 100),
  }
}

/**
 * 打乱数组 (Fisher-Yates)
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 生成随机字符串
 */
export function randomString(
  length: number = 8,
  options: {
    uppercase?: boolean
    lowercase?: boolean
    numbers?: boolean
    symbols?: boolean
    custom?: string
  } = {}
): string {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = false,
    custom = '',
  } = options

  let chars = custom
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers) chars += '0123456789'
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!chars) chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 创建确定性随机数生成器 (Mulberry32)
 */
export function createSeededRandom(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 生成随机日期
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * 生成符合正态分布的随机数 (Box-Muller)
 */
export function randomNormal(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z * stdDev + mean
}

/**
 * 生成随机 IP 地址
 */
export function randomIp(): string {
  return Array.from({ length: 4 }, () => randomInt(0, 255)).join('.')
}

/**
 * 生成随机 MAC 地址
 */
export function randomMac(): string {
  return Array.from({ length: 6 }, () =>
    randomInt(0, 255).toString(16).padStart(2, '0')
  ).join(':')
}
