# API 文档

## 认证 (Authentication)

### 1. 用户注册

*   **Endpoint:** `POST /auth/register`
*   **Description:** 注册一个新用户。
*   **Request Body:**
    *   `username` (string, required): 用户名 (最小 5 个字符, 必须是唯一的, 不能是保留词)。
    *   `email` (string, required): 邮箱 (必须是唯一的)。
    *   `password` (string, required): 密码 (最小 6 个字符)。
    *   `ticket` (string, required): 用于验证的票据 (通过其他接口获取)。
*   **Response:**
    *   `200 OK`
        ```json
        {
            "token": "string"
        }
        ```
    *   `422 Unprocessable Entity`: 验证失败。

### 2. 忘记密码

*   **Endpoint:** `POST /user/forget-password`
*   **Description:** 发送重置密码邮件。
*   **Request Body:**
    *   `email` (string, required): 注册时使用的邮箱。
*   **Response:**
    *   `200 OK` (空响应)
    *   `422 Unprocessable Entity`: 邮箱不存在。

### 3. 重置密码

*   **Endpoint:** `POST /user/reset-password`
*   **Description:** 重置用户密码。
*   **Request Body:**
    *   **场景一: 已登录用户修改密码**
        *   `old_password` (string, required): 旧密码。
        *   `password` (string, required): 新密码 (最小 6 个字符)。
        *   `password_confirmation` (string, required): 确认新密码。
    *   **场景二: 通过重置邮件修改密码**
        *   `token` (string, required): 从重置邮件中获取的 token。
        *   `email` (string, required): 注册时使用的邮箱。
        *   `password` (string, required): 新密码 (最小 6 个字符)。
        *   `password_confirmation` (string, required): 确认新密码。
*   **Response:**
    *   `200 OK`
        ```json
        {
            "status": 200,
            "message": "密码修改成功 ^_^"
        }
        ```
    *   `422 Unprocessable Entity`: 验证失败。
    *   `404 Not Found`: Token 无效或已过期。

### 4. 第三方登录跳转

*   **Endpoint:** `GET /oauth/redirect-url/{platform}`
*   **Description:** 获取第三方登录的跳转链接。
*   **URL Parameters:**
    *   `platform` (string, required): 第三方平台名称 (例如: `github`, `qq`)。
*   **Response:**
    *   `302 Found`: 跳转到第三方授权页面。

### 5. 第三方登录回调

*   **Endpoint:** `GET /oauth/callback/{platform}`
*   **Description:** 处理第三方登录的回调请求。
*   **URL Parameters:**
    *   `platform` (string, required): 第三方平台名称。
*   **Response:**
    *   `200 OK`: 返回用户信息和 token。
    *   `401 Unauthorized`: 授权失败。

## 用户 (Users)

### 1. 获取用户列表

*   **Endpoint:** `GET /users`
*   **Description:** 获取用户列表，支持分页和过滤。
*   **Query Parameters:**
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
    *   (其他过滤参数请参考 `app/Filters/UserFilter.php`)
*   **Response:**
    *   `200 OK`: 返回用户列表。
*   **Response Example:**
    ```json
{
    "data": [
        {
            "id": 1,
            "name": "mudRen",
            "username": "mudren",
            "avatar": "https://api.mud.ren/storage/uploads/2019/10/01/f0f17285c4047e7bb6ee19b65370ff51.jpeg",
            "gender": "male",
            "bio": null,
            "level": 0,
            "is_admin": true
        }
    ],
    "links": {
        "first": "https://api.mud.ren/users?page=1",
        "last": "https://api.mud.ren/users?page=151",
        "prev": null,
        "next": "https://api.mud.ren/users?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 151,
        "path": "https://api.mud.ren/users",
        "per_page": 20,
        "to": 20,
        "total": 3007
    }
}
    ```

### 2. 获取指定用户信息

*   **Endpoint:** `GET /users/{user}`
*   **Description:** 获取指定用户的详细信息。
*   **URL Parameters:**
    *   `user` (integer, required): 用户 ID。
*   **Response:**
    *   `200 OK`: 返回用户信息。

### 3. 获取当前登录用户信息

*   **Endpoint:** `GET /me`
*   **Description:** 获取当前登录用户的详细信息。
*   **Authentication:** Required.
*   **Response:**
    *   `200 OK`: 返回用户信息。

### 4. 更新用户信息

