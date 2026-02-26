/**
 * Zero Core - MathUtils
 * 数学计算工具类
 */


export class MathUtils {

  // #region 数值范围与精度

  /**
   * 限制数值范围
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * 线性插值
   */
  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  /**
   * 反向线性插值
   */
  static inverseLerp(a: number, b: number, value: number): number {
    return (value - a) / (b - a)
  }

  /**
   * 范围映射
   */
  static remap(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
    return this.lerp(toMin, toMax, this.inverseLerp(fromMin, fromMax, value))
  }

  /**
   * 四舍五入到指定精度
   */
  static round(value: number, precision: number = 0): number {
    const factor = Math.pow(10, precision)
    return Math.round(value * factor) / factor
  }

  /**
   * 向下取整到指定精度
   */
  static floor(value: number, precision: number = 0): number {
    const factor = Math.pow(10, precision)
    return Math.floor(value * factor) / factor
  }

  /**
   * 向上取整到指定精度
   */
  static ceil(value: number, precision: number = 0): number {
    const factor = Math.pow(10, precision)
    return Math.ceil(value * factor) / factor
  }

  // #endregion

  // #region 角度与弧度

  /**
   * 角度转弧度
   */
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * 弧度转角度
   */
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI)
  }

  // #endregion

  // #region 数值判断

  /**
   * 判断两个浮点数是否近似相等
   */
  static isAlmostEqual(a: number, b: number, epsilon: number = 1e-6): boolean {
    return Math.abs(a - b) < epsilon
  }

  /**
   * 判断是否为偶数
   */
  static isEven(n: number): boolean {
    return n % 2 === 0
  }

  /**
   * 判断是否为奇数
   */
  static isOdd(n: number): boolean {
    return n % 2 !== 0
  }

  /**
   * 判断是否为质数
   */
  static isPrime(n: number): boolean {
    if (!Number.isInteger(n)) return false;
    if (n < 2) return false
    if (n === 2) return true
    if (n % 2 === 0) return false
    const limit = Math.sqrt(n);
    for (let i = 3; i <= limit; i += 2) {
      if (n % i === 0) return false
    }
    return true
  }

  // #endregion

  // #region 常用算法

  /**
   * 取模 (处理负数)
   */
  static mod(n: number, m: number): number {
    return ((n % m) + m) % m
  }

  /**
   * 最大公约数
   */
  static gcd(a: number, b: number): number {
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
  static lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b)
  }

  /**
   * 阶乘
   */
  static factorial(n: number): number {
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
  static fibonacci(n: number): number {
    if (n < 0) return NaN
    if (n <= 1) return n
    let a = 0, b = 1
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b]
    }
    return b
  }

  // #endregion

  // #region 统计计算

  /**
   * 求和
   */
  static sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0)
  }

  /**
   * 平均值
   */
  static mean(...numbers: number[]): number {
    if (numbers.length === 0) return NaN
    return this.sum(...numbers) / numbers.length
  }

  /**
   * 中位数
   */
  static median(...numbers: number[]): number {
    if (numbers.length === 0) return NaN
    const sorted = [...numbers].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }

  /**
   * 方差
   */
  static variance(...numbers: number[]): number {
    if (numbers.length === 0) return NaN
    const avg = this.mean(...numbers)
    return this.mean(...numbers.map((n) => (n - avg) ** 2))
  }

  /**
   * 标准差
   */
  static standardDeviation(...numbers: number[]): number {
    return Math.sqrt(this.variance(...numbers))
  }

  // #endregion

  // #region 数字符号

  /**
   * 数字符号
   */
  static sign(n: number): -1 | 0 | 1 {
    if (n > 0) return 1
    if (n < 0) return -1
    return 0
  }

  /**
   * 平滑步进 (Smooth Step)
   */
  static smoothStep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
  }

  /**
   * 更平滑的步进 (Smoother Step)
   */
  static smootherStep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  // #endregion

}