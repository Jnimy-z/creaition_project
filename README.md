# Vue 3 + Vite
## 一、技术栈选型（纯 JS + Less 适配）
- 核心框架：Vue3 + Vite（高效构建，无需 TypeScript 配置）
- 状态管理：Pinia（轻量无依赖，JS 原生支持，管理 AI 状态与用户偏好）
- UI 适配：原生 CSS + Less 变量（灵活映射设计系统，简化样式组织）
- 图像编辑核心：tui-image-editor@3.15.0（指定版本，JS 原生兼容）
- AI API 交互：Axios（处理请求、错误重试与跨域）
- 样式工具：Less（替代 Sass，语法更简洁，无需额外复杂配置）
- 部署平台：Vercel/Netlify（快速部署，支持静态资源与 API 代理）

### 环境搭建步骤
1. 创建 Vue3 项目
npm create vite@latest creaition-project -- --template vue
cd creaition-project
npm install
2. 安装核心依赖
图像编辑器核心
npm install tui-image-editor@3.15.0 fabric@4.2.0
工具依赖
npm install axios pinia
npm install -D less less-loader
3. 基础配置
新建 src/style/variables.less，定义 Creaition 设计系统变量（Less 语法）
配置 vite.config.js 解决跨域与路径别名
在 src/main.js 中初始化 Pinia 并引入全局样式
新建 src/style/global.less（全局通用样式）  
## 二、 设计系统集成与 Tui.ImageEditor 适配
1. 定制 Tui.ImageEditor 主题（适配 Creaition 设计系统）
新建 src/components/ImageEditor/theme.js，定义主题配置
新建 src/components/ImageEditor/ImageEditor.vue（主编辑器组件），初始化并注入主题
2. 封装自定义工具栏与属性面板（Less 样式适配）
新建 src/components/ImageEditor/Toolbar.vue（自定义工具栏）
新建 src/components/ImageEditor/PropertiesPanel.vue（属性面板）
3. 响应式设计整合
在 src/views/EditorView.vue 中整合所有组件，处理响应式逻辑
## 三、 AI API 集成与状态管理
1. 封装 AI API 服务（处理请求、错误与重试）
新建 src/services/aiImageService.js
创建 .env 文件（根目录），配置 API Token
2. Pinia 状态管理（管理 AI 生成状态、历史、收藏）
新建 src/stores/aiImageStore.js
3. 实现 AI 生成面板（集成到编辑器）
新建 src/components/ImageEditor/AiPanel.vue
# 运行步骤
1. 配置 API Token：打开 .env 文件，替换 your_huggingface_token_here 为你的 Hugging Face Token（从 https://huggingface.co/settings/tokens 获取，需勾选 api 权限）
2. 安装依赖：打开终端，进入项目根目录，执行 npm install
3. 启动项目：执行 npm run dev，等待编译完成后访问 http://127.0.0.1:5173