*   **Endpoint:** `PATCH /users/{user}`
*   **Description:** 更新指定用户的信息。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `user` (integer, required): 用户 ID。
*   **Request Body:**
    *   `name` (string, optional): 昵称。
    *   `avatar` (string, optional): 头像 URL。
    *   `realname` (string, optional): 真实姓名。
    *   `bio` (string, optional): 个人简介。
    *   `extends` (object, optional): 扩展信息。
    *   `settings` (object, optional): 设置。
    *   `cache` (object, optional): 缓存。
    *   `gender` (string, optional): 性别。
    *   `banned_at` (datetime, optional): 封禁时间。
*   **Response:**
    *   `200 OK`: 返回更新后的用户信息。
    *   `403 Forbidden`: 无权修改。

### 5. 检查用户是否存在

*   **Endpoint:** `POST /user/exists`
*   **Description:** 检查用户名或邮箱是否已存在。
*   **Request Body:**
    *   `username` (string, optional): 要检查的用户名。
    *   `email` (string, optional): 要检查的邮箱。
*   **Response:**
    *   `200 OK`
        ```json
        {
            "success": true
        }
        ```

---

## 帖子 (Threads)

### 1. 获取帖子列表

*   **Endpoint:** `GET /threads`
*   **Description:** 获取帖子列表，支持分页和过滤。
*   **Query Parameters:**
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
    *   (其他过滤参数请参考 `app/Filters/ThreadFilter.php`)
*   **Response:**
    *   `200 OK`: 返回帖子列表。
*   **Response Example:**
    ```json
{
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "node_id": 7,
            "title": "mud.Ren 社区使用指南",
            "excellent_at": null,
            "pinned_at": "2025-05-14 20:50:51",
            "frozen_at": null,
            "banned_at": null,
            "published_at": "2025-05-14 20:48:25",
            "cache": {
                "views_count": 515,
                "comments_count": 9,
                "likes_count": 4,
                "subscriptions_count": 2,
                "last_reply_user_id": 1,
                "last_reply_user_name": "mudRen",
                "favoriters_count": 0
            },
            "created_at": "2019-05-21 14:27:32",
            "updated_at": "2025-07-23 16:11:26",
            "deleted_at": null,
            "popular_at": "2025-05-14 20:48:25",
            "has_pinned": true,
            "has_banned": false,
            "has_excellent": false,
            "has_frozen": false,
            "created_at_timeago": "6年前",
            "updated_at_timeago": "8小时前",
            "has_liked": false,
            "has_subscribed": false,
            "highlights": [],
            "user": {
                "id": 1,
                "name": "mudRen",
                "username": "mudren",
                "email": "admin@mud.ren",
                "avatar": "https://api.mud.ren/storage/uploads/2019/10/01/f0f17285c4047e7bb6ee19b65370ff51.jpeg",
                "realname": null,
                "gender": "male",
                "bio": null,
                "is_admin": true
            }
        }
    ],
    "links": {
        "first": "https://api.mud.ren/threads?page=1",
        "last": "https://api.mud.ren/threads?page=19",
        "prev": null,
        "next": "https://api.mud.ren/threads?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 19,
        "path": "https://api.mud.ren/threads",
        "per_page": 20,
        "to": 20,
        "total": 378
    }
}
    ```

### 2. 搜索帖子

*   **Endpoint:** `GET /threads/search`
*   **Description:** 搜索帖子。
*   **Query Parameters:**
    *   `q` (string, required): 搜索关键词。
*   **Response:**
    *   `200 OK`: 返回匹配的帖子列表。
*   **Response Example:**
    ```json
{
    "data": [
        {
            "id": 29,
            "user_id": 1,
            "node_id": 3,
            "title": "LPC 语言基础教程：5.7 LPC语言中的面向对象编程",
            "excellent_at": null,
            "pinned_at": null,
            "banned_at": null,
            "published_at": "2019-08-15 14:42:57",
            "cache": {
                "views_count": 1753,
                "comments_count": 6,
                "likes_count": 1,
                "subscriptions_count": 0,
                "last_reply_user_id": 2068,
                "last_reply_user_name": "sasakojiro",
                "favoriters_count": 0
            },
            "created_at": "2019-08-15 14:42:57",
            "updated_at": "2025-07-22 19:47:58",
            "deleted_at": null,
            "popular_at": "2020-12-25 21:43:17",
            "has_pinned": false,
            "has_banned": false,
            "has_excellent": false,
            "has_frozen": false,
            "created_at_timeago": "5年前",
            "updated_at_timeago": "1天前",
            "has_liked": false,
            "has_subscribed": false,
            "highlights": {
                "content": [
                    "debug(\"调用 *test*2 方法\");\n    debug(\"我是示例5.7.5 的 protected 类型函数\");\n}","\npublic void *test*3()\n{\n    debug(\"调用\",\"\");\n    *test*1();\n    *test*2();\n    *test*3();\n\n    return 1;\n}","\nvoid set_s1(string s)\n{\n    s1 = s;\n}\n\nstring","; // 无效\n    ob->*test*2(); // 无效(MUDOS中有效)\n    ob->*test*3();\n    ob->*test*();\n    // 使用封装的方法修改值\n    ob->set_s1","调用 *test*2 方法\n    我是示例5.7.5 的 protected 类型函数\n    调用 *test*3 方法\n    我是示例5.7.5 的 public 类型函数\n    调用 *test* 方法","y, mapping z)\n{\n    //...\n}\n```\n\n在调用中我们可以使用*test*()、*test*(1)、*test*(1,\"*test*\")、*test*(1,\"*test*\",([\"a\":1\"]"
                ]
            },
            "user": {
                "id": 1,
                "name": "mudRen",
                "username": "mudren",
                "avatar": "https://api.mud.ren/storage/uploads/2019/10/01/f0f17285c4047e7bb6ee19b65370ff51.jpeg",
                "gender": "male",
                "bio": null,
                "is_admin": true
            }
        }
    ],
    "links": {
        "first": "https://api.mud.ren/threads/search?query=test&page=1",
        "last": "https://api.mud.ren/threads/search?query=test&page=7",
        "prev": null,
        "next": "https://api.mud.ren/threads/search?query=test&page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 7,
        "path": "https://api.mud.ren/threads/search",
        "per_page": 10,
        "to": 10,
        "total": 70
    }
}
    ```
*   **Response Example:**
    ```json
{
    "data": [
        {
            "id": 29,
            "user_id": 1,
            "node_id": 3,
            "title": "LPC 语言基础教程：5.7 LPC语言中的面向对象编程",
            "excellent_at": null,
            "pinned_at": null,
            "frozen_at": null,
            "banned_at": null,
            "published_at": "2019-08-15 14:42:57",
            "cache": {
                "views_count": 1753,
                "comments_count": 6,
                "likes_count": 1,
                "subscriptions_count": 0,
                "last_reply_user_id": 2068,
                "last_reply_user_name": "sasakojiro",
                "favoriters_count": 0
            },
            "created_at": "2019-08-15 14:42:57",
            "updated_at": "2025-07-22 19:47:58",
            "deleted_at": null,
            "popular_at": "2020-12-25 21:43:17",
            "has_pinned": false,
            "has_banned": false,
            "has_excellent": false,
            "has_frozen": false,
            "created_at_timeago": "5年前",
            "updated_at_timeago": "1天前",
            "has_liked": false,
            "has_subscribed": false,
            "highlights": {
                "content": [
                    "debug(\"调用 *test*2 方法\");\n    debug(\"我是示例5.7.5 的 protected 类型函数\");\n}\n\npublic void *test*3()\n{\n    debug(\"调用\",\"\");\n    *test*1();\n    *test*2();\n    *test*3();\n\n    return 1;\n}\n\nvoid set_s1(string s)\n{\n    s1 = s;\n}\n\nstring","; // 无效\n    ob->*test*2(); // 无效(MUDOS中有效)\n    ob->*test*3();\n    ob->*test*();\n    // 使用封装的方法修改值\n    ob->set_s1","调用 *test*2 方法\n    我是示例5.7.5 的 protected 类型函数\n    调用 *test*3 方法\n    我是示例5.7.5 的 public 类型函数\n    调用 *test* 方法","y, mapping z)\n{\n    //...\n}\n```\n\n在调用中我们可以使用*test*()、*test*(1)、*test*(1,\"*test*\")、*test*(1,\"*test*\",([\"a\":1\"]"
                ]
            },
            "user": {
                "id": 1,
                "name": "mudRen",
                "username": "mudren",
                "avatar": "https://api.mud.ren/storage/uploads/2019/10/01/f0f17285c4047e7bb6ee19b65370ff51.jpeg",
                "gender": "male",
                "bio": null,
                "is_admin": true
            }
        }
    ],
    "links": {
        "first": "https://api.mud.ren/threads/search?query=test&page=1",
        "last": "https://api.mud.ren/threads/search?query=test&page=7",
        "prev": null,
        "next": "https://api.mud.ren/threads/search?query=test&page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 7,
        "path": "https://api.mud.ren/threads/search",
        "per_page": 10,
        "to": 10,
        "total": 70
    }
}
    ```

### 3. 获取指定帖子详情

*   **Endpoint:** `GET /threads/{thread}`
*   **Description:** 获取指定帖子的详细信息。
*   **URL Parameters:**
    *   `thread` (integer, required): 帖子 ID。
*   **Response:**
    *   `200 OK`: 返回帖子信息。
*   **Response Example:**
    ```json
{
    "id": 1,
    "user_id": 1,
    "node_id": 7,
    "title": "mud.Ren 社区使用指南",
    "excellent_at": null,
    "pinned_at": "2025-05-14 20:50:51",
    "frozen_at": null,
    "banned_at": null,
    "published_at": "2025-05-14 20:48:25",
    "cache": {
        "views_count": 516,
        "comments_count": 9,
        "likes_count": 4,
        "subscriptions_count": 2,
        "last_reply_user_id": 1,
        "last_reply_user_name": "mudRen",
        "favoriters_count": 0
    },
    "created_at": "2019-05-21 14:27:32",
    "updated_at": "2025-07-24 00:43:27",
    "deleted_at": null,
    "popular_at": "2025-05-14 20:48:25",
    "has_pinned": true,
    "has_banned": false,
    "has_excellent": false,
    "has_frozen": false,
    "created_at_timeago": "6年前",
    "updated_at_timeago": "1秒前",
    "has_liked": false,
    "has_subscribed": false,
    "highlights": [],
    "user": {
        "id": 1,
        "name": "mudRen",
        "username": "mudren",
        "email": "admin@mud.ren",
        "avatar": "https://api.mud.ren/storage/uploads/2019/10/01/f0f17285c4047e7bb6ee19b65370ff51.jpeg",
        "realname": null,
        "gender": "male",
        "bio": null,
        "is_admin": true
    },
    "content": {
        "id": 1,
        "contentable_type": "App\\Thread",
        "contentable_id": 1,
        "body": "<blockquote>...</blockquote>",
        "markdown": "> ..."
    }
}
    ```

### 4. 创建帖子

*   **Endpoint:** `POST /threads`
*   **Description:** 创建一个新帖子。
*   **Authentication:** Required.
*   **Request Body:**
    *   `title` (string, required): 标题 (最小 6 个字符, 同一用户发布的标题必须唯一)。
    *   `type` (string, required): 内容类型 (`markdown` 或 `html`)。
    *   `content` (object, required): 帖子内容。
        *   `body` (string, required_if:type,html): HTML 内容。
        *   `markdown` (string, required_if:type,markdown): Markdown 内容。
    *   `ticket` (string, required): 用于验证的票据。
    *   `is_draft` (boolean, optional): 是否为草稿。
*   **Response:**
    *   `201 Created`: 返回新创建的帖子信息。
    *   `422 Unprocessable Entity`: 验证失败。

### 5. 更新帖子

*   **Endpoint:** `PUT /threads/{thread}` or `PATCH /threads/{thread}`
*   **Description:** 更新指定帖子。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `thread` (integer, required): 帖子 ID。
*   **Request Body:**
    *   `title` (string, optional): 标题 (最小 6 个字符, 同一用户发布的标题必须唯一)。
    *   `type` (string, optional): 内容类型 (`markdown` 或 `html`)。
    *   `content` (object, optional): 帖子内容。
        *   `body` (string, required_if:type,html): HTML 内容。
        *   `markdown` (string, required_if:type,markdown): Markdown 内容。
    *   `is_draft` (boolean, optional): 是否为草稿。
    *   `ticket` (string, optional): 用于验证的票据 (非管理员用户需要)。
*   **Response:**
    *   `200 OK`: 返回更新后的帖子信息。
    *   `403 Forbidden`: 无权修改。
    *   `422 Unprocessable Entity`: 验证失败。

### 6. 删除帖子

*   **Endpoint:** `DELETE /threads/{thread}`
*   **Description:** 删除指定帖子。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `thread` (integer, required): 帖子 ID。
*   **Response:**
    *   `204 No Content`
    *   `403 Forbidden`: 无权删除。

### 7. 举报帖子

*   **Endpoint:** `POST /threads/{thread}/report`
*   **Description:** 举报指定帖子。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `thread` (integer, required): 帖子 ID。
*   **Request Body:**
    *   `remark` (string, required): 举报原因。
*   **Response:**
    *   `200 OK` (空响应)

## 评论 (Comments)

### 1. 获取评论列表

*   **Endpoint:** `GET /comments`
*   **Description:** 获取评论列表，支持分页和过滤。
*   **Query Parameters:**
    *   `user_id` (integer, required_without:commentable_id): 用户 ID。
    *   `commentable_id` (integer, required_without:user_id): 可评论对象的 ID (例如: 帖子 ID)。
    *   `commentable_type` (string, required_with:commentable_id): 可评论对象的类型 (例如: `threads`)。
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
*   **Response:**
    *   `200 OK`: 返回评论列表。

### 2. 获取指定评论

*   **Endpoint:** `GET /comments/{comment}`
*   **Description:** 获取指定评论的详细信息。
*   **URL Parameters:**
    *   `comment` (integer, required): 评论 ID。
*   **Response:**
    *   `200 OK`: 返回评论信息。

### 3. 创建评论

*   **Endpoint:** `POST /comments`
*   **Description:** 创建一条新评论。
*   **Authentication:** Required.
*   **Request Body:**
    *   `commentable_id` (integer, required): 可评论对象的 ID。
    *   `commentable_type` (string, required): 可评论对象的类型。
    *   `type` (string, required): 内容类型 (`markdown` 或 `html`)。
    *   `content` (object, required): 评论内容。
        *   `body` (string, required_if:type,html): HTML 内容。
        *   `markdown` (string, required_if:type,markdown): Markdown 内容。
*   **Response:**
    *   `201 Created`: 返回新创建的评论信息。
    *   `422 Unprocessable Entity`: 验证失败。

### 4. 更新评论

*   **Endpoint:** `PUT /comments/{comment}` or `PATCH /comments/{comment}`
*   **Description:** 更新指定评论。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `comment` (integer, required): 评论 ID。
*   **Request Body:**
    *   `type` (string, optional): 内容类型 (`markdown` 或 `html`)。
    *   `content` (object, optional): 评论内容。
        *   `body` (string, required_if:type,html): HTML 内容。
        *   `markdown` (string, required_if:type,markdown): Markdown 内容。
*   **Response:**
    *   `200 OK`: 返回更新后的评论信息。
    *   `403 Forbidden`: 无权修改。
    *   `422 Unprocessable Entity`: 验证失败。

### 5. 删除评论

*   **Endpoint:** `DELETE /comments/{comment}`
*   **Description:** 删除指定评论。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `comment` (integer, required): 评论 ID。
*   **Response:**
    *   `204 No Content`
    *   `403 Forbidden`: 无权删除。

### 6. 顶/踩评论

*   **Endpoints:**
    *   `POST /comments/{comment}/up-vote` (顶)
    *   `POST /comments/{comment}/down-vote` (踩)
    *   `POST /comments/{comment}/cancel-vote` (取消顶/踩)
*   **Description:** 对评论进行顶、踩或取消操作。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `comment` (integer, required): 评论 ID。
*   **Response:**
    *   `200 OK` (空响应)

---

## 节点 (Nodes)

### 1. 获取节点列表

*   **Endpoint:** `GET /nodes`
*   **Description:** 获取节点列表。
*   **Query Parameters:**
    *   `all` (boolean, optional): 获取所有节点并以树形结构展示。
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
    *   (其他过滤参数请参考 `app/Filters/NodeFilter.php`)
*   **Response:**
    *   `200 OK`: 返回节点列表。

### 2. 获取指定节点的帖子列表

*   **Endpoint:** `GET /nodes/{node}/threads`
*   **Description:** 获取指定节点下的帖子列表。
*   **URL Parameters:**
    *   `node` (integer, required): 节点 ID。
*   **Query Parameters:**
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
*   **Response:**
    *   `200 OK`: 返回帖子列表。

### 3. 创建节点

*   **Endpoint:** `POST /nodes`
*   **Description:** 创建一个新节点。
*   **Authentication:** Required.
*   **Response:**
    *   `201 Created`: 返回新创建的节点信息。

### 4. 获取指定节点

*   **Endpoint:** `GET /nodes/{node}`
*   **Description:** 获取指定节点的详细信息。
*   **URL Parameters:**
    *   `node` (integer, required): 节点 ID。
*   **Response:**
    *   `200 OK`: 返回节点信息。
*   **Response Example:**
    ```json
{
    "id": 1,
    "node_id": 0,
    "order": 1,
    "title": "游戏开发",
    "icon": null,
    "banner": null,
    "description": "LPC开发节点",
    "settings": null,
    "cache": null,
    "created_at": "2019-05-21 13:59:04",
    "updated_at": "2021-03-30 22:07:57",
    "deleted_at": null,
    "has_subscribed": false
}
    ```

### 5. 更新节点

*   **Endpoint:** `PUT /nodes/{node}` or `PATCH /nodes/{node}`
*   **Description:** 更新指定节点。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `node` (integer, required): 节点 ID。
*   **Response:**
    *   `200 OK`: 返回更新后的节点信息。
    *   `403 Forbidden`: 无权修改。

### 6. 删除节点

*   **Endpoint:** `DELETE /nodes/{node}`
*   **Description:** 删除指定节点。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `node` (integer, required): 节点 ID。
*   **Response:**
    *   `204 No Content`
    *   `403 Forbidden`: 无权删除。

## 横幅 (Banners)

### 1. 获取横幅列表

*   **Endpoint:** `GET /banners`
*   **Description:** 获取横幅列表。
*   **Query Parameters:**
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
    *   (其他过滤参数请参考 `app/Filters/BannerFilter.php`)
*   **Response:**
    *   `200 OK`: 返回横幅列表。

## 标签 (Tags)

### 1. 获取标签列表

*   **Endpoint:** `GET /tags`
*   **Description:** 获取标签列表。
*   **Query Parameters:**
    *   `per_page` (integer, optional): 每页数量 (默认: 20)。
    *   `page` (integer, optional): 页码。
    *   (其他过滤参数请参考 `app/Filters/TagFilter.php`)
*   **Response:**
    *   `200 OK`: 返回标签列表。

## 通知 (Notifications)

### 1. 获取通知列表

*   **Endpoint:** `GET /notifications`
*   **Description:** 获取当前用户的通知列表。
*   **Authentication:** Required.
*   **Response:**
    *   `200 OK`: 返回通知列表。

### 2. 将所有通知标记为已读

*   **Endpoint:** `POST /notifications/mark-all-as-read`
*   **Description:** 将当前用户的所有未读通知标记为已读。
*   **Authentication:** Required.
*   **Response:**
    *   `200 OK` (空响应)

### 3. 将指定通知标记为已读

*   **Endpoint:** `PATCH /notifications/{notification}`
*   **Description:** 将当前用户的指定未读通知标记为已读。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `notification` (string, required): 通知 ID。
*   **Response:**
    *   `200 OK` (空响应)

## 关系 (Relations)

### 1. 获取关系列表

*   **Endpoint:** `GET /relations`
*   **Description:** 获取指定对象的关系列表 (例如: 关注者、点赞者等)。
*   **Query Parameters:**
    *   `followable_id` (integer, required): 对象 ID。
    *   `followable_type` (string, required): 对象类型。
    *   `relation` (string, optional): 关系类型 (默认: `follow`)。
    *   `per_page` (integer, optional): 每页数量 (默认: 50)。
*   **Response:**
    *   `200 OK`: 返回关系列表。

### 2. 切换关系

*   **Endpoint:** `POST /relations/{relation}`
*   **Description:** 切换用户与对象之间的关系 (例如: 关注/取消关注)。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `relation` (string, required): 关系类型 (`like`, `follow`, `subscribe`, `favorite`, `upvote`, `downvote`)。
*   **Request Body:**
    *   `followable_id` (integer, required): 对象 ID。
    *   `followable_type` (string, required): 对象类型。
*   **Response:**
    *   `204 No Content`

## 内容 (Content)

### 1. 预览 Markdown

*   **Endpoint:** `POST /contents/preview`
*   **Description:** 将 Markdown 转换为 HTML。
*   **Request Body:**
    *   `markdown` (string, required): 要转换的 Markdown 内容。
*   **Response:**
    *   `200 OK`: 返回转换后的 HTML。

### 2. 更新内容

*   **Endpoint:** `PATCH /contents/{content}`
*   **Description:** 更新指定内容。
*   **Authentication:** Required.
*   **URL Parameters:**
    *   `content` (integer, required): 内容 ID。
*   **Request Body:**
    *   `markdown` (string, required): 更新后的 Markdown 内容。
*   **Response:**
    *   `200 OK`: 返回更新后的内容信息。

## 文件上传 (File Uploads)

### 1. 上传文件

*   **Endpoint:** `POST /files/upload`
*   **Description:** 上传文件。
*   **Authentication:** Required.
*   **Request Body:**
    *   `file` (file, required): 要上传的文件。
*   **Response:**
    *   `200 OK`: 返回文件信息，包括 URL。