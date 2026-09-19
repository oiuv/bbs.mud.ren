<template>
  <button
    type="button"
    class="theme-toggle"
    :title="actionLabel"
    :aria-label="actionLabel"
    :aria-pressed="theme === 'dark'"
    @click="toggleTheme"
  >
    <weather-sunny v-if="theme === 'dark'" aria-hidden="true" />
    <weather-night v-else aria-hidden="true" />
    <span>{{ theme === 'dark' ? '浅色' : '深色' }}</span>
  </button>
</template>

<script>
import WeatherSunny from '$icons/WeatherSunny'
import WeatherNight from '$icons/WeatherNight'

export default {
  name: 'ThemeToggle',
  components: { WeatherSunny, WeatherNight },
  data () {
    return { theme: window.MudrenTheme.get() }
  },
  computed: {
    actionLabel () {
      return this.theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'
    }
  },
  mounted () {
    window.addEventListener('mudren:theme-change', this.updateTheme)
  },
  beforeDestroy () {
    window.removeEventListener('mudren:theme-change', this.updateTheme)
  },
  methods: {
    updateTheme (event) {
      this.theme = event.detail
    },
    toggleTheme () {
      window.MudrenTheme.set(this.theme === 'dark' ? 'light' : 'dark')
    }
  }
}
</script>
