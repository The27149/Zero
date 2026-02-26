/**
 * Zero Core - StringUtils
 * 字符串处理工具类
 */


export class StringUtils {

  // #region 格式化

  /**
   * 去除两端空白
   * @example
   * StringUtils.trim('  hello  ') // 'hello'
   * StringUtils.trim('**hello**', '*') // 'hello'
   * @param str - 源字符串
   * @param chars - 要移除的字符集合，不传则移除空白字符
   */
  static trim(str: string, chars?: string): string {
    if (!chars) return str.trim()
    const pattern = new RegExp(`^[${this.escapeRegExp(chars)}]+|[${this.escapeRegExp(chars)}]+$`, 'g')
    return str.replace(pattern, '')
  }

  /**
   * 去除左侧空白
   * @example
   * StringUtils.trimStart('  hello') // 'hello'
   * StringUtils.trimStart('**hello', '*') // 'hello'
   * @param str - 源字符串
   * @param chars - 要移除的字符集合，不传则移除空白字符
   */
  static trimStart(str: string, chars?: string): string {
    if (!chars) return str.trimStart()
    const pattern = new RegExp(`^[${this.escapeRegExp(chars)}]+`, 'g')
    return str.replace(pattern, '')
  }

  /**
   * 去除右侧空白
   * @example
   * StringUtils.trimEnd('hello  ') // 'hello'
   * StringUtils.trimEnd('hello**', '*') // 'hello'
   * @param str - 源字符串
   * @param chars - 要移除的字符集合，不传则移除空白字符
   */
  static trimEnd(str: string, chars?: string): string {
    if (!chars) return str.trimEnd()
    const pattern = new RegExp(`[${this.escapeRegExp(chars)}]+$`, 'g')
    return str.replace(pattern, '')
  }

  /**
   * 转换为驼峰命名
   * @example
   * StringUtils.toCamel('hello-world') // 'helloWorld'
   * StringUtils.toCamel('hello_world') // 'helloWorld'
   * StringUtils.toCamel('Hello World') // 'helloWorld'
   * StringUtils.toCamel('Hello World', true) // 'HelloWorld'
   * @param str - 源字符串
   * @param upperFirst - 是否首字母大写 (大驼峰/PascalCase)，默认 false (小驼峰/camelCase)
   */
  static toCamel(str: string, upperFirst: boolean = false): string {
    const result = str
      .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^[A-Z]/, (c) => c.toLowerCase())
    return upperFirst ? result.charAt(0).toUpperCase() + result.slice(1) : result
  }

  /**
   * 转换为连接符命名
   * @example
   * StringUtils.toSeparator('helloWorld', '-') // 'hello-world'
   * StringUtils.toSeparator('helloWorld', '_') // 'hello_world'
   * StringUtils.toSeparator('helloWorld', ' ', true) // 'HELLO WORLD'
   * @param str - 源字符串
   * @param separator - 连接符，如 '-', '_', ' '
   * @param uppercase - 是否全大写，默认 false
   */
  static toSeparator(str: string, separator: string, uppercase: boolean = false): string {
    const camel = this.toCamel(str)
    const result = camel.replace(/([a-z])([A-Z])/g, `$1${separator}`).toLowerCase()
    return uppercase ? result.toUpperCase() : result
  }

  // #endregion

  // #region 转义

  /**
   * 正则转义
   * 每匹配到一个特殊字符 X  替换成 \X
   */
  static escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // #endregion

  // #region 查询与判断

  /**
   * 统计子串出现次数
   */
  static countSubStr(str: string, substr: string): number {
    if (!substr) return 0
    let count = 0
    let pos = 0
    while ((pos = str.indexOf(substr, pos)) !== -1) {
      count++
      pos += substr.length
    }
    return count
  }

  /**
   * 单词数统计
   */
  static countWord(str: string): number {
    return str.trim().split(/\s+/).filter(Boolean).length
  }

  /**
   * 字符数统计（不含空格）
   */
  static countChar(str: string, excludeSpaces: boolean = true): number {
    return excludeSpaces ? str.replace(/\s/g, '').length : str.length
  }

  /**
   * 行数统计
   */
  static countLine(str: string): number {
    return str.split(/\r?\n/).length
  }

  // #endregion

  // #region 工具方法

  /**
   * 遮罩字符串 安全
   */
  static mask(str: string, start: number = 0, end?: number, char: string = '*'): string {
    const len = str.length
    end = end ?? len
    if (start >= len || start >= end) return str

    const prefix = str.slice(0, start)
    const suffix = str.slice(end)
    const masked = char.repeat(Math.min(end, len) - start)

    return prefix + masked + suffix
  }

  /**
  * 截断字符串 自定义省略部分
  */
  static clampChar(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str
    return str.slice(0, length - suffix.length) + suffix
  }

  /**
   * 按字节截断
   */
  static clampBytes(str: string, maxBytes: number, suffix: string = '...'): string {
    const encoder = new TextEncoder()
    const suffixBytes = encoder.encode(suffix).length

    if (encoder.encode(str).length <= maxBytes) return str

    let result = ''
    let currentBytes = 0

    for (const char of str) {
      const charBytes = encoder.encode(char).length
      if (currentBytes + charBytes + suffixBytes > maxBytes) break
      result += char
      currentBytes += charBytes
    }

    return result + suffix
  }

  // #endregion

}