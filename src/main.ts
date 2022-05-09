import { createApp } from 'vue'
// 捋平了各个浏览器之间的样式差异
import 'normalize.css'
// 页面入口
import App from './App.vue'
// 前端路由
import router from './router'
import 'style/index.scss'
// 把状态管理装进vue组件
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).mount('#app')

// main.ts是项目入口
