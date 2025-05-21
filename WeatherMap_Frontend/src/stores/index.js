import { defineStore } from 'pinia'

// 暫存語言
export const useLanguageStore = defineStore('language', {
    state: () => ({
        currentLanguage: localStorage.getItem('selected_language') || 'en'
    }),
    actions: {
        setLanguage(language) {
            this.currentLanguage = language
            localStorage.setItem('selected_language', language)
        }
    }
})

// 暫存基底地圖
export const useBaseMapStore = defineStore('baseMap', {
    state: () => ({
        selectedBaseMap: localStorage.getItem('base_map') || 'carto'
    }),
    actions: {
        setBaseMap(baseMap) {
            this.selectedBaseMap = baseMap
            localStorage.setItem('base_map', baseMap)
        }
    }
})

// 暫存天氣圖層
export const useWeatherLayerStore = defineStore('weatherLayer', {
    state: () => ({
        selectedLayer: localStorage.getItem('weather_layer') || 'clouds_new'
    }),
    actions: {
        setWeatherLayer(layer) {
            this.selectedLayer = layer
            localStorage.setItem('weather_layer', layer)
        }
    }
})

// 暫存地圖中心點和縮放尺度
export const useMapViewStore = defineStore('mapView', {
    state: () => {
        const savedCenter = JSON.parse(localStorage.getItem('map_center') || '[23.5,121]')
        const savedZoom = parseInt(localStorage.getItem('map_zoom') || '7')
        return {
            center: savedCenter,
            zoom: savedZoom
        }
    },
    actions: {
        setCenter(lat, lng) {
            this.center = [lat, lng]
            localStorage.setItem('map_center', JSON.stringify(this.center))
        },
        setZoom(zoomLevel) {
            this.zoom = zoomLevel
            localStorage.setItem('map_zoom', this.zoom.toString())
        },
        setView(lat, lng, zoomLevel) {
            this.center = [lat, lng]
            this.zoom = zoomLevel
            localStorage.setItem('map_center', JSON.stringify(this.center))
            localStorage.setItem('map_zoom', this.zoom.toString())
        }
    }
})

// 暫存晨昏線開關
export const useTerminatorStore = defineStore('terminator', {
    state: () => ({
        isShowTerminator: localStorage.getItem('night_boundary') || 'enabled'
    }),
    actions: {
        setShowTerminator(terminator) {
            this.isShowTerminator = terminator
            localStorage.setItem('night_boundary', terminator)
        }
    }
})