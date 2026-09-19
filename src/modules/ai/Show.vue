<template>
  <div class="ai-container">
    <div v-if="!isLogged" class="ai-status">
      <p>登录后即可使用 AI 助手</p>
      <router-link :to="{ name: 'auth.login' }" class="btn btn-primary">
        前往登录
      </router-link>
    </div>
    <div v-else-if="loadError" class="ai-status" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" class="btn btn-primary" @click="loadChat">
        重试
      </button>
    </div>
    <iframe
      v-else-if="chat && chat.userKey === chatUserKey"
      :key="chat.userKey"
      :src="chat.url"
      class="ai-iframe"
      title="MUDREN AI 助手"
      referrerpolicy="no-referrer"
      allow="microphone; clipboard-write; fullscreen"
    >
    </iframe>
    <div v-else class="ai-status" role="status">
      正在准备 AI 助手…
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createDifyChatbotUrl } from './dify'

export default {
  name: 'AiShow',
  data () {
    return {
      chat: null,
      loadError: '',
      requestId: 0
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'isLogged']),
    chatUserKey () {
      const user = this.currentUser
      if (!this.isLogged || !user || user.id === undefined || user.id === null || !String(user.id).trim()) {
        return ''
      }

      return JSON.stringify([user.id, user.name, user.username, user.avatar])
    }
  },
  watch: {
    chatUserKey: {
      immediate: true,
      handler: 'loadChat'
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.$nextTick(this.updateHeight)
    window.addEventListener('resize', this.updateHeight)
  },
  beforeDestroy () {
    this.requestId++
    window.removeEventListener('resize', this.updateHeight)
  },
  methods: {
    async loadChat () {
      const requestId = ++this.requestId
      const userKey = this.chatUserKey
      this.chat = null
      this.loadError = ''
      if (!userKey) return

      try {
        const url = await createDifyChatbotUrl({ ...this.currentUser })
        // Ignore an old account's result if logout, account switching or unmount occurs.
        if (requestId === this.requestId && userKey === this.chatUserKey) {
          this.chat = { userKey, url }
        }
      } catch (error) {
        if (requestId === this.requestId && userKey === this.chatUserKey) {
          this.loadError = typeof CompressionStream === 'undefined'
            ? error.message
            : 'AI 助手暂时无法加载，请稍后重试。'
        }
      }
    },
    updateHeight () {
      const top = Math.max(0, this.$el.getBoundingClientRect().top)
      this.$el.style.setProperty('--ai-offset', `${top}px`)
    }
  }
}
</script>

<style scoped lang="scss">
.ai-container {
  width: 100%;
  height: calc(100vh - var(--ai-offset, 65px));
  min-height: 320px;
  background: var(--surface);
  overflow: hidden;
}

.ai-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.ai-status {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
}

@supports (height: 100dvh) {
  .ai-container {
    height: calc(100dvh - var(--ai-offset, 65px));
  }
}

* {
  box-sizing: border-box;
}
</style>
