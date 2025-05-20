import L from 'leaflet'

let currentBaseLayer = null

// 載入基底地圖
export async function loadMap(map, provider = 'carto') {
    if (!map) return

    // 移除先前的圖層
    if (currentBaseLayer) {
        map.removeLayer(currentBaseLayer)
        currentBaseLayer = null
    }

    if (provider === 'carto') {
        // Carto 地圖
        currentBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; Carto contributors',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map)

    } else if (provider === 'osm') {
        // OpenStreetMap 地圖
        currentBaseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map)

    } else if (provider === 'esri') {
        // Esri 地圖
        currentBaseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; ArcGIS contributors',
            maxZoom: 19
        }).addTo(map)
    }
}