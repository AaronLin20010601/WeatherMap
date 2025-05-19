<!-- 切換語言 -->
<template>
    <div class="absolute top-4 right-4 z-50">
        <div class="mb-1.5 text-white font-bold text-sm whitespace-nowrap drop-shadow-[0_0_1px_black]">
            {{ t('language') }}
        </div>

        <select
            :value="languageStore.currentLanguage"
            @change="changeLanguage($event.target.value)"
            class="text-black bg-white border border-gray-300 rounded px-2 py-1"
            title="Select Language"
            >
            <option value="en">English</option>
            <option value="zh-TW">繁體中文</option>
        </select>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores'

const { t } = useI18n()
const { locale } = useI18n()
const languageStore = useLanguageStore()

locale.value = languageStore.currentLanguage

// 切換語言
function changeLanguage(newLanguage) {
    languageStore.setLanguage(newLanguage)
    locale.value = newLanguage
    localStorage.setItem('language', newLanguage)
}
</script>