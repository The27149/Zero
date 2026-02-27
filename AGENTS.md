# dora-pocket 项目文档

## 项目概述

**dora-pocket** 是一个通用、无限可扩展的 JavaScript/TypeScript 工具库，提供了一系列实用工具函数、算法、设计模式和跨平台支持。

### 核心特性

- **TypeScript 原生支持**：完整的类型定义和类型推断
- **模块化架构**：支持按需导入，减小打包体积
- **跨平台兼容**：支持 Web、Node.js、Cocos 等多个平台
- **丰富的工具集**：包含核心工具、算法、设计模式、网络、文件操作等模块
- **Tree-shaking 友好**：支持 ESM 和 CommonJS 双格式

### 技术栈

- **语言**：TypeScript 5.3+
- **构建工具**：tsup (基于 esbuild)
- **测试框架**：Vitest
- **代码检查**：ESLint + TypeScript ESLint
- **Node 版本要求**：>= 16.0.0

## 项目结构

```
dora-pocket/
├── src/                          # 源代码目录
│   ├── index.ts                  # 主入口文件
│   ├── global.ts                 # 全局扩展入口
│   ├── core/                     # 核心模块
│   │   ├── baseUtil/             # 基础工具函数
│   │   │   ├── arrayUtils.ts     # 数组工具
│   │   │   ├── functionUtils.ts  # 函数工具
│   │   │   ├── objectUtils.ts    # 对象工具
│   │   │   ├── randomUtils.ts    # 随机数工具
│   │   │   ├── stringUtils.ts    # 字符串工具
│   │   │   ├── timeUtils.ts      # 时间工具
│   │   │   └── typeCheck.ts      # 类型检查
│   │   ├── const/                # 常量定义
│   │   │   └── regConst.ts       # 正则表达式常量
│   │   ├── math/                 # 数学工具
│   │   │   └── mathUtils.ts      # 数学运算工具
│   │   ├── objects/              # 对象处理
│   │   ├── error.ts              # 错误处理
│   │   ├── event.ts              # 事件系统
│   │   ├── logger.ts             # 日志系统
│   │   └── index.ts              # 核心模块入口
│   ├── algorithm/                # 算法模块
│   │   ├── search/               # 搜索算法
│   │   │   └── index.ts
│   │   ├── sort/                 # 排序算法
│   │   │   └── index.ts
│   │   ├── struct/               # 数据结构
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pattern/                  # 设计模式模块
│   │   ├── behavioral/           # 行为型模式
│   │   │   └── index.ts
│   │   ├── concurrency/          # 并发模式
│   │   │   └── index.ts
│   │   ├── creational/           # 创建型模式
│   │   │   └── index.ts
│   │   ├── structural/           # 结构型模式
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── engineer/                 # 工程化模块
│   ├── file/                     # 文件操作模块
│   │   └── index.ts
│   ├── framework/                # 框架集成
│   │   ├── cocos-game/           # Cocos 游戏框架
│   │   │   └── index.ts
│   │   └── node-server/          # Node.js 服务框架
│   │       └── index.ts
│   ├── network/                  # 网络模块
│   │   └── index.ts
│   ├── platform/                 # 平台特定代码
│   │   ├── cocos/                # Cocos 平台
│   │   │   └── index.ts
│   │   ├── node/                 # Node.js 平台
│   │   │   └── index.ts
│   │   └── web/                  # Web 平台
│   │       └── index.ts
│   ├── preset/                   # 预设配置
│   │   └── index.ts
│   └── ui/                       # UI 模块
│       └── index.ts
├── dist/                         # 构建输出目录（自动生成）
├── node_modules/                 # 依赖包
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── tsup.config.ts                # tsup 构建配置
├── PUBLISH-NPM.md                # NPM 发布流程文档
└── README.md                     # 项目说明文档
```

## 模块说明

### 核心模块 (Core)

提供基础工具函数、常量定义、事件系统和日志系统。

**基础工具包括**：
- 数组操作工具 (`arrayUtils.ts`)
- 函数工具 (`functionUtils.ts`)
- 对象操作工具 (`objectUtils.ts`)
- 随机数生成 (`randomUtils.ts`)
- 字符串处理 (`stringUtils.ts`)
- 时间处理 (`timeUtils.ts`)
- 类型检查 (`typeCheck.ts`)
- 数学运算 (`mathUtils.ts`)

**导入方式**：
```typescript
// 导入整个核心模块
import * as core from 'dora-pocket/core'

// 导入特定工具
import { isArray, isObject } from 'dora-pocket/core'
```

### 算法模块 (Algorithm)

提供常用算法和数据结构。

