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
    
    // 动态调整高度以消除滚动条
    this.$nextTick(() => {
      const navbar = document.querySelector('.navbar') || document.querySelector('nav');
      const navbarHeight = navbar ? navbar.offsetHeight : 64;
      const container = document.querySelector('.ai-container');
      if (container) {
        container.style.height = `calc(100vh - ${navbarHeight}px)`;
      }
    });
  }
}
</script>

<style scoped lang="scss">
.ai-container {
  width: 100%;
  height: calc(100vh - 65px); // 稍微增加一点余量
  min-height: 500px;
  background: #ffffff;
  overflow: hidden; // 防止滚动条
}

.ai-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  overflow: hidden;
}

// 使用更精确的单位
@supports (height: 100dvh) {
  .ai-container {
    height: calc(100dvh - 65px);
  }
}

// 处理可能的边框和内边距
* {
  box-sizing: border-box;
}
</style>