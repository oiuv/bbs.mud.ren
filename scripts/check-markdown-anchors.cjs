// Run in an isolated browser on the local dev server:
// playwright-cli run-code --filename scripts/check-markdown-anchors.cjs
async (page) => {
  const origin = 'http://127.0.0.1:8081'
  if (!page.url().startsWith(origin + '/')) throw new Error('Use the local dev server in an isolated browser session')
  const assert = (condition, message) => { if (!condition) throw new Error(message) }
  const sections = [
    ['2. 源文件与对象系统', '2-源文件与对象系统'],
    ['9. 一等函数与 Lambda', '9-一等函数与-lambda'],
    ['10. 面向对象：继承与 class', '10-面向对象继承与-class'],
    ['12. Mapping（关联数组）', '12-mapping关联数组']
  ]
  const avatar = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
  const user = { id: 999999, username: 'anchortest', name: '目录验收', avatar, bio: '', extends: {}, cache: {} }
  const body = '<ol>' + sections.map(([title, id]) => `<li><a href="#${encodeURIComponent(id)}">${title}</a></li>`).join('') + '</ol>' +
    sections.map(([title]) => `<h2>${title}</h2><p>${'目录正文验收内容。'.repeat(200)}</p>`).join('') +
    '<a id="重复-1"></a><h2>重复</h2><h2>重复</h2><h3>2.3 <code>__INIT</code> 函数</h3>' +
    '<h2 id="custom-anchor" onclick="window.__anchorUnsafeExecuted=1">自定义标题</h2>' +
    `<img src="${avatar}" onload="window.__anchorUnsafeExecuted=1">`
  const thread = {
    id: 493, title: '目录锚点验收', user_id: user.id, user,
    content: { body, markdown: '' }, cache: { likes_count: 0, comments_count: 0 },
    likers: [], has_liked: false, has_subscribed: false, created_at_timeago: '刚刚'
  }
  const routeHandler = async route => {
    const request = route.request()
    const pathname = new URL(request.url()).pathname
    const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) })
    if (request.method() !== 'GET') return json({ message: '目录验收禁止真实写入' }, 422)
    if (pathname === '/api/threads/493') {
      await new Promise(resolve => setTimeout(resolve, 300))
      return json(thread)
    }
    if (pathname === '/api/comments') return json({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } })
    const headers = { ...request.headers() }
    delete headers.authorization
    return route.continue({ headers })
  }
  const checkPosition = async id => page.waitForFunction(targetId => {
    const element = document.getElementById(targetId)
    if (!element) return false
    const top = element.getBoundingClientRect().top
    return top >= 0 && top < 100
  }, id)
  const viewport = page.viewportSize()
  await page.route('**/api/**', routeHandler)
  try {
    const target = sections[0][1]
    await page.goto(origin + '/threads/493#' + encodeURIComponent(target))
    await checkPosition(target)
    const content = page.locator('.thread-content .markdown-body')
    for (const [title, id] of sections) {
      await content.getByRole('link', { name: title, exact: true }).click()
      await checkPosition(id)
    }
    await content.getByRole('link', { name: sections[0][0], exact: true }).click()
    await page.reload()
    await checkPosition(target)
    await content.getByRole('link', { name: sections[1][0], exact: true }).click()
    await checkPosition(sections[1][1])
    await page.goBack()
    await checkPosition(target)
    await page.goForward()
    await checkPosition(sections[1][1])
    await page.setViewportSize({ width: 390, height: 844 })
    await content.getByRole('link', { name: sections[0][0], exact: true }).click()
    await checkPosition(target)
    const result = await content.evaluate(root => ({
      ids: [...root.querySelectorAll('h2,h3')].map(heading => heading.id),
      customId: root.querySelector('#custom-anchor')?.textContent,
      unsafeAttributes: root.querySelectorAll('[onclick], [onload]').length,
      unsafeExecuted: Boolean(window.__anchorUnsafeExecuted)
    }))
    assert(JSON.stringify(result.ids) === JSON.stringify([...sections.map(([, id]) => id), '重复', '重复-2', '23-__init-函数', 'custom-anchor']), 'Unexpected heading IDs')
    assert(result.customId === '自定义标题', 'Custom heading ID was lost')
    assert(result.unsafeAttributes === 0 && !result.unsafeExecuted, 'HTML cleaning regressed')
    return { delayedDeepLink: true, tocLinks: sections.length, reload: true, history: true, mobile: true, uniqueIds: true, safeHtml: true, realApiWrites: 0 }
  } finally {
    await page.unroute('**/api/**', routeHandler)
    if (viewport) await page.setViewportSize(viewport)
  }
}
