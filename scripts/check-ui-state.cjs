// Run with Node 24: node scripts/check-ui-state.cjs
// Uses the project's existing Vue/Babel dependencies; makes no network requests.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const { transformSync } = require('@babel/core')
const compiler = require('vue-template-compiler')
const Vue = require('vue')

const root = path.resolve(__dirname, '..')
const cache = new Map()
const componentStub = {
  props: ['item', 'user', 'relation', 'action', 'meta', 'notification', 'to', 'html', 'tag'],
  render (h) { return h('span', this.$slots.default) }
}

function load (file) {
  if (cache.has(file)) return cache.get(file)
  const source = fs.readFileSync(path.join(root, 'src', file), 'utf8')
  const { script, template } = compiler.parseComponent(source)
  const { code } = transformSync(script.content, {
    babelrc: false,
    configFile: false,
    plugins: [require('@babel/plugin-transform-modules-commonjs')]
  })
  const module = { exports: {} }
  const importStub = id => ['vuex', 'dompurify'].includes(id) ? require(id) : componentStub
  new Function('require', 'module', 'exports', code)(importStub, module, module.exports)
  const options = module.exports.default
  const rendered = template ? compiler.compileToFunctions(template.content) : {}
  const result = { options, rendered }
  cache.set(file, result)
  return result
}

function freeze (value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}

function context (file, props) {
  const { options } = load(file)
  const events = []
  const vm = {
    ...props,
    $emit: (...args) => events.push(args),
    ...options.methods
  }
  Object.assign(vm, options.data ? options.data.call(vm) : {}, props)
  return { vm, events }
}

function render (file, propsData) {
  const { options, rendered } = load(file)
  const vm = new Vue({
    ...options,
    ...rendered,
    components: { ...options.components, RouterLink: componentStub },
    propsData,
    beforeCreate () { this.$store = { getters: { currentUser: { id: 1 } } } },
    created: [],
    mounted: []
  })
  return { vm, tree: vm._render() }
}

function nodes (tree) {
  if (!tree) return []
  return [tree, ...(tree.children || []).flatMap(nodes),
    ...((tree.componentOptions && tree.componentOptions.children) || []).flatMap(nodes)]
}

for (const [action, field, relation] of [
  ['like', 'has_liked', 'thread'],
  ['follow', 'has_followed', 'user'],
  ['subscribe', 'has_subscribed', 'node']
]) {
  for (const previous of [false, true]) {
    test(`${action}: successful toggle preserves input and unrelated fields (${previous})`, async () => {
      const item = freeze({ id: 12, [field]: previous, name: '保持资料', cache: { likes_count: 7 } })
      const { vm, events } = context('components/buttons/relation-btn.vue', { item, action, relation })
      vm.$http = { post: async (url, body) => {
        assert.equal(url, `relations/${action}`)
        assert.deepEqual(body, { followable_type: vm.types[relation], followable_id: 12 })
      } }
      await vm.toggle()
      assert.deepEqual(events, [
        ['update:item', { ...item, [field]: !previous }],
        ['after-toggle', !previous]
      ])
      assert.equal(item[field], previous)
    })
  }
  test(`${action}: rejected request emits no state update`, async () => {
    const { vm, events } = context('components/buttons/relation-btn.vue', {
      item: freeze({ id: 12, [field]: false }), action, relation
    })
    vm.$http = { post: async () => { throw new Error('request failed') } }
    await assert.rejects(vm.toggle(), /request failed/)
    assert.deepEqual(events, [])
  })
}

test('like wrapper handles the real child event with one immutable counter update', () => {
  for (const previous of [false, true]) {
    const item = freeze({ id: 12, has_liked: previous, cache: { likes_count: 7, comments_count: 3 } })
    const { vm, tree } = render('components/buttons/like-btn.vue', { item, relation: 'thread' })
    const updates = []
    vm.$on('update:item', value => updates.push(value))
    tree.componentOptions.listeners['after-toggle'](!previous)
    assert.deepEqual(updates, [{ ...item, has_liked: !previous, cache: {
      ...item.cache, likes_count: previous ? 6 : 8
    } }])
    assert.equal(item.cache.likes_count, 7)
    vm.$destroy()
  }
})

test('animated like shares the same counter contract without accessing its parent', async () => {
  for (const previous of [false, true]) {
    const item = freeze({ id: 12, has_liked: previous, cache: { likes_count: 7, comments_count: 3 } })
    const { vm, events } = context('components/buttons/animate-action.vue', {
      item, currentUser: { id: 1 }, $http: { post: async () => {} }
    })
    await vm.toggle()
    assert.deepEqual(events, [['update:item', { ...item, has_liked: !previous, cache: {
      ...item.cache, likes_count: previous ? 6 : 8
    } }]])
  }
})

