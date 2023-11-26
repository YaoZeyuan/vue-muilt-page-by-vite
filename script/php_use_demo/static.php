<?php

class StaticRes
{
    static protected $inst;
    static protected $config;
    // 需要指定manifest.json的路径. 支持本地路径/cdn地址两种形式
    // 示例: "/home/yao/www/github/vue-muilt-page-by-vite/dist/0.0.3/manifest.json";
    static protected $manifestUri = "/demo/0.0.3/manifest.json";

    /**
     * 生成manifest.json缓存路径, 以便当$manifestUri为cdn路径时进行缓存, 
     */
     static private function getCacheDir() {
        return sys_get_temp_dir() . DIRECTORY_SEPARATOR .  "map-json" . DIRECTORY_SEPARATOR;
    }


    /**
     * 单例模式
     * @return StaticRes
     */
    static public function Instance()
    {
        if (empty(self::$config)) {
            self::$config = [];
        }
        if (empty(self::$inst)) {
            self::$inst = new self();
        }
        if (file_exists(self::getCacheDir()) === false) {
            mkdir(self::getCacheDir(), 0777, true);
        }
        return self::$inst;
    }

    /**
     * 根据传入的静态资源文件名, 返回manifest.json中定义的静态资源列表
     * @param string $url
     * @param boolean $https
     * @return null|string
     * @throws \Exception
     */
    public function getVueStaticContent($fileUri = '', $https = false)
    {
        // 最终返回结果示例
        // <script type="module" crossorigin src="/assets/home-VjUNKXHj.js"></script>
        // <link rel="modulepreload" crossorigin href="/assets/_plugin-vue_export-helper-6YIHpUfb.js">
        // <link rel="stylesheet" crossorigin href="/assets/_plugin-vue_export-helper-gA1KHM_E.css">
        // <link rel="stylesheet" crossorigin href="/assets/home-FdWSi62J.css">
        if(empty(self::$config)){
            // 首次启动需要加载manifest.json配置
            self::$config = self::getAutoStaticByFile(self::$manifestUri);
        }

        // 线上以版本号为标识，每个map.json都是唯一的，获取并缓存.
        $staticConfig = self::$config[$fileUri];

        $staticList = [];
        // 添加静态资源地址
        $staticList[] = "<script type='module' crossorigin  src='{$staticConfig["file"]}'></script>";
        if(empty($staticConfig['imports']) === false){
            // 外部以来不为空
            foreach($staticConfig['imports'] as $subImportKey){
                // 添加额外导入的静态资源地址
                $subImportConfig = self::$config[$subImportKey];
                // 添加外部依赖的js
                $staticList[] = "<link rel='modulepreload' crossorigin href='{$subImportConfig["file"]}'>";
                if(empty($subImportConfig['css']) === false){
                    // 补充依赖的css
                    foreach($subImportConfig['css'] as $subImportCss){
                        $staticList[] = "<link rel='stylesheet' crossorigin href='{$subImportCss}'>";
                    }
                }
            }
        }
        // 补充项目自身css
        if(empty($staticConfig['css']) === false){
            // 补充依赖的css
            foreach($staticConfig['css'] as $staticImportCss){
                $staticList[] = "<link rel='stylesheet' crossorigin href='{$staticImportCss}'>";
            }
        }

        // 合成为需要注入到html的静态资源代码
        $result = '';
        if(empty($staticList) === false){
            $result = implode("\n", $staticList);
        }

        // 试过很多方法，暂时没办法判断请求是http还是https, 故如果页面支持https则使用//进行自适应匹配.
        if (!empty($result) && $https == true) {
            $result = str_replace('http://', '//', $result);
        }
        return $result;
    }

    /**
     * 从任意uri中读取mainifest.json内容, 并将结果缓存在本地磁盘上
     *
     * @param string $static_url mainifest.json地址.
     *
     * @return mixed
     */
    protected function getAutoStaticByFile($static_url)
    {
        $filePath = self::getCacheDir() . md5($static_url) . '.json';
        if (file_exists($filePath)) {
            $mapJson = file_get_contents($filePath);
            $mapJson = json_decode($mapJson, true);
        } else {
            $mapJson = file_get_contents($static_url);
            $mapJson = json_decode($mapJson, true);
            if (is_array($mapJson)) {
                file_put_contents($filePath, json_encode($mapJson));
            }
        }
        return $mapJson;
    }
}

// 使用示例
// $a = StaticRes::Instance();
// echo $a->getVueStaticContent("src/pages/home/index.html", true);