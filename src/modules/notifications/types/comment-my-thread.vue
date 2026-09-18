<template>
  <notification :notification="notification">
    <template slot="title">
      评论了你的文章
      <router-link :to="{name: 'threads.show', params: {id: notification.data.thread_id}, hash: '#comment-' + notification.data.comment_id}">
        《{{ notification.data.thread_title }}》
      </router-link>
    </template>
    <div class="pt-2 pl-md-4">
      <router-link :to="{name: 'threads.show', params: {id: notification.data.thread_id}}" class="text-muted">
        <safe-html tag="span" :html="notification.data.content"></safe-html>
      </router-link>
    </div>
  </notification>
</template>

<script>
import Notification from './notification'
import SafeHtml from '$components/safe-html'

export default {
  components: { Notification, SafeHtml },
  props: {
    notification: {
      type: Object,
      default: null
    }
  }
}
</script>
