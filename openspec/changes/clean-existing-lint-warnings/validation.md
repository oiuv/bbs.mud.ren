# 验证记录

日期：2026-09-18。环境：Windows、Node.js 24.21.0、npm 12.0.2；本地开发地址 `http://127.0.0.1:8081/`。

## 检查结果

| 检查 | 结果 |
| --- | --- |
| `npm run lint:check` | 通过，退出码 0；**0 errors / 530 warnings → 0 errors / 0 warnings** |
| `node scripts/check-ui-state.cjs` | 24 项通过，0 项失败，包含前一轮的状态流回归及新增的安全纯文本回退 |
| `node node_modules/eslint/bin/eslint.js scripts/check-ui-state.cjs scripts/check-rich-content.cjs` | 通过，0 errors / 0 warnings |
| Playwright CLI 执行 `scripts/check-rich-content.cjs` | 24 个浏览器断言通过，API 写请求全部由隔离会话拦截 |
| `npm run build` | 通过，`dist/` 已生成，构建 hash `3c7ddd86c68fc0be` |
| `openspec validate clean-existing-lint-warnings --strict` | 通过 |
| `git diff --check` | 通过 |
| 本地首页 HTTP 检查 | 200 |

本轮未更改 `.eslintrc.js`、检查范围或环境变量，没有新增规则豁免。生产构建仍有原有样式模块默认导出及包体积/性能警告；这是构建工具的诊断，不属于本轮已清零的 ESLint 警告。

## 变更复核

- 自动修复处理 510 个警告。余下的组件选项顺序经过人工确认后整理；两个用户 prop 改为必填，分页省略号改为静态文本。
- 对 63 个既有 Vue 文件做脚本和模板语法树对比，排除格式、组件名称及选项顺序后，差异集中于预期的 HTML 入口、用户 prop 和分页文本。订阅文字和热门话题的额外差异为插值空格，已复核。
- 新增 `SafeHtml` 统一清理 7 处动态 HTML，先处理用户提及再清理正文。渲染函数只插入清理结果；不支持清理器时通过 Vue 文本节点显示原内容。
- 依赖仅新增固定版本 `dompurify@3.4.15` 及可选类型依赖 `@types/trusted-types@2.0.7`，未升级无关包。实现依据 [DOMPurify 官方用法](https://github.com/cure53/DOMPurify#how-do-i-use-it)及 HTML profile 配置。

## 浏览器验收

使用隔离 Edge 会话。真实公共 API 下的首页、`/threads/1`、桌面和 390 × 844 移动端页面正常加载；移动端视口和内容宽度均为 390，导航能够返回首页。截图已检查，浏览器运行错误为 0，保留已有 Vue Router `tag` 弃用提示。

模拟内容回归通过以下检查：

- 正文保留标题、加粗、斜体、高亮、列表、图片、代码文本与 Prism 语法高亮。
- `@mudren` 保留用户链接并能跳转；安全外链保留新窗口打开行为并含 `noopener noreferrer`。
- 脚本、事件属性、JavaScript 链接、iframe 和 SVG 活动内容被移除，执行标记始终未触发。
- 搜索先后返回两组响应时，标题与正文高亮均更新，详情链接保持 `/threads/1`。
- 评论通知和提及通知均保留加粗内容及外层主题链接，点击通知可进入主题。

## 重复运行与边界

组件回归使用 Node 直接运行。浏览器回归需要本地开发服务和独立 Playwright CLI 会话：先用 `playwright-cli open http://127.0.0.1:8081/ --browser msedge` 打开，再运行 `playwright-cli run-code --filename scripts/check-rich-content.cjs`，最后关闭测试会话。若使用具名会话，三个命令使用同一个 `-s=<name>`。

浏览器脚本应在项目根目录执行，或者将 `--filename` 改为绝对路径。它用模拟登录和接口响应验证前端行为，不能代替真实后端认证或账号写入验收。未挂载的旧导航搜索组件通过编译和统一组件接入复核；实际搜索页完成了浏览器交互验证。

活动嵌入内容会按清理策略移除，不承诺保留任意原始 HTML。此次没有对所有历史帖子、第三方嵌入或所有浏览器逐一验收。

临时证据保存在本机 `%TEMP%\mudren-local\`：`warnings-lint-final.log`、`warnings-build-final.log`、`warnings-rich-content.log`、`warnings-guest-desktop.png`、`warnings-guest-mobile.png`、`warnings-home-mobile.png`。本地服务保持运行，环境配置、构建产物和临时证据不纳入提交。
