const baseUrl = process.env.VUE_APP_DIFY_BASE_URL || 'https://dify.shifa.vip'
const chatbotToken = process.env.VUE_APP_DIFY_TOKEN || 'BJjM5PwNBygng9Y3'

const text = value => typeof value === 'string' ? value.trim() : ''

const avatarUrl = value => {
  if (!text(value)) return ''

  try {
    const url = new URL(value, window.location.href)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

// Match Dify's embed.js: UTF-8 -> gzip -> Base64 -> URLSearchParams.
const encodeVariable = async value => {
  const stream = new Blob([value]).stream().pipeThrough(new CompressionStream('gzip'))
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer())
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
}

export const createDifyChatbotUrl = async user => {
  if (!user || user.id === undefined || user.id === null || !String(user.id).trim()) {
    throw new Error('需要登录后才能使用 AI 助手。')
  }

  if (typeof CompressionStream === 'undefined') {
    throw new Error('当前浏览器暂不支持 AI 助手，请升级浏览器后重试。')
  }

  const name = text(user.name) || text(user.username) || `用户 ${user.id}`
  const variables = {
    'sys.user_id': `mudren:${user.id}:${name}`,
    'user.name': name
  }
  const avatar = avatarUrl(user.avatar)
  if (avatar) variables['user.avatar_url'] = avatar

  const entries = await Promise.all(Object.entries(variables).map(async ([key, value]) => [
    key,
    await encodeVariable(value)
  ]))
  const url = new URL(`${baseUrl.replace(/\/+$/, '')}/chatbot/${encodeURIComponent(chatbotToken)}`)
  url.search = new URLSearchParams(entries).toString()
  return url.href
}
