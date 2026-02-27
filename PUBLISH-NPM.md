# dora-pocket npm 包发布流程

> 记录 dora-pocket 项目发布到 npm 的完整流程和注意事项

## 目录

- [准备工作](#准备工作)
- [代码检查与构建](#代码检查与构建)
- [配置检查](#配置检查)
- [预览发布内容](#预览发布内容)
- [正式发布](#正式发布)
- [验证发布](#验证发布)
- [后续版本更新](#后续版本更新)
- [注意事项](#注意事项)
- [问题排查](#问题排查)

---

## 准备工作

### 1. 确认包名可用性

```bash
npm view dora-pocket
```

- 返回 404 → 包名可用
- 返回信息 → 包名已被占用，需要更换

**当前项目包名**：`dora-pocket`

### 2. 注册 npm 账号

1. 访问 https://www.npmjs.com/signup
2. 注册并验证邮箱

### 3. 登录 npm

```bash
npm login
```

按提示输入用户名、密码和邮箱。

---

## 代码检查与构建

### 1. 类型检查

```bash
npm run typecheck
```

### 2. 代码检查

```bash
npm run lint
```

### 3. 运行测试

```bash
npm test
```

### 4. 构建项目

```bash
npm run build
```

---

## 配置检查

### package.json 检查清单

- [ ] `name` - 包名
- [ ] `version` - 版本号
- [ ] `description` - 描述
- [ ] `exports` - 导出配置

### exports 配置验证

确保 `package.json` 中的 `exports` 与 `tsup.config.ts` 中的 `entry` 对应。

### .npmignore 文件

在项目根目录创建 `.npmignore` 文件：

```
src
.git
.gitignore
node_modules
package-lock.json
tsconfig.json
tsup.config.ts
.eslintrc
.vscode
.vitest
*.test.ts
*.spec.ts
```

---

## 预览发布内容

```bash
npm pack --dry-run
```

检查输出列表，确认只包含必要的文件。

---

## 正式发布

### 1. 发布到 npm

```bash
npm publish
```

### 2. 发布带标签的版本

```bash
npm publish --tag beta    # beta 版
npm publish --tag next    # next 版
npm publish --tag latest  # 正式版（默认）
```

### 3. 双因素认证（2FA）

如果启用了 2FA，发布时会要求输入 OTP（一次性密码）。

**输入 OTP**：
```
Enter one-time password from your authenticator app: 123456
```

从你的 2FA 应用（Google Authenticator、Authy 等）获取 6 位数字密码。

### 4. 使用 Access Token（自动化发布）

对于 CI/CD 或自动化发布，可以使用 Access Token 绕过 OTP。

**设置 Token**：
```bash
npm set //registry.npmjs.org/:_authToken YOUR_TOKEN
```

**验证 Token**：
```bash
npm config get //registry.npmjs.org/:_authToken
```

**使用 Token 发布**：
```bash
npm publish
```

**CI/CD 环境变量方式**：
```bash
npm publish --_authToken=$NPM_TOKEN
```

---

## 验证发布

### 1. 在 npm 上查看

访问 https://www.npmjs.com/package/dora-pocket

### 2. 测试安装

```bash
npm install dora-pocket
```

### 3. 测试导入

```typescript
import { arrayUtils } from 'dora-pocket/core'
arrayUtils.isArray([])
```

---

## 后续版本更新

### 1. 更新版本号

```bash
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

### 2. 重新发布

```bash
npm run build
npm publish
```

---

## 注意事项

### 包名选择

- 普通包名：先到先得
- 作用域包：`@username/package`，需要 `--access public`

### 版本管理

- 遵循语义化版本规范
- 不要跳过版本号

### 安全性

- 不要在包中发布敏感信息
- 定期更新依赖包

---

## 问题排查

### ENEEDAUTH - 需要认证

```
error code ENEEDAUTH
need auth This command requires you to be logged in
```

**解决方案**：
```bash
npm login
```

---

### E403 - 需要 2FA 或 Token

```
error code E403
403 Forbidden - PUT https://registry.npmjs.org/dora-pocket
Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

**解决方案**：

**选项 1：输入 OTP**
```bash
npm publish
# 输入 6 位数字 OTP
```

**选项 2：使用 Access Token**
```bash
npm set //registry.npmjs.org/:_authToken YOUR_TOKEN
npm publish
```

---

### Token 设置失败

**错误语法**：
```bash
npm set //registry.npmjs.org/:_authToken=YOUR_TOKEN  # ❌ 错误
```

**正确语法**：
```bash
npm set //registry.npmjs.org/:_authToken YOUR_TOKEN  # ✅ 正确
```

**解决方案**：
```bash
npm config delete //registry.npmjs.org/:_authToken
npm set //registry.npmjs.org/:_authToken YOUR_TOKEN
npm config get //registry.npmjs.org/:_authToken
```

---

### Token 无效

**可能原因**：
- Token 已过期
- Token 被撤销
- Token 权限不足

**解决方案**：
1. 访问 https://www.npmjs.com/settings/tokens
2. 创建新 Token
3. 更新本地配置

---

### E404 - 包名错误或未登录

**解决方案**：
```bash
npm login
npm view dora-pocket  # 检查包名
```

---

### 构建产物路径不匹配

**解决方案**：
- 检查 `tsup.config.ts` 的 `entry` 配置
- 检查 `package.json` 的 `exports` 配置
- 确保路径完全匹配

---

### 类型定义不生效

**解决方案**：
```bash
npm run build
# 检查 dist 目录下是否有 .d.ts 文件
```

---

### Tree-shaking 不生效

**解决方案**：
```json
{
  "sideEffects": false
}
```

---

### 发布速度慢

**解决方案**：
```bash
npm publish --registry=https://registry.npmjs.org
```

---

## 常用命令速查

```bash
# 登录/登出
npm login
npm logout
npm whoami

# 构建
npm run build

# 发布
npm publish
npm publish --tag beta
npm publish --access public

# 更新版本
npm version patch
npm version minor
npm version major

# 预览
npm pack --dry-run

# Token 配置
npm set //registry.npmjs.org/:_authToken YOUR_TOKEN
npm config get //registry.npmjs.org/:_authToken
npm config delete //registry.npmjs.org/:_authToken

# 查看 Token
npm view 包名 versions
```

---

## 发布检查清单

发布前确认：

- [ ] 包名正确
- [ ] 版本号正确
- [ ] 代码通过检查
- [ ] 构建产物完整
- [ ] `.npmignore` 配置正确
- [ ] `package.json` 配置正确
- [ ] README.md 更新
- [ ] 已登录 npm 或配置好 Token
- [ ] 预览发布内容确认无误

---

## 模块组织、导出与使用指南

### 模块组织结构

```
dora-pocket/
├── src/
│   ├── index.ts              # 主入口（用于探索）
│   ├── core/                 # 核心模块
│   ├── algorithm/            # 算法模块
│   ├── pattern/              # 设计模式模块
│   ├── network/              # 网络模块
│   ├── file/                 # 文件模块
│   ├── ui/                   # UI 模块
│   └── preset/               # 预设模块
├── dist/                     # 构建输出目录
├── tsup.config.ts            # 构建配置
└── package.json              # 包配置
```

### tsup.config.ts 配置（打包配置）

**职责**：定义构建入口点和构建选项

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',      // 主入口：用于探索所有模块
    'src/*/index.ts',    # 一级模块入口
  ],
  format: ['cjs', 'esm'], // 同时生成 CommonJS 和 ES Module
  dts: true,             // 生成类型定义
  splitting: true,       // 启用代码拆分
  clean: true,           // 构建前清理
  treeshake: true,       // 移除未使用的代码
  sourcemap: true,       // 生成 source maps
  target: 'es2020',
  outDir: 'dist',
})
```

### package.json exports 配置（导出配置）

**职责**：定义包的导出路径，控制用户如何导入模块

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./core": {
      "import": {
        "types": "./dist/core/index.d.ts",
        "default": "./dist/core/index.js"
      },
      "require": {
        "types": "./dist/core/index.d.cts",
        "default": "./dist/core/index.cjs"
      }
    }
  }
}
```

### tsup 与 package.json 的职责区分

| 配置文件         | 职责         | 配置内容                     |
| ---------------- | ------------ | ---------------------------- |
| `tsup.config.ts` | **打包配置** | 定义哪些源文件要构建、构建格式 |
| `package.json`   | **导出配置** | 定义包的对外接口、导入路径   |

**关系**：`entry` 决定生成哪些构建产物，`exports` 决定用户如何访问这些产物。

### 使用方式

#### 方式 1：探索模式（开发阶段）

```typescript
import * as dp from 'dora-pocket'

// IDE 会提示所有可用的模块
dp.core.ArrayUtils.isArray([])
dp.algorithm.sort.quickSort(arr)
```

#### 方式 2：按需导入（生产阶段 - 推荐）

```typescript
import { ArrayUtils } from 'dora-pocket/core'
import { quickSort } from 'dora-pocket/algorithm/sort'

ArrayUtils.isArray([])
quickSort(arr)
```

**优点**：
- ✅ 完美的 Tree-shaking
- ✅ 只打包实际使用的代码
- ✅ 包体积最小

### 添加新模块的维护步骤

#### 步骤 1：创建模块目录和文件

在 `src/` 下创建新模块目录。

#### 步骤 2：更新主入口（可选）

在 `src/index.ts` 中添加导出（用于探索）。

#### 步骤 3：更新 package.json exports（必须）

在 `package.json` 的 `exports` 字段中添加新模块的导出配置。

#### 步骤 4：构建和测试

```bash
npm run build
```

### 维护清单

| 维护项                    | 位置             | 是否必须 |
| ------------------------- | ---------------- | -------- |
| 创建模块文件              | `src/newModule/` | ✅ 必须   |
| 更新主入口                | `src/index.ts`   | ⚠️ 可选   |
| 更新 tsup.config.ts       | `tsup.config.ts` | ⚠️ 自动   |
| 更新 package.json exports | `package.json`   | ✅ 必须   |

### 最佳实践总结

1. **开发阶段**：使用 `import * as dp from 'dora-pocket'` 探索 API
2. **生产阶段**：使用子模块导入 `import { xxx } from 'dora-pocket/core'` 确保最佳包体积
3. **添加模块**：同步更新 `package.json exports` 配置
4. **tsup 配置**：使用通配符自动匹配新模块
5. **保持一致性**：确保 `tsup.entry` 和 `package.json.exports` 匹配