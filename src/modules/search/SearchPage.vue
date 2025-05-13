<template>
  <div class="search-page">
    <div class="search-form d-flex align-items-center">
      <input class="form-control flex-grow-1" type="search" v-model="q" placeholder="请输入要搜索的内容" aria-label="Search">
      <button class="btn btn-primary ml-2" @click="search">搜索</button>
    </div>
    <div v-if="loading" class="loading-message">
      正在搜索，请稍候...
    </div>
    <div class="search-results" v-else-if="threads.length > 0">
      <div class="result-item" v-for="item of threads" :key="item.id">
        <div class="d-flex align-items-center">
          <a href="#" class="mr-2"><img :src="item.user.avatar" alt="" class="avatar-30"></a>
          <div class="highlights text-gray-50 text-truncate" v-html="item['highlights'] && item['highlights']['title'] ? item.highlights.title[0] : item.title"></div>
        </div>
        <p class="highlights mt-1 text-gray-60" v-if="item.highlights['content']" v-html="highlightContent(item)"></p>
        <router-link :to="{name: 'threads.show', params:{id: item.id}}" class="btn btn-sm btn-outline-primary">查看详情</router-link>
      </div>
    </div>
    <div class="no-results" v-else-if="q.length > 0 &&!loading &&!error">
      未找到相关结果。
    </div>
    <div class="error-message" v-else-if="error">
      搜索出错，请稍后再试。
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
  data () {
    return {
      q: '',
      threads: [],
      loading: false,
      error: false
    }
  },
  methods: {
    highlightContent (item) {
      return (item.highlights['content'] || []).join('...')
    },
    search () {
      if (this.q.length > 0) {
        this.loading = true
        this.error = false
        this.$http.get(`/threads/search?q=` + this.q).then(response => {
          this.threads = response.data
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
    }
  }
}
</script>

<style scoped lang="scss">
.search-page {
  padding: 20px;
  .search-form {
    margin-bottom: 20px;
    input {
      width: auto;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    button {
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      &:hover {
        background-color: darken(#007bff, 10%);
      }
    }
  }
  .loading-message {
    color: #6c757d;
    font-style: italic;
  }
  .result-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    transition: box-shadow 0.3s ease;
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
  .no-results {
    color: #999;
  }
  .error-message {
    color: red;
  }
}
</style>