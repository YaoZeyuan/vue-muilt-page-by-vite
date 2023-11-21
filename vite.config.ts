import { fileURLToPath, URL } from 'node:url'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const projectRootPath = path.resolve(fileURLToPath(import.meta.url),
  "..")

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // 通过函数的形式生成配置, 方便根据实际参数进行自定义

  // 读取package.json中的版本号
  const packageJsonUri = path.resolve(projectRootPath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonUri).toString())
  console.log('当前package.json中记录的版本号为 => ', packageJson.version)

  return {
    plugins: [
      vue(),
      vueJsx(),
    ],
    build: {
      manifest: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
