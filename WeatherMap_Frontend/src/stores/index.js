import { defineStore } from 'pinia'

// 暫存語言
export const useLanguageStore = defineStore('language', {
    state: () => ({
        currentLanguage: 'en'
    }),
    actions: {
        setLanguage(language) {
            this.currentLanguage = language
        }
    }
})

// 暫存基底地圖
export const useBaseMapStore = defineStore('baseMap', {
    state: () => ({
        selectedBaseMap: 'carto'
    }),
    actions: {
        setBaseMap(baseMap) {
            this.selectedBaseMap = baseMap
        }
    }
})

// 暫存天氣圖層
export const useWeatherLayerStore = defineStore('weatherLayer', {
    state: () => ({
        selectedLayer: 'clouds_new'
    }),
    actions: {
        setWeatherLayer(layer) {
            this.selectedLayer = layer
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