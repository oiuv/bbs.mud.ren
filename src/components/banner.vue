<template>
  <div v-if="banner" :id="id" class="carousel slide carousel-fade">
    <ol v-if="banner.banners.length > 1" class="carousel-indicators">
      <li
        v-for="(item, index) in banner.banners"
        :key="index"
        :data-target="idSelector"
        :data-slide-to="index"
        :class="{active: index === currentIndex}"
        @click="goToSlide(index)"
      ></li>
    </ol>
    <div class="carousel-inner">
      <div
        v-for="(item, index) of banner.banners" :key="item.id"
        class="carousel-item"
        :class="{active: index === currentIndex}"
      >
        <a :href="item.url || 'javascript:;'" target="_blank">
          <img class="d-block w-100" :src="item.image_url" alt="First slide" />
          <div v-if="item.title || item.description" class="carousel-caption">
            <h1 v-if="item.title">{{ item.title }}</h1>
            <p v-if="item.description">{{ item.description }}</p>
          </div>
        </a>
      </div>
    </div>
    <a
      v-if="banner.banners.length > 1"
      class="carousel-control-prev"
      :href="idSelector"
      role="button"
      data-slide="prev"
      @click.prevent="prevSlide()"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true">
        <arrow-left></arrow-left>
      </span>
      <span class="sr-only">Previous</span>
    </a>
    <a
      v-if="banner.banners.length > 1"
      class="carousel-control-next"
      :href="idSelector"
      role="button"
      data-slide="next"
      @click.prevent="nextSlide()"
    >
      <span class="carousel-control-next-icon" aria-hidden="true">
        <arrow-right></arrow-right>
      </span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</template>

<script>
import ArrowLeft from "$icons/ArrowLeft"
import ArrowRight from "$icons/ArrowRight"

export default {
  name: "Banner",
  components: { ArrowLeft, ArrowRight },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      banner: null,
      currentIndex: 0,
      intervalId: null,
    }
  },
  computed: {
    id() {
      return "banner-" + this.name
    },
    idSelector() {
      return "#" + this.id
    },
  },
  mounted() {
    this.loadBanner()
  },
  beforeDestroy() {
    this.stopAutoPlay()
  },
  methods: {
    loadBanner() {
      this.$http
        .get("banners/" + this.name)
        .then((banner) => {
          this.banner = banner
          if (this.banner && this.banner.banners.length > 1) {
            this.startAutoPlay()
          }
        })
        .catch(() => {})
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.banner.banners.length
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.banner.banners.length) % this.banner.banners.length
    },
    goToSlide(index) {
      this.currentIndex = index
    },
    startAutoPlay() {
      this.stopAutoPlay()
      this.intervalId = setInterval(() => {
        this.nextSlide()
      }, 5000) // 5秒切换一次
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
  },
}
</script>

<style lang="scss">
.carousel-item {
  display: flex !important;
  align-items: center;
  justify-content: stretch;
  max-height: 300px;
  border-radius: 2px;
  overflow: hidden;
}
</style>
