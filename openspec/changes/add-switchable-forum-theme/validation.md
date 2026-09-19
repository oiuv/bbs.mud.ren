# 主题升级验收

日期：2026-09-20。Windows / Node.js 24，本地地址 http://127.0.0.1:8081/。

## 实现结果

- 默认深色与 https://mud.ren/ 的公开 `css/home.css` 颜色一致：近黑背景、深灰表面、暖橙强调和米白文字。已读取主站源码并实际截图对照，复用主站品牌标记。
- 导航提供深浅切换，桌面按钮位于发帖按钮左侧，游客位于登录/注册前；手机保留顶部入口，无需展开菜单。各断点只显示一个切换按钮。选择只存于当前浏览器，跨标签同步；默认不跟随操作系统。
- head 中的 `theme.js` 在 Vue 之前恢复选择；初始背景和浏览器 theme-color 同步。读取、写入存储失败都不阻止当前页面切换。
- 全局颜色变量覆盖 Bootstrap、Markdown、Prism、CodeMirror、Element UI 和正文/版块等局部样式。保留图片原色和语义状态色。
- 手机分页可换行，修复多页时的横向溢出；保留现有分页行为。

## 验证

| 检查 | 结果 |
| --- | --- |
| `npm run lint:check` | 通过，0 错误、0 警告 |
| ESLint 检查 public/theme.js 和两个主题回归脚本 | 通过 |
| `node scripts/check-theme.cjs` | 5 项通过：默认/非法值、保存值恢复、写入、存储异常、跨标签同步 |
| `node scripts/check-ui-state.cjs` | 原有 24 项通过 |
| Playwright CLI `scripts/check-theme-browser.cjs` | 57 个断言通过，模拟 2 次登录写请求，无真实 API 写入 |
| Playwright CLI `scripts/check-rich-content.cjs` | 原有 24 个富文本断言通过，无真实 API 写入 |
| `npm run build` | 按钮位置调整后通过，hash `4461f680f26ddc5c`；dist/theme.js 与源文件 SHA256 一致 |
| `openspec validate add-switchable-forum-theme --strict` | 通过 |
| `git diff --check` | 通过 |
| 本地首页 HTTP | 200 |

浏览器验收包含：深色默认、浅色刷新恢复、实际跨标签变化、键盘切换、登录输入和编辑器草稿保持、模拟登录失败反馈、选择器及确认弹窗、通知、正文代码/引用/表格、图片不反色、账户表单和移动导航。320px 游客首页与 390px 登录态首页/版块均无横向溢出。阻断应用 JavaScript 后仍能恢复浅色；浏览器 localStorage 被禁止时仍能切换。

按钮位置调整后重新运行 lint、生产构建和 57 项主题浏览器断言，均通过；重新查看桌面编辑器与手机首页截图，确认桌面主题按钮紧邻发帖按钮，手机入口仍可直接使用。

初次截图捕获了按钮过渡中间态，最终截图禁用有限动画，按钮颜色断言等待过渡结束。最终截图已人工查看：桌面/手机首页、版块、正文深浅模式、编辑器、弹窗和通知。所有浏览器验收会话已关闭，本地开发服务继续运行。

## 证据与范围

日志和截图位于本机 `%TEMP%\mudren-local\`，未加入版本控制：

- `main-reference.png`、`forum-before.png`：参考站与改造前页面。
- `theme-home-dark-desktop.png`、`theme-home-light-desktop.png`、`theme-home-dark-mobile.png`、`theme-home-light-mobile.png`。
- `theme-rich-post-dark.png`、`theme-rich-post-light.png`、`theme-editor-dark.png`、`theme-editor-light.png`、`theme-editor-dropdown-dark.png`、`theme-dialog-dark.png`、`theme-notifications-dark.png`。
- `theme-browser-verified.log`、`theme-rich-content.log`、`theme-build-final.log`；位置调整后的 `theme-browser-position.log`、`theme-build-position.log`。

生产构建保留原有每个构建目标 26 个警告（样式模块默认导出及包体积/性能），与本次已通过的 ESLint 检查不同。第三方 Dify/验证码 iframe 的内部界面由外部服务控制；未做全量历史帖子、真实账号写入或线上部署验收。业务接口、依赖版本和环境配置没有变更。本次验收不包含推送或部署。
