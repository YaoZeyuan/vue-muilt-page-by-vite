#   vue-muilt-page-by-vite[个人项目-勿fork]

#   项目目标

1.  基于vite, 实现多页面vue构建工具. 以支持在现有php项目中**尽可能无感知的**接入vue

#   项目需求

1.  由于宿主项目使用index.php?r=controller模式进行导航, 因此只能使用hash模式作为路由
    1.  考虑通过hack的方式, 支持通过参数定义路由
2.  支持输出带版本号的map.json, 方便实现前后端分离
3.  支持接口转发

#   项目运行

node版本>=18

执行 pnpm install


#   备注
后端接入过程
https://cn.vitejs.dev/guide/backend-integration.html