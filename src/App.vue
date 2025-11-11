<template>
    <div id="app">
      <EditorView />
    </div>
  </template>
  
  <script setup>
  import EditorView from '@/views/EditorView.vue'
  </script>
  
  <style scoped lang="less">
  #app {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
  </style>