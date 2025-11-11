<template>
    <div class="toolbar">
      <!-- 基础编辑工具 -->
      <button class="toolbar-btn" @click="handleCrop" :disabled="!hasPermission">
        裁剪
      </button>
      <button class="toolbar-btn" @click="handleRotate" :disabled="!hasPermission">
        旋转
      </button>
      <button class="toolbar-btn" @click="handleFlip" :disabled="!hasPermission">
        翻转
      </button>
      <button class="toolbar-btn" @click="handleFilter" :disabled="!hasPermission">
        滤镜
      </button>
      <!-- AI 功能入口 -->
      <button class="toolbar-btn ai-btn" @click="isAiPanelShow = !isAiPanelShow">
        AI 生成/编辑
      </button>
    </div>
  
    <!-- AI 面板 -->
    <AiPanel v-if="isAiPanelShow" @close="isAiPanelShow = false" />
  </template>
  
  <script setup>
  import { ref, inject, computed } from 'vue'
  import AiPanel from './AiPanel.vue'
  
  const emit = defineEmits(['crop', 'rotate', 'filter'])
  const isAiPanelShow = ref(false)
  const imageEditorRef = inject('imageEditorRef')
  
  // 判断是否有权限操作（是否加载图像）
  const hasPermission = computed(() => {
    return !!imageEditorRef?.getImageBase64()
  })
  
  // 工具栏事件
  const handleCrop = () => emit('crop')
  const handleRotate = () => emit('rotate')
  const handleFilter = () => emit('filter')
  
  // 翻转图像（水平）
  const handleFlip = () => {
    if (hasPermission.value) {
      imageEditorRef?.editor?.flipX()
    }
  }
  </script>
  
  <style scoped lang="less">
  .toolbar {
    display: flex;
    gap: @spacing-sm;
    padding: @spacing-md;
    background-color: @white;
    border-radius: @card-radius;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  
  .toolbar-btn {
    padding: @spacing-sm @spacing-md;
    background-color: @white;
    color: @text-color;
    border: 1px solid @primary-grey;
    border-radius: @btn-radius;
    min-height: @btn-min-height;
    font-family: @main-font;
    font-variation-settings: '"wght" 80';
  
    &:hover {
      border-color: @black;
      font-variation-settings: '"wght" 120, "slnt" 12';
    }
  
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      border-color: @primary-grey;
      background-color: @primary-grey;
      &:hover {
        font-variation-settings: '"wght" 80';
      }
    }
  }
  
  .ai-btn {
    background-color: @black;
    color: @white;
    border-color: @black;
  
    &:hover {
      background-color: #333;
      border-color: #333;
      color: @white;
    }
  }
  
  // 移动端适配
  @media (max-width: @sm-breakpoint) {
    .toolbar {
      gap: @spacing-sm;
      justify-content: center;
    }
  
    .toolbar-btn {
      padding: @spacing-sm @spacing-md;
      font-size: @font-size-sm;
    }
  }
  </style>