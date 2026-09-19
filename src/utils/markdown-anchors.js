const headingSelector = 'h1, h2, h3, h4, h5, h6'

export function headingSlug (text) {
  return text.trim().toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-') || 'section'
}

export function addHeadingAnchors (html) {
  const template = document.createElement('template')
  template.innerHTML = html

  // Keep explicit anchors and avoid collisions with any IDs already in the body.
  const usedIds = new Set(Array.from(template.content.querySelectorAll('[id]'), element => element.id))
  template.content.querySelectorAll(headingSelector).forEach(heading => {
    if (heading.id) return

    const base = headingSlug(heading.textContent)
    let id = base
    let suffix = 0
    while (usedIds.has(id)) {
      id = `${base}-${++suffix}`
    }
    heading.id = id
    usedIds.add(id)
  })

  return template.innerHTML
}

export function findHashTarget (root, hash) {
  if (!hash || !hash.startsWith('#')) return null

  let id
  try {
    id = decodeURIComponent(hash.slice(1))
  } catch {
    return null
  }
  if (!id) return null

  // IDs may start with numbers or contain Chinese; do not treat them as CSS selectors.
  return Array.from(root.querySelectorAll('[id], a[name]'))
    .find(element => element.id === id || element.getAttribute('name') === id) || null
}
