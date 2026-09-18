<template>
  <safe-html tag="section" class="markdown-body" :html="replaceUserMention(value)"></safe-html>
</template>

<script>
import Prism from 'prismjs'
import SafeHtml from './safe-html'

export default {
  name: 'MarkdownBody',
  components: { SafeHtml },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
  },
  mounted () {
    this.$nextTick(() => {
      Prism.highlightAll()
    })
  },
  updated () {
    Prism.highlightAll()
  },
  methods: {
    replaceUserMention (body) {
      return body.replace(new RegExp(/@([a-zA-Z][a-zA-Z_\-0-9]+)/, 'g'), '<a href="/$1" class="username">@$1</a>')
    }
  }
}
</script>

<style scoped>
</style>
