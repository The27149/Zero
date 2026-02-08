/**
 * Zero Core - DateHandler
 * 日期处理工具类
 */

export type DateInput = Date | number | string

export class DateHandler {
  /**
   * 解析日期
   */
  static parse(date: DateInput): Date {
    if (date instanceof Date) return new Date(date)
    if (typeof date === 'number') return new Date(date)
    return new Date(date)
  }

  /**
   * 格式化日期
   */
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

    return pattern.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g, (match) => {
      return tokens[match]?.() ?? match
    })
  }

  /**
   * 获取时间戳
   */
  static timestamp(date?: DateInput): number {
    return date ? this.parse(date).getTime() : Date.now()
  }

  /**
   * 获取 Unix 时间戳 (秒)
   */
  static unix(date?: DateInput): number {
    return Math.floor(this.timestamp(date) / 1000)
  }

  /**
   * 日期差值
   */
  static diff(
    date1: DateInput,
    date2: DateInput,
    unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' = 'millisecond'
  ): number {
    const d1 = this.parse(date1)
    const d2 = this.parse(date2)
    const diffMs = d1.getTime() - d2.getTime()

    const units: Record<string, number> = {
      millisecond: 1,
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
      month: 1000 * 60 * 60 * 24 * 30,
      year: 1000 * 60 * 60 * 24 * 365,
    }

    return Math.floor(diffMs / units[unit])
  }

  /**
   * 日期加减
   */
  static add(
    date: DateInput,
    amount: number,
    unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' = 'day'
  ): Date {
    const d = this.parse(date)

    switch (unit) {
      case 'year':
        d.setFullYear(d.getFullYear() + amount)
        break
      case 'month':
        d.setMonth(d.getMonth() + amount)
        break
      case 'day':
        d.setDate(d.getDate() + amount)
        break
      case 'hour':
        d.setHours(d.getHours() + amount)
        break
      case 'minute':
        d.setMinutes(d.getMinutes() + amount)
        break
      case 'second':
        d.setSeconds(d.getSeconds() + amount)
        break
      case 'millisecond':
        d.setMilliseconds(d.getMilliseconds() + amount)
        break
    }

    return d
  }

  /**
   * 日期减法
   */
  static subtract(
    date: DateInput,
    amount: number,
    unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' = 'day'
  ): Date {
    return this.add(date, -amount, unit)
  }

  /**
   * 获取某时间段的开始
   */
  static startOf(date: DateInput, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'): Date {
    const d = this.parse(date)

    switch (unit) {
      case 'year':
        return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0)
      case 'month':
        return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
      case 'week':
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0, 0)
      case 'day':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
      case 'hour':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0, 0)
      case 'minute':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0, 0)
      case 'second':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0)
    }
  }

  /**
   * 获取某时间段的结束
   */
  static endOf(date: DateInput, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'): Date {
    const d = this.parse(date)

    switch (unit) {
      case 'year':
        return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999)
      case 'month':
        return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      case 'week':
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? 0 : 7)
        return new Date(d.getFullYear(), d.getMonth(), diff, 23, 59, 59, 999)
      case 'day':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
      case 'hour':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 59, 59, 999)
      case 'minute':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 59, 999)
      case 'second':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 999)
    }
  }

  /**
   * 判断是否为同一天
   */
  static isSameDay(date1: DateInput, date2: DateInput): boolean {
    const d1 = this.parse(date1)
    const d2 = this.parse(date2)
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  /**
   * 判断是否在指定日期之前
   */
  static isBefore(date1: DateInput, date2: DateInput): boolean {
    return this.parse(date1).getTime() < this.parse(date2).getTime()
  }

  /**
   * 判断是否在指定日期之后
   */
  static isAfter(date1: DateInput, date2: DateInput): boolean {
    return this.parse(date1).getTime() > this.parse(date2).getTime()
  }

  /**
   * 判断是否在日期范围内
   */
  static isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
    const d = this.parse(date).getTime()
    return d >= this.parse(start).getTime() && d <= this.parse(end).getTime()
  }

  /**
   * 判断是否为闰年
   */
  static isLeapYear(date: DateInput): boolean {
    const year = this.parse(date).getFullYear()
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  /**
   * 获取某月天数
   */
  static daysInMonth(date: DateInput): number {
    const d = this.parse(date)
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  }

  /**
   * 获取某年天数
   */
  static daysInYear(date: DateInput): number {
    return this.isLeapYear(date) ? 366 : 365
  }

  /**
   * 相对时间描述
   */
  static relative(date: DateInput, baseDate: DateInput = new Date()): string {
    const d = this.parse(date)
    const base = this.parse(baseDate)
    const diffSec = Math.floor((base.getTime() - d.getTime()) / 1000)

    const units: [number, string, string][] = [
      [60, '秒', '秒'],
      [60, '分钟', '分钟'],
      [24, '小时', '小时'],
      [30, '天', '天'],
      [12, '个月', '个月'],
      [Infinity, '年', '年'],
    ]

    let value = Math.abs(diffSec)
    let unitIndex = 0

    for (let i = 0; i < units.length; i++) {
      if (value < units[i][0]) {
        unitIndex = i
        break
      }
      value = Math.floor(value / units[i][0])
    }

    const unit = units[unitIndex][1]
    const suffix = diffSec > 0 ? '前' : '后'

    if (unitIndex === 0 && value < 10) {
      return '刚刚'
    }

    return `${value}${unit}${suffix}`
  }

  /**
   * 获取星期几
   */
  static dayOfWeek(date: DateInput): number {
    return this.parse(date).getDay()
  }

  /**
   * 获取星期几名称
   */
  static dayOfWeekName(date: DateInput, locale: 'zh' | 'en' = 'zh'): string {
    const day = this.dayOfWeek(date)
    const names = {
      zh: ['日', '一', '二', '三', '四', '五', '六'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }
    return locale === 'zh' ? `星期${names.zh[day]}` : names.en[day]
  }

  /**
   * 获取今天
   */
  static today(): Date {
    return this.startOf(new Date(), 'day')
  }

  /**
   * 获取明天
   */
  static tomorrow(): Date {
    return this.add(this.today(), 1, 'day')
  }

  /**
   * 获取昨天
   */
  static yesterday(): Date {
    return this.subtract(this.today(), 1, 'day')
  }
}