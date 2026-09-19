<template>
  <safe-html tag="section" class="markdown-body" :html="renderedBody"></safe-html>
</template>

<script>
import Prism from 'prismjs'
import SafeHtml from './safe-html'
import { addHeadingAnchors, findHashTarget } from '$utils/markdown-anchors'

export default {
  name: 'MarkdownBody',
  components: { SafeHtml },
  props: {
    value: {
      type: String,
      default: ''
    },
    anchors: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    renderedBody () {
      const body = this.replaceUserMention(this.value)
      return this.anchors ? addHeadingAnchors(body) : body
    }
  },
  watch: {
    renderedBody () {
      this.$nextTick(this.refreshContent)
    },
    '$route.hash' () {
      this.$nextTick(this.scrollToAnchor)
    }
  },
  mounted () {
    if (this.anchors) window.addEventListener('hashchange', this.scrollToAnchor)
    this.refreshContent()
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.scrollToAnchor)
  },
  methods: {
    refreshContent () {
      Prism.highlightAllUnder(this.$el)
      this.scrollToAnchor()
    },
    scrollToAnchor () {
      if (!this.anchors) return

      const target = findHashTarget(this.$el, window.location.hash)
      if (target) target.scrollIntoView({ block: 'start' })
    },
    replaceUserMention (body) {
      return body.replace(new RegExp(/@([a-zA-Z][a-zA-Z_\-0-9]+)/, 'g'), '<a href="/$1" class="username">@$1</a>')
    }
  }
}
</script>

<style scoped>
</style>
