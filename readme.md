
[![Created Badge](https://badges.pufler.dev/created/oiuv/bbs.mud.ren)](https://badges.pufler.dev)
[![Updated Badge](https://badges.pufler.dev/updated/oiuv/bbs.mud.ren)](https://bbs.mud.ren)
[![Visits Badge](https://badges.pufler.dev/visits/oiuv/bbs.mud.ren)](https://bbs.mud.ren)

<img align="right" width="100" src="https://www.mud.ren/logo.png"/>

<h1 align="left"><a href="https://bbs.mud.ren">bbs.mud.ren</a></h1>

MUDREN论坛项目基于[一刻社区](https://github.com/yikeio/yike.io)修改, 使用 Vuejs 开发的 Laravel SPA 项目。

[![Contributors Display](https://badges.pufler.dev/contributors/oiuv/bbs.mud.ren?size=50&padding=5&bots=true)](https://github.com/oiuv/bbs.mud.ren)

> 🏵后端源码：https://github.com/oiuv/api.mud.ren

## 安装

> nodejs请使用LTS版本: v14.*

克隆源代码到本地：

```shell
$ git clone https://github.com/oiuv/bbs.mud.ren.git
```

安装依赖：

```shell
$ npm install
```

或者使用 yarn：

```shell
$ yarn install
```

测试服务：

```shell
$ npm run serve
```

正式服务：

```shell
$ yarn build
```

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

## License

MIT
