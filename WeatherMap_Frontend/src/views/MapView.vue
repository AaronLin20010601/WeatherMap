<!-- 顯示地圖 -->
<template>
    <div class="relative w-screen h-screen">
        <!-- 天氣圖層 -->
        <LayerSwitcher v-model="selectedLayer" :layers="weatherLayers" @update:modelValue="updateWeatherLayer"/>

        <!-- 地圖 -->
        <div id="map" class="absolute inset-0 w-full h-full z-0"></div>

        <!-- 經緯度 -->
        <MouseCoordinates :lat="mouseLatitude" :lng="mouseLongitude" />

        <!-- 範圍色條 -->
        <DisplayLegend :layer="selectedLayer" />
    </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { loadMap } from '@/utils/baseMap.js'
import { addEarthquakeMarkers } from '@/utils/earthquakeData.js'
import LayerSwitcher from '@/components/LayerSwitcher.vue'
import MouseCoordinates from '@/components/MouseCoordinates.vue'
import DisplayLegend from '@/components/legend/DisplayLegend.vue'

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

const selectedLayer = ref('clouds_new')
const mouseLatitude = ref(null)
const mouseLongitude = ref(null)
let map, weatherLayer
let earthquakeLayerGroup = null

onMounted(async () => {
    await nextTick()

    const mapContainer = document.getElementById('map')

    // 確保載入尺寸正確
    const resizeObserver = new ResizeObserver(() => {
        if (map) {
            map.invalidateSize()
        }
    })
    resizeObserver.observe(mapContainer)

    map = L.map('map', {
        center: [23.5, 121],
        zoom: 7,
        minZoom: 3,
        maxZoom: 10
    })

    loadMap(map)

    // 從後端獲取圖層的 URL
    addWeatherLayer(selectedLayer.value)

    // 等地圖容器掛上後重新計算尺寸
    setTimeout(() => {
        map.invalidateSize()
    }, 300)

    // 經緯度顯示鼠標當前位置
    map.on('mousemove', function (e) {
        mouseLatitude.value = e.latlng.lat
        mouseLongitude.value = e.latlng.lng
    })
})

// 加上天氣圖層
function addWeatherLayer(layer) {
    const tileLayerUrl = `http://localhost:5200/api/weather/${layer}/{z}/{x}/{y}.png`
    weatherLayer = L.tileLayer(tileLayerUrl, {
        attribution: '&copy; OpenWeatherMap contributors'
    }).addTo(map)
}

// 更新天氣圖層
async function updateWeatherLayer(layerValue) {
    selectedLayer.value = layerValue
    
    // 清除舊的天氣圖層
    if (weatherLayer) {
        if (map.hasLayer(weatherLayer)) {
            map.removeLayer(weatherLayer)
        }
        weatherLayer = null
    }

    // 清除舊的地震圖層
    if (earthquakeLayerGroup) {
        if (map.hasLayer(earthquakeLayerGroup)) {
            map.removeLayer(earthquakeLayerGroup)
        }
        earthquakeLayerGroup = null
    }

    // 切換到地震圖層
    if (layerValue === 'earthquake') {
        const newGroup = await addEarthquakeMarkers(map)
        if (newGroup) {
            earthquakeLayerGroup = newGroup
            map.addLayer(earthquakeLayerGroup)
        }
    } else {
        addWeatherLayer(layerValue)
    }
}
</script>