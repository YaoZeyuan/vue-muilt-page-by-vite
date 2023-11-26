#   vue-muilt-page-by-vite[个人项目-勿fork]

#   想解决什么问题

让老旧php项目也能使用现代前后端分离方式进行开发, 并尽量降低接入成本

#   实现了哪些功能

| 面临问题                                                                                                            | 解决思路&方案                                                                                                                                 |
| :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| 旧项目使用index_guangdian.php?controller=/guangdian/bjtv的方式配置路由, 且不能改成现代path路径风格(/guangdian/bjtv) | 旧项目间各页面关系不大, 因此可以考虑为一个应用单独输出一份js文件. 每个页面自成体系. 绕过对vue路由的需求(确有需要可以在页面内通过hash路由实现) |
| 构建产物名中包含hash, 每次发版需要手工改模板很麻烦                                                                  | 额外输出一份manifest.json文件, 将页面路径和实际静态文件进行映射. **并提供解析manifest.json的示例代码, 方便直接接入**                          |
| 前端构建产物名为乱码, 发版失败后回滚困难, 找不到上一个版本的构建结果                                                | 在构建结果路径中添加版本号, 发版时只要将构建产物贴到静态资源路径里, 然后将路径从`0.0.1`修改成`0.0.2`就可以                                    |
| 传统多项目文件无法共享代码                                                                                          | 基于vite@5 搭建项目, 支持在不同文件中共享前端代码                                                                                             |

#   如何使用

##  项目运行

node版本>=18

执行 pnpm install 安装依赖

执行 pnpm start 启动本地服务, 默认端口号为3000, 在`vite.config.ts`中修改

##  实际开发

以`src/pages`为每个文件的路径, 以目录下index.html的目录作为该独立页面的根目录, 通过路径进行区分

### 添加新页面

1.  将`src/pages/demo`文件夹复制一份, 例如复制成`src/pages/question`
2.  在`vite.config.ts`文件中, 找到`pagesUriConfig`, 按照`文件夹名 => 文件夹路径`的形式, 将路径添加进去
3.  在`src/pages/question`中, 按正常vue项目的模式进行开发即可. `pnpm start`启动后, 使用`http://localhost:3000/src/pages/question/index.html`即可进入页面

#  php侧具体接入步骤

1.  接口层
    1.  制定统一接口格式
        1.  示例: 接口统一按以下字段进行返回. 其中未登录code值需要专门约定, 方便在cookie失效后跳转登录页
            ```js
            {
                data:{}
                action:"success"|"alert"|"needLogin"|...,
                message:"",
                // 0为正常响应, 其他为错误响应. 其中10000为未登录响应
                code: 0 | 10000
            }
            ```
    2.  制定api接口统一路径, 例如将/api作为接口的统一前缀, 以便前端开发时进行路径匹配, 将api请求转发到后端服务器
    3.  将数据从注入模板改为通过接口进行返回
        1.  可以配置统一的返回json方法. 示例: `asyncShowResult($data, $msg = '', $action = 'success',$errno = 0)`/`asyncShowError($err_msg, $errno = 10000, $action = 'alert', $data = array())`
2.  渲染层
    1.  参考[php-demo](script/php_use_demo/static.php), 提供一个读取manifest.json配置, 将指定key转换为静态资源html的方法
        1.  示例: 假设该方法名为 `this->getVueStaticContent`, 则渲染`src/pages/demo`页对应的html模板时, 模板中实际代码如下
        2.  ```php
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>demo项目</title>
                {{this->getVueStaticContent("src/pages/demo/index.html")}}
            </head>
            <body>
                <div id="app"></div>
            </body>
            </html>
            ```
        3.  `getVueStaticContent`会在manifest.json中寻找对应key配置项, 并替换为实际的html代码. 替换后的结果为
            ```php
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>demo项目</title>
                <script type="module" crossorigin src="/0.0.3/assets/demo-IPqw7wmY.js"></script>
                <link rel="modulepreload" crossorigin href="/0.0.3/assets/_plugin-vue_export-helper-yVIqEbAC.js">
                <link rel="stylesheet" crossorigin href="/0.0.3/assets/_plugin-vue_export-helper-8ZBU8I84.css">
                <link rel="stylesheet" crossorigin href="/0.0.3/assets/demo-VMru3q4S.css">
            </head>
            <body>
                <div id="app"></div>
            </body>
            </html>
            ```
3.  controller层.
    1.  改为前后端分离后, php端只在访问页面时返回一个如上包括前端构建后地址的html简单模板即可.
    2.  但由于改为前端展示, 所以php端需要做好用户身份校验工作. 避免被黑客直接调用接口, 引发数据泄露
        1.  若访问index.html时未登录直接跳转登录页
        2.  若访问接口时未登录则返回特定状态码, 通知前端跳转登录页
4.  静态资源侧
    1.  本处无需修改, 直接将构建好的静态资源放在原先位置即可.
    2.  前端需要调试验证, 确认线上的静态资源路径和打包后产物一样(资源路径配置项位于`vite.config.ts`, `productionPublicPath`变量)
