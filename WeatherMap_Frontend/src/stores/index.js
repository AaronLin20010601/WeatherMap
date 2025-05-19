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