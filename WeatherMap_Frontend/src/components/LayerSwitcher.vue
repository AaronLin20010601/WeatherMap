<!-- 選擇天氣圖層 -->
<template>
    <div class="absolute top-1/2 left-2 z-[1000] flex flex-col items-center gap-2 bg-white/85 p-2 rounded-md -translate-y-1/2">
        <button
        v-for="layer in weatherLayers"
        :key="layer.value"
        :class="[
            'flex flex-col items-center border-none bg-transparent cursor-pointer p-1 transition-transform',
            selectedLayer === layer.value ? 'border-b-2 border-blue-500 scale-105' : ''
        ]"
        @click="changeLayer(layer.value)"
        >
            <img :src="layer.image" :alt="layer.label" class="w-6 h-6" />
            <span class="text-xs">{{ t('layers.' + layer.value) }}</span>
        </button>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useWeatherLayerStore } from '@/stores/index.js'

// 圖層類型
const weatherLayers = [
    { value: 'clouds_new', label: 'Clouds', image: new URL('@/assets/icons/clouds.png', import.meta.url).href },
    { value: 'precipitation_new', label: 'Precipitation', image: new URL('@/assets/icons/precipitation.png', import.meta.url).href },
    { value: 'temp_new', label: 'Temperature', image: new URL('@/assets/icons/temp.png', import.meta.url).href },
    { value: 'wind_new', label: 'Wind', image: new URL('@/assets/icons/wind.png', import.meta.url).href },
    { value: 'pressure_new', label: 'Pressure', image: new URL('@/assets/icons/pressure.png', import.meta.url).href },
    { value: 'snow', label: 'Snow', image: new URL('@/assets/icons/snow.png', import.meta.url).href },
    { value: 'rain', label: 'Rain', image: new URL('@/assets/icons/rain.png', import.meta.url).href },
    { value: 'earthquake', label: 'Earthquake', image: new URL('@/assets/icons/earthquake.png', import.meta.url).href }
]

const { t } = useI18n()
const weatherLayerStore = useWeatherLayerStore()
const selectedLayer = computed(() => weatherLayerStore.selectedLayer)

// 切換天氣圖層
function changeLayer(newLayer) {
    weatherLayerStore.setWeatherLayer(newLayer)
    localStorage.setItem('weatherLayer', newLayer)
}
</script>