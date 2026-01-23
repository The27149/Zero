/**
 * Zero Utils - String
 * 字符串工具
 */

/**
 * 去除两端空白
 */
export function trim(str: string, chars?: string): string {
  if (!chars) return str.trim()
  const pattern = new RegExp(`^[${escapeRegExp(chars)}]+|[${escapeRegExp(chars)}]+$`, 'g')
  return str.replace(pattern, '')
}

/**
 * 去除左侧空白
 */
export function trimStart(str: string, chars?: string): string {
  if (!chars) return str.trimStart()
  const pattern = new RegExp(`^[${escapeRegExp(chars)}]+`, 'g')
  return str.replace(pattern, '')
}

/**
 * 去除右侧空白
 */
export function trimEnd(str: string, chars?: string): string {
  if (!chars) return str.trimEnd()
  const pattern = new RegExp(`[${escapeRegExp(chars)}]+$`, 'g')
  return str.replace(pattern, '')
}

/**
 * 转驼峰命名 (camelCase)
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
}

/**
 * 转帕斯卡命名 (PascalCase)
 */
export function pascalCase(str: string): string {
  const camel = camelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * 转短横线命名 (kebab-case)
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * 转下划线命名 (snake_case)
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * 转常量命名 (CONSTANT_CASE)
 */
export function constantCase(str: string): string {
  return snakeCase(str).toUpperCase()
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 首字母小写
 */
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * 每个单词首字母大写
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * 字符串模板
 */
export function template(str: string, data: Record<string, unknown>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => {
    return data[key] !== undefined ? String(data[key]) : `{${key}}`
  })
}

/**
 * 高级模板（支持嵌套路径）
 */
export function templateAdvanced(
  str: string,
  data: Record<string, unknown>,
  options: { start?: string; end?: string } = {}
): string {
  const { start = '{{', end = '}}' } = options
  const pattern = new RegExp(`${escapeRegExp(start)}\\s*([\\w.]+)\\s*${escapeRegExp(end)}`, 'g')

  return str.replace(pattern, (_, path: string) => {
    const keys = path.split('.')
    let value: unknown = data
    for (const key of keys) {
      if (value == null) return `${start}${path}${end}`
      value = (value as Record<string, unknown>)[key]
    }
    return value !== undefined ? String(value) : `${start}${path}${end}`
  })
}

/**
 * 截断字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

/**
 * 填充字符串（左侧）
 */
export function padStart(str: string, length: number, char: string = ' '): string {
  return str.padStart(length, char)
}

/**
 * 填充字符串（右侧）
 */
export function padEnd(str: string, length: number, char: string = ' '): string {
  return str.padEnd(length, char)
}

/**
 * 重复字符串
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count)
}

/**
 * HTML 转义
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char])
}

/**
 * HTML 反转义
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => htmlUnescapes[entity] || entity)
}

/**
 * 正则转义
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 移除 HTML 标签
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

/**
 * 计算字符串字节长度
 */
export function byteLength(str: string): number {
  return new Blob([str]).size
}

/**
 * 按字节截断
 */
export function truncateBytes(str: string, maxBytes: number, suffix: string = '...'): string {
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

/**
 * 反转字符串
 */
export function reverse(str: string): string {
  return [...str].reverse().join('')
}

/**
 * 统计子串出现次数
 */
export function countOccurrences(str: string, substr: string): number {
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
 * 检查是否以指定字符串开头
 */
export function startsWith(str: string, search: string, position: number = 0): boolean {
  return str.startsWith(search, position)
}

/**
 * 检查是否以指定字符串结尾
 */
export function endsWith(str: string, search: string, length?: number): boolean {
  return str.endsWith(search, length)
}

/**
 * 检查是否包含子串
 */
export function includes(str: string, search: string, position: number = 0): boolean {
  return str.includes(search, position)
}

/**
 * 分割字符串（保留分隔符）
 */
export function splitKeep(str: string, separator: string | RegExp): string[] {
  const parts = str.split(separator)
  const matches = str.match(separator instanceof RegExp ? new RegExp(separator, 'g') : separator)

  if (!matches) return parts

  const result: string[] = []
  parts.forEach((part, i) => {
    result.push(part)
    if (matches[i]) result.push(matches[i])
  })

  return result.filter(Boolean)
}

/**
 * 生成随机字符串
 */
export function random(length: number = 8, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 单词数统计
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length
}

/**
 * 字符数统计（不含空格）
 */
export function charCount(str: string, excludeSpaces: boolean = true): number {
  return excludeSpaces ? str.replace(/\s/g, '').length : str.length
}

/**
 * 行数统计
 */
export function lineCount(str: string): number {
  return str.split(/\r?\n/).length
}

/**
 * 格式化数字为千分位
 */
export function formatNumber(num: number | string, separator: string = ','): string {
  const [integer, decimal] = String(num).split('.')
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return decimal ? `${formatted}.${decimal}` : formatted
}

/**
 * 遮罩字符串
 */
export function mask(str: string, start: number = 0, end?: number, char: string = '*'): string {
  const len = str.length
  end = end ?? len
  if (start >= len || start >= end) return str

  const prefix = str.slice(0, start)
  const suffix = str.slice(end)
  const masked = char.repeat(Math.min(end, len) - start)

  return prefix + masked + suffix
}
