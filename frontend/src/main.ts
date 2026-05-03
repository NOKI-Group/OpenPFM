import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
auth.init().then(() => {
    app.use(router).mount('#app')
})