<template>
  <div v-if="users.length > 0" class="box box-flush text-gray-50">
    <div v-if="title" class="box-body">
      <div class="d-flex align-items-center justify-content-between">
        <div class="text-13">
          {{ title }}
        </div>
        <!--<button class="btn btn-ghost btn-icon"><arrow-right></arrow-right></button>-->
      </div>
    </div>
    <ul class="plan-list px-2 pb-2" :class="{'pt-2':!title}">
      <user-media v-for="item in users" :key="item.id" type="vertical w25" :user="item"></user-media>
    </ul>
  </div>
</template>

<script>
import UserMedia from '$components/user-media'

export default {
  name: 'UserListCard',
  components: { UserMedia },
  props: {
    title: {
      type: String,
      default: null
    },
    users: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped>
</style>
