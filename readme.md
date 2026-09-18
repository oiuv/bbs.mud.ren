
<img align="right" width="100" src="https://www.mud.ren/logo.png"/>

<h1 align="left"><a href="https://bbs.mud.ren">bbs.mud.ren</a></h1>

MUDREN论坛项目基于[一刻社区](https://github.com/yikeio/yike.io)修改, 使用 Vuejs 开发的 Laravel SPA 项目。

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

## License

MIT
