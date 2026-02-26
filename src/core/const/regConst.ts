/**
 * Zero Core - RegConst
 * 常用正则表达式常量
 */

export class RegConst {

  // #region 邮箱、手机号、身份证

  /** 电子邮箱 */
  static readonly email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  /** 中国大陆手机号 */
  static readonly phoneCn = /^1[3-9]\d{9}$/

  /** 中国大陆身份证号 (18位) */
  static readonly idCardCn = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/

  // #endregion

  // #region URL、IP、域名

  /** URL */
  static readonly URL = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

  /** IPv4 地址 */
  static readonly IPV4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

  /** IPv6 地址 */
  static readonly IPV6 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

  /** 域名 */
  static readonly DOMAIN = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

  // #endregion

  // #region 数字

  /** 整数 (正负整数) */
  static readonly INTEGER = /^-?\d+$/

  /** 正整数 */
  static readonly POSITIVE_INTEGER = /^[1-9]\d*$/

  /** 负整数 */
  static readonly NEGATIVE_INTEGER = /^-[1-9]\d*$/

  /** 浮点数 */
  static readonly FLOAT = /^-?\d+\.\d+$/

  /** 正浮点数 */
  static readonly POSITIVE_FLOAT = /^\d+\.\d+$/

  /** 数字 (整数或浮点数) */
  static readonly NUMBER = /^-?\d+(\.\d+)?$/

  /** 十六进制颜色 */
  static readonly HEX_COLOR = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

  // #endregion

  // #region 字符串

  /** 中文字符 */
  static readonly CHINESE = /^[\u4e00-\u9fa5]+$/

  /** 英文字符 */
  static readonly ENGLISH = /^[a-zA-Z]+$/

  /** 数字字符 */
  static readonly DIGIT = /^\d+$/

  /** 字母和数字 */
  static readonly ALPHANUMERIC = /^[a-zA-Z0-9]+$/

  /** 字母、数字和下划线 */
  static readonly ALPHANUMERIC_UNDERSCORE = /^\w+$/

  /** 空白字符 */
  static readonly WHITESPACE = /^\s+$/

  // #endregion

  // #region 时间日期

  /** 日期 (YYYY-MM-DD) */
  static readonly DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

  /** 时间 (HH:mm:ss) */
  static readonly TIME = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/

  /** 日期时间 (YYYY-MM-DD HH:mm:ss) */
  static readonly DATETIME = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/

  // #endregion

  // #region 格式规范

  /** 驼峰命名 (camelCase) */
  static readonly CAMEL_CASE = /^[a-z][a-zA-Z0-9]*$/

  /** 帕斯卡命名 (PascalCase) */
  static readonly PASCAL_CASE = /^[A-Z][a-zA-Z0-9]*$/

  /** 短横线命名 (kebab-case) */
  static readonly KEBAB_CASE = /^[a-z][a-z0-9-]*[a-z0-9]$/

  /** 下划线命名 (snake_case) */
  static readonly SNAKE_CASE = /^[a-z][a-z0-9_]*[a-z0-9]$/

  /** 常量命名 (CONSTANT_CASE) */
  static readonly CONSTANT_CASE = /^[A-Z][A-Z0-9_]*[A-Z0-9]$/

  // #endregion

  // #region 特殊字符

  /** 仅包含可打印 ASCII 字符 */
  static readonly PRINTABLE_ASCII = /^[\x20-\x7E]*$/

  /** 仅包含可见 ASCII 字符 (不含空格) */
  static readonly VISIBLE_ASCII = /^[\x21-\x7E]*$/

  /** Base64 编码 */
  static readonly BASE64 = /^[A-Za-z0-9+/]*={0,2}$/

  /** UUID v4 */
  static readonly UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

  // #endregion

  // #region HTML 标签

  /** HTML 标签 */
  static readonly HTML_TAG = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/i

  /** 自闭合 HTML 标签 */
  static readonly HTML_SELF_CLOSING_TAG = /^<([a-z]+)([^<]+)*\s+\/>$/i

  // #endregion

  // #region 密码强度

  /** 弱密码 (至少6位) */
  static readonly PASSWORD_WEAK = /^.{6,}$/

  /** 中等密码 (至少8位，包含字母和数字) */
  static readonly PASSWORD_MEDIUM = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

  /** 强密码 (至少8位，包含大小写字母、数字和特殊字符) */
  static readonly PASSWORD_STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  // #endregion

  // #region 编码

  /** 颜色十六进制 (#RRGGBB 或 #RGB) */
  static readonly COLOR_HEX = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

  /** RGB 颜色 */
  static readonly COLOR_RGB = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/

  /** RGBA 颜色 */
  static readonly COLOR_RGBA = /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/

  // #endregion

}