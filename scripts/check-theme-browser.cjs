// Run with Playwright CLI in an isolated session on the local dev server.
// Screenshots are saved to the CLI working directory.
async (page) => {
  const origin = 'http://127.0.0.1:8081'
  if (!page.url().startsWith(origin + '/')) throw new Error('Use an isolated local browser session')
  const checks = []
  const assert = (condition, message) => { if (!condition) throw new Error(message); checks.push(message) }
  const current = () => page.evaluate(() => document.documentElement.dataset.theme)
  const screenshot = name => page.screenshot({ path: `theme-${name}.png`, animations: 'disabled' })
  const loaded = selector => page.locator(selector).first().waitFor({ state: 'visible' })
  const switchTo = async theme => {
    if (await current() !== theme) {
      await page.locator('body').ariaSnapshot()
      await page.getByRole('button', { name: theme === 'light' ? '切换到浅色主题' : '切换到深色主题' }).click()
    }
    assert(await current() === theme, `switch to ${theme}`)
  }
  const surfaces = async selector => page.locator(selector).evaluateAll(elements => elements.filter(el => el.getBoundingClientRect().width).map(el => ({
    background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color
  })))
  const assertSurface = async selector => {
    const theme = await current()
    const colors = await surfaces(selector)
    assert(colors.length > 0 && colors.every(c => c.background === (theme === 'dark' ? 'rgb(20, 21, 24)' : 'rgb(255, 255, 255)')), `${selector} matches ${theme}`)
  }
  const avatar = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
  const user = { id: 999999, username: 'themecheck', name: '主题验收账号', email: 'theme@example.test', avatar,
    bio: '', extends: {}, settings: {}, cache: {}, has_activated: true, is_admin: false, has_banned: false }
  const body = '<h2>文字世界</h2><p>论坛正文 <a href="https://mud.ren/">MUDREN</a></p><blockquote>一段引用</blockquote><table><tr><th>名称</th><th>用途</th></tr><tr><td>LPC</td><td>构筑世界</td></tr></table><pre><code class="language-javascript">const world = "MUDREN"</code></pre><p><img src="' + avatar + '" alt="原色图片"></p>'
  let loginFails = true
  let writes = 0
  const handler = async route => {
    const req = route.request()
    const pathname = req.url().split('/api')[1].split('?')[0]
    const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) })
    if (pathname === '/oauth/token') {
      writes++
      return loginFails ? json({ errors: { login: ['主题验收：模拟登录失败'] } }, 422) : json({ access_token: 'theme-test-only', token_type: 'Bearer' })
    }
    if (pathname === '/me') return json(user)
    if (req.method() !== 'GET') {
      writes++
      return json({ errors: { test: ['主题验收禁止真实写入'] } }, 422)
    }
    if (pathname === '/threads/999999') return json({ id: 999999, title: '主题内容验收', user_id: 1,
      user: { ...user, id: 1, username: 'mudren', has_followed: false }, content: { body, markdown: body },
      cache: { likes_count: 1, comments_count: 0 }, likers: [], has_liked: false, has_subscribed: false, created_at_timeago: '刚刚' })
    if (pathname === '/comments') return json({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } })
    if (pathname === '/user/notifications') return json({ data: [{ id: 1, type: 'mentioned_me', read_at: null,
      created_at: '2026-09-20', data: { ...user, thread_id: 999999, thread_title: '主题内容验收',
        content: '<strong>主题通知验收</strong>' } }] })
    const headers = { ...req.headers() }
    delete headers.authorization
    return route.continue({ headers })
  }
  await page.route('**/api/**', handler)
  try {
    await page.evaluate(() => localStorage.removeItem('mudren-theme'))
    await page.reload()
    await loaded('.theme-toggle:visible')
    assert(await current() === 'dark', 'default dark theme')
    await loaded('.threads-items li')
    await assertSurface('.box')
    await screenshot('home-dark-desktop')
    await page.setViewportSize({ width: 320, height: 740 })
    assert(await page.getByRole('button', { name: '切换到浅色主题' }).isVisible(), 'narrow mobile guest can switch without opening menu')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '320px guest homepage has no horizontal overflow')
    await page.setViewportSize({ width: 1280, height: 720 })
    await switchTo('light')
    await assertSurface('.box')
    await screenshot('home-light-desktop')
    await page.reload()
    await loaded('.theme-toggle:visible')
    assert(await current() === 'light', 'light persists after reload')

    const secondTab = await page.context().newPage()
    await secondTab.goto(origin + '/auth/login')
    await secondTab.locator('.theme-toggle:visible').waitFor()
    await secondTab.locator('body').ariaSnapshot()
    await secondTab.getByRole('button', { name: '切换到深色主题' }).click()
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    assert(await page.getByRole('button', { name: '切换到浅色主题' }).isVisible(), 'cross-tab preference and button synchronize')
    await secondTab.close()

    for (const [path, selector, name] of [
      ['/nodes', '.child-card', 'nodes'], ['/threads/1', '.markdown-body', 'thread'],
      ['/threads/999999', '.markdown-body table', 'rich-post'],
      ['/mudren', '.page-user-show', 'profile'], ['/search', 'input[type=search]', 'search'],
      ['/auth/register', 'form', 'register'], ['/auth/login', 'form', 'login']
    ]) {
      await page.goto(origin + path)
      await loaded(selector)
      await switchTo('dark')
      if (await page.locator('.box').count()) await assertSurface('.box')
      await screenshot(`${name}-dark`)
      await switchTo('light')
      if (await page.locator('.box').count()) await assertSurface('.box')
      await screenshot(`${name}-light`)
      if (name === 'rich-post') {
        assert(await page.locator('.markdown-body img').evaluate(el => getComputedStyle(el).filter === 'none'), 'content images are not inverted')
        assert(await page.locator('.markdown-body pre .token').count() > 0, 'code highlighting survives both themes')
      }
    }

    await page.locator('body').ariaSnapshot()
    await page.getByRole('textbox').nth(0).fill('theme-test-only')
    await page.getByRole('textbox').nth(1).fill('synthetic-test-password')
    await page.getByRole('button', { name: '切换到深色主题' }).press('Enter')
    assert(await current() === 'dark', 'keyboard switching works')
    assert(await page.getByRole('textbox').nth(0).inputValue() === 'theme-test-only', 'switch preserves login input')
    await page.getByRole('button', { name: '登录', exact: true }).click()
    await page.getByText('主题验收：模拟登录失败', { exact: true }).waitFor()
    await screenshot('login-error-dark')
    assert((await surfaces('.el-message'))[0].background === 'rgb(59, 32, 38)', 'error feedback uses semantic dark surface')
    loginFails = false
    await page.getByRole('button', { name: '登录', exact: true }).click()
    await page.waitForURL(origin + '/')
    await page.goto(origin + '/threads/create')
    await loaded('.CodeMirror')
    await page.locator('body').ariaSnapshot()
    await page.getByPlaceholder('请在这里输入标题（请精准表达主题）').fill('主题切换保留草稿')
    await page.locator('.CodeMirror').click()
    await page.keyboard.type('A draft remains here when the appearance changes.')
    await assertSurface('.CodeMirror')
    await screenshot('editor-dark')
    await switchTo('light')
    assert((await page.locator('.CodeMirror').innerText()).includes('A draft remains'), 'switch preserves editor draft')
    assert(await page.getByPlaceholder('请在这里输入标题（请精准表达主题）').inputValue() === '主题切换保留草稿', 'switch preserves title')
    await assertSurface('.CodeMirror')
    await screenshot('editor-light')
    await switchTo('dark')
    await page.locator('.el-select').click()
    await loaded('.el-select-dropdown')
    await assertSurface('.el-select-dropdown')
    await screenshot('editor-dropdown-dark')
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: '清除草稿', exact: true }).click()
    await loaded('.el-message-box')
    await assertSurface('.el-message-box')
    await screenshot('dialog-dark')
    await page.getByRole('button', { name: '取消', exact: true }).click()
    await page.goto(origin + '/user/profile')
    await loaded('input.form-control')
    await screenshot('account-dark')
    await switchTo('light')
    await screenshot('account-light')
    await page.goto(origin + '/notifications')
    await page.getByText('主题通知验收', { exact: true }).waitFor()
    await screenshot('notifications-light')
    await switchTo('dark')
    await assertSurface('.list-group-item')
    await page.waitForFunction(() => getComputedStyle(document.querySelector('a[title="通知"]')).backgroundColor === 'rgb(36, 35, 38)')
    assert(await page.locator('a[title="通知"]').evaluate(el => getComputedStyle(el).backgroundColor) === 'rgb(36, 35, 38)', 'active notification button uses dark surface')
    await screenshot('notifications-dark')

    await page.goto(origin + '/')
    await loaded('.threads-items li')
    await page.setViewportSize({ width: 390, height: 844 })
    await switchTo('dark')
    await screenshot('home-dark-mobile')
    assert(await page.getByRole('button', { name: '切换到浅色主题' }).isVisible(), 'mobile toggle is outside collapsed menu')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile homepage has no horizontal overflow')
    await switchTo('light')
    await screenshot('home-light-mobile')
    await page.getByRole('button', { name: '展开导航' }).click()
    await page.getByRole('link', { name: '论坛', exact: true }).click()
    await loaded('.child-card')
    await screenshot('nodes-light-mobile')
    assert(await current() === 'light', 'theme persists through mobile navigation')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile categories have no horizontal overflow')

    // Verify the saved theme before Vue can run, with application JS blocked.
    const bootstrap = await page.context().newPage()
    await bootstrap.route('**/*.js', route => route.request().url().endsWith('/theme.js') ? route.continue() : route.abort())
    await bootstrap.goto(origin + '/auth/login', { waitUntil: 'domcontentloaded' })
    assert(await bootstrap.evaluate(() => document.documentElement.dataset.theme) === 'light', 'saved light applies without application JavaScript')
    await bootstrap.close()

    const blockedContext = await page.context().browser().newContext()
    await blockedContext.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get () { throw new Error('Storage blocked for theme test') } })
    })
    const blockedPage = await blockedContext.newPage()
    await blockedPage.goto(origin + '/auth/login')
    await blockedPage.locator('.theme-toggle:visible').waitFor()
    await blockedPage.locator('body').ariaSnapshot()
    await blockedPage.getByRole('button', { name: '切换到浅色主题' }).click()
    assert(await blockedPage.evaluate(() => document.documentElement.dataset.theme) === 'light', 'blocked browser storage still allows switching')
    await blockedContext.close()
    return { assertions: checks.length, checks, mockedWrites: writes, realApiWrites: 0 }
  } finally {
    await page.unroute('**/api/**', handler)
    await page.setViewportSize({ width: 1280, height: 900 })
  }
}
