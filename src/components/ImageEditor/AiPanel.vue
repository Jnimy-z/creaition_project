<template>
    <div class="ai-panel-overlay" @click="handleOverlayClick"></div>
    <div class="ai-panel">
      <div class="panel-header">
        <h3>AI 图像生成/编辑</h3>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>
  
      <!-- 模型选择 -->
      <div class="form-group">
        <label>选择 AI 模型：</label>
        <select v-model="selectedModel" @change="switchModel">
          <option value="stable-diffusion">Stable Diffusion（文本生图）</option>
          <option value="qwen-image-edit">Qwen 图像编辑</option>
        </select>
      </div>
  
      <!-- 提示词输入 -->
      <div class="form-group">
        <label>提示词（描述你想要的图像）：</label>
        <textarea 
          v-model="prompt" 
          placeholder="例如：一片蓝色的海洋，高清，治愈系，日落"
          rows="4"
          @input="clearError"
        ></textarea>
        <!-- 提示词建议 -->
        <div class="prompt-suggestions">
          <span @click="selectPrompt('高清风景照，阳光明媚，绿色草地')">高清风景</span>
          <span @click="selectPrompt('可爱的猫咪，卡通风格，粉色背景')">卡通猫咪</span>
          <span @click="selectPrompt('科技感城市夜景，霓虹灯，未来风格')">科技夜景</span>
          <span @click="selectPrompt('油画风格，向日葵花田，梵高风格')">油画风格</span>
        </div>
      </div>
  
      <!-- 生成按钮 -->
      <button 
        class="generate-btn" 
        @click="handleGenerate"
        :disabled="!prompt || aiStore.isLoading"
      >
        <span v-if="aiStore.isLoading">生成中...</span>
        <span v-else>开始生成</span>
      </button>
  
      <!-- 错误提示 -->
      <div class="error-msg" v-if="aiStore.errorMsg">{{ aiStore.errorMsg }}</div>
  
      <!-- 生成历史 -->
      <div class="history-section" v-if="aiStore.history.length">
        <h4 class="section-title">生成历史</h4>
        <div class="history-list">
          <div 
            class="history-item" 
            v-for="(item, index) in aiStore.history" 
            :key="index"
          >
            <img 
              :src="item.image" 
              :alt="item.prompt" 
              class="history-img"
              @click="loadToEditor(item.image)"
            />
            <div class="history-info">
              <p class="history-prompt">{{ item.prompt }}</p>
              <div class="history-actions">
                <span class="history-time">{{ item.time }}</span>
                <button 
                  class="favorite-btn"
                  @click.stop="aiStore.toggleFavorite(item.image)"
                >
                  {{ aiStore.favorites.includes(item.image) ? '★' : '☆' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject } from 'vue'
  import { useAiImageStore } from '@/stores/aiImageStore'
  
  const aiStore = useAiImageStore()
  const emit = defineEmits(['close'])
  const imageEditorRef = inject('imageEditorRef')
  
  // 状态变量
  const prompt = ref('')
  const selectedModel = ref(aiStore.currentModel)
  
  // 加载收藏
  aiStore.loadFavorites()
  
  // 切换模型
  const switchModel = () => {
    aiStore.switchModel(selectedModel.value)
  }
  
  // 选择提示词建议
  const selectPrompt = (suggestion) => {
    prompt.value = suggestion
    clearError()
  }
  
  // 清除错误提示
  const clearError = () => {
    aiStore.errorMsg = ''
  }
  
  // 生成图像
  const handleGenerate = async () => {
    if (!prompt.value.trim()) {
      aiStore.errorMsg = '请输入提示词'
      return
    }
  
    // 获取编辑器当前图像（用于图像编辑模型）
    const currentImageBase64 = imageEditorRef?.getImageBase64() || null
    await aiStore.generateImage(prompt.value.trim(), currentImageBase64)
  }
  
  // 加载历史图像到编辑器
  const loadToEditor = (imageUrl) => {
    imageEditorRef?.loadImage(imageUrl, '历史图像')
    emit('close')
  }
  
  // 点击遮罩层关闭面板
  const handleOverlayClick = () => {
    emit('close')
  }
  </script>
  
  <style scoped lang="less">
  .ai-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
  }
  
  .ai-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background-color: @white;
    border-radius: @card-radius;
    padding: @spacing-md;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    z-index: 1000;
    overflow-y: auto;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-md;
    padding-bottom: @spacing-sm;
    border-bottom: 1px solid @primary-grey;
  
    h3 {
      font-variation-settings: '"wght" 120';
      font-size: @font-size-lg;
    }
  
    .close-btn {
      background: none;
      border: none;
      font-size: @font-size-lg;
      color: @text-color;
      cursor: pointer;
    }
  }
  
  .form-group {
    margin-bottom: @spacing-md;
  
    label {
      display: block;
      margin-bottom: @spacing-sm;
      font-variation-settings: '"wght" 80';
      font-size: @font-size-md;
    }
  
    textarea, select {
      width: 100%;
      padding: @spacing-sm;
      border-radius: @input-radius;
      border: 1px solid @secondary-grey;
      font-family: @main-font;
      font-size: @font-size-md;
    }
  
    textarea {
      resize: none;
      min-height: 120px;
    }
  
    select {
      height: @input-height;
    }
  }
  
  .prompt-suggestions {
    display: flex;
    gap: @spacing-sm;
    flex-wrap: wrap;
    margin-top: @spacing-sm;
  
    span {
      padding: @spacing-sm;
      background-color: @primary-grey;
      border-radius: 4px;
      font-size: @font-size-sm;
      cursor: pointer;
  
      &:hover {
        background-color: @secondary-grey;
      }
    }
  }
  
  .generate-btn {
    width: 100%;
    height: @input-height;
    background-color: @black;
    color: @white;
    border: none;
    border-radius: @btn-radius;
    font-family: @main-font;
    font-variation-settings: '"wght" 80';
    font-size: @font-size-md;
  
    &:disabled {
      background-color: @secondary-grey;
      cursor: not-allowed;
    }
  }
  
  .error-msg {
    margin-top: @spacing-sm;
    color: @error-color;
    font-size: @font-size-sm;
    text-align: center;
  }
  
  .history-section {
    margin-top: @spacing-lg;
  
    .section-title {
      font-variation-settings: '"wght" 80';
      margin-bottom: @spacing-sm;
      font-size: @font-size-md;
    }
  
    .history-list {
      display: flex;
      gap: @spacing-sm;
      flex-wrap: wrap;
      max-height: 200px;
      overflow-y: auto;
    }
  
    .history-item {
      width: calc(33.333% - 8px);
      border-radius: @card-radius;
      overflow: hidden;
      background-color: @primary-grey;
      cursor: pointer;
  
      &:hover {
        transform: scale(1.02);
      }
    }
  
    .history-img {
      width: 100%;
      height: 80px;
      object-fit: cover;
    }
  
    .history-info {
      padding: @spacing-sm;
      font-size: @font-size-sm;
    }
  
    .history-prompt {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: @spacing-sm;
    }
  
    .history-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
  
      .history-time {
        color: @secondary-grey;
        font-size: 12px;
      }
  
      .favorite-btn {
        background: none;
        border: none;
        color: #ffc107;
        font-size: @font-size-md;
        cursor: pointer;
      }
    }
  }
  
  // 移动端适配
  @media (max-width: @sm-breakpoint) {
    .ai-panel {
      width: 95%;
      max-height: 70vh;
      padding: @spacing-sm;
    }
  
    .history-item {
      width: calc(50% - 6px);
    }
  }
  </style>