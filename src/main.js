import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/style/variables.less'
import '@/style/global.less'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')