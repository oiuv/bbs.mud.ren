<template>
  <div id="wrapper" class="h-100" :class="{toggled: isToggled}">
    <div id="page-content-wrapper" class="w-100 position-absolute">
      <navbar v-if="shouldShowNavbar" />
      <div v-if="currentUser.id && !currentUser.has_activated" class="alert alert-warning text-center m-0" role="alert">
        您的邮箱尚未验证，将影响你的正常使用。请先验证您的邮箱，如果未收到邮件，请点击<a href="javascript:void(0)" class="text-blue" @click="sendActiveMail">重新发送</a>！
      </div>
      <template v-if="$route.query['active-success'] && $route.query.type">
        <template v-if="$route.query.type == 'register'">
          <div v-if="checkParams" class="alert alert-success text-center m-0" role="alert">
            您的账号已激活！
          </div>
          <div v-else class="alert alert-danger text-center m-0" role="alert">
            邮箱验证失败，请<a href="javascript:void(0)" class="text-blue" @click="sendActiveMail">重新发送验证邮件</a>！
          </div>
        </template>
        <template v-if="$route.query.type == 'email'">
          <div v-if="checkParams" class="alert alert-success text-center m-0" role="alert">
            账号已修改邮箱！
          </div>
          <div v-else class="alert alert-danger text-center m-0" role="alert">
            验证失败！请<router-link class="text-blue" :to="{name: 'user.account', hash: '#edit-email'}">
              重新提交验证新邮箱
            </router-link>！
          </div>
        </template>
      </template>
      <div class="main-content" :class="{'container my-3': withContainer}">
        <router-view />
      </div>
      <footer-bar v-if="shouldShowFooter" />
    </div>
    <div v-if="isToggled" class="position-absolute w-100 h-100 bg-white opacity-70" @click="toggle"></div>
    <div ref="backToTopLayer" class="back-to-top">
      <a class="btn btn-icon btn-secondary text-20" href="javascript:" data-toggle="tooltip" data-placement="top" title="返回顶部" @click="scrollToTop">
        <arrow-up-icon /></a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Navbar from '$components/navbar'
import FooterBar from '$components/footer'
import ArrowUpIcon from '$icons/ArrowUp'

export default {
  name: 'App',
  components: {
    Navbar,
    FooterBar,
    ArrowUpIcon
  },
  computed: {
    ...mapGetters(['currentUser', 'isToggled']),
    checkParams () {
      return this.$route.query['active-success'] == 'yes'
    },
    shouldShowNavbar () {
      return (
        typeof this.$route.meta['navbar'] === 'undefined' ||
        !!this.$route.meta['navbar']
      )
    },
    withContainer () {
      if (typeof this.$route.meta['container'] !== 'undefined') {
        return !!this.$route.meta['container']
      }

      return true
    },
    shouldShowFooter () {
      return (
        typeof this.$route.meta['footer'] === 'undefined' ||
        !!this.$route.meta['footer']
      )
    }
  },
  mounted () {
    setTimeout(() => {
      window.addEventListener('scroll', () => {
        if (
          document.body.scrollTop > 400 ||
          document.documentElement.scrollTop > 400
        ) {
          this.$refs['backToTopLayer'].style.display = 'block'
        } else {
          this.$refs['backToTopLayer'].style.display = 'none'
        }
      })
    }, 1000)
  },
  methods: {
    ...mapActions(['toggle']),
    sendActiveMail () {
      this.$http.post('user/send-active-mail').then(data => {
        this.$message.success(data.message)
      })
    },
    scrollToTop () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss">
.back-to-top {
  display: none;
  position: fixed;
  bottom: 30px;
  right: 50px;
}
</style>
