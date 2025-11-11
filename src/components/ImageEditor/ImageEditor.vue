<template>
    <div id="tui-image-editor" class="editor"></div>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import ImageEditor from 'tui-image-editor'
  import { customTheme, initCssVariables } from './theme'
  import 'tui-image-editor/dist/tui-image-editor.css'
  
  let editor = ref(null)
  
  // 初始化 CSS 变量（供主题使用）
  initCssVariables()
  
  // 初始化编辑器
  const initEditor = () => {
    // 确保容器存在
    const container = document.getElementById('tui-image-editor')
    if (!container) return
  
    editor.value = new ImageEditor(container, {
      theme: customTheme,
      usageStatistics: false,
      minWidth: 320,
      minHeight: 300,
      toolbarItems: [
        // 保留基础工具（可根据需求调整）
        'crop', 'rotate', 'flip', 'draw', 'shape', 'text', 'filter'
      ],
      // 禁用不必要的功能
      disableFilter: false,
      disableDownload: false,
      disableGuide: true
    })
    debugger
  
    // 监听图像加载事件
    editor.value.on('imageLoaded', () => {
      console.log('图像加载完成')
    })
  }
  
  onMounted(() => {
    initEditor()
    // 延迟初始化，确保 DOM 渲染完成
    //setTimeout(initEditor, 100)
  })
  
  onUnmounted(() => {
    debugger
    // 销毁编辑器，释放资源
    if (editor.value) {
      editor.value.destroy()
      editor.value = null
    }
  })
  
  // 暴露方法给父组件
  defineExpose({
    editor: editor,
    loadImage: (url, name = '图像') => {
      if (editor.value) {
        editor.value.loadImageFromURL(url, name)
      }
    },
    getImageBase64: () => {
      return editor.value?.toDataURL() || ''
    },
    getCanvasSize: () => {
      return editor.value?.getCanvasSize() || { width: 800, height: 600 }
    },
    resizeCanvas: (width, height) => {
      if (editor.value) {
        editor.value.resizeCanvas(width, height)
      }
    }
  })
  </script>
  
  <style scoped lang="less">
  .editor {
    width: 100%;
    height: 100%;
    border-radius: @card-radius;
    overflow: hidden;
  }
  
  // 覆盖 TUI 编辑器默认样式，适配设计系统
  ::v-deep(.tui-image-editor-header) {
    background-color: @bg-color !important;
    border-bottom: 1px solid @primary-grey !important;
  }
  
  ::v-deep(.tui-image-editor-toolbar-button) {
    border-radius: @btn-radius !important;
    min-height: @btn-min-height !important;
  }
  
  ::v-deep(.tui-image-editor-input) {
    border-radius: @input-radius !important;
    height: @input-height !important;
  }
  </style>