<template>
  <div class="box box-flush">
    <!--<form class="box-body" v-if="users.data && users.data.length > 0">-->
    <!--<div class="input-group">-->
    <!--<input type="text" class="form-control border-0" placeholder="杜索用户">-->
    <!--</div>-->
    <!--</form>-->
    <div class="list-group list-group-flush">
      <user-list-item v-for="(user, index) of users.data" :key="user.id" class="list-group-item" :user.sync="users.data[index]"></user-list-item>
      <empty-state v-if="users.data && users.data.length == 0"></empty-state>
      <paginator :meta="users.meta" @change="followings"></paginator>
    </div>
    <div v-if="false" class="text-center">
      <button class="mt-2 btn btn-ghost">
        Load More
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EmptyState from '$components/empty-state'
import UserListItem from '$components/user-list-item'
import Paginator from '$components/paginator'

export default {
  name: 'UserFollowings',
  components: {
    UserListItem,
    EmptyState,
    Paginator
  },
  data () {
    return {
      users: []
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  created () {
    this.followings()
  },
  methods: {
    async followings (page = 1) {
      this.users = await this.$http.get(
        `user/${this.$parent.user.username}/followings`, { params: { page } }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.form-control:focus {
  border: none;
  box-shadow: none;
}
</style>
