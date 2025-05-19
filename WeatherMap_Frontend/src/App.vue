<template>
    <main class="flex-grow">
        <RouterView />
    </main>
</template>

<script setup>
// 取得暫存
import { useLanguageStore, useBaseMapStore, useWeatherLayerStore } from '@/stores/index.js'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const languageStore = useLanguageStore()
const baseMapStore = useBaseMapStore()
const weatherLayerStore = useWeatherLayerStore()
const { locale } = useI18n()

onMounted(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    const savedBaseMap = localStorage.getItem('baseMap') || 'carto'
    const savedWeatherLayer = localStorage.getItem('weatherLayer') || 'clouds_new'

    // 設定語言
    languageStore.setLanguage(savedLanguage)
    locale.value = savedLanguage

    // 設定地圖
    baseMapStore.setBaseMap(savedBaseMap)

    //設定天氣圖層
    weatherLayerStore.setWeatherLayer(savedWeatherLayer)
})
</script>