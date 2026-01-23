/**
 * Zero File
 * 文件与资源模块
 */

/**
 * 下载选项
 */
export interface DownloadOptions {
  filename?: string
  type?: string
}

/**
 * 下载文件
 */
export function download(data: Blob | string, options: DownloadOptions = {}): void {
  const blob = typeof data === 'string' ? new Blob([data], { type: options.type ?? 'text/plain' }) : data
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = options.filename ?? 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 下载 URL 文件
 */
export async function downloadUrl(url: string, filename?: string): Promise<void> {
  const response = await fetch(url)
  const blob = await response.blob()
  download(blob, { filename: filename ?? url.split('/').pop() ?? 'download' })
}

/**
 * 读取文件
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

/**
 * 读取文件为 DataURL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * 读取文件为 ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 选择文件
 */
export function selectFile(options: {
  accept?: string
  multiple?: boolean
} = {}): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = options.accept ?? ''
    input.multiple = options.multiple ?? false

    input.onchange = () => {
      resolve(Array.from(input.files ?? []))
    }

    input.click()
  })
}

/**
 * 上传选项
 */
export interface UploadOptions {
  url: string
  file: File
  fieldName?: string
  headers?: Record<string, string>
  data?: Record<string, string>
  onProgress?: (percent: number) => void
}

/**
 * 上传文件
 */
export function upload<T = unknown>(options: UploadOptions): Promise<T> {
  const { url, file, fieldName = 'file', headers = {}, data = {}, onProgress } = options

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()

    formData.append(fieldName, file)
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          resolve(xhr.responseText as unknown as T)
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Upload failed')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.open('POST', url)
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.send(formData)
  })
}

/**
 * 获取文件扩展名
 */
export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  return idx === -1 ? '' : filename.slice(idx + 1).toLowerCase()
}

/**
 * 获取文件名（不含扩展名）
 */
export function getBasename(filename: string): string {
  const idx = filename.lastIndexOf('.')
  return idx === -1 ? filename : filename.slice(0, idx)
}

/**
 * 格式化文件大小
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 判断是否为图片
 */
export function isImage(file: File | string): boolean {
  const ext = typeof file === 'string' ? getExtension(file) : getExtension(file.name)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)
}

/**
 * 判断是否为视频
 */
export function isVideo(file: File | string): boolean {
  const ext = typeof file === 'string' ? getExtension(file) : getExtension(file.name)
  return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(ext)
}

/**
 * 判断是否为音频
 */
export function isAudio(file: File | string): boolean {
  const ext = typeof file === 'string' ? getExtension(file) : getExtension(file.name)
  return ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma', 'm4a'].includes(ext)
}
