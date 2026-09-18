// Run in an isolated Playwright CLI session on the local dev server:
// playwright-cli run-code --filename scripts/check-rich-content.cjs
async (page) => {
  const origin = 'http://127.0.0.1:8081'
  if (!page.url().startsWith(origin + '/')) throw new Error('Use the local dev server in an isolated browser session')
  const assert = (condition, message) => { if (!condition) throw new Error(message) }
  const checks = []
  const record = (name, result) => {
    for (const [key, passed] of Object.entries(result)) assert(passed, `${name}: ${key}`)
    checks.push({ name, assertions: Object.keys(result).length })
  }
  const avatar = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
  const user = {
    id: 999999, username: 'lintguest', name: '隔离验收账号', avatar, bio: '',
    extends: {}, cache: {}, has_activated: false, is_admin: false
  }
  const attack = '<script>window.__richContentExecuted=1</script><img src="' + avatar + '" onload="window.__richContentExecuted=1"><a href="javascript:window.__richContentExecuted=1">危险链接</a><iframe srcdoc="<script>parent.__richContentExecuted=1</script>"></iframe><svg onload="window.__richContentExecuted=1"></svg>'
  const body = '<h3>格式验收</h3><p><strong>加粗</strong> <em>斜体</em> <mark>高亮</mark> @mudren</p><ul><li>列表内容</li></ul><pre><code class="language-javascript">const answer = 42</code></pre><a href="https://example.com/docs" target="_blank">外部链接</a>' + attack
  const thread = {
    id: 1, title: 'HTML 清理验收', user_id: 1,
    user: { ...user, id: 1, username: 'mudren', name: '作者', has_followed: false },
    content: { body, markdown: body }, cache: { likes_count: 7, comments_count: 0 },
    likers: [], has_liked: false, has_subscribed: false, created_at_timeago: '刚刚'
  }
  const routeHandler = async route => {
    const req = route.request()
    const pathname = req.url().split('/api')[1].split('?')[0]
    const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) })
    if (pathname === '/oauth/token') return json({ access_token: 'rich-content-test-only', token_type: 'Bearer' })
    if (pathname === '/me') return json(user)
    if (req.method() !== 'GET') return json({ errors: { test: ['浏览器验收禁止真实写入'] } }, 422)
    if (pathname === '/threads/1') return json(thread)
    if (pathname === '/comments') return json({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } })
    if (pathname === '/threads/search') {
      const second = req.url().includes('q=second')
      const label = second ? '第二轮' : '第一轮'
      return json({ data: [{ id: 1, user, title: label, highlights: {
        title: [`<em>${label}标题</em>` + attack], content: [`<mark>${label}正文</mark>` + attack]
      } }], links: {}, meta: { current_page: 1, last_page: 1, total: 1 } })
    }
    if (pathname === '/user/notifications') {
      return json({ data: ['comment_my_thread', 'mentioned_me'].map((type, i) => ({
        id: i + 1, type, created_at: '2026-09-18', read_at: null,
        data: { ...user, thread_id: 1, thread_title: thread.title, commentable_id: 1,
          commentable_title: thread.title, comment_id: i + 1,
          content: `<strong>通知验收 ${i + 1}</strong>` + attack }
      })) })
    }
    const headers = { ...req.headers() }
    delete headers.authorization
    return route.continue({ headers })
  }
  // These routes exist only in this isolated browser; mutations never reach the API.
  await page.route('**/api/**', routeHandler)
  try {
    await page.goto(origin + '/threads/1')
    await page.getByRole('heading', { name: 'HTML 清理验收', exact: true }).waitFor()
    await page.locator('body').ariaSnapshot()
    record('post', await page.evaluate(() => {
      const content = document.querySelector('.thread-content .markdown-body')
      const link = content.querySelector('a[target="_blank"]')
      return {
        root: content.tagName === 'SECTION',
        formatting: ['h3', 'strong', 'em', 'mark', 'ul li', 'img'].every(selector => content.querySelector(selector)),
        code: content.querySelector('pre code').textContent === 'const answer = 42',
        syntaxHighlight: Boolean(content.querySelector('pre code .token')),
        mention: content.querySelector('a.username')?.getAttribute('href') === '/mudren',
        link: link?.getAttribute('href') === 'https://example.com/docs' && link.rel.includes('noopener') && link.rel.includes('noreferrer'),
        clean: !content.querySelector('script, iframe, svg, [onload], [onerror], a[href^="javascript:"]'),
        noExecution: !window.__richContentExecuted
      }
    }))
    await page.locator('.markdown-body a.username').click()
    await page.waitForURL(/\/mudren\/?$/)
    checks.push({ name: 'mention navigation', assertions: 1 })

    await page.goto(origin + '/search')
    await page.getByRole('searchbox', { name: 'Search' }).waitFor()
    await page.locator('body').ariaSnapshot()
    for (const [query, label] of [['first', '第一轮'], ['second', '第二轮']]) {
      await page.getByRole('searchbox', { name: 'Search' }).fill(query)
      await page.locator('.search-results em').filter({ hasText: `${label}标题` }).waitFor()
      record(`search ${query}`, await page.evaluate(expected => {
        const content = document.querySelector('.search-results')
        return {
          emphasis: content.querySelector('.highlights em')?.textContent === expected + '标题',
          updatedContent: content.querySelector('p.highlights mark')?.textContent === expected + '正文',
          destination: content.querySelector('a.btn')?.getAttribute('href') === '/threads/1',
          clean: !content.querySelector('script, iframe, svg, [onload], a[href^="javascript:"]'),
          noExecution: !window.__richContentExecuted
        }
      }, label))
    }

    await page.goto(origin + '/auth/login')
    await page.getByRole('heading', { name: '用户登录' }).waitFor()
    await page.locator('body').ariaSnapshot()
    await page.getByRole('textbox').nth(0).fill('rich-content-test-only')
    await page.getByRole('textbox').nth(1).fill('synthetic-test-password')
    await page.getByRole('button', { name: '登录', exact: true }).click()
    await page.waitForURL(origin + '/')
    await page.goto(origin + '/notifications')
    await page.getByText('通知验收 2', { exact: true }).waitFor()
    await page.locator('body').ariaSnapshot()
    record('notifications', await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.notification-body'))
      return {
        bothTypes: items.length === 2,
        links: items.every(item => item.querySelector('strong')?.closest('a')?.getAttribute('href') === '/threads/1'),
        clean: items.every(item => !item.querySelector('script, iframe, svg, [onload], a[href^="javascript:"]')),
        noExecution: !window.__richContentExecuted
      }
    }))
    await page.getByText('通知验收 1', { exact: true }).click()
    await page.waitForURL(origin + '/threads/1')
    checks.push({ name: 'notification navigation', assertions: 1 })
    return { checks, assertions: checks.reduce((total, item) => total + item.assertions, 0), realApiWrites: 0 }
  } finally {
    await page.unroute('**/api/**', routeHandler)
  }
}
