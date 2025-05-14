<!-- 顯示地圖 -->
<template>
    <div class="map-container">
        <div class="layer-buttons">
        <button
            v-for="layer in weatherLayers"
            :key="layer.value"
            :class="{ active: selectedLayer === layer.value }"
            @click="updateWeatherLayer(layer.value)"
        >
            <img :src="layer.image" :alt="layer.label" />
            <span>{{ layer.label }}</span>
        </button>
        </div>
        <div id="map"></div>
    </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 圖層類型
const weatherLayers = [
    { value: 'clouds_new', label: 'Clouds', image: new URL('@/assets/icons/clouds.png', import.meta.url).href },
    { value: 'precipitation_new', label: 'Precipitation', image: new URL('@/assets/icons/precipitation.png', import.meta.url).href },
    { value: 'temp_new', label: 'Temperature', image: new URL('@/assets/icons/temp.png', import.meta.url).href },
    { value: 'wind_new', label: 'Wind', image: new URL('@/assets/icons/wind.png', import.meta.url).href },
    { value: 'pressure_new', label: 'Pressure', image: new URL('@/assets/icons/pressure.png', import.meta.url).href },
    { value: 'snow', label: 'Snow', image: new URL('@/assets/icons/snow.png', import.meta.url).href },
    { value: 'rain', label: 'Rain', image: new URL('@/assets/icons/rain.png', import.meta.url).href }
]

const selectedLayer = ref('clouds_new')
let map, weatherLayer

onMounted(async () => {
    await nextTick()

    map = L.map('map').setView([23.5, 121], 7)

    // 地圖和地名
    const lightNoLabelsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO contributors',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map)

    const labelLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19,
        pane: 'overlayPane'
    }).addTo(map)

    // 從後端獲取圖層的 URL
    addWeatherLayer(selectedLayer.value)

    // 等地圖容器掛上後重新計算尺寸
    setTimeout(() => {
        map.invalidateSize()
    }, 300)
})

// 加上天氣圖層
function addWeatherLayer(layer) {
    const tileLayerUrl = `http://localhost:5200/api/weather/${layer}/{z}/{x}/{y}.png`

    if (weatherLayer) {
        map.removeLayer(weatherLayer)
    }

    weatherLayer = L.tileLayer(tileLayerUrl, {
        attribution: '&copy; OpenWeatherMap contributors'
    }).addTo(map)
}

// 更新天氣圖層
function updateWeatherLayer(layerValue) {
    selectedLayer.value = layerValue
    addWeatherLayer(layerValue)
}
</script>

<style scoped>
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}

.layer-buttons {
    position: absolute;
    top: 50%;
    left: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.85);
    padding: 6px 10px;
    border-radius: 6px;
    transform: translateY(-50%);
}

.layer-buttons button {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;
    transition: transform 0.2s;
}

.layer-buttons button.active {
    border-bottom: 2px solid #007BFF;
    transform: scale(1.05);
}

.layer-buttons img {
    width: 24px;
    height: 24px;
}

.layer-buttons span {
    font-size: 12px;
}
</style>