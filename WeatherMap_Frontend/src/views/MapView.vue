<!-- 顯示地圖 -->
<template>
    <div class="relative w-screen h-screen">
        <!-- 左側按鈕 -->
        <div class="absolute top-1/2 left-2 z-[1000] flex flex-col items-center gap-2 bg-white/85 p-2 rounded-md -translate-y-1/2">
            <button
                v-for="layer in weatherLayers"
                :key="layer.value"
                :class="[
                'flex flex-col items-center border-none bg-transparent cursor-pointer p-1 transition-transform',
                selectedLayer === layer.value ? 'border-b-2 border-blue-500 scale-105' : ''
                ]"
                @click="updateWeatherLayer(layer.value)"
            >
                <img :src="layer.image" :alt="layer.label" class="w-6 h-6" />
                <span class="text-xs">{{ layer.label }}</span>
            </button>
        </div>

        <!-- 地圖 -->
        <div id="map" class="absolute inset-0 w-full h-full z-0"></div>

        <!-- 經緯度 -->
        <div
        id="mouse-coordinates"
        class="absolute bottom-2 left-2 px-3 py-1.5 text-white font-bold text-sm whitespace-nowrap drop-shadow-[0_0_1px_black] pointer-events-none z-[1000]"
        >
        Latitude: ---, Longitude: ---
        </div>

        <component :is="getLegendComponent(selectedLayer)" />
    </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { addEarthquakeMarkers } from '@/utils/earthquake.js'
import PrecipitationLegend from '@/components/PrecipitationLegend.vue'
import TemperatureLegend from '@/components/TemperatureLegend.vue'
import WindLegend from '@/components/WindLegend.vue'
import PressureLegend from '@/components/PressureLegend.vue'
import SnowLegend from '@/components/SnowLegend.vue'
import RainLegend from '@/components/RainLegend.vue'

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
let map, weatherLayer
let earthquakeLayerGroup = null

// 根據 selectedLayer 返回對應的圖例組件
const getLegendComponent = (layer) => {
    const legends = {
        'precipitation_new': PrecipitationLegend,
        'temp_new': TemperatureLegend,
        'wind_new': WindLegend,
        'pressure_new': PressureLegend,
        'snow': SnowLegend,
        'rain': RainLegend
    };
    
    return legends[layer] || null;
};

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
        maxZoom: 12
    })

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

    // 經緯度顯示鼠標當前位置
    map.on('mousemove', function (e) {
        const { formattedLat, formattedLng } = formatLatLng(e.latlng.lat, e.latlng.lng)
        const coordDiv = document.getElementById('mouse-coordinates')
        if (coordDiv) {
            coordDiv.innerText = `Latitude: ${formattedLat}, Longitude: ${formattedLng}`
        }
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
        console.log('earthquakeLayerGroup:', newGroup)
        if (newGroup) {
            earthquakeLayerGroup = newGroup
            map.addLayer(earthquakeLayerGroup)
        }
    } else {
        addWeatherLayer(layerValue)
    }
}

// 經緯度顯示
function formatLatLng(lat, lng) {
    const latDir = lat >= 0 ? 'N' : 'S'
    let normalizedLng = ((lng + 180) % 360 + 360) % 360 - 180
    const lngDir = normalizedLng >= 0 ? 'E' : 'W'

    const formattedLat = `${Math.abs(lat).toFixed(4)}° ${latDir}`
    const formattedLng = `${Math.abs(normalizedLng).toFixed(4)}° ${lngDir}`
    return { formattedLat, formattedLng }
}
</script>