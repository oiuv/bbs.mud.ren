<template>
  <section class="markdown-body" v-html="replaceUserMention(value)"></section>
</template>

<script>
import Prism from 'prismjs'

export default {
  name: 'markdown-body',
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