**包含**：
- **搜索算法**：二分搜索、深度优先搜索(DFS)、广度优先搜索(BFS)、线性搜索等
- **排序算法**：快速排序、归并排序、堆排序等
- **数据结构**：LRU 缓存、堆、链表、栈、队列、字典树(Trie)等

**导入方式**：
```typescript
// 导入整个算法模块
import * as algorithm from 'dora-pocket/algorithm'

// 导入特定算法
import { quickSort, mergeSort } from 'dora-pocket/algorithm/sort'
import { binarySearch, dfs, bfs } from 'dora-pocket/algorithm/search'
import { LRUCache, Heap, LinkedList } from 'dora-pocket/algorithm/struct'
```

### 设计模式模块 (Pattern)

实现常用的设计模式，帮助构建可维护、可扩展的代码。

**包含**：
- **创建型模式**：单例(Singleton)、工厂(Factory)、建造者(Builder)、原型(Prototype)、抽象工厂
- **行为型模式**：观察者(Observer)、状态机(StateMachine)、策略(Strategy)、命令(Command)、责任链(Chain)、中介者(Mediator)
- **结构型模式**：适配器(Adapter)、装饰器(Decorator)、代理(Proxy)、外观(Facade)、组合(Composite)、享元(Flyweight)、桥接(Bridge)
- **并发模式**：对象池(ObjectPool)、调度器(Scheduler)、节流队列(ThrottleQueue)、信号量(Semaphore)、读写锁(ReadWriteLock)

**导入方式**：
```typescript
// 导入整个设计模式模块
import * as pattern from 'dora-pocket/pattern'

// 导入特定模式
import { Singleton, Factory, Builder } from 'dora-pocket/pattern/creational'
import { Observer, StateMachine, Strategy } from 'dora-pocket/pattern/behavioral'
import { createAdapter, Decorator, createProxy } from 'dora-pocket/pattern/structural'
import { ObjectPool, Scheduler, Semaphore } from 'dora-pocket/pattern/concurrency'
```

### 网络模块 (Network)

提供网络请求和通信相关的工具函数。

**导入方式**：
```typescript
import * as network from 'dora-pocket/network'
```

### 文件模块 (File)

提供文件操作相关的工具函数。

**导入方式**：
```typescript
import * as file from 'dora-pocket/file'
```

### UI 模块 (UI)

提供 UI 相关的工具函数和组件。

**导入方式**：
```typescript
import * as ui from 'dora-pocket/ui'
```

### 平台模块 (Platform)

提供特定平台的工具和适配器。

**包含**：
- **Web 平台**：浏览器相关的工具函数
- **Node.js 平台**：Node.js 特定的工具函数
- **Cocos 平台**：Cocos 游戏引擎相关的工具函数

**导入方式**：
```typescript
import * as web from 'dora-pocket/platform/web'
import * as node from 'dora-pocket/platform/node'
import * as cocos from 'dora-pocket/platform/cocos'
```

### 预设模块 (Preset)

提供常用的预设配置和模板。

**导入方式**：
```typescript
import * as preset from 'dora-pocket/preset'
```

### 框架模块 (Framework)

提供与流行框架集成的工具和适配器。

**包含**：
- **Cocos 游戏框架**：Cocos 引擎集成工具
- **Node.js 服务框架**：Node.js 服务端开发工具

**导入方式**：
```typescript
import * as cocosGame from 'dora-pocket/framework/cocos-game'
import * as nodeServer from 'dora-pocket/framework/node-server'
```

## 构建和运行

### 安装依赖

```bash
npm install
```

### 开发模式

监听文件变化并自动构建：

```bash
npm run dev
```

### 构建

生产环境构建：

```bash
npm run build
```

构建产物位于 `dist/` 目录，包含：
- ESM 格式 (`.js`)
- CommonJS 格式 (`.cjs`)
- TypeScript 类型定义 (`.d.ts`, `.d.cts`)
- Source Maps (`.js.map`, `.cjs.map`)

### 测试

运行单元测试：

```bash
npm test
```

运行测试并生成覆盖率报告：

```bash
npm run test:coverage
```

### 代码检查

运行 ESLint 检查：

```bash
npm run lint
```

### 类型检查

运行 TypeScript 类型检查：

```bash
npm run typecheck
```

## NPM 发布

### 发布前检查清单

- [ ] 包名唯一且合适
- [ ] 版本号正确（遵循语义化版本规范）
- [ ] 代码通过类型检查 (`npm run typecheck`)
- [ ] 代码通过 lint 检查 (`npm run lint`)
- [ ] 测试全部通过 (`npm test`)
- [ ] 构建产物完整 (`npm run build`)
- [ ] `package.json` 配置正确
- [ ] `exports` 配置与 `tsup.config.ts` 的 `entry` 匹配
- [ ] README.md 更新
- [ ] 已登录 npm (`npm login`)

### 发布流程

1. **构建项目**：
   ```bash
   npm run build
   ```

2. **预览发布内容**（可选）：
   ```bash
   npm pack --dry-run
   ```

3. **发布到 npm**：
   ```bash
   npm publish
   ```

4. **发布带标签的版本**：
   ```bash
   npm publish --tag beta    # beta 版
   npm publish --tag next    # next 版
   npm publish --tag latest  # 正式版（默认）
   ```

5. **发布作用域包**（如果包名是 `@username/xxx`）：
   ```bash
   npm publish --access public
   ```

### 版本更新

```bash
npm version patch  # 0.1.0 -> 0.1.1 (修复bug)
npm version minor  # 0.1.0 -> 0.2.0 (新增功能)
npm version major  # 0.1.0 -> 1.0.0 (破坏性变更)
```

更新版本后重新构建和发布：
```bash
npm run build
npm publish
```

详细发布流程请参考 [PUBLISH-NPM.md](./PUBLISH-NPM.md)。

## 开发约定

### 代码风格

- 使用 TypeScript 进行开发，充分利用类型系统
- 遵循 TypeScript 严格模式配置 (`strict: true`)
- 使用 ESLint 进行代码质量检查
- 遵循函数式编程范式，尽量使用纯函数
- 避免使用 `any` 类型，使用 `unknown` 或具体类型替代

### 模块导出

- 每个模块都有对应的 `index.ts` 入口文件
- 支持按需导入，减小打包体积
- 同时导出命名导出和默认导出（根据需要）
- 确保导出的 API 具有良好的类型定义

### 文档和注释

- 为公共 API 提供清晰的 JSDoc 注释
- 复杂逻辑添加解释性注释
- 保持注释的准确性和时效性
- 注释使用中文

### 测试

- 为公共 API 编写单元测试
- 使用 Vitest 作为测试框架
- 保持高测试覆盖率
- 测试文件命名规范：`*.test.ts` 或 `*.spec.ts`

### Git 提交规范

建议使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响代码运行）
- `refactor:` 重构（既不是新增功能也不是修复 bug）
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 配置文件说明

### package.json

主要配置：
- **包名**：`dora-pocket`
- **入口文件**：
  - CommonJS: `./dist/index.cjs`
  - ESM: `./dist/index.js`
  - 类型定义: `./dist/index.d.ts`
- **模块导出**：支持细粒度的条件导出，可按需导入子模块
- **Side Effects**：支持 Tree-shaking
- **引擎要求**：Node >= 16.0.0

### tsconfig.json

TypeScript 编译配置：
- 目标：ES2020
- 模块系统：ESNext
- 模块解析：bundler
- 严格模式：开启
- 路径别名：`@/*` 指向 `src/*`

### tsup.config.ts

构建配置：
- 支持多入口点构建
- 输出格式：ESM 和 CommonJS
- 生成类型定义文件
- 启用 Tree-shaking
- 生成 Source Maps
- 目标环境：ES2020

## 常见问题

### Q: 如何导入特定模块？

A: 使用路径别名导入：

```typescript
// 导入核心模块
import { isArray } from 'dora-pocket/core'

// 导入算法模块
import { quickSort } from 'dora-pocket/algorithm/sort'

// 导入设计模式
import { Singleton } from 'dora-pocket/pattern/creational'
```

### Q: 如何处理类型错误？

A: 运行类型检查命令：
```bash
npm run typecheck
```

### Q: 如何添加新模块？

A: 在 `src/` 目录下创建新模块目录，并在 `tsup.config.ts` 中添加对应的入口配置，然后在 `package.json` 的 `exports` 字段中添加导出配置。

### Q: 构建产物在哪里？

A: 构建产物位于 `dist/` 目录，包含 `.js`、`.cjs`、`.d.ts` 等文件。

### Q: 如何发布到 npm？

A: 参考 [PUBLISH-NPM.md](./PUBLISH-NPM.md) 文档中的详细发布流程。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

在提交前请确保：
- 代码通过类型检查 (`npm run typecheck`)
- 代码通过 lint 检查 (`npm run lint`)
- 测试全部通过 (`npm test`)
- 构建成功 (`npm run build`)

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- 作者：the27149
- 仓库：https://github.com/27149/zero.git

## 更新日志

详细的版本更新记录请查看 CHANGELOG.md（如果存在）。