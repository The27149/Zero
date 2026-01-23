# Zero

> 0 is All - 一个通用、无限可扩展的 JavaScript/TypeScript 工具库

## 特性

- **分层架构**: Core 核心层 + Utils 工具层 + 功能模块
- **按需加载**: 功能模块支持 Tree-shaking，只打包使用的代码
- **类型完备**: 100% TypeScript 开发，完整的类型提示
- **多环境支持**: Web、Node.js、Cocos Creator 等多环境适配
- **无限扩展**: 插件系统支持自定义扩展

## 安装

```bash
npm install zero-toolkit
```

## 快速开始

### 方式 1: 全局命名空间

```typescript
import 'zero-toolkit'

// 使用全局 Zero 对象
Zero.logger.info('Hello Zero!')
Zero.config.set('debug', true)
Zero.event.on('ready', () => console.log('App ready'))
```

### 方式 2: 按需导入

```typescript
import { deepClone, debounce, uuid } from 'zero-toolkit'
import { isArray, isNil } from 'zero-toolkit/utils/is'

const cloned = deepClone({ a: 1, b: { c: 2 } })
const debouncedFn = debounce(() => console.log('debounced'), 300)
const id = uuid()
```

### 方式 3: 导入功能模块

```typescript
// 算法模块
import { quickSort, LRUCache, Heap } from 'zero-toolkit/algorithm'

// 设计模式
import { Singleton, StateMachine, ObjectPool } from 'zero-toolkit/pattern'

// 网络模块
import { http, createCache } from 'zero-toolkit/network'

// 平台工具
import { dom, clipboard } from 'zero-toolkit/platform/web'
```

## 模块清单

### Core (核心层)
- `config` - 配置管理
- `logger` - 日志系统
- `error` - 错误处理
- `event` - 事件机制
- `plugin` - 插件系统

### Utils (通用工具)
- `is` - 类型判断
- `array` - 数组操作
- `object` - 对象操作
- `string` - 字符串处理
- `function` - 函数工具
- `date` - 日期工具
- `random` - 随机工具
- `math` - 数学工具

### Algorithm (算法)
- `sort` - 排序算法
- `search` - 搜索算法
- `struct` - 数据结构 (LRUCache, Heap, LinkedList, Trie)

### Pattern (设计模式)
- `creational` - 创建型 (Singleton, Factory, Builder)
- `behavioral` - 行为型 (Observer, StateMachine, Strategy, Command)
- `structural` - 结构型 (Adapter, Decorator, Proxy, Facade)
- `concurrency` - 并发型 (ObjectPool, Scheduler, Semaphore)

### Network (网络)
- `http` - HTTP 客户端
- `cache` - 缓存
- `storage` - 存储抽象

### UI (交互)
- `drag` - 拖拽
- `gesture` - 手势识别
- `toast` - 消息提示
- `dialog` - 对话框

### File (文件)
- `download` - 下载
- `upload` - 上传
- `reader` - 文件读取

### Platform (平台工具)
- `web` - Web 平台 (DOM, 剪贴板, 全屏)
- `node` - Node.js 平台 (文件系统, CLI)
- `cocos` - Cocos Creator 平台

### Framework (应用框架)
- `cocos-game` - Cocos 游戏框架
- `node-server` - Node 服务框架

### Preset (预设)
- `default` - 默认预设
- `game` - 游戏预设
- `server` - 服务端预设
- `mobile` - 移动端预设

## 类型发现

```typescript
import type { ZeroModules } from 'zero-toolkit'

// 在 IDE 中，点击 ZeroModules 的各个属性可以跳转到对应模块的类型定义
// 查看该模块所有可用的函数和类
```

## License

MIT
