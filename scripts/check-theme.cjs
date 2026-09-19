const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const { test } = require('node:test')
const vm = require('node:vm')

const source = readFileSync(join(__dirname, '../public/theme.js'), 'utf8')

function boot (saved, { readBlocked = false, writeBlocked = false } = {}) {
  const attributes = {}
  const events = []
  const listeners = {}
  const storage = {
    value: saved,
    getItem () { return this.value },
    setItem (key, value) {
      assert.equal(key, 'mudren-theme')
      if (writeBlocked) throw new Error('Storage blocked')
      this.value = value
    }
  }
  const root = { style: {}, setAttribute (key, value) { attributes[key] = value } }
  const meta = { setAttribute (key, value) { this[key] = value } }
  const window = {
    get localStorage () {
      if (readBlocked) throw new Error('Storage blocked')
      return storage
    },
    addEventListener (name, listener) { listeners[name] = listener },
    dispatchEvent (event) { events.push(event.detail) }
  }
  vm.runInNewContext(source, {
    window,
    document: { documentElement: root, querySelector: () => meta },
    CustomEvent: function (type, init) { this.type = type; this.detail = init.detail }
  })
  return { theme: window.MudrenTheme, attributes, root, meta, storage, events, listeners }
}

test('First visit and invalid saved values start dark, including browser chrome', () => {
  for (const saved of [null, undefined, '', 'system', 'LIGHT', 'unexpected']) {
    const state = boot(saved)
    assert.equal(state.theme.get(), 'dark')
    assert.equal(state.attributes['data-theme'], 'dark')
    assert.equal(state.root.style.colorScheme, 'dark')
    assert.equal(state.meta.content, '#0b0d10')
  }
})

test('A saved light choice is applied before the application starts', () => {
  const state = boot('light')
  assert.equal(state.attributes['data-theme'], 'light')
  assert.equal(state.meta.content, '#f2f5f9')
  assert.equal(state.root.style.colorScheme, 'light')
})

test('Switching persists a valid choice and notifies subscribers; invalid input is ignored', () => {
  const state = boot(null)
  state.theme.set('light')
  assert.equal(state.storage.value, 'light')
  assert.equal(state.attributes['data-theme'], 'light')
  assert.equal(state.events.at(-1), 'light')
  state.theme.set('invalid')
  assert.equal(state.theme.get(), 'light')
  state.theme.set('dark')
  assert.equal(state.storage.value, 'dark')
})

test('Denied storage reads and writes never prevent theme switching', () => {
  for (const options of [{ readBlocked: true }, { writeBlocked: true }]) {
    const state = boot(null, options)
    state.theme.set('light')
    assert.equal(state.theme.get(), 'light')
    assert.equal(state.attributes['data-theme'], 'light')
  }
})

test('Other tabs synchronize preferences and clearing; unrelated storage events do not', () => {
  const state = boot(null)
  const change = value => state.listeners.storage({ key: 'mudren-theme', newValue: value, storageArea: state.storage })
  change('light')
  assert.equal(state.theme.get(), 'light')
  state.listeners.storage({ key: 'other-key', newValue: 'dark', storageArea: state.storage })
  state.listeners.storage({ key: 'mudren-theme', newValue: 'dark', storageArea: {} })
  assert.equal(state.theme.get(), 'light')
  change(null)
  assert.equal(state.theme.get(), 'dark')
  change('light')
  state.listeners.storage({ key: null, newValue: null, storageArea: state.storage })
  assert.equal(state.theme.get(), 'dark')
})
