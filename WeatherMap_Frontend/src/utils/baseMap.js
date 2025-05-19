import L from 'leaflet'

let currentBaseLayer = null
let currentLabelLayer = null

// 載入基底地圖
export async function loadMap(map, provider = 'carto') {
    if (!map) return

    // 移除先前的圖層
    if (currentBaseLayer) {
        map.removeLayer(currentBaseLayer)
        currentBaseLayer = null
    }
    if (currentLabelLayer) {
        map.removeLayer(currentLabelLayer)
        currentLabelLayer = null
    }

    if (provider === 'carto') {
        // Carto 地圖和地名
        currentBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO contributors',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map)

        currentLabelLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'abcd',
            maxZoom: 19,
            pane: 'overlayPane'
        }).addTo(map)

    } else if (provider === 'osm') {
        // OpenStreetMap 地圖
        currentBaseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map)
    }
}