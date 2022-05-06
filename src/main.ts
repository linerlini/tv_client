import { createApp } from 'vue'
import 'normalize.css'
import App from './App.vue'
import router from './router'
import 'style/index.scss'
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).mount('#app')
