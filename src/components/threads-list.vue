<template>
  <div class="threads-items mb-2">
    <ul class="list-group list-group-flush">
      <!-- 循环展示每个帖子 -->
      <li
        class="list-group-item d-md-flex d-block align-items-center justify-content-between bg-white rounded shadow-sm mb-2"
        v-for="item in threads.data"
        :key="item.id"
      >
        <!-- 左侧用户信息和帖子标题部分 -->
        <div class="d-flex align-items-center">
          <!-- 用户头像 -->
          <a :href="'/' + item.user.username" class="mr-2">
            <img :src="item.user.avatar" alt class="avatar-30 rounded-circle">
          </a>
          <!-- 帖子节点、标记和标题 -->
          <div class="text-gray-70">
            <!-- 帖子所属节点 -->
            <a :href="'/nodes/' + item.node.id"><span class="badge badge-light border">{{ item.node.title }}</span></a>
            <!-- 精华标记 -->
            <span v-if="item.excellent_at" class="badge badge-pill badge-success ml-1">精</span>
            <!-- 置顶标记 -->
            <span v-if="item.pinned_at" class="badge badge-pill badge-danger ml-1">顶</span>
            <!-- 冻结标记 -->
            <span v-if="item.frozen_at" class="badge badge-pill badge-secondary ml-1">冻</span>
            <!-- 禁用标记 -->
            <span v-if="item.banned_at" class="badge badge-pill badge-dark ml-1">禁</span>
            
            <!-- 帖子标题 -->
            <a :href="'/threads/' + item.id" target="_blank" class="ml-1 text-decoration-none">
              {{ item.title }}
            </a>
            <div class="d-none d-md-block">
              <div class="text-muted text-12 mt-1">
                由 <a :href="'/' + item.user.username" class="text-blue">{{ item.user.name }}</a> 发布于 {{ item.created_at_timeago }}
                <span class="ml-2">最后回复：
                  <span v-if="item.cache.last_reply_user_name">
                    {{ item.cache.last_reply_user_name }}
                  </span>
                  <span v-else>
                    无
                  </span>
                </span>
                <span v-if="item.updated_at_timeago" class="ml-2" title="最近访问时间">最近访问：{{ item.updated_at_timeago }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧互动数据和更新时间部分 -->
        <div class="ml-auto d-flex align-items-center justify-content-md-end">
          <!-- 点赞、评论和浏览量 -->
          <div class="text-gray-60 d-flex justify-content-between align-items-center">
            <!-- 点赞数 -->
            <a class="p-1 mr-2">
              <like-icon class="text-danger"></like-icon>
              {{ item.cache.likes_count }}
            </a>
            <!-- 评论数 -->
            <a class="p-1 mr-2">
              <comment-icon class="text-info"></comment-icon>
              {{ item.cache.comments_count }}
            </a>
            <!-- 浏览量 -->
            <a class="p-1 mr-2">
              <view-icon class="text-warning"></view-icon>
              {{ item.cache.views_count }}
            </a>
            <!-- 订阅数 -->
            <a class="p-1">
              <subscribe-icon class="text-primary"></subscribe-icon>
              {{ item.cache.subscriptions_count }}
            </a>
          </div>
          <!-- 帖子更新时间 -->
          <!-- <div class="ml-3 text-gray-60">
            <small :title="item.created_at_timeago">{{ item.updated_at_timeago }}</small>
          </div> -->
        </div>
      </li>
      <!-- 当没有帖子时显示空状态 -->
      <li
        class="list-group-item d-flex align-items-center justify-content-center p-5"
        v-if="threads['data'] && threads.data.length == 0"
      >
        <empty-state message="该分类下无相关讨论哦~"></empty-state>
      </li>
    </ul>
    <!-- 分页组件 -->
    <paginator :meta="threads.meta" @change="handleChange"></paginator>
  </div>
</template>

<script>
import Paginator from '$components/paginator'
import LikeIcon from '$icons/Heart'
import CommentIcon from '$icons/Comment'
import ViewIcon from '$icons/Eye'
import EmptyState from '$components/empty-state'
import MedalIcon from '$icons/Medal'
import TopIcon from '$icons/FormatVerticalAlignTop'
import SubscribeIcon from '$icons/Rss'

export default {
  name: 'threads-list',
  components: {
    LikeIcon,
    CommentIcon,
    ViewIcon,
    MedalIcon,
    TopIcon,
    Paginator,
    EmptyState,
    SubscribeIcon
  },
  props: {
    threads: {
      type: Object,
      default () {
        return {
          data: [],
          meta: {
            total: 1,
            per_page: 1,
            from: 1,
            to: 1,
            last_page: 1,
            current_page: 1
          }
        }
      }
    }
  },
  methods: {
    handleChange (page) {
      this.$emit('page-changed', page)
    }
  }
}
</script>

<style scoped>
/* 鼠标悬停在列表项上的效果 */
.list-group-item {
  transition: all 0.3s ease;
}

.list-group-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 徽章样式 */
.badge {
  font-weight: normal;
}

/* 链接样式 */
a {
  color: #333;
}

a:hover {
  color: #007bff;
}
</style>