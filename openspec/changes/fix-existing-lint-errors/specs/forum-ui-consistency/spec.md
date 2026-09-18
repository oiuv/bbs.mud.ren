# Spec Delta

## Purpose

保证论坛在清理静态检查错误后仍提供一致的点赞、关注、订阅、分页和通知阅读体验。覆盖成功操作、请求失败、同一对象的多处展示，以及被删除的动态对象，防止维护性修改破坏用户可见行为。

## ADDED Requirements

### Requirement: Consistent relation state

The forum SHALL update the visible relation status and like count only after a successful relation request, and all controls displaying the same owned object SHALL reflect the updated state.

#### Scenario: Like and unlike
- **WHEN** a signed-in user successfully likes or unlikes a thread
- **THEN** its like controls show the same status and its like count increases or decreases exactly once

#### Scenario: Failed request
- **WHEN** a like, follow or subscribe request fails
- **THEN** the previously displayed relation status and counters remain unchanged

#### Scenario: Follow and subscribe
- **WHEN** a follow or subscribe operation succeeds
- **THEN** the corresponding control switches to the reverse action without changing unrelated object data

### Requirement: Pagination loads the selected page

The forum SHALL request the selected page for paginated thread, comment, follower and following lists and display the page returned by the API.

#### Scenario: Select a different page
- **WHEN** the user selects another available page
- **THEN** the owning list requests that page and updates both the list and active page from the response

#### Scenario: Failed page request
- **WHEN** the selected page cannot be loaded
- **THEN** the previous response metadata is not overwritten merely by clicking the pagination control

### Requirement: Notification and activity rendering is preserved

The forum SHALL retain notification content formatting and clickable thread destinations, and SHALL omit activity entries whose subject is absent.

#### Scenario: Read a notification
- **WHEN** a comment or mention notification contains formatted content
- **THEN** the content is rendered inside the corresponding thread link and the link remains navigable

#### Scenario: Deleted activity subject
- **WHEN** an activity response contains entries without a subject
- **THEN** those entries are omitted while valid entries and further-page controls remain available

### Requirement: Existing lint errors are resolved

The repository SHALL pass its existing lint check with zero errors without disabling rules, excluding affected files or converting errors to warnings for this change.

#### Scenario: Validate the repair
- **WHEN** lint and the production build are run after the repair
- **THEN** lint exits successfully with zero errors and the production build completes; remaining warnings are recorded separately
