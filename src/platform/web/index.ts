/**
 * Zero Platform - Web
 * Web 平台工具
 */

/**
 * DOM 操作工具
 */
export const dom = {
  /**
   * 查询单个元素
   */
  query<T extends HTMLElement = HTMLElement>(selector: string, parent: Element = document.documentElement): T | null {
    return parent.querySelector<T>(selector)
  },

  /**
   * 查询所有元素
   */
  queryAll<T extends HTMLElement = HTMLElement>(selector: string, parent: Element = document.documentElement): T[] {
    return Array.from(parent.querySelectorAll<T>(selector))
  },

  /**
   * 添加类名
   */
  addClass(el: Element, ...classNames: string[]): void {
    el.classList.add(...classNames)
  },

  /**
   * 移除类名
   */
  removeClass(el: Element, ...classNames: string[]): void {
    el.classList.remove(...classNames)
  },

  /**
   * 切换类名
   */
  toggleClass(el: Element, className: string, force?: boolean): boolean {
    return el.classList.toggle(className, force)
  },

  /**
   * 检查是否有类名
   */
  hasClass(el: Element, className: string): boolean {
    return el.classList.contains(className)
  },

  /**
   * 设置样式
   */
  setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(el.style, styles)
  },

  /**
   * 获取样式
   */
  getStyle(el: HTMLElement, prop: string): string {
    return getComputedStyle(el).getPropertyValue(prop)
  },

  /**
   * 设置属性
   */
  setAttr(el: Element, attrs: Record<string, string>): void {
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value)
    })
  },

  /**
   * 获取属性
   */
  getAttr(el: Element, name: string): string | null {
    return el.getAttribute(name)
  },

  /**
   * 创建元素
   */
  create<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    options?: {
      class?: string | string[]
      attrs?: Record<string, string>
      style?: Partial<CSSStyleDeclaration>
      children?: (Node | string)[]
    }
  ): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag)
    if (options?.class) {
      const classes = Array.isArray(options.class) ? options.class : [options.class]
      el.classList.add(...classes)
    }
    if (options?.attrs) {
      this.setAttr(el, options.attrs)
    }
    if (options?.style) {
      this.setStyle(el, options.style)
    }
    if (options?.children) {
      options.children.forEach((child) => {
        el.append(child)
      })
    }
    return el
  },
}

/**
 * 事件工具
 */
export const event = {
  /**
   * 事件委托
   */
  delegate<T extends Event>(
    container: Element,
    eventType: string,
    selector: string,
    handler: (e: T, target: Element) => void
  ): () => void {
    const listener = (e: Event) => {
      const target = (e.target as Element).closest(selector)
      if (target && container.contains(target)) {
        handler(e as T, target)
      }
    }
    container.addEventListener(eventType, listener)
    return () => container.removeEventListener(eventType, listener)
  },

  /**
   * 一次性事件
   */
  once<K extends keyof HTMLElementEventMap>(
    el: Element,
    eventType: K,
    handler: (e: HTMLElementEventMap[K]) => void
  ): void {
    el.addEventListener(eventType, handler, { once: true })
  },
}

/**
 * 剪贴板工具
 */
export const clipboard = {
  /**
   * 复制文本
   */
  async copy(text: string): Promise<void> {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  },

  /**
   * 读取文本
   */
  async paste(): Promise<string> {
    if (navigator.clipboard) {
      return navigator.clipboard.readText()
    }
    return ''
  },
}

/**
 * 全屏工具
 */
export const fullscreen = {
  /**
   * 进入全屏
   */
  async enter(el: Element = document.documentElement): Promise<void> {
    if (el.requestFullscreen) {
      await el.requestFullscreen()
    }
  },

  /**
   * 退出全屏
   */
  async exit(): Promise<void> {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    }
  },

  /**
   * 切换全屏
   */
  async toggle(el: Element = document.documentElement): Promise<void> {
    if (this.isFullscreen()) {
      await this.exit()
    } else {
      await this.enter(el)
    }
  },

  /**
   * 是否全屏
   */
  isFullscreen(): boolean {
    return document.fullscreenElement !== null
  },

  /**
   * 监听全屏变化
   */
  onChange(callback: (isFullscreen: boolean) => void): () => void {
    const handler = () => callback(this.isFullscreen())
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  },
}

/**
 * 页面可见性
 */
export const visibility = {
  /**
   * 是否可见
   */
  isVisible(): boolean {
    return document.visibilityState === 'visible'
  },

  /**
   * 监听可见性变化
   */
  onChange(callback: (visible: boolean) => void): () => void {
    const handler = () => callback(this.isVisible())
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  },
}

/**
 * URL 工具
 */
export const url = {
  /**
   * 获取查询参数
   */
  getQuery(key: string): string | null {
    return new URLSearchParams(location.search).get(key)
  },

  /**
   * 获取所有查询参数
   */
  getAllQuery(): Record<string, string> {
    const params: Record<string, string> = {}
    new URLSearchParams(location.search).forEach((value, key) => {
      params[key] = value
    })
    return params
  },

  /**
   * 设置查询参数
   */
  setQuery(params: Record<string, string>): void {
    const searchParams = new URLSearchParams(location.search)
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value)
    })
    history.replaceState(null, '', `${location.pathname}?${searchParams.toString()}`)
  },
}
