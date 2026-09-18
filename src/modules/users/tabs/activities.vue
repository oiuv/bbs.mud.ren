<template>
  <div class="user-activities">
    <div v-if="activities.data.length <= 0">
      <empty-state />
    </div>
    <ul v-else class="timeline pb-2">
      <li v-for="activity in visibleActivities" :key="activity.id" class="timeline-item">
        <div class="timeline-heading">
          <div class="d-flex">
            <router-link :to="{name:'users.show', params: {username: $parent.user.username}}">
              <img :src="$parent.user.avatar" class="avatar-40" :alt="$parent.user.name" />
            </router-link>
            <div class="ml-2">
              <div>
                <router-link :to="{name:'users.show', params: {username: $parent.user.username}}">
                  <h6 class="mb-0 text-16 d-inline-block">
                    {{ $parent.user.name }}
                  </h6>
                </router-link>
                <span class="text-gray-60 ml-1">
                  <template v-if="activity.log_name == 'commented.thread'">
                    评论了 <router-link :to="subjectLink(activity)">《{{ activity.subject.title }}》</router-link>
                  </template>
                  <template v-else-if="activity.log_name == 'published.thread'">
                    发布了 <router-link :to="subjectLink(activity)">《{{ activity.subject.title }}》</router-link>
                  </template>
                  <template v-else-if="activity.log_name == 'like.thread'">
                    赞了 <router-link :to="subjectLink(activity)">《{{ activity.subject.title }}》</router-link>
                  </template>
                  <template v-else-if="activity.log_name == 'follow.user'">
                    关注了 <router-link :to="subjectLink(activity)">{{ activity.subject.username }}</router-link>
                  </template>
                </span>
              </div>
              <div class="text-12 text-gray-70">
                <small class="text-muted">{{ activity.created_at_timeago }}</small>
              </div>
            </div>
          </div>
        </div>
        <div class="timeline-body">
          <user-card v-if="activity.log_name == 'follow.user'" :user.sync="activity.subject"></user-card>
          <div v-else class="box cursor-pointer">
            <router-link class="text-muted" :to="subjectLink(activity)">
              {{ activity.properties['content'] || '无' }}
            </router-link>
          </div>
        </div>
      </li>
      <li v-if="activities.meta.current_page < activities.meta.last_page" class="timeline-item">
        <div class="timeline-heading">
          <div class="d-flex">
            <button class="btn btn-secondary btn-icon text-20" @click="loadActivities($parent.user.username)">
              <arrow-down-icon />
            </button>
          </div>
        </div>
      </li>
      <li v-if="activities.meta.current_page == activities.meta.last_page" class="timeline-item">
        <div class="timeline-heading">
          <div class="d-flex">
            <button class="btn btn-secondary btn-icon text-20" disabled>
              <source-commit-end />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import UserCard from '$components/user-card'
import ArrowDownIcon from '$icons/ArrowDown'
import SourceCommitEnd from '$icons/SourceCommitEnd'
import EmptyState from '$components/empty-state'

export default {
  name: 'UserActivities',
  components: { UserCard, ArrowDownIcon, SourceCommitEnd, EmptyState },
  beforeRouteUpdate (to, from, next) {
    if (to.params.username != from.params.username) {
      this.activities = {
        data: [],
        meta: {
          current_page: 0,
          last_page: 0
        }
      }
      this.loadActivities(to.params.username)
    }

    next()
  },
  data () {
    return {
      activities: {
        data: [],
        meta: {
          current_page: 0,
          last_page: 0
        }
      }
    }
  },
  computed: {
    visibleActivities () {
      return this.activities.data.filter(activity => activity.subject)
    }
  },
  mounted () {
    this.loadActivities(this.$parent.user.username)
  },
  methods: {
    subjectLink (activity) {
      switch (activity.subject_type) {
      case 'App\\Thread':
        if (activity.log_name == 'commented.thread') {
          return {
            name: 'threads.show',
            params: { id: activity.subject.id },
            hash: '#comment-' + activity.properties.comment_id || 0
          }
        }
        return { name: 'threads.show', params: { id: activity.subject.id } }
      case 'App\\Comment':
        return { name: 'threads.show', params: { id: activity.subject.id } }
      case 'App\\User':
        return {
          name: 'users.show',
          params: { id: activity.subject.username }
        }
      }
      return {}
    },
    loadActivities (username) {
      let page = this.activities.meta.current_page + 1
      this.$http
        .get(`user/${username}/activities?per_page=10&page=${page}`)
        .then(activities => {
          this.activities.data = this.activities.data.concat(activities.data)
          this.activities.meta = activities.meta
        })
    }
  }
}
</script>
