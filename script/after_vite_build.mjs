import * as fs from 'node:fs'
import * as path from 'node:path'
import shelljs from 'shelljs'
import { fileURLToPath, URL } from 'node:url'

const projectRootPath = path.resolve(fileURLToPath(import.meta.url), '..', '..')

async function asyncRunner() {
  console.log('vite构建完毕, 开始执行构建后操作')

  // 读取package.json中的版本号
  const packageJsonUri = path.resolve(projectRootPath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonUri).toString())
  console.log('当前package.json中记录的版本号为 => ', packageJson.version)

  const targetDirPath = path.resolve(projectRootPath, `dist/${packageJson.version}`)
  const viteOutputRootPath = path.resolve(projectRootPath, `dist`)
  console.log(`对应静态资源输出路径为 => ${targetDirPath}, 重置该路径`)
  shelljs.rm('-rf', targetDirPath)
  shelljs.mkdir('-p', targetDirPath)
  console.log(`将生成的静态资源移动到 ${targetDirPath} 中`)
  shelljs.mv(path.resolve(viteOutputRootPath, 'assets'), targetDirPath)
  shelljs.mv(
    path.resolve(viteOutputRootPath, '.vite/manifest.json'),
    path.resolve(targetDirPath, `manifest.json`)
  )
  console.log(`静态资源迁移完毕`)

  console.log(`✔构建后处理流程完毕`)
}

asyncRunner()
