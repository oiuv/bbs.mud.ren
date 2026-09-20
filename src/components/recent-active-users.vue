<template>
  <section class="box recent-active-users text-gray-50" aria-labelledby="recent-active-users-title" :aria-busy="loading">
    <div class="box-heading">
      <h2 id="recent-active-users-title" class="text-13 mb-0">
        最近活跃
      </h2>
    </div>
    <p v-if="loading" class="recent-users-status" role="status">
      正在加载…
    </p>
    <div v-else-if="failed" class="recent-users-status" role="status">
      <span>暂时无法加载</span>
      <button type="button" class="recent-users-retry" @click="loadUsers">
        重试
      </button>
    </div>
    <p v-else-if="!users.length" class="recent-users-status">
      暂时还没有活跃记录
    </p>
    <ul v-else class="recent-users-grid">
      <li v-for="item in users" :key="item.id">
        <router-link class="recent-user" :to="{ name: 'users.show', params: { username: item.username } }" :title="item.name || item.username">
          <img :src="item.avatar" alt="" class="avatar-40" width="40" height="40" loading="lazy" />
          <span class="recent-user-name">{{ item.name || item.username }}</span>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'RecentActiveUsers',
  data () {
    return {
      users: [],
      loading: false,
      failed: false
    }
  },
  mounted () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      if (this.loading) return
      this.loading = true
      this.failed = false
      try {
        const response = await this.$http.get('users?order=recentActive&limit=20')
        // Older API releases ignore unknown sort orders; never show that as activity.
        if (!response.meta || response.meta.order !== 'recentActive' || !Array.isArray(response.data)) {
          throw new Error('Recent activity ordering is unavailable')
        }
        this.users = response.data
      } catch (error) {
        this.failed = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.recent-active-users h2 {
  font-weight: 400;
}

.recent-users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
  gap: 14px 8px;
  padding: 0;
  margin: 0;
  list-style: none;

  li { min-width: 0; }
}

.recent-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-block: 3px;
  color: var(--muted);
  border-radius: 4px;

  &:hover { color: var(--accent); }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
}

.recent-user-name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1.5;
}

.recent-users-status {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.recent-users-retry {
  padding: 4px 8px;
  margin-left: 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--accent);
  background: transparent;

  &:hover { border-color: var(--accent); }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
}
</style>
