<template>
    <div class="map-container">
        <div id="map"></div>
    </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

onMounted(async () => {
    await nextTick()

    const map = L.map('map').setView([23.5, 121], 7)

    const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // 從後端獲取雲層圖層的 URL
    const tileLayerUrl = 'http://localhost:5200/api/weather/clouds_new/{z}/{x}/{y}.png';
    const cloudLayer = L.tileLayer(tileLayerUrl, {
        attribution: '&copy; OpenWeatherMap contributors'
    }).addTo(map)

    // 等地圖容器掛上後重新計算尺寸
    setTimeout(() => {
        map.invalidateSize()
    }, 300)
})
</script>

<style scoped>
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
</style>