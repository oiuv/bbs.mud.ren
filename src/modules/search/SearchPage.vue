<template>
  <div class="search-page container">
    <!-- 搜索表单 -->
    <div class="search-form input-group mb-3">
      <input v-model="q" class="form-control" type="search" placeholder="请输入要搜索的内容" aria-label="Search">
      <button class="btn btn-primary" @click="search">
        搜索
      </button>
    </div>
    <!-- 加载提示 -->
    <div v-if="loading" class="alert alert-info">
      正在搜索，请稍候...
    </div>
    <!-- 搜索结果 -->
    <div v-else-if="threads.length > 0" class="search-results">
      <div v-for="item of threads" :key="item.id" class="card mb-3">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <a :href="'/' + item.user.username" class="mr-2">
              <img :src="item.user.avatar" alt="" class="rounded-circle" width="30">
            </a>
            <div class="flex-grow-1">
              <safe-html class="highlights text-truncate" :html="item['highlights'] && item['highlights']['title'] ? item.highlights.title[0] : item.title"></safe-html>
            </div>
          </div>
          <safe-html v-if="item.highlights['content']" tag="p" class="highlights mt-1 text-muted" :html="highlightContent(item)"></safe-html>
          <router-link tag="a" target="_blank" :to="{name: 'threads.show', params:{id: item.id}}" class="btn btn-sm btn-outline-primary">
            查看详情
          </router-link>
        </div>
      </div>
      <!-- 优化后的分页组件 -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <!-- 首页按钮 -->
          <li class="page-item" :class="{ disabled: meta.current_page === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(1)">首页</a>
          </li>

          <!-- 上一页按钮 -->
          <li class="page-item" :class="{ disabled: !links.prev }">
            <a class="page-link" href="#" @click.prevent="prevPage">上一页</a>
          </li>
          <li class="page-item disabled">
            <span class="page-link">第 {{ meta.current_page }} 页，共 {{ meta.last_page }} 页</span>
          </li>
          <li class="page-item" :class="{ disabled:!links.next }">
            <a class="page-link" href="#" @click.prevent="nextPage">下一页</a>
          </li>

          <!-- 尾页按钮 -->
          <li class="page-item" :class="{ disabled: meta.current_page === meta.last_page }">
            <a class="page-link" href="#" @click.prevent="goToPage(meta.last_page)">尾页</a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- 无搜索结果提示 -->
    <div v-else-if="q.length > 0 &&!loading &&!error" class="alert alert-warning">
      未找到相关结果，请换个关键词试试。
    </div>
    <!-- 搜索错误提示 -->
    <div v-else-if="error" class="alert alert-danger">
      搜索出错，请换个关键词搜索。
    </div>
  </div>
</template>

<script>
import SafeHtml from '$components/safe-html'

export default {
  name: 'SearchPage',
  components: { SafeHtml },
  data() {
    return {
      q: '',
      threads: [],
      loading: false,
      error: false,
      links: {},
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: '',
        per_page: 10,
        to: 10,
        total: 0
      }
    }
  },
  watch: {
    q() {
      if (this.q.length > 0) {
        this.meta.current_page = 1 // 搜索关键词改变时，重置页码
        this.search()
      } else {
        this.threads = []
      }
    }
  },
  methods: {
    highlightContent(item) {
      return (item.highlights['content'] || []).join('...')
    },
    search() {
      if (this.q.length > 0) {
        this.loading = true
        this.error = false
        // 发送请求时传递查询参数
        this.$http.get(`/threads/search?q=${this.q}&page=${this.meta.current_page}`).then(response => {
          this.threads = response.data
          this.links = response.links
          this.meta = response.meta
          this.loading = false
        }).catch(error => {
          console.error('搜索出错:', error)
          this.threads = []
          this.loading = false
          this.error = true
        })
      } else {
        this.threads = []
      }
    },
    prevPage() {
      if (this.links.prev) {
        this.meta.current_page--
        this.search()
      }
    },
    nextPage() {
      if (this.links.next) {
        this.meta.current_page++
        this.search()
      }
    },
    goToPage(page) {
      this.meta.current_page = page
      this.search()
    }
  }
}
</script>

<style scoped lang="scss">
/* 由于使用了 Bootstrap 样式，这里可以简化样式 */
.search-page {
  padding-top: 20px;
}
</style>
