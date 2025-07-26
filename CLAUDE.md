# MUDREN社区论坛系统

基于 Vue.js 2 + Laravel 构建的 MUDREN 社区论坛系统。

## 主要技术栈
- **前端框架**: Vue.js 2
- **状态管理**: Vuex
- **路由管理**: Vue Router
- **UI组件库**: Element UI + Bootstrap 4
- **样式预处理器**: Sass
- **HTTP客户端**: Axios（代理到 https://api.mud.ren）

## 项目结构
采用模块化结构，主要模块位于 `src/modules/` 目录：
- **auth**: 认证模块
- **home**: 首页模块
- **nodes**: 版块管理
- **notifications**: 通知系统
- **pages**: 页面模块
- **search**: 搜索功能
- **threads**: 主题帖子
- **users**: 用户管理

## 常用命令
```bash
# 安装依赖
npm install

# 开发服务器（端口：localhost:8081）
npm run serve

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 环境配置
环境变量使用 `VUE_APP_` 前缀

## 部署
通过 Deployer PHP 部署到 `dist/` 目录

## 核心功能
- ✅ 用户认证系统
- ✅ 主题帖子管理
- ✅ 论坛版块管理
- ✅ 用户个人资料
- ✅ 通知系统
- ✅ 搜索功能
- ✅ 文件上传
- ✅ Markdown编辑器