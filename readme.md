#   vue-muilt-page-by-vite[个人项目-勿fork]

#   项目目标

1.  基于vite, 实现多页面vue构建工具. 以支持在现有php项目中**尽可能无感知的**接入vue

#   项目需求

1.  由于是旧项目改造, 每个页面相对独立(且宿主项目使用index.php?r=controller模式进行导航, 无法直接使用vue-router), 因此取消vue-router, 改为对每个页面进行单独编辑
2.  以`src/pages`为每个文件的路径, 以目录下index.html的目录作为该独立页面的根目录, 通过路径进行区分
3.  支持在manifest.json输出路径中添加版本号, 方便及时回滚
4.  支持接口转发

#   项目运行

node版本>=18

执行 pnpm install 安装依赖

执行 pnpm start 启动本地服务, 默认端口号为3000, 在`vite.config.ts`中修改

#   备注

##  后端接入过程

https://cn.vitejs.dev/guide/backend-integration.html