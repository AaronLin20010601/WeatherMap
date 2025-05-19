import L from 'leaflet'

let weatherLayer = null

// 加上天氣圖層
export function addWeatherLayer(map, layer) {
    const tileLayerUrl = `http://localhost:5200/api/weather/${layer}/{z}/{x}/{y}.png`
    weatherLayer = L.tileLayer(tileLayerUrl, {
        attribution: '&copy; OpenWeatherMap contributors'
    }).addTo(map)
}

// 移除天氣圖層
export function removeWeatherLayer(map) {
    if (weatherLayer && map.hasLayer(weatherLayer)) {
        map.removeLayer(weatherLayer)
        weatherLayer = null
    }
}