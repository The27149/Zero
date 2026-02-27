# Dora Pocket

> 通用、无限可扩展的 JavaScript/TypeScript 工具库

Dora Pocket 是一个覆盖面广泛但按需使用的工具库。核心模块提供常用工具，其他模块（算法、设计模式、网络、文件等）完全可选，支持完美的 Tree-shaking。

## ✨ 特性

- 🎯 **按需加载**：只用核心模块？没问题。需要算法？随时加载。
- 📦 **零运行时开销**：未使用的模块不会打包进项目。
- 🔍 **智能提示**：通过主入口探索所有可用功能。
- 🌍 **双格式支持**：同时支持 ESM 和 CommonJS。
- 📝 **完整类型**：TypeScript 类型定义开箱即用。
- 🚀 **现代构建**：基于 esbuild，构建速度快。

## 📦 安装

```bash
npm install dora-pocket
# 或
yarn add dora-pocket
# 或
pnpm add dora-pocket
```

## 🚀 快速开始

### 按需导入（推荐）

只导入实际使用的模块，获得最佳的包体积：

```typescript
// 导入整个核心模块
import * as core from 'dora-pocket/core'

core.arrayUtils.isArray([])

// 或从子模块导入具体功能
import { arrayUtils, TypeCheck } from 'dora-pocket/core'

arrayUtils.isArray([])
TypeCheck.isString('hello')
```

```typescript
// 导入算法模块
import * as algorithm from 'dora-pocket/algorithm'

algorithm.sort.quickSort([3, 1, 2])

// 或从子模块导入
import { quickSort, mergeSort } from 'dora-pocket/algorithm/sort'

quickSort([3, 1, 2])
```

```typescript
// 导入设计模式
import * as pattern from 'dora-pocket/pattern'

pattern.creational.Singleton.getInstance()

// 或从子模块导入
import { Singleton } from 'dora-pocket/pattern/creational'

const instance = Singleton.getInstance()
```

## 🔧 开发指南

### 新增模块

在 `src/` 目录下创建新的模块目录和 `index.ts` 文件：

```bash
src/
├── core/
├── algorithm/
├── your-new-module/    # 新增模块
│   └── index.ts
```

然后运行构建命令，脚本会自动更新导出配置：

```bash
npm run build
```

脚本会自动：
1. 扫描 `src/` 下所有模块
2. 更新 `src/index.ts` 的导出
3. 更新 `package.json` 的 `exports` 字段

**注意**：`src/index.ts` 和 `package.json` 的 `exports` 字段由 `scripts/update-exports.js` 自动生成，请勿手动修改。

### 自动更新脚本

手动运行更新脚本：

```bash
npm run update-exports
```

## 📁 模块概览

| 模块 | 说明 | 可选 |
|------|------|------|
| `core` | 核心工具（数组、字符串、对象、数学、时间、类型检查、事件、日志） | ✅ 必需 |
| `algorithm` | 算法（排序、搜索、数据结构） | ✅ 可选 |
| `pattern` | 设计模式（创建型、行为型、结构型、并发） | ✅ 可选 |
| `network` | 网络请求、HTTP 客户端 | ✅ 可选 |
| `file` | 文件操作、路径处理 | ✅ 可选 |
| `ui` | UI 工具、DOM 操作 | ✅ 可选 |
| `preset` | 预设配置、常用模板 | ✅ 可选 |

## 💡 使用建议

### Tree-shaking 最佳实践

**✅ 推荐**（确保只打包使用的模块）：
```typescript
// 从子模块导入具体功能
import { arrayUtils } from 'dora-pocket/core'
arrayUtils.isArray([])
```

**✅ 可用**（导入整个模块，打包工具会分析使用的子功能）：
```typescript
import * as core from 'dora-pocket/core'
core.arrayUtils.isArray([])
```

### 模块导入方式

```typescript
// ✅ 推荐：从子模块导入具体功能
import { arrayUtils } from 'dora-pocket/core'

// ✅ 可用：导入整个模块
import * as core from 'dora-pocket/core'
```

## ⚠️ 注意事项

### 1. Tree-shaking 依赖

Tree-shaking 的效果取决于：
- 使用按需导入方式（推荐从子模块导入）
- 打包工具支持（Webpack 5+、Vite、Rollup 等）
- 导出方式为命名导出（本项目已优化）

### 2. 模块导入方式

```typescript
// ✅ 推荐：从子模块导入具体功能
import { arrayUtils } from 'dora-pocket/core'

// ✅ 可用：导入整个模块
import * as core from 'dora-pocket/core'

// ✅ 可用：导入多个模块
import { core, algorithm } from 'dora-pocket'
core.arrayUtils.isArray([])
algorithm.sort.quickSort([3, 1, 2])
```

### 3. TypeScript 支持

完整支持 TypeScript，开箱即用：

```typescript
import { arrayUtils } from 'dora-pocket/core'

// 完整的类型提示
arrayUtils.isArray([])  // IDE 会提示参数和返回值类型
```

### 4. 兼容性

- **Node.js**: 推荐 14.0+
- **浏览器**: 支持所有现代浏览器
- **TypeScript**: 推荐 4.0+

## 📚 文档

详细的使用文档和 API 说明，请参考项目文档。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

**Dora Pocket** - 小巧强大，按需使用 🚀