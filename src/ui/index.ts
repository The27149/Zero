/**
 * Zero UI
 * UI 与交互模块
 */

/**
 * 拖拽选项
 */
export interface DragOptions {
  target: HTMLElement
  handle?: HTMLElement
  bounds?: HTMLElement | 'parent' | 'window'
  axis?: 'x' | 'y' | 'both'
  onStart?: (e: MouseEvent | TouchEvent) => void
  onMove?: (e: MouseEvent | TouchEvent, delta: { x: number; y: number }) => void
  onEnd?: (e: MouseEvent | TouchEvent) => void
}

/**
 * 创建拖拽
 */
export function createDrag(options: DragOptions): { destroy: () => void } {
  const { target, handle = target, axis = 'both', onStart, onMove, onEnd } = options

  let startX = 0
  let startY = 0
  let isDragging = false

  const getPosition = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const handleStart = (e: MouseEvent | TouchEvent) => {
    isDragging = true
    const pos = getPosition(e)
    startX = pos.x
    startY = pos.y
    onStart?.(e)
  }

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    const pos = getPosition(e)
    const delta = {
      x: axis === 'y' ? 0 : pos.x - startX,
      y: axis === 'x' ? 0 : pos.y - startY,
    }
    startX = pos.x
    startY = pos.y
    onMove?.(e, delta)
  }

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    isDragging = false
    onEnd?.(e)
  }

  handle.addEventListener('mousedown', handleStart)
  handle.addEventListener('touchstart', handleStart)
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchend', handleEnd)

  return {
    destroy() {
      handle.removeEventListener('mousedown', handleStart)
      handle.removeEventListener('touchstart', handleStart)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    },
  }
}

/**
 * 手势类型
 */
export type GestureType = 'tap' | 'doubletap' | 'press' | 'swipe' | 'pinch'

/**
 * 手势选项
 */
export interface GestureOptions {
  target: HTMLElement
  onTap?: (e: TouchEvent) => void
  onDoubleTap?: (e: TouchEvent) => void
  onPress?: (e: TouchEvent) => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', e: TouchEvent) => void
}

/**
 * 创建手势识别
 */
export function createGesture(options: GestureOptions): { destroy: () => void } {
  const { target, onTap, onDoubleTap, onPress, onSwipe } = options

  let startX = 0
  let startY = 0
  let startTime = 0
  let lastTapTime = 0
  let pressTimer: ReturnType<typeof setTimeout> | null = null

  const handleStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startTime = Date.now()

    if (onPress) {
      pressTimer = setTimeout(() => {
        onPress(e)
      }, 500)
    }
  }

  const handleEnd = (e: TouchEvent) => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const duration = Date.now() - startTime
    const deltaX = endX - startX
    const deltaY = endY - startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Swipe detection
    if (distance > 50 && duration < 300 && onSwipe) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe(deltaX > 0 ? 'right' : 'left', e)
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up', e)
      }
      return
    }

    // Tap detection
    if (distance < 10 && duration < 300) {
      const now = Date.now()

      if (onDoubleTap && now - lastTapTime < 300) {
        onDoubleTap(e)
        lastTapTime = 0
      } else {
        lastTapTime = now
        if (onTap) {
          setTimeout(() => {
            if (lastTapTime !== 0) {
              onTap(e)
            }
          }, 300)
        }
      }
    }
  }

  target.addEventListener('touchstart', handleStart)
  target.addEventListener('touchend', handleEnd)

  return {
    destroy() {
      target.removeEventListener('touchstart', handleStart)
      target.removeEventListener('touchend', handleEnd)
      if (pressTimer) clearTimeout(pressTimer)
    },
  }
}

/**
 * Toast 选项
 */
export interface ToastOptions {
  message: string
  duration?: number
  position?: 'top' | 'center' | 'bottom'
  type?: 'info' | 'success' | 'warning' | 'error'
}

/**
 * 显示 Toast
 */
export function showToast(options: ToastOptions | string): void {
  const opts: ToastOptions =
    typeof options === 'string' ? { message: options } : options
  const { message, duration = 3000, position = 'center', type = 'info' } = opts

  const toast = document.createElement('div')
  toast.className = `zero-toast zero-toast-${position} zero-toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    border-radius: 4px;
    z-index: 9999;
    transition: opacity 0.3s;
    ${position === 'top' ? 'top: 20px;' : ''}
    ${position === 'center' ? 'top: 50%; transform: translate(-50%, -50%);' : ''}
    ${position === 'bottom' ? 'bottom: 20px;' : ''}
  `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 300)
  }, duration)
}

/**
 * Dialog 选项
 */
export interface DialogOptions {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

/**
 * 显示对话框
 */
export function showDialog(options: DialogOptions): { close: () => void } {
  const {
    title = '',
    content,
    confirmText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel,
  } = options

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `

  const dialog = document.createElement('div')
  dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 20px;
    min-width: 300px;
    max-width: 80%;
  `

  dialog.innerHTML = `
    ${title ? `<h3 style="margin: 0 0 12px 0;">${title}</h3>` : ''}
    <p style="margin: 0 0 20px 0;">${content}</p>
    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button class="cancel-btn" style="padding: 8px 16px; cursor: pointer;">${cancelText}</button>
      <button class="confirm-btn" style="padding: 8px 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;">${confirmText}</button>
    </div>
  `

  overlay.appendChild(dialog)
  document.body.appendChild(overlay)

  const close = () => overlay.remove()

  dialog.querySelector('.confirm-btn')?.addEventListener('click', () => {
    onConfirm?.()
    close()
  })

  dialog.querySelector('.cancel-btn')?.addEventListener('click', () => {
    onCancel?.()
    close()
  })

  return { close }
}
