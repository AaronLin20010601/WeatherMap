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
    const response = await fetch('http://localhost:5200/api/weather/current')
    const cities = await response.json()

    const map = L.map('map').setView([23.5, 121], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // 顯示資訊
    cities.forEach(city => {
        const marker = L.marker([city.latitude, city.longitude]).addTo(map)

        marker.bindPopup(`
            <b>${city.location}</b><br>
            Temperature: ${city.temperature}<br>
            Wind speed: ${city.windSpeed}
        `)

        // 滑鼠鼠標移動到標點後顯示
        marker.on('mouseover', function () {
            this.openPopup()
        })
        marker.on('mouseout', function () {
            this.closePopup()
        })
    })

    // 等地圖容器掛上後重新計算尺寸
    setTimeout(() => {
        map.invalidateSize()
    }, 300)
})
</script>

<style scoped>
.map-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
}

#map {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
</style>