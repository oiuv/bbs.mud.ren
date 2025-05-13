// 引入之前的模块路由
import { routes as auth } from '$modules/auth'
import { routes as home } from '$modules/home'
import { routes as nodes } from '$modules/nodes'
import { routes as notifications } from '$modules/notifications'
import { routes as pages } from '$modules/pages'
import { routes as threads } from '$modules/threads'
import { routes as users } from '$modules/users'

// 引入 SearchPage 组件
import SearchPage from '$modules/search/SearchPage.vue';

import Vue from 'vue'
import Router from 'vue-router'
import beforeEach from './beforeEach'

Vue.use(Router)

const AppRoute = {
  path: '/',
  component: () => import('../app'),
  children: [
    ...auth, 
    ...home, 
    ...threads, 
    ...notifications, 
    ...nodes, 
    ...pages, 
    ...users,
    {
      path: 'search', // 定义搜索页面的路由路径
      name: 'search', // 定义路由名称
      component: SearchPage // 指定对应的组件
    }
  ]
}

const routes = [AppRoute]

const router = new Router({
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  mode: 'history'
})

router.beforeEach(beforeEach)

export default router
