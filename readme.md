
<img align="right" width="100" src="https://www.mud.ren/logo.png"/>

<h1 align="left"><a href="https://bbs.mud.ren">bbs.mud.ren</a></h1>

MUDREN 是独立维护的社区论坛前端，基于 Vue 2 开发，与独立部署的 Laravel 后端 API 配合使用。

> 后端源码：https://github.com/oiuv/api.mud.ren

## 安装

> 构建环境：Node.js 24 LTS（使用随 Node 安装的 npm）。项目提供 `.nvmrc`，使用版本管理器时可执行 `nvm use` 或 `fnm use`。服务器已有 Node.js 24 时可直接构建，无需切换到旧版 Node。

克隆源代码到本地：

```shell
$ git clone https://github.com/oiuv/bbs.mud.ren.git
```

按锁文件安装依赖（构建需要开发依赖）：

```shell
$ npm ci --include=dev
```

本地开发（默认端口 8081）：

```shell
$ npm run serve
```

生产构建：

```shell
$ npm run build
```

构建产物位于 `dist/`。Node.js 仅用于开发和打包，网站运行时由 Nginx、Apache 或 IIS 提供静态文件，不需要常驻 Node 进程。也可以在本地或 CI 中用生产环境配置构建，再将 `dist/` 上传到服务器。

路由使用 history 模式，Web 服务器需将不存在的文件路径回退到 `index.html`。Nginx 可在站点的 `location /` 中设置 `try_files $uri $uri/ /index.html;`。Laravel API 仍独立部署。

现有 `deploy.php` 会在服务器执行 `npm ci --include=dev` 和 `npm run build`，使用该流程时服务器需安装 Node.js 24。

代码检查：

```shell
$ npm run lint:check
```

`npm run lint` 会自动修复可修复的问题；`lint:check` 只检查，不修改文件。构建使用 Vue CLI 5 / Webpack 5 和 Dart Sass，无需 `node-sass` 或 `--openssl-legacy-provider`。

## 配置

Copy the `.env.example` to `.env.[ENV]`:

```shell
# local
cp .env.example .env.local

# production
cp .env.example .env.production
```

其中有两个变量是你在安装后端时 `passport:install` 得到的 **Password Grant Client** 的 `id` 与 `secret`：

```
VUE_APP_AUTH_CLIENT_ID=
VUE_APP_AUTH_CLIENT_SECRET=
```

如果你忘记了，就去找 `oauth_clients` 表中找吧。

配置 [腾讯防水墙](https://007.qq.com/) ID , 需要跟后端一致

```env
# 腾讯防水墙配置
VUE_APP_CAPTCHA_ID_REGISTER=
VUE_APP_CAPTCHA_ID_PUBLISH=
```

环境变量在构建时写入前端产物。修改 API 地址等配置后需要重新构建；不要在 `VUE_APP_*` 中保存私有服务密钥。

## AI 助手（Dify）

`/ai` 在登录后加载 Dify 整页聊天，自动传入当前账号的信息：

- `systemVariables.user_id`：`mudren:<用户 ID>:<昵称>`，例如 `mudren:1:雪风`。昵称为空时使用用户名，两者都为空时使用 `用户 <ID>`。
- `userVariables.name`：昵称，未设置时使用用户名。
- `userVariables.avatar_url`：头像地址；未设置或地址无效时使用 Dify 默认头像。

参数按 [Dify 官方嵌入脚本](https://github.com/langgenius/dify/blob/main/web/public/embed.js)的 gzip + Base64 格式编码到 iframe 地址，支持中文昵称。退出登录会移除聊天窗口，切换账号或更新昵称、头像会重新加载。仅传递上述公开资料，不传递邮箱、论坛登录令牌或 API 密钥。`user_id` 用于 Dify 用户标识，不代替后端鉴权；历史会话的保存和恢复由 Dify 管理，本站不固定 `conversation_id`。从旧的 `mudren:<用户 ID>` 格式切换，或以后修改昵称，都会改变 Dify 用户标识；旧标识下的会话不会自动迁移。

`.env.local` / `.env.production` 可通过 `VUE_APP_DIFY_BASE_URL` 和 `VUE_APP_DIFY_TOKEN` 覆盖默认应用；这里的 token 是公开的嵌入标识，不是 Dify API 密钥。修改后需重新构建。浏览器需支持 `CompressionStream`，不支持时页面会提示升级。

## License

MIT
