<template>
  <div class="page-node-show">
    <!-- 顶部标题区域 -->
    <div class="hero-section bg-gradient-primary text-white py-4 mb-4">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h1 class="display-5 fw-bold mb-2">论坛版块</h1>
            <p class="lead mb-3">探索各个讨论区，找到你感兴趣的话题</p>
            <div class="d-flex justify-content-center gap-2 flex-wrap">
              <span class="badge bg-light text-primary px-3 py-2 mb-1">
                <i class="fas fa-users me-1"></i>
                活跃社区
              </span>
              <span class="badge bg-light text-primary px-3 py-2 mb-1">
                <i class="fas fa-comments me-1"></i>
                精彩讨论
              </span>
              <span class="badge bg-light text-primary px-3 py-2 mb-1">
                <i class="fas fa-lightbulb me-1"></i>
                知识分享
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <!-- 父版块列表 -->
          <div v-for="node in nodes" :key="node.id" class="parent-section mb-4">
            <!-- 父版块标题区域 -->
            <div class="parent-header bg-white rounded-3 shadow-sm p-3 mb-3 border-start border-4 border-primary">
              <div class="d-flex align-items-center">
                <div v-if="node.icon" class="me-3">
                  <div class="icon-wrapper bg-primary bg-opacity-10 rounded-2 p-3">
                    <i :class="node.icon" class="text-primary fs-3"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h2 class="h5 mb-1 fw-bold text-dark">{{ node.title }}</h2>
                  <p class="text-muted mb-0 small">{{ node.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- 子版块列表 -->
            <div class="child-section">
              <div v-for="child in node.children" :key="child.id" class="mb-2">
                <router-link 
                  :to="{name: 'nodes.node', params: {id: child.id}}" 
                  class="text-decoration-none">
                  <div class="child-card card border-0 shadow-sm hover-card">
                    <div class="card-body p-3">
                      <div class="d-flex align-items-center">
                                                <!-- 图标区域 -->
                        <div class="me-4 flex-shrink-0">
                          <div v-if="child.icon" 
                               class="child-icon bg-gradient-primary text-white rounded-3 d-flex align-items-center justify-content-center" 
                               style="width: 72px; height: 72px; min-width: 72px;">
                            <i :class="child.icon" class="fs-3"></i>
                          </div>
                          <div v-else 
                               class="child-icon bg-gradient-secondary text-white rounded-3 d-flex align-items-center justify-content-center" 
                               style="width: 72px; height: 72px; min-width: 72px;">
                            <i class="fas fa-comments fs-3"></i>
                          </div>
                        </div>
                        
                        <!-- 内容区域 -->
                                                    <div class="flex-grow-1">
                              <div class="d-flex justify-content-between align-items-center">
                                <div class="flex-grow-1 me-4">
                                  <div class="d-flex align-items-center mb-1">
                                    <h5 class="h6 mb-0 fw-bold text-dark">
                                      {{ child.title }}
                                    </h5>
                                    <i v-if="child.has_subscribed" 
                                       class="fas fa-star text-warning ms-2" 
                                       style="font-size: 0.75rem;"
                                       title="已订阅"></i>
                                  </div>
                                  <p class="text-muted mb-2" style="font-size: 0.875rem; line-height: 1.5; margin-bottom: 0.5rem;">
                                    {{ child.description }}
                                  </p>
                                                                    <div class="d-flex align-items-center text-muted flex-wrap" style="font-size: 0.8rem; gap: 1.25rem;">
                                    <span class="d-flex align-items-center">
                                      <i class="far fa-file-alt" style="font-size: 0.75rem; width: 16px; text-align: center;"></i>
                                      <span class="ms-2">
                                        <span class="fw-medium">{{ (child.cache && child.cache.threads_count) || 0 }}</span>
                                        <span class="ms-1">主题</span>
                                      </span>
                                    </span>
                                    <span class="d-flex align-items-center">
                                      <i class="far fa-user" style="font-size: 0.75rem; width: 16px; text-align: center;"></i>
                                      <span class="ms-2">
                                        <span class="fw-medium">{{ (child.cache && child.cache.subscribers_count) || 0 }}</span>
                                        <span class="ms-1">订阅</span>
                                      </span>
                                    </span>
                                    <span v-if="child.last_thread" 
                                          class="text-truncate d-flex align-items-center"
                                          style="max-width: 250px;">
                                      <i class="far fa-clock" style="font-size: 0.75rem; width: 16px; text-align: center;"></i>
                                      <span class="text-truncate ms-2">{{ child.last_thread.title }}</span>
                                    </span>
                                  </div>
                                </div>
                                
                                <!-- 右侧箭头 -->
                                <div class="flex-shrink-0 d-flex align-items-center">
                                  <div class="text-primary d-flex align-items-center justify-content-center" 
                                       style="width: 28px; height: 28px; margin-top: 0;">
                                    <i class="fas fa-chevron-right" style="font-size: 0.85rem;"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nodes: []
    }
  },
  created () {
    this.getNodes()
  },
  methods: {
    getNodes () {
      this.$http.get('nodes?all=yes').then(({ data }) => {
        this.nodes = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
}

.parent-section {
  margin-bottom: 2rem !important;
}

.parent-header {
  transition: all 0.3s ease;
  border-left: 4px solid #667eea !important;
  margin-bottom: 1rem !important;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
  }
}

.icon-wrapper {
  transition: all 0.3s ease;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parent-header:hover .icon-wrapper {
  transform: scale(1.05);
}

.child-section {
  .mb-2 {
    margin-bottom: 0.75rem !important;
  }
  
  .child-card {
    transition: all 0.2s ease;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    background: #fff;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      border-color: rgba(102, 126, 234, 0.15) !important;
    }
    
    .card-body {
      padding: 1.25rem !important;
    }
  }
}

.hover-card {
  cursor: pointer;
  
  &:hover .child-icon {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }
  
  &:hover .fa-chevron-right {
    transform: translateX(3px);
    color: #667eea;
  }
}

.child-icon {
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.15);
  flex-shrink: 0;
}

.fa-chevron-right {
  transition: all 0.2s ease;
  color: #8b92a9;
  font-size: 0.9rem;
}

.text-muted {
  color: #6c757d !important;
  transition: color 0.2s ease;
}

.child-card:hover .text-muted {
  color: #5a6268 !important;
}

// 优化间距和对齐
.me-4 {
  margin-right: 1.25rem !important;
}

.me-3 {
  margin-right: 0.75rem !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

// 响应式优化
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .display-5 {
    font-size: 1.75rem;
  }
  
  .lead {
    font-size: 1rem;
    margin-bottom: 1rem !important;
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .parent-header {
    padding: 1rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  .parent-section {
    margin-bottom: 1.5rem !important;
  }
  
  .child-card .card-body {
    padding: 1rem !important;
  }
  
  .child-icon {
    width: 60px !important;
    height: 60px !important;
    min-width: 60px !important;
    margin-right: 1rem !important;
  }
  
  .me-4 {
    margin-right: 1rem !important;
  }
  
  .text-truncate {
    max-width: 150px !important;
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 1.5rem 0;
  }
  
  .display-5 {
    font-size: 1.5rem;
  }
  
  .lead {
    font-size: 0.9rem;
  }
  
  .badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem !important;
    margin-bottom: 0.25rem !important;
  }
  
  .child-card .card-body {
    padding: 0.875rem !important;
  }
  
  .child-icon {
    width: 52px !important;
    height: 52px !important;
    min-width: 52px !important;
    margin-right: 0.75rem !important;
  }
  
  .me-4 {
    margin-right: 0.75rem !important;
  }
  
  .text-truncate {
    max-width: 120px !important;
  }
  
  .d-flex.text-muted {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
