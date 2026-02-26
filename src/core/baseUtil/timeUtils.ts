/**
 * Zero Core - DateUtils
 * 日期处理工具类  
*
* 快速查找提示 (在 VSCode 中按 Ctrl+Shift+O):
 *   - 输入 "parse" 查找解析方法
 *   - 输入 "format" 查找格式化方法
 *   - 输入 "timestamp" 查找时间戳方法
 *   - 输入 "is" 查找所有判断方法
 *   - 输入 "add" 或 "subtract" 查找时间操作
 *   - 输入 "day" 查找日期相关方法
 */

export type DateInput = Date | number | string

export type TimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
export type PeriodUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'

///todo: 未整理 需要重新整理的内容
/**时间工具 */
export class timeUtils {
  private static readonly MS_PER_UNIT: Record<TimeUnit, number> = {
    millisecond: 1,
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    month: 1000 * 60 * 60 * 24 * 30,
    year: 1000 * 60 * 60 * 24 * 365,
  }

  private static readonly WEEKDAY_NAMES: Record<'zh' | 'en', string[]> = {
    zh: ['日', '一', '二', '三', '四', '五', '六'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  }

  // #region 解析与转换

  static parse(date: DateInput): Date {
    if (date instanceof Date) return new Date(date)
    if (typeof date === 'number') return new Date(date)
    return new Date(date)
  }

  static format(date: DateInput, pattern: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = this.parse(date)

    const tokens: Record<string, () => string> = {
      YYYY: () => String(d.getFullYear()),
      YY: () => String(d.getFullYear()).slice(-2),
      MM: () => String(d.getMonth() + 1).padStart(2, '0'),
      M: () => String(d.getMonth() + 1),
      DD: () => String(d.getDate()).padStart(2, '0'),
      D: () => String(d.getDate()),
      HH: () => String(d.getHours()).padStart(2, '0'),
      H: () => String(d.getHours()),
      hh: () => String(d.getHours() % 12 || 12).padStart(2, '0'),
      h: () => String(d.getHours() % 12 || 12),
      mm: () => String(d.getMinutes()).padStart(2, '0'),
      m: () => String(d.getMinutes()),
      ss: () => String(d.getSeconds()).padStart(2, '0'),
      s: () => String(d.getSeconds()),
      SSS: () => String(d.getMilliseconds()).padStart(3, '0'),
      A: () => (d.getHours() < 12 ? 'AM' : 'PM'),
      a: () => (d.getHours() < 12 ? 'am' : 'pm'),
    }

    return pattern.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g, (match) => tokens[match]?.() ?? match)
  }

  static timestamp(date?: DateInput): number {
    return date ? this.parse(date).getTime() : Date.now()
  }

  static unix(date?: DateInput): number {
    return Math.floor(this.timestamp(date) / 1000)
  }

  // #endregion

  // #region 时间操作

  static diff(date1: DateInput, date2: DateInput, unit: TimeUnit = 'millisecond'): number {
    return Math.floor((this.timestamp(date1) - this.timestamp(date2)) / this.MS_PER_UNIT[unit])
  }

  static add(date: DateInput, amount: number, unit: TimeUnit = 'day'): Date {
    const d = this.parse(date)
    const setters: Record<TimeUnit, (n: number) => void> = {
      year: (n) => d.setFullYear(d.getFullYear() + n),
      month: (n) => d.setMonth(d.getMonth() + n),
      day: (n) => d.setDate(d.getDate() + n),
      hour: (n) => d.setHours(d.getHours() + n),
      minute: (n) => d.setMinutes(d.getMinutes() + n),
      second: (n) => d.setSeconds(d.getSeconds() + n),
      millisecond: (n) => d.setMilliseconds(d.getMilliseconds() + n),
    }
    setters[unit]?.(amount)
    return d
  }

  static subtract(date: DateInput, amount: number, unit: TimeUnit = 'day'): Date {
    return this.add(date, -amount, unit)
  }

  private static createNormalizedDate(
    d: Date,
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    ms: number
  ): Date {
    return new Date(d.getFullYear() + year, d.getMonth() + month, d.getDate() + day, hour, minute, second, ms)
  }

  static startOf(date: DateInput, unit: PeriodUnit): Date {
    const d = this.parse(date)
    const startMap: Record<PeriodUnit, Date> = {
      year: this.createNormalizedDate(d, 0, -d.getMonth(), -d.getDate() + 1, 0, 0, 0, 0),
      month: this.createNormalizedDate(d, 0, 0, -d.getDate() + 1, 0, 0, 0, 0),
      week: (() => {
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return this.createNormalizedDate(d, 0, 0, diff - d.getDate(), 0, 0, 0, 0)
      })(),
      day: this.createNormalizedDate(d, 0, 0, 0, 0, 0, 0, 0),
      hour: this.createNormalizedDate(d, 0, 0, 0, 0, 0, 0, 0),
      minute: this.createNormalizedDate(d, 0, 0, 0, 0, 0, 0, 0),
      second: this.createNormalizedDate(d, 0, 0, 0, 0, 0, 0, 0),
    }
    return startMap[unit]
  }

  static endOf(date: DateInput, unit: PeriodUnit): Date {
    const d = this.parse(date)
    const endMap: Record<PeriodUnit, Date> = {
      year: this.createNormalizedDate(d, 0, 11 - d.getMonth(), 31 - d.getDate(), 23, 59, 59, 999),
      month: this.createNormalizedDate(d, 0, 1, 0, 23, 59, 59, 999),
      week: (() => {
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? 0 : 7)
        return this.createNormalizedDate(d, 0, 0, diff - d.getDate(), 23, 59, 59, 999)
      })(),
      day: this.createNormalizedDate(d, 0, 0, 0, 23, 59, 59, 999),
      hour: this.createNormalizedDate(d, 0, 0, 0, 0, 59, 59, 999),
      minute: this.createNormalizedDate(d, 0, 0, 0, 0, 0, 59, 999),
      second: this.createNormalizedDate(d, 0, 0, 0, 0, 0, 0, 999),
    }
    return endMap[unit]
  }

  // #endregion

  // #region 比较与判断

  static isSameDay(date1: DateInput, date2: DateInput): boolean {
    const d1 = this.parse(date1)
    const d2 = this.parse(date2)
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  }

  static isBefore(date1: DateInput, date2: DateInput): boolean {
    return this.timestamp(date1) < this.timestamp(date2)
  }

  static isAfter(date1: DateInput, date2: DateInput): boolean {
    return this.timestamp(date1) > this.timestamp(date2)
  }

  static isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
    const t = this.timestamp(date)
    return t >= this.timestamp(start) && t <= this.timestamp(end)
  }

  static isLeapYear(date: DateInput): boolean {
    const year = this.parse(date).getFullYear()
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  // #endregion

  // #region 辅助方法

  static daysInMonth(date: DateInput): number {
    const d = this.parse(date)
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  }

  static daysInYear(date: DateInput): number {
    return this.isLeapYear(date) ? 366 : 365
  }

  static relative(date: DateInput, baseDate: DateInput = new Date()): string {
    const diffSec = Math.floor((this.timestamp(baseDate) - this.timestamp(date)) / 1000)
    const absSec = Math.abs(diffSec)

    const units: [number, string][] = [
      [60, '秒'],
      [60, '分钟'],
      [24, '小时'],
      [30, '天'],
      [12, '个月'],
      [Infinity, '年'],
    ]

    let value = absSec
    let unitName = ''

    for (const [threshold, unit] of units) {
      if (value < threshold) break
      value = Math.floor(value / threshold)
      unitName = unit
    }

    if (unitName === '' && value < 10) return '刚刚'

    return `${value}${unitName}${diffSec > 0 ? '前' : '后'}`
  }

  static dayOfWeek(date: DateInput): number {
    return this.parse(date).getDay()
  }

  static dayOfWeekName(date: DateInput, locale: 'zh' | 'en' = 'zh'): string {
    const day = this.dayOfWeek(date)
    return locale === 'zh' ? `星期${this.WEEKDAY_NAMES.zh[day]}` : this.WEEKDAY_NAMES.en[day]
  }

  private static offsetDays(offset: number): Date {
    return this.add(this.startOf(new Date(), 'day'), offset, 'day')
  }

  static today(): Date {
    return this.offsetDays(0)
  }

  static tomorrow(): Date {
    return this.offsetDays(1)
  }

  static yesterday(): Date {
    return this.offsetDays(-1)
  }

  // #endregion
}