<script>
import createDOMPurify from 'dompurify'

const purifier = createDOMPurify()

if (purifier.isSupported) {
  purifier.addHook('afterSanitizeAttributes', node => {
    if (node.nodeName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

export default {
  name: 'SafeHtml',
  props: {
    html: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    contentTag () {
      return ['div', 'span', 'section', 'p'].includes(this.tag) ? this.tag : 'div'
    },
    cleanHtml () {
      if (!purifier.isSupported) return null
      return purifier.sanitize(this.html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['style'],
        ADD_ATTR: ['target']
      })
    }
  },
  render (h) {
    // Unsupported environments must use Vue's text escaping, never raw HTML.
    if (this.cleanHtml === null) return h(this.contentTag, [this.html])
    return h(this.contentTag, { domProps: { innerHTML: this.cleanHtml } })
  }
}
</script>