test('animated like redirects guests and does not update after a failed request', async () => {
  const { vm, events } = context('components/buttons/animate-action.vue', {
    item: freeze({ id: 12, has_liked: false, cache: { likes_count: 7 } }), currentUser: {}
  })
  vm.$router = { push: route => assert.deepEqual(route, { name: 'auth.login' }) }
  vm.$http = { post: async () => { throw new Error('request failed') } }
  vm.toggle()
  vm.currentUser = { id: 1 }
  await assert.rejects(vm.toggle(), /request failed/)
  assert.deepEqual(events, [])
})

for (const [file, incoming, outgoing, prop] of [
  ['buttons/follow-btn.vue', 'update:item', 'update:item', 'item'],
  ['buttons/subscribe-btn.vue', 'update:item', 'update:item', 'item'],
  ['user-card.vue', 'update:item', 'update:user', 'user'],
  ['user-profile-card.vue', 'update:item', 'update:user', 'user'],
  ['user-list-item.vue', 'update:item', 'update:user', 'user']
]) {
  test(`${file}: forwards child updates without mutating its prop`, () => {
    const user = freeze({ id: 12, username: 'tester', name: '测试用户', has_followed: false })
    const { vm, tree } = render(`components/${file}`, { [prop]: user, relation: 'thread' })
    const updates = []
    vm.$on(outgoing, value => updates.push(value))
    const child = nodes(tree).find(node => node.componentOptions?.listeners?.[incoming])
    assert.ok(child, 'update listener is present in the compiled template')
    const next = { ...user, has_followed: true }
    child.componentOptions.listeners[incoming](next)
    assert.deepEqual(updates, [next])
    assert.equal(user.has_followed, false)
    vm.$destroy()
  })
}

test('paginator emits selection without overwriting the displayed response metadata', () => {
  const meta = freeze({ current_page: 1, last_page: 3 })
  const { vm, events } = context('components/paginator.vue', { meta })
  vm.change(2)
  assert.deepEqual(events, [['change', 2]])
  assert.equal(meta.current_page, 1)
})

for (const [file, method] of [['followers', 'followers'], ['following', 'followings']]) {
  test(`${file}: requests the selected page and preserves the old list on failure`, async () => {
    const previous = freeze({ data: [{ id: 1 }], meta: { current_page: 1, last_page: 3 } })
    const next = { data: [{ id: 2 }], meta: { current_page: 2, last_page: 3 } }
    const { vm } = context(`modules/users/tabs/${file}.vue`, {
      users: previous, $parent: { user: { username: 'tester' } }
    })
    vm.$http = { get: async (url, options) => {
      assert.equal(url, `user/tester/${method}`)
      assert.deepEqual(options, { params: { page: 2 } })
      assert.equal(vm.users, previous)
      return next
    } }
    await vm[method](2)
    assert.equal(vm.users, next)
    vm.$http.get = async () => { throw new Error('request failed') }
    await assert.rejects(vm[method](3), /request failed/)
    assert.equal(vm.users, next)
  })
}

test('activity filtering keeps valid subjects without changing the response or pagination', () => {
  const activities = freeze({ data: [{ id: 1, subject: null }, { id: 2, subject: { id: 4 } }], meta: { current_page: 1, last_page: 2 } })
  const { options } = load('modules/users/tabs/activities.vue')
  assert.deepEqual(options.computed.visibleActivities.call({ activities }), [activities.data[1]])
  assert.equal(activities.data.length, 2)
  assert.equal(activities.meta.last_page, 2)
})

for (const file of ['comment-my-thread', 'mentioned-me']) {
  test(`${file}: formatted notification content remains inside its thread link`, () => {
    const notification = freeze({ data: {
      thread_id: 12, thread_title: '测试主题', comment_id: 3,
      commentable_id: 12, commentable_title: '测试主题', content: '<strong>通知正文</strong>'
    } })
    const { vm, tree } = render(`modules/notifications/types/${file}.vue`, { notification })
    const link = nodes(tree).find(node => node.componentOptions &&
      node.componentOptions.tag === 'router-link' &&
      nodes(node).some(child => child.componentOptions?.tag === 'safe-html'))
    assert.ok(link)
    assert.deepEqual(link.componentOptions.propsData.to, { name: 'threads.show', params: { id: 12 } })
    const content = nodes(link).find(node => node.componentOptions?.tag === 'safe-html')
    assert.deepEqual(content.componentOptions.propsData, { html: notification.data.content, tag: 'span' })
    vm.$destroy()
  })
}

test('rich HTML falls back to escaped text when DOM cleaning is unavailable', () => {
  const html = '<img src=x onerror="alert(1)"><script>alert(1)</script>'
  for (const tag of ['div', 'span', 'p', 'section', 'script']) {
    const { vm, tree } = render('components/safe-html.vue', { html, tag })
    assert.equal(tree.tag, tag === 'script' ? 'div' : tag)
    assert.equal(tree.data?.domProps, undefined)
    assert.equal(tree.children.length, 1)
    assert.equal(tree.children[0].text, html)
    assert.equal(tree.children[0].tag, undefined)
    vm.$destroy()
  }
})
