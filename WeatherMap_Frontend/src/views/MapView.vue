<!-- 顯示地圖 -->
<template>
    <div class="relative w-screen h-screen">
        <!-- 天氣圖層 -->
        <LayerSwitcher/>

        <!-- 語言切換 -->
        <LanguageSwitcher/>

        <!-- 地圖切換 -->
        <BaseMapSwitcher/>

        <!-- 晨昏線顯示 -->
        <TerminatorSwitcher />

        <!-- 地圖 -->
        <div id="map" class="absolute inset-0 w-full h-full z-0"></div>

        <!-- 經緯度 -->
        <MouseCoordinates :lat="mouseLatitude" :lng="mouseLongitude" />

        <!-- 範圍色條 -->
        <DisplayLegend/>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, ref, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useI18n } from 'vue-i18n'
import { loadMap } from '@/utils/baseMap.js'
import { addEarthquakeMarkers, removeEarthquakeLayer } from '@/utils/earthquakeData.js'
import { addWeatherLayer, removeWeatherLayer } from '@/utils/weatherLayer.js'
import { updateTerminatorLine } from '@/utils/nightBoundary.js'
import { useBaseMapStore, useWeatherLayerStore, useMapViewStore, useTerminatorStore } from '@/stores/index.js'
import LayerSwitcher from '@/components/LayerSwitcher.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import BaseMapSwitcher from '@/components/BaseMapSwitcher.vue'
import TerminatorSwitcher from '@/components/TerminatorSwitcher.vue'
import MouseCoordinates from '@/components/MouseCoordinates.vue'
import DisplayLegend from '@/components/legend/DisplayLegend.vue'

const { t, locale } = useI18n()

// 地圖中心和縮放尺度
const mapViewStore = useMapViewStore()

// 基底地圖
const baseMapStore = useBaseMapStore()
const selectedBaseMap = computed({
    get: () => baseMapStore.selectedBaseMap,
    set: (val) => baseMapStore.setBaseMap(val)
})

// 天氣圖層
const weatherLayerStore = useWeatherLayerStore()
const selectedLayer = computed({
    get: () => weatherLayerStore.selectedLayer,
    set: (val) => weatherLayerStore.setWeatherLayer(val)
})

// 鼠標經緯度
const mouseLatitude = ref(null)
const mouseLongitude = ref(null)

// 地圖
let map

// 地震點位
let earthquakeLayerGroup = null

// 晨昏線點位和黑夜遮罩
let terminatorPolylines = []
let nightPolygons = []
let terminatorInterval = null
const terminatorStore = useTerminatorStore()
const isShowTerminator = computed({
    get: () => terminatorStore.isShowTerminator,
    set: (val) => terminatorStore.setShowTerminator(val)
})

onUnmounted(() => {
    stopTerminatorAutoUpdate()
})

onMounted(async () => {
    await nextTick()
    const mapContainer = document.getElementById('map')

    // 確保載入尺寸正確
    const resizeObserver = new ResizeObserver(() => {
        map?.invalidateSize()
    })
    resizeObserver.observe(mapContainer)

    map = L.map('map', {
        center: mapViewStore.center,
        zoom: mapViewStore.zoom,
        minZoom: 3,
        maxZoom: 10
    })

    loadMap(map, selectedBaseMap.value)

    // 載入圖層
    if (selectedLayer.value === 'earthquake') {
        earthquakeLayerGroup = await addEarthquakeMarkers(map, t)
        map.addLayer(earthquakeLayerGroup)
    } else {
        addWeatherLayer(map, selectedLayer.value)
    }

    // 加入晨昏線
    map.whenReady(() => {
        updateTerminatorLine(map, isShowTerminator.value, terminatorPolylines, nightPolygons)
    })

    // 自動更新晨昏線
    startTerminatorAutoUpdate()

    watch(isShowTerminator, (newStatus) => {
        updateTerminatorLine(map, newStatus, terminatorPolylines, nightPolygons)
        if (newStatus === 'enabled') {
            startTerminatorAutoUpdate()
        } else {
            stopTerminatorAutoUpdate()
        }
    })

    // 經緯度顯示鼠標當前位置
    map.on('mousemove', function (e) {
        mouseLatitude.value = e.latlng.lat
        mouseLongitude.value = e.latlng.lng
    })

    // 當前地圖中心和縮放尺度
    map.on('moveend', () => {
        const center = map.getCenter()
        mapViewStore.setCenter(center.lat, center.lng)
        updateTerminatorLine(map, isShowTerminator.value, terminatorPolylines, nightPolygons)
    })

    map.on('zoomend', () => {
        const zoom = map.getZoom()
        mapViewStore.setZoom(zoom)
        updateTerminatorLine(map, isShowTerminator.value, terminatorPolylines, nightPolygons)
    })
})

// 更新天氣圖層
async function updateWeatherLayer(layerValue) {
    selectedLayer.value = layerValue
    
    // 清除舊的天氣圖層
    removeWeatherLayer(map)

    // 清除舊的地震圖層
    await removeEarthquakeLayer(map, earthquakeLayerGroup)

    // 切換到地震圖層
    if (layerValue === 'earthquake') {
        const newGroup = await addEarthquakeMarkers(map, t)
        if (newGroup) {
            earthquakeLayerGroup = newGroup
            map.addLayer(earthquakeLayerGroup)
        }
    } else {
        addWeatherLayer(map, layerValue)
    }
}

// 每分鐘自動更新晨昏線
function startTerminatorAutoUpdate() {
    if (terminatorInterval) return
    terminatorInterval = setInterval(() => {
        if (isShowTerminator.value === 'enabled') {
            updateTerminatorLine(map, isShowTerminator.value, terminatorPolylines, nightPolygons)
        }
    }, 60 * 1000)
}

// 停止計算更新晨昏線
function stopTerminatorAutoUpdate() {
    if (terminatorInterval) {
        clearInterval(terminatorInterval)
        terminatorInterval = null
    }
}

// 切換地圖來源時重新載入
watch(selectedBaseMap, (newValue) => {
    loadMap(map, newValue)
    updateWeatherLayer(selectedLayer.value)
})

// 切換天氣圖層時重新載入
watch(selectedLayer, (newLayer) => {
    if (map) {
        updateWeatherLayer(newLayer)
    }
})

// 開關晨昏線時重新載入
watch(isShowTerminator, (newStatus) => {
    updateTerminatorLine(map, newStatus, terminatorPolylines, nightPolygons)
})

// 更新地震資訊框語言
watch(locale, async () => {
    if (selectedLayer.value === 'earthquake' && map) {
        // 移除舊的地震圖層
        await removeEarthquakeLayer(map, earthquakeLayerGroup)

        // 重新加上新的地震圖層
        earthquakeLayerGroup = await addEarthquakeMarkers(map, t)
        map.addLayer(earthquakeLayerGroup)
    }
})
</script>