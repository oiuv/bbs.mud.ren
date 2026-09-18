<template>
  <div class="box box-flush text-gray-50">
    <div class="box-body">
      <div class="d-flex align-items-center justify-content-between">
        <div class="text-13">
          最新用户
        </div>
        <!--<button class="btn btn-ghost btn-icon"><arrow-right></arrow-right></button>-->
      </div>
    </div>
    <ul class="plan-list px-2 pb-1">
      <user-media v-for="item in users" :key="item.id" type="vertical w25" :user="item"></user-media>
    </ul>
  </div>
</template>

<script>
import UserMedia from '$components/user-media'

export default {
  name: 'NewUsers',
  components: { UserMedia },
  data () {
    return {
      users: []
    }
  },
  mounted () {
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      this.$http
        .get('users?latest=1&limit=20')
        .then(users => (this.users = users.data))
    }
  }
}
</script>

<style scoped>
</style>
