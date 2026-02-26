# Zero npm 包发布流程

> 记录 Zero 项目发布到 npm 的完整流程和注意事项

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

**当前项目包名**：`zero`（需确认是否可用）

**推荐的包名选择**：
- `dora-pocket` - 描述性强
- `@username/zero` - 作用域包（免费且唯一）
- `zero-utils` - 简洁明了

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

检查 TypeScript 类型错误。

### 2. 代码检查

```bash
npm run lint
```

检查代码风格和潜在问题。

### 3. 运行测试

```bash
npm test
```

运行单元测试（如果有）。

### 4. 构建项目

```bash
npm run build
```

- 检查 `dist` 目录是否正确生成
- 确认 `.js`、`.cjs`、`.d.ts`、`.d.cts` 文件齐全
- 验证 `package.json` 中的 `exports` 路径是否匹配

---

## 配置检查

### package.json 检查清单

- [ ] `name` - 包名（唯一性）
- [ ] `version` - 版本号（语义化版本）
- [ ] `description` - 描述
- [ ] `main` - CommonJS 入口
- [ ] `module` - ES Module 入口
- [ ] `types` - 类型定义入口
- [ ] `exports` - 条件导出配置
- [ ] `files` - 发布文件列表
- [ ] `scripts` - 构建和测试脚本
- [ ] `keywords` - 关键词
- [ ] `repository` - 代码仓库
- [ ] `license` - 开源协议

### exports 配置验证

确保 `package.json` 中的 `exports` 与 `tsup.config.ts` 中的 `entry` 对应：

```json
// package.json
{
  "exports": {
    "./core": { ... },
    "./utils": { ... },
    ...
  }
}
```

```ts
// tsup.config.ts
export default defineConfig({
  entry: {
    'core/index': 'src/core/index.ts',
    'utils/index': 'src/utils/index.ts',
    ...
  }
})
```

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
PUBLISH.md
```

这样只会发布 `dist` 目录和 `README.md`。

---

## 预览发布内容

### 1. 查看将要发布的文件

```bash
npm pack --dry-run
```

检查输出列表，确认：
- ✅ 包含 `dist/` 目录
- ✅ 包含 `README.md`
- ❌ 不包含源码 `src/`
- ❌ 不包含配置文件
- ❌ 不包含测试文件

### 2. 生成 tarball（可选）

```bash
npm pack
```

会生成 `zero-0.1.0.tgz` 文件，可以手动解压检查内容。

---

## 正式发布

### 1. 发布到 npm

```bash
npm publish
```

首次发布会提示：
```
Publishing to https://registry.npmjs.org/
+ zero@0.1.0
```

### 2. 发布带标签的版本

```bash
npm publish --tag beta    # beta 版
npm publish --tag next    # next 版
npm publish --tag latest  # 正式版（默认）
```

**标签说明**：
- `latest` - 正式稳定版（默认）
- `beta` - 测试版
- `next` - 下一个版本
- `canary` - 金丝雀版本

### 3. 双因素认证（2FA）

如果启用了 2FA，发布时会要求输入 OTP。

---

## 验证发布

### 1. 在 npm 上查看

访问 https://www.npmjs.com/package/你的包名

检查：
- ✅ 版本号正确
- ✅ 描述信息完整
- ✅ README 正常显示
- ✅ 关键词和标签正确

### 2. 测试安装

在新项目中测试：

```bash
npm install 你的包名
```

### 3. 测试导入

```typescript
// 主入口
import { deepClone } from '你的包名'

// 子模块
import { isArray } from '你的包名/utils/is'

// 完整导入
import * as utils from '你的包名/utils'
```

### 4. 测试类型提示

在 IDE 中应该有完整的类型提示和跳转功能。

---

## 后续版本更新

### 1. 更新版本号

```bash
npm version patch  # 0.1.0 -> 0.1.1 (修复bug)
npm version minor  # 0.1.0 -> 0.2.0 (新增功能)
npm version major  # 0.1.0 -> 1.0.0 (破坏性变更)
```

**语义化版本规则**：
- `MAJOR.MINOR.PATCH`
  - MAJOR：不兼容的 API 修改
  - MINOR：向下兼容的功能新增
  - PATCH：向下兼容的 bug 修复

### 2. 手动指定版本号

```bash
npm version 0.2.0
```

### 3. 重新发布

```bash
npm run build
npm publish
```

### 4. 撤销已发布版本（谨慎使用）

```bash
npm unpublish 包名@版本号
# 24小时内可以撤销，超过24小时只能废弃
```

```bash
# 废弃版本（推荐）
npm deprecate 包名@版本号 "废弃原因"
```

---

## 注意事项

### 包名选择

1. **普通包名**：如 `dora-pocket`
   - 先到先得，可能被占用
   - 简短易记

2. **作用域包名**：如 `@username/zero`
   - 免费且唯一
   - 适合个人或组织项目
   - 默认私有，发布时需加 `--access public`

   ```bash
   npm publish --access public
   ```

### 构建产物检查

发布前确保：
- ✅ ESM 格式 (`.js`)
- ✅ CommonJS 格式 (`.cjs`)
- ✅ TypeScript 类型定义 (`.d.ts`, `.d.cts`)
- ✅ Source Maps (`.js.map`, `.cjs.map`)
- ✅ 所有子模块的导出路径正确

### package.json 配置

- **`files` 字段**：只包含要发布的文件
- **`sideEffects` 字段**：支持 Tree-shaking
- **`exports` 字段**：确保条件导出正确
- **`engines` 字段**：指定 Node 版本要求

### 版本管理

- 遵循语义化版本规范
- 不要跳过版本号（如从 0.1.0 直接到 0.3.0）
- 发布前更新 CHANGELOG.md（如果有）

### 安全性

- 不要在包中发布敏感信息（API密钥、密码等）
- 使用 `.npmignore` 排除敏感文件
- 定期更新依赖包

---

## 问题排查

### 问题 1：包名已被占用

**解决方案**：
- 更换包名
- 使用作用域包 `@username/包名`

### 问题 2：发布时提示 E404

**原因**：包名拼写错误或未登录

**解决方案**：
```bash
npm login
# 检查包名拼写
```

### 问题 3：构建产物路径不匹配

**原因**：`tsup.config.ts` 和 `package.json` 配置不一致

**解决方案**：
- 检查 `entry` 配置
- 检查 `exports` 配置
- 确保路径完全匹配

### 问题 4：类型定义不生效

**原因**：`.d.ts` 文件未正确生成或路径错误

**解决方案**：
```bash
npm run build
# 检查 dist 目录下是否有 .d.ts 文件
```

### 问题 5：Tree-shaking 不生效

**原因**：`sideEffects` 配置错误

**解决方案**：
```json
{
  "sideEffects": false
}
```

或指定有副作用的文件：
```json
{
  "sideEffects": ["./dist/global.js"]
}
```

### 问题 6：发布速度慢

**原因**：网络问题或 npm 镜像问题

**解决方案**：
```bash
# 临时使用官方源
npm publish --registry=https://registry.npmjs.org
```

### 问题 7：权限错误 E403

**原因**：
- 未登录
- 包名已被他人占用
- 作用域包未设置为公开

**解决方案**：
```bash
npm login
# 作用域包发布
npm publish --access public
```

---

## 常用命令速查

```bash
# 查看包信息
npm view 包名

# 登录/登出
npm login
npm logout

# 查看当前用户
npm whoami

# 构建项目
npm run build

# 发布包
npm publish
npm publish --tag beta
npm publish --access public  # 作用域包公开

# 更新版本
npm version patch
npm version minor
npm version major

# 预览发布内容
npm pack --dry-run

# 撤销版本（24小时内）
npm unpublish 包名@版本号

# 废弃版本
npm deprecate 包名@版本号 "废弃原因"

# 查看已发布的版本
npm view 包名 versions
```

---

## 发布检查清单

发布前确认：

- [ ] 包名唯一且合适
- [ ] 版本号正确
- [ ] 代码通过类型检查
- [ ] 代码通过 lint 检查
- [ ] 测试全部通过
- [ ] 构建产物完整
- [ ] `.npmignore` 配置正确
- [ ] `package.json` 配置正确
- [ ] `exports` 配置与 `entry` 匹配
- [ ] README.md 更新
- [ ] CHANGELOG.md 更新（如果有）
- [ ] 已登录 npm
- [ ] 预览发布内容确认无误

---

## 记录与补充

> 此处记录后续强调的补充点和特殊注意事项

### 补充点 1
（待添加）

### 补充点 2
（待添加）