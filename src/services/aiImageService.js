import axios from 'axios'

const AI_API_TOKEN = import.meta.env.VITE_AI_API_TOKEN

// 指数退避重试逻辑
const requestWithRetry = async (config, retries = 3, delay = 1000) => {
  try {
    const response = await axios(config)
    return response.data
  } catch (error) {
    // 仅对 429（限流）和 503（服务不可用）重试
    if (retries > 0 && [429, 503].includes(error.response?.status)) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return requestWithRetry(config, retries - 1, delay * 2)
    }

    // 解析错误信息
    const errorMsg = error.response?.data?.error || 
      error.response?.data?.message || 
      '请求失败，请检查网络或 API Token 配置'
    throw new Error(errorMsg)
  }
}

// 文本生成图像（Stable Diffusion）
export const textToImage = async (prompt) => {
  if (!AI_API_TOKEN) throw new Error('请配置 AI API Token')
  
  return requestWithRetry({
    url: '/api/models/stabilityai/stable-diffusion-xl-base-1.0',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: {
      input: { prompt },
      parameters: {
        width: 512,
        height: 512,
        num_inference_steps: 20 // 生成步数（平衡速度与质量）
      }
    },
    timeout: 30000 // 30秒超时
  })
}

// 图像编辑（Qwen Image Edit）
export const editImage = async (imageBase64, prompt) => {
  if (!AI_API_TOKEN) throw new Error('请配置 AI API Token')
  if (!imageBase64) throw new Error('图像 Base64 不能为空')
  
  return requestWithRetry({
    url: '/api/models/Qwen/Qwen-Image-Edit',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: {
      input: {
        image: imageBase64,
        prompt
      },
      parameters: {
        width: 512,
        height: 512
      }
    },
    timeout: 30000
  })
}