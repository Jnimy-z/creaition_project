import { defineStore } from 'pinia'
import { textToImage, editImage } from '@/services/aiImageService'

export const useAiImageStore = defineStore('aiImage', {
  state: () => ({
    isLoading: false,
    errorMsg: '',
    generatedImages: [],
    history: [],
    favorites: [],
    currentModel: 'stable-diffusion' // stable-diffusion / qwen-image-edit
  }),
  actions: {
    // 切换 AI 模型
    switchModel(model) {
      this.currentModel = model
    },

    // 生成图像（文本生图/图像编辑）
    async generateImage(prompt, imageBase64 = null) {
      this.isLoading = true
      this.errorMsg = ''
      try {
        let result
        if (this.currentModel === 'stable-diffusion') {
          // 文本生成图像
          result = await textToImage(prompt)
        } else {
          // 图像编辑
          if (!imageBase64) throw new Error('请先加载一张图像再进行编辑')
          result = await editImage(imageBase64, prompt)
        }

        // 提取 Base64 图像（兼容不同模型响应格式）
        const imageUrl = result.output?.image || result.image || result.data?.image || 'data:image/png;base64,'+result
        console.log(imageUrl)
        if (!imageUrl) throw new Error('生成失败，未返回有效图像')

        // 更新状态
        this.generatedImages.push(imageUrl)
        this.history.push({
          prompt,
          image: imageUrl,
          time: new Date().toLocaleString(),
          model: this.currentModel
        })
      } catch (error) {
        this.errorMsg = error.message || 'AI 服务异常，请稍后重试'
      } finally {
        this.isLoading = false
      }
    },

    // 收藏/取消收藏
    toggleFavorite(image) {
      const index = this.favorites.findIndex(item => item === image)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(image)
      }
      localStorage.setItem('aiImageFavorites', JSON.stringify(this.favorites))
    },

    // 加载本地收藏
    loadFavorites() {
      const saved = localStorage.getItem('aiImageFavorites')
      if (saved) {
        try {
          this.favorites = JSON.parse(saved)
        } catch (e) {
          localStorage.removeItem('aiImageFavorites')
        }
      }
    },

    // 清空历史
    clearHistory() {
      this.history = []
      this.generatedImages = []
    }
  }
})