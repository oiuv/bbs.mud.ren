<template>
  <relation-btn :relation="relation" action="like" :item="item" @after-toggle="afterToggle">
    <a slot="on" class="btn btn-sm btn-link text-gray-50" href="javascript:void(0)">
      <thumb-up-icon></thumb-up-icon> {{ item.cache.likes_count }}
    </a>
    <a slot="off" class="btn btn-sm btn-primary" href="javascript:void(0)">
      <thumb-up-icon></thumb-up-icon> {{ item.cache.likes_count }}
    </a>
  </relation-btn>
</template>

<script>
import RelationBtn from './relation-btn'
import ThumbUpIcon from '$icons/ThumbUp'

export default {
  name: 'LikeBtn',
  components: {
    RelationBtn,
    ThumbUpIcon
  },
  props: {
    relation: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    afterToggle (bool) {
      this.$emit('update:item', {
        ...this.item,
        has_liked: bool,
        cache: {
          ...this.item.cache,
          likes_count: this.item.cache.likes_count + (bool ? 1 : -1)
        }
      })
    }
  }
}
</script>
