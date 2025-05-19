import L from 'leaflet'

// 在地圖上加上地震發生點
export async function addEarthquakeMarkers(map, t) {
    if (!map) return

    // 取得今天日期
    const getTodayDate = () => {
        const now = new Date()
        const yyyy = now.getUTCFullYear()
        const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(now.getUTCDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    // 取得明天日期
    const getTomorrowDate = () => {
        const now = new Date()
        now.setUTCDate(now.getUTCDate() + 1)
        const yyyy = now.getUTCFullYear()
        const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(now.getUTCDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    // 抓取外部地震資料
    const starttime = getTodayDate()
    const endtime = getTomorrowDate()
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=3`

    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch earthquake data')
        const data = await res.json()

        const earthquakeGroup = L.layerGroup()
        const earthquakeLngShifts = new Set()

        // 繪製地震點
        const drawMarkers = (lngShift) => {
            data.features.forEach(feature => {
                const coords = feature.geometry.coordinates
                const lat = coords[1]
                const lng = coords[0] + lngShift
                const mag = feature.properties.mag
                const place = feature.properties.place
                const time = new Date(feature.properties.time).toLocaleString()

                // 依照地震強度繪製發生點
                const marker = L.circleMarker([lat, lng], {
                    radius: mag ? mag * 2 : 5,
                    fillColor: mag >= 6 ? 'red' : mag >= 4 ? 'orange' : 'yellow',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                })

                // 地震資訊內容
                marker.bindPopup(`
                <div>
                    <strong>${t('earthquake.intensity')}:</strong> ${mag} <br/>
                    <strong>${t('earthquake.position')}:</strong> ${place} <br/>
                    <strong>${t('earthquake.time')}:</strong> ${time}
                </div>
                `)

                earthquakeGroup.addLayer(marker)
            })
        }

        // 地圖橫向延伸地震點位渲染
        const updateMarkersInView = () => {
            const bounds = map.getBounds()
            const west = bounds.getWest()
            const east = bounds.getEast()

            const earthWidth = 360
            const startShift = Math.floor(west / earthWidth) * earthWidth
            const endShift = Math.floor(east / earthWidth) * earthWidth

            for (let shift = startShift; shift <= endShift; shift += earthWidth) {
                if (!earthquakeLngShifts.has(shift)) {
                    earthquakeLngShifts.add(shift)
                    drawMarkers(shift)
                }
            }
        }

        // 繪製和更新點位
        updateMarkersInView()
        map.on('moveend', updateMarkersInView)

        return earthquakeGroup
    } catch (error) {
        console.error('Error loading earthquake data:', error)
        return null
    }
}

// 移除舊地震發生點
export async function removeEarthquakeLayer(map, layerGroup) {
    if (layerGroup && map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup)
    }
}