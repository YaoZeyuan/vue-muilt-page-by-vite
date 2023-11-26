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
  const port = 3000
  // 线上前端cdn前缀
  const productionPublicPath = '/'
  const isBuild = mode === "production"

  // 读取package.json中的版本号
  const packageJsonUri = path.resolve(projectRootPath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonUri).toString())
  console.log('当前package.json中记录的版本号为 => ', packageJson.version)

  // 待编译的项目
  const pagesUriConfig = {
    demo: path.resolve(projectRootPath, 'src/pages/demo/index.html'),
    question: path.resolve(projectRootPath, 'src/pages/question/index.html'),
  }

  console.log(`页面对应地址 => `)
  for (const key of Object.keys(pagesUriConfig)) {
    // @ts-ignore
    const fileUri = pagesUriConfig[key].split(projectRootPath).pop()
    console.log(`${key} => http://localhost:${port}${fileUri}`)
  }

  return {
    plugins: [
      vue(),
      vueJsx(),
    ],
    server: {
      port: port
    },
    // 当线上构建时, 主动添加版本号和静态资源前缀
    base: isBuild ? `${productionPublicPath}/${packageJson.version}/` : "/",
    build: {
      experimental: {
        // renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
        //   // 自定义静态资源路径
        //   return `/${packageJson.version}/`
        //   if (['js', 'css'].includes(hostType)) {
        //     return { runtime: `window.__getFile(${JSON.stringify(filename)})` }
        //   } else {
        //     return { relative: true }
        //   }
        // }
      },
      rollupOptions: {
        input: {
          ...pagesUriConfig
        }
      },
      manifest: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
