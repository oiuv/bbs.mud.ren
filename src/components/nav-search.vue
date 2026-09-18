<template>
  <form class="search-form form-inline my-2 my-lg-0">
    <input v-model="q" class="form-control mr-sm-2" type="search" placeholder="搜索" aria-label="Search">
    <div v-if="threads.length > 0" class="list-group">
      <div v-for="item of threads" :key="item.id" class="list-group-item list-group-item-action cursor-pointer" @click="$router.push({name: 'threads.show', params:{id: item.id}})">
        <div class="d-flex align-items-center">
          <a href="#" class="mr-2"><img :src="item.user.avatar" alt="" class="avatar-30"></a>
          <safe-html class="highlights text-gray-50 text-truncate" :html="item['highlights'] && item['highlights']['title'] ? item.highlights.title[0] : item.title"></safe-html>
        </div>
        <safe-html v-if="item.highlights['content']" tag="p" class="highlights mt-1 text-gray-60" :html="highlightContent(item)"></safe-html>
      </div>
    </div>
  </form>
</template>

<script>
import SafeHtml from './safe-html'

export default {
  name: 'NavSearch',
  components: { SafeHtml },
  data () {
    return {
      q: '',
      threads: []
    }
  },
  watch: {
    q () {
      if (this.q.length > 0) {
        this.search()
      } else {
        this.threads = []
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.addEventListener('click', this.onBodyClick)
    })
  },
  beforeDestroy () {
    document.removeEventListener('click', this.onBodyClick)
  },
  methods: {
    onBodyClick (e) {
      let searchForm = document.querySelector('.search-form')
      if (e.target !== searchForm) {
        this.threads = []
      }
    },
    highlightContent (item) {
      return (item.highlights['content'] || []).join('...')
    },
    search () {
      this.$http.get(`/threads/search?q=` + this.q).then(response => {
        this.threads = response.data
      })
      // this.threads = []
    }
  }
}
</script>

<style scoped lang="scss">
.search-form {
  position: relative;
  .list-group {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    z-index: 99;
  }
}
</style>
