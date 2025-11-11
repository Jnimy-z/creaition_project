<template>
  <div class="editor-view">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1>AI 图像编辑器</h1>
      <button class="clear-history-btn" @click="clearHistory">清空历史</button>
    </header>

    <!-- 工具栏 -->
    <Toolbar @crop="handleCrop" @rotate="handleRotate" @filter="handleFilter" />

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 图像编辑器 -->
      <div class="editor-wrapper">
        <ImageEditor ref="imageEditorRef" />
        <!-- 无图像提示 -->
        <div class="empty-tip" v-if="!hasImageLoaded">
          点击 AI 生成/编辑按钮，创建或编辑图像
        </div>
      </div>

      <!-- 桌面端属性面板 -->
      <PropertiesPanel
        v-if="!isMobile && hasImageLoaded"
        :initial-width="editorWidth"
        :initial-height="editorHeight"
        @update:size="handleUpdateSize"
      />
    </div>

    <!-- 移动端属性面板按钮 -->
    <button
      class="mobile-panel-btn"
      v-if="isMobile && hasImageLoaded"
      @click="showMobilePanel = !showMobilePanel"
    >
      {{ showMobilePanel ? '关闭属性' : '图像属性' }}
    </button>

    <!-- 移动端属性面板 -->
    <PropertiesPanel
      v-if="isMobile && showMobilePanel && hasImageLoaded"
      :initial-width="editorWidth"
      :initial-height="editorHeight"
      :is-mobile="true"
      @update:size="handleUpdateSize"
      @close="showMobilePanel = false"
    />
  </div>
</template>
  
  <script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watchEffect,
  provide,
  computed,
  watch
} from 'vue';
import Toolbar from '@/components/ImageEditor/Toolbar.vue';
import ImageEditor from '@/components/ImageEditor/ImageEditor.vue';
import PropertiesPanel from '@/components/ImageEditor/PropertiesPanel.vue';
import { useAiImageStore } from '@/stores/aiImageStore';

const aiStore = useAiImageStore();
const imageEditorRef = ref(null);
const isMobile = ref(false);
const showMobilePanel = ref(false);
const editorWidth = ref(800);
const editorHeight = ref(600);
const hasImageLoaded = ref(false);


watchEffect(() => {
  provide('imageEditorRef', imageEditorRef.value);
});

// 判断移动端
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640;
};

// 检查是否有图像加载
const checkImageLoaded = () => {
  if (imageEditorRef.value?.editor) {
    const canvas = imageEditorRef.value.editor?.getCanvas();
    hasImageLoaded.value = !!canvas && canvas.width > 0;
  }
};

// 初始化
onMounted(() => {
  // 提供编辑器引用给子组件
  provide('imageEditorRef', imageEditorRef.value);
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);

  // 监听编辑器加载状态
  setTimeout(() => {
    checkImageLoaded();
    editorWidth.value =
      imageEditorRef.value?.editor?.getCanvasSize().width || 800;
    editorHeight.value =
      imageEditorRef.value?.editor?.getCanvasSize().height || 600;
  }, 300);
  // 组件挂载后，监听子组件暴露的 ref
  if (imageEditorRef.value) {
    // 关键：监听子组件 ref 的 .value 变化（而非 ref 本身）
    watch(
      () => imageEditorRef.value.editor, // 监听目标：子组件 ref 的值
      (newVal, oldVal) => {
        console.log("子组件编辑器实例更新：", oldVal, "→", newVal);
        
      },
      { immediate: true } // 立即执行一次（获取初始值）
    );
  }

  // 加载收藏
  aiStore.loadFavorites();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});

// 编辑器操作
const handleCrop = () => {
  if (hasImageLoaded.value) {
    imageEditorRef.value?.editor?.startCropMode();
  }
};

const handleRotate = () => {
  if (hasImageLoaded.value) {
    imageEditorRef.value?.editor?.rotate(90);
  }
};

const handleFilter = () => {
  if (hasImageLoaded.value) {
    // 亮度调整（+10）
    imageEditorRef.value?.editor?.applyFilter('brightness', 10);
  }
};

// 更新图像尺寸
const handleUpdateSize = ({ width, height }) => {
  if (width > 0 && height > 0) {
    debugger
    editorWidth.value = width;
    editorHeight.value = height;
    imageEditorRef.value?.resizeCanvas(width, height);
  }
};

// 清空历史
const clearHistory = () => {
  if (confirm('确定要清空所有生成历史吗？')) {
    aiStore.clearHistory();
  }
};

// 监听生成图像变化，更新加载状态
watchEffect(() => {
  if (aiStore.generatedImages.length > 0) {
    hasImageLoaded.value = true;
  }
});
</script>
  
  <style scoped lang="less">
.editor-view {
  padding: @spacing-md;
  max-width: @xl-breakpoint;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-md;

  h1 {
    font-variation-settings: '"wght" 120';
    font-size: @font-size-lg;
  }

  .clear-history-btn {
    background-color: @white;
    border: none;
    border-radius: @btn-radius;
    padding: @spacing-sm @spacing-md;
    font-family: @main-font;
    font-variation-settings: '"wght" 80';

    &:hover {
      background-color: @primary-grey;
    }
  }
}

.main-content {
  display: flex;
  gap: @spacing-md;
  height: calc(100vh - 160px);
  align-items: flex-start;
}

.editor-wrapper {
  flex: 1;
  position: relative;
  height: 100%;
  background-color: @white;
  border-radius: @card-radius;
  overflow: hidden;
}

.empty-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: @secondary-grey;
  font-size: @font-size-md;
  text-align: center;
  z-index: 10;
}

.mobile-panel-btn {
  position: fixed;
  bottom: @spacing-lg;
  left: 50%;
  transform: translateX(-50%);
  background-color: @black;
  color: @white;
  border: none;
  border-radius: @btn-radius;
  padding: @spacing-sm @spacing-lg;
  min-height: @btn-min-height;
  font-family: @main-font;
  z-index: 998;
}

// 移动端适配
@media (max-width: @sm-breakpoint) {
  .main-content {
    flex-direction: column;
    height: calc(100vh - 200px);
  }

  .editor-wrapper {
    height: calc(100% - 60px);
  }
}
</style>