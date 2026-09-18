<template>
  <div class="box text-gray-50">
    <div class="box-heading">
      <div class="text-13">
        热门话题
      </div>
    </div>
    <ul class="plan-list text-13">
      <template v-for="node in nodes">
        <router-link :key="node.id" tag="li" :to="{name: 'nodes.node', params:{id: node.id}}" class="py-1 cursor-pointer">
          #{{ node.title }} <span class="float-right">{{ node.cache ? node.cache.threads_count : 0 }}</span>
        </router-link>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HotTags',
  data () {
    return {
      nodes: []
    }
  },
  created () {
    this.loadNodes()
  },
  methods: {
    loadNodes () {
      this.$http
        .get('nodes?hot=20&per_page=20')
        .then(nodes => (this.nodes = nodes.data))
    }
  }
}
</script>

<style scoped>
</style>
