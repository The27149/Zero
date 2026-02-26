/**
 * Zero Core - RandomUtils
 * 随机数处理工具类
 */


export class RandomUtils {

  // #region 基础随机数

  /**
   * 生成随机整数 [min, max]
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * 生成随机浮点数 [min, max)
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * 生成随机布尔值
   */
  static randomBool(probability: number = 0.5): boolean {
    return Math.random() < probability
  }

  /**
   * 生成符合正态分布的随机数 (Box-Muller)
   * @param mean - 均值 (期望值)
   * @param stdDev - 标准差 (控制离散程度)
   */
  static randomNormal(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return z * stdDev + mean
  }

  // #endregion

  // #region ID 生成

  /**
   * 生成 UUID v4
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * 生成 NanoID
   */
  static nanoid(size: number = 21): string {
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
   * 生成简短 ID  (简单的固定规则)
   */
  static shortId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // #endregion

  // #region 随机字符串

  /**
   * 生成随机字符串 （可配置规则）
   */
  static randomString(
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

  // #endregion

  // #region 随机颜色

  /**
   * 生成随机颜色 (十六进制)
   */
  static randomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  /**
   * 生成随机 RGB 颜色
   */
  static randomRgb(): { r: number; g: number; b: number } {
    return {
      r: this.randomInt(0, 255),
      g: this.randomInt(0, 255),
      b: this.randomInt(0, 255),
    }
  }

  /**
   * 生成随机 HSL 颜色
   */
  static randomHsl(): { h: number; s: number; l: number } {
    return {
      h: this.randomInt(0, 360),
      s: this.randomInt(0, 100),
      l: this.randomInt(0, 100),
    }
  }

  // #endregion

  // #region 确定性随机

  /**
   * 创建确定性随机数生成器 (Mulberry32)
   * 相同seed创建的生成器，一直产出一组确定的随机序列
   */
  static createSeededRandom(seed: number): () => number {
    return () => {
      seed |= 0
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // #endregion

}