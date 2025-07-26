<template>
  <div class="ai-container">
    <iframe
      src="//dify.shifa.vip/chatbot/BJjM5PwNBygng9Y3"
      class="ai-iframe"
      frameborder="0"
      allow="microphone">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'ai-show',
  mounted() {
    // 确保页面滚动到顶部
    window.scrollTo(0, 0);
  }
}
</script>

<style scoped lang="scss">
.ai-container {
  width: 100%;
  height: calc(100vh - 60px); // 减去导航栏高度（约60px）
  min-height: 500px;
  background: #ffffff;
}

.ai-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

// 响应式处理不同屏幕尺寸
@media (max-width: 768px) {
  .ai-container {
    height: calc(100vh - 56px); // 移动端导航栏略小
  }
}

// 处理iOS Safari等浏览器的底部工具栏
@supports (height: 100dvh) {
  .ai-container {
    height: calc(100dvh - 60px);
  }
  
  @media (max-width: 768px) {
    .ai-container {
      height: calc(100dvh - 56px);
    }
  }
}
</style>