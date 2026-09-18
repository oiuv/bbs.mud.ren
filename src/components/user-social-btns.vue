<template>
  <div class="user-social-btns d-flex justify-content-start flex-wrap">
    <a
      v-if="user.extends.github"
      class="btn btn-dark btn-icon"
      :href="'https://github.com/'+user.extends.github"
      target="_blank"
      :class="btnClass"
    >
      <github-icon></github-icon>
    </a>
    <a
      v-if="user.extends.twitter"
      class="btn btn-twitter btn-icon"
      :href="'https://twitter.com/' + user.extends.twitter"
      target="_blank"
      :class="btnClass"
    >
      <twitter-icon></twitter-icon>
    </a>
    <a
      v-if="user.extends.facebook"
      class="btn btn-facebook btn-icon"
      :href="'https://www.facebook.com/' + user.extends.facebook"
      target="_blank"
      :class="btnClass"
    >
      <facebook-icon></facebook-icon>
    </a>
    <a
      v-if="user.extends.instagram"
      class="btn btn-orange btn-icon text-white"
      :href="'https://www.instagram.com/' + user.extends.instagram"
      target="_blank"
      :class="btnClass"
    >
      <instagram-icon></instagram-icon>
    </a>
    <a
      v-if="user.extends.telegram"
      class="btn btn-teal-blue btn-icon text-white"
      :href="'https://t.me/' + user.extends.telegram"
      target="_blank"
      :class="btnClass"
    >
      <telegram-icon></telegram-icon>
    </a>
    <a
      v-if="user.extends.steam"
      class="btn btn-payne-grey btn-icon text-white"
      :href="'https://steamcommunity.com/id/'+user.extends.steam"
      target="_blank"
      :class="btnClass"
    >
      <steam-icon></steam-icon>
    </a>
  </div>
</template>

<script>
import TwitterIcon from '$icons/Twitter'
import GithubIcon from '$icons/GithubCircle'
import FacebookIcon from '$icons/Facebook'
import InstagramIcon from '$icons/Instagram'
import TelegramIcon from '$icons/Telegram'
import SteamIcon from '$icons/Steam'

export default {
  name: 'UserSocialBtns',
  components: {
    TwitterIcon,
    GithubIcon,
    FacebookIcon,
    InstagramIcon,
    TelegramIcon,
    SteamIcon
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      default: 16
    },
    spacing: {
      type: Number,
      default: 8
    }
  },
  computed: {
    btnClass () {
      return `text-${this.size} spacing-${this.spacing}`
    }
  }
}
</script>

<style scoped lang="scss">
.user-social-btns {
  @each $size in 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20
  {
    .spacing-#{$size} {
      margin-left: #{$size}px;
      margin-right: #{$size}px;
      margin-bottom: #{$size}px;
    }
  }
}
</style>
