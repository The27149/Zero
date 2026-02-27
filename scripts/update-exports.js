
// 执行脚本 重新生成模块导出
// 自动更新 主入口 src/index.ts 和 package.json 的 exports 配置

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const srcDir = join(process.cwd(), 'src')
const indexFilePath = join(srcDir, 'index.ts')
const packageJsonPath = join(process.cwd(), 'package.json')

// 获取所有有一级 index.ts 的模块
function getModules() {
  const modules = readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => {
      const indexPath = join(srcDir, dirent.name, 'index.ts')
      return existsSync(indexPath)
    })
    .map(dirent => dirent.name)
    .filter(name => name !== 'global') // 排除 global
    .sort()

  return modules
}

// 生成主入口文件内容
function generateIndexContent(modules) {
  const exports = modules
    .map(name => `export * as ${name} from './${name}'`)
    .join('\n')

  return `/**
 * Dora Pocket 主入口
 * 通用、无限可扩展的 JavaScript/TypeScript 工具库
 * 
 * ⚠️  此文件由 scripts/update-exports.js 自动生成
 *     请勿手动修改，修改将被覆盖
 */

${exports}
`
}

// 生成 package.json 的 exports 配置
function generateExports(modules) {
  const exports = {
    '.': {
      'import': {
        'types': './dist/index.d.ts',
        'default': './dist/index.js'
      },
      'require': {
        'types': './dist/index.d.cts',
        'default': './dist/index.cjs'
      }
    }
  }

  modules.forEach(module => {
    exports[`./${module}`] = {
      'import': {
        'types': `./dist/${module}/index.d.ts`,
        'default': `./dist/${module}/index.js`
      },
      'require': {
        'types': `./dist/${module}/index.d.cts`,
        'default': `./dist/${module}/index.cjs`
      }
    }
  })

  return exports
}

// 主函数
function main() {
  try {
    const modules = getModules()
    console.log(`📦 发现 ${modules.length} 个模块: ${modules.join(', ')}`)

    // 更新主入口文件
    const indexContent = generateIndexContent(modules)
    writeFileSync(indexFilePath, indexContent, 'utf-8')
    console.log(`✅ 已更新: ${indexFilePath}`)

    // 更新 package.json
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    const newExports = generateExports(modules)

    // 保持 package.json 其他字段不变
    packageJson.exports = newExports
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')
    console.log(`✅ 已更新: ${packageJsonPath}`)
    console.log(`⚠️  注意: package.json 的 exports 字段由脚本自动生成，请勿手动修改`)
    console.log('\n🎉 完成！请运行 npm run build 重新构建')
  } catch (error) {
    console.error('❌ 更新失败:', error.message)
    process.exit(1)
  }
}

main()