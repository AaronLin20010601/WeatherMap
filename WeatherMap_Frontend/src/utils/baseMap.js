import L from 'leaflet'

// 載入基底地圖
export async function loadMap(map) {
    if (!map) return

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
}