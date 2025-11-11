<template>
    <div class="properties-panel" :class="{ 'panel-modal': isMobile }">
      <div class="panel-header">
        <h3>图像属性</h3>
        <button class="close-btn" @click="handleClose" v-if="isMobile">×</button>
      </div>
  
      <!-- 尺寸调整 -->
      <div class="panel-section">
        <h4 class="section-title">尺寸调整</h4>
        <div class="form-group">
          <label>宽度 (px)</label>
          <input 
            type="number" 
            v-model.number="width" 
            @input="handleSizeInput"
            min="100"
          />
        </div>
        <div class="form-group">
          <label>高度 (px)</label>
          <input 
            type="number" 
            v-model.number="height" 
            @input="handleSizeInput"
            min="100"
          />
        </div>
        <button class="apply-btn" @click="handleUpdateSize">应用</button>
      </div>
  
      <!-- 比例锁定（可选） -->
      <div class="panel-section">
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="lockRatio" /> 锁定比例
          </label>
        </div>
      </div>
  
      <!-- 亮度调整 -->
      <div class="panel-section">
        <h4 class="section-title">亮度</h4>
        <input 
          type="range" 
          min="-100" 
          max="100" 
          v-model="brightness" 
          @change="handleBrightnessChange"
        />
        <span class="range-value">{{ brightness }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import { useAiImageStore } from '@/stores/aiImageStore'
  
  const aiStore = useAiImageStore()
  const props = defineProps({
    initialWidth: { type: Number, required: true },
    initialHeight: { type: Number, required: true },
    isMobile: { type: Boolean, default: false }
  })
  const emit = defineEmits(['update:size', 'close'])
  
  // 状态变量
  const width = ref(props.initialWidth)
  const height = ref(props.initialHeight)
  const lockRatio = ref(true)
  const brightness = ref(0)
  const originalRatio = computed(() => props.initialWidth / props.initialHeight)
  
  // 监听初始尺寸变化
  watch([() => props.initialWidth, () => props.initialHeight], ([newW, newH]) => {
    width.value = newW
    height.value = newH
    brightness.value = 0 // 重置亮度
  })
  
  // 锁定比例时，同步宽高
  const handleSizeInput = () => {
    if (lockRatio.value && width.value && height.value) {
      const currentRatio = width.value / height.value
      if (currentRatio !== originalRatio.value) {
        // 以宽度为准，计算高度
        height.value = Math.round(width.value / originalRatio.value)
      }
    }
  }
  
  // 应用尺寸调整
  const handleUpdateSize = () => {
    if (width.value > 0 && height.value > 0) {
      emit('update:size', { width: width.value, height: height.value })
    }
  }
  
  // 亮度调整
  const handleBrightnessChange = () => {
    const imageEditorRef = aiStore.imageEditorRef
    if (imageEditorRef?.editor) {
      // 重置之前的亮度滤镜
      imageEditorRef.editor.applyFilter('brightness', -brightness.value + 10)
      // 应用新的亮度
      imageEditorRef.editor.applyFilter('brightness', brightness.value)
    }
  }
  
  // 移动端关闭面板
  const handleClose = () => {
    emit('close')
  }
  </script>
  
  <style scoped lang="less">
  .properties-panel {
    width: 280px;
    padding: @spacing-md;
    background-color: @white;
    border-radius: @card-radius;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
  
  .panel-modal {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 999;
    overflow-y: auto;
    box-shadow: -2px 0 12px rgba(0,0,0,0.1);
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
      font-size: @font-size-md;
    }
  
    .close-btn {
      background: none;
      border: none;
      font-size: @font-size-lg;
      color: @text-color;
      cursor: pointer;
    }
  }
  
  .panel-section {
    margin-bottom: @spacing-md;
  
    .section-title {
      font-variation-settings: '"wght" 80';
      margin-bottom: @spacing-sm;
      font-size: @font-size-md;
    }
  }
  
  .form-group {
    margin-bottom: @spacing-sm;
  
    label {
      display: block;
      margin-bottom: @spacing-sm;
      font-variation-settings: '"wght" 80';
      font-size: @font-size-sm;
    }
  
    input {
      width: 100%;
      padding: 0 @spacing-sm;
      border-radius: @input-radius;
      height: @input-height;
      font-family: @main-font;
    }
  
    input[type="range"] {
      height: 6px;
      border-radius: 3px;
      background-color: @primary-grey;
      appearance: none;
  
      &::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: @black;
        cursor: pointer;
      }
    }
  }
  
  .range-value {
    display: inline-block;
    width: 40px;
    text-align: center;
    font-size: @font-size-sm;
    color: @secondary-grey;
  }
  
  .apply-btn {
    width: 100%;
    height: @input-height;
    background-color: @black;
    color: @white;
    border: none;
    border-radius: @btn-radius;
    font-family: @main-font;
    font-variation-settings: '"wght" 80';
  
    &:hover {
      background-color: #333;
    }
  }
  </style>