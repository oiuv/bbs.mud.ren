# Spec Delta

## Purpose

论坛内容来自帖子、评论、通知和搜索结果，需要保留阅读所需的格式与导航，同时避免其中的活动 HTML 在访问者浏览器中执行。统一约束首次显示和异步更新后的内容，让清理行为可通过界面与测试验证。

## ADDED Requirements

### Requirement: Rich content is cleaned before display

The forum SHALL remove executable scripts, inline event handlers and dangerous URL schemes from rendered post content, notification content and search highlights before inserting them into the page.

#### Scenario: Unsafe content is received
- **WHEN** content contains scripts, an image event handler or a JavaScript link
- **THEN** these executable parts are absent from the rendered content and do not execute

#### Scenario: Content updates asynchronously
- **WHEN** a new response replaces previously displayed rich content
- **THEN** the new content is cleaned before display using the same policy

#### Scenario: Safe HTML processing is unavailable
- **WHEN** the browser cannot safely process HTML for cleaning
- **THEN** the content is displayed as text without executing markup

### Requirement: Safe formatting and navigation remain usable

The forum SHALL preserve headings, emphasis, lists, ordinary links, images, code blocks, user mentions and search highlighting while retaining surrounding notification destinations and page interactions.

#### Scenario: Read formatted content
- **WHEN** a post contains safe formatting, a code example and a user mention
- **THEN** the formatting and code text remain visible and the mention navigates to the corresponding profile

#### Scenario: Read notification or search result
- **WHEN** a notification or search result contains safe emphasis or highlighting
- **THEN** the emphasis remains visible and the original thread destination is retained

#### Scenario: Open an external link
- **WHEN** cleaned content contains a safe link configured to open in a new tab
- **THEN** its URL and new-tab behavior remain available with opener isolation
