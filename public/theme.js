// Loaded before the application so saved preferences also apply to the first paint.
(function () {
  var key = 'mudren-theme'
  var current = 'dark'
  var root = document.documentElement

  function apply (theme) {
    current = theme === 'light' ? 'light' : 'dark'
    root.setAttribute('data-theme', current)
    root.style.colorScheme = current
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', current === 'dark' ? '#0b0d10' : '#f2f5f9')
    window.dispatchEvent(new CustomEvent('mudren:theme-change', { detail: current }))
  }

  try {
    current = window.localStorage.getItem(key) === 'light' ? 'light' : 'dark'
  } catch (error) {
    // Private or restricted browsing can deny storage access.
  }
  apply(current)

  window.MudrenTheme = {
    get: function () { return current },
    set: function (theme) {
      if (theme !== 'dark' && theme !== 'light') return
      apply(theme)
      try {
        window.localStorage.setItem(key, current)
      } catch (error) {
        // Switching still works for this page when persistence is unavailable.
      }
    }
  }

  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return
    try {
      if (event.storageArea !== window.localStorage) return
    } catch (error) {
      return
    }
    apply(event.newValue)
  })
}())
