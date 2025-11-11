# Vue3 AI 图像编辑器
基于 Vue3 + JavaScript + Less 实现的小型 AI 图像编辑器，集成 Tui.ImageEditor 和 Hugging Face AI API。

## 功能清单
1. 图像基础编辑（裁剪、旋转、滤镜）
2. AI 文本生成图像（Stable Diffusion）
3. AI 图像编辑（Qwen Image Edit）
4. 生成历史记录与收藏功能
5. 响应式布局（适配移动端/桌面端）
6. 符合 Creaition 设计系统规范

## 环境搭建
1. 克隆项目：`git clone <仓库地址>`
2. 安装依赖：`npm install`
3. 配置 API Token：
   - 复制 `.env` 文件，将 `VITE_AI_API_TOKEN` 替换为你的 Hugging Face Token
   - Token 获取地址：https://huggingface.co/settings/tokens（需勾选 `api` 权限）
4. 启动项目：`npm run dev`
5. 访问地址：http://127.0.0.1:5173/

## 部署
1. 打包项目：`npm run build`
2. 部署到 Vercel/Netlify：直接上传 `dist` 文件夹，或通过 CLI 部署
3. 部署时需在平台后台配置 `VITE_AI_API_TOKEN` 环境变量

## 注意事项
- 免费版 Hugging Face API 每月限 1000 次请求，请勿高频调用
- 移动端适配断点为 640px，可在 `variables.less` 中修改
- 组件样式使用 Less 全局变量，统一维护设计系统规范