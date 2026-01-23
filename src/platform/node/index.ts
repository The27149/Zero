/**
 * Zero Platform - Node
 * Node.js 平台工具 (占位)
 */

/**
 * 文件系统工具
 * @description 需要在 Node.js 环境中使用
 */
export const fs = {
  /**
   * 读取文件
   */
  async read(path: string): Promise<string> {
    const { readFile } = await import('fs/promises')
    return readFile(path, 'utf-8')
  },

  /**
   * 写入文件
   */
  async write(path: string, data: string): Promise<void> {
    const { writeFile } = await import('fs/promises')
    await writeFile(path, data, 'utf-8')
  },

  /**
   * 读取 JSON
   */
  async readJSON<T>(path: string): Promise<T> {
    const content = await this.read(path)
    return JSON.parse(content) as T
  },

  /**
   * 写入 JSON
   */
  async writeJSON(path: string, data: unknown, pretty: boolean = true): Promise<void> {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
    await this.write(path, content)
  },

  /**
   * 检查文件是否存在
   */
  async exists(path: string): Promise<boolean> {
    const { access } = await import('fs/promises')
    try {
      await access(path)
      return true
    } catch {
      return false
    }
  },

  /**
   * 创建目录
   */
  async mkdir(path: string, recursive: boolean = true): Promise<void> {
    const { mkdir } = await import('fs/promises')
    await mkdir(path, { recursive })
  },

  /**
   * 确保目录存在
   */
  async ensureDir(path: string): Promise<void> {
    if (!(await this.exists(path))) {
      await this.mkdir(path)
    }
  },

  /**
   * 删除文件或目录
   */
  async remove(path: string): Promise<void> {
    const { rm } = await import('fs/promises')
    await rm(path, { recursive: true, force: true })
  },

  /**
   * 复制文件
   */
  async copy(src: string, dest: string): Promise<void> {
    const { copyFile } = await import('fs/promises')
    await copyFile(src, dest)
  },

  /**
   * 移动/重命名文件
   */
  async move(src: string, dest: string): Promise<void> {
    const { rename } = await import('fs/promises')
    await rename(src, dest)
  },

  /**
   * 列出目录内容
   */
  async readdir(path: string): Promise<string[]> {
    const { readdir } = await import('fs/promises')
    return readdir(path)
  },
}

/**
 * 路径工具
 */
export const path = {
  /**
   * 连接路径
   */
  async join(...paths: string[]): Promise<string> {
    const { join } = await import('path')
    return join(...paths)
  },

  /**
   * 获取目录名
   */
  async dirname(p: string): Promise<string> {
    const { dirname } = await import('path')
    return dirname(p)
  },

  /**
   * 获取文件名
   */
  async basename(p: string, ext?: string): Promise<string> {
    const { basename } = await import('path')
    return basename(p, ext)
  },

  /**
   * 获取扩展名
   */
  async extname(p: string): Promise<string> {
    const { extname } = await import('path')
    return extname(p)
  },

  /**
   * 解析为绝对路径
   */
  async resolve(...paths: string[]): Promise<string> {
    const { resolve } = await import('path')
    return resolve(...paths)
  },
}

/**
 * CLI 工具
 */
export const cli = {
  /**
   * 打印彩色文本
   */
  print(text: string, color?: 'red' | 'green' | 'yellow' | 'blue' | 'cyan' | 'magenta'): void {
    const colors: Record<string, string> = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
    }
    const reset = '\x1b[0m'
    console.log(color ? `${colors[color]}${text}${reset}` : text)
  },

  /**
   * 成功信息
   */
  success(text: string): void {
    this.print(`✓ ${text}`, 'green')
  },

  /**
   * 错误信息
   */
  error(text: string): void {
    this.print(`✗ ${text}`, 'red')
  },

  /**
   * 警告信息
   */
  warn(text: string): void {
    this.print(`⚠ ${text}`, 'yellow')
  },

  /**
   * 信息
   */
  info(text: string): void {
    this.print(`ℹ ${text}`, 'cyan')
  },
}
