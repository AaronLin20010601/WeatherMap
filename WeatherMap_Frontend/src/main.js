import './assets/tailwind.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import en from '@/assets/languages/en'
import zhtw from '@/assets/languages/zh-tw'
import zh from '@/assets/languages/zh'
import ja from '@/assets/languages/ja'
import ko from '@/assets/languages/ko'

// 初始語言設定
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        'zh-tw': zhtw,
        'zh': zh,
        'ja': ja,
        'ko': ko
    }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
