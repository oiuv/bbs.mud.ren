# Design

## Context

动机见 proposal.md。530 个警告中 510 个有自动修复建议。7 个动态 HTML 入口分别位于 Markdown 正文、两种通知和两种搜索视图；另外 2 个入口仅渲染分页省略号。当前没有统一 HTML 清理器。`UserMedia` 和 `UserListItem` 的所有调用均传入用户对象。

## Goals / Non-Goals

**Goals:** 保留 Vue 2 Options API、路由、组件事件和内容容器；让 HTML 清理逻辑集中且可验证；使现有 lint 命令输出零警告。

**Non-Goals:** 不修改接口或后端存储，不重写 Markdown 渲染协议，不扩展为全库安全审计，不调整 Sass、打包体积或第三方 Vue Router 弃用提示。

## Decisions

1. 使用现有 ESLint 自动修复布局与命名问题，再人工处理剩余警告。组件 `name` 改为 PascalCase；模板注册名、路由名和外部 API 不变。确认现有 `keep-alive` 无按组件名配置的 include/exclude。
2. 新增通用 `SafeHtml` 组件，集中调用 DOMPurify 的 HTML profile 后通过渲染函数生成现有 `section`、`div`、`p` 或 `span` 根元素。允许普通 HTML 内容，过滤脚本、事件属性和危险 URL，不编译内容中的 Vue 指令。保留新窗口链接并补充 `noopener noreferrer`；在不支持清理器的环境下显示纯文本，禁止退回原始 HTML。
3. `MarkdownBody` 在用户提及替换之后执行清理，随后保留已有 Prism 代码高亮。通知继续放在原有路由链接内，搜索高亮保留 `em`/`mark` 等常用元素。分页省略号直接使用文本 `⋯`。
4. 不通过规则禁用或局部豁免消除 `v-html` 警告，也不使用自制正则作为 HTML 清理器。新增 DOMPurify 并仅更新相关锁文件条目，依据其[官方用法](https://github.com/cure53/DOMPurify#how-do-i-use-it)采用浏览器 DOM 清理。
5. `user` prop 标记 `required: true`，体现已有使用契约；空对象默认值会掩盖缺失数据，且不能满足模板所需的用户名、头像等字段。
6. 沿用现有 23 项组件回归，更新通知断言以验证清理组件仍在路由链接内；增加真实浏览器的内容渲染检查，覆盖合法格式、恶意 HTML、搜索内容更新和链接。

## Risks / Trade-offs

- [清理影响富文本] → 检查真实帖子和模拟的标题、图片、列表、代码块、提及、通知和搜索高亮；脚本、iframe、SVG 等活动嵌入按 HTML 内容策略移除。
- [格式修复导致可见空格变化] → 浏览器检查桌面与移动端，审阅非格式差异，保留事件和绑定。
- [名称变更影响引用] → 搜索递归、动态组件和 keep-alive 用法，保留组件注册键与路由配置。
- [构建依赖变化] → 锁定新增依赖，检查锁文件差异与生产构建；不升级无关依赖。

## Migration Plan

无需配置或数据迁移。依赖安装后构建静态站点即可；本轮独立提交，回退可以恢复此前的组件和锁文件。本地服务保持运行供复查。
