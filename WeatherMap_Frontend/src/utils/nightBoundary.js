import L from 'leaflet'
import SunCalc from 'suncalc';

// 二分法搜尋太陽晨昏線緯度
function binarySearchLatitude(date, lng, minLat, maxLat, epsilon = 0.01) {
    let low = minLat
    let high = maxLat

    while (high - low > epsilon) {
        const mid = (low + high) / 2
        const sunAlt = SunCalc.getPosition(date, mid, lng).altitude

        if (sunAlt > 0) {
            // 太陽在上則朝南找
            high = mid
        } else {
            // 太陽在下則朝北找
            low = mid
        }
    }

    return (low + high) / 2
}

// 取得晨昏線座標
function getTerminatorLinePoints(date, lngShift = 0, zoom = 3) {
    const points = []

    // 根據縮放調整經度步長
    let lngStep
    if (zoom >= 7) {
        lngStep = 0.25
    }
    else if (zoom >= 5) {
        lngStep = 0.5
    }
    else {
        lngStep = 1
    }

    for (let lng = -180; lng <= 180; lng += lngStep) {
        const terminatorLat = binarySearchLatitude(date, lng, -89, 89, 0.01)
        points.push([terminatorLat, lng + lngShift])
    }

    return points
}

// 晨昏線黑夜區
function drawNightOverlay(map, points, shift) {
    const nightPolygonPoints = [...points]

    // 從右側接往南極點
    nightPolygonPoints.push([ -90, 180 + shift ])
    // 從南極點回到左側
    nightPolygonPoints.push([ -90, -180 + shift ])
    // 回到左側第一點
    nightPolygonPoints.push(points[0])

    // 建立黑夜區域
    const nightPolygon = L.polygon(nightPolygonPoints, {
        color: '#000000',
        fillColor: '#000000',
        fillOpacity: 0.3,
        weight: 0,
        interactive: false,
    }).addTo(map)

    nightPolygon._shift = shift

    return nightPolygon
}

// 繪製晨昏線
function drawTerminatorLine(map, terminatorPolylines, nightPolygons) {
    if (!map) return

    const date = new Date()
    const bounds = map.getBounds()
    const west = bounds.getWest()
    const east = bounds.getEast()

    const earthWidth = 360
    const startShift = Math.floor(west / earthWidth) * earthWidth - earthWidth
    const endShift = Math.floor(east / earthWidth) * earthWidth + earthWidth

    // 保留晨昏線範圍
    const neededShifts = new Set()
    for (let shift = startShift; shift <= endShift; shift += earthWidth) {
        neededShifts.add(shift)
    }

    // 移除過度延伸的晨昏線
    for (let i = terminatorPolylines.length - 1; i >= 0; i--) {
        const poly = terminatorPolylines[i]
        const shift = poly._shift
        if (!neededShifts.has(shift)) {
            map.removeLayer(poly)
            terminatorPolylines.splice(i, 1)
        }
    }

    // 移除過度延伸的黑夜遮罩
    for (let i = nightPolygons.length - 1; i >= 0; i--) {
        const poly = nightPolygons[i]
        const shift = poly._shift
        if (!neededShifts.has(shift)) {
            map.removeLayer(poly)
            nightPolygons.splice(i, 1)
        }
    }

    // 繪製為載入的晨昏線
    for (let shift = startShift; shift <= endShift; shift += earthWidth) {
        if (!terminatorPolylines.some(p => p._shift === shift)) {
            const points = getTerminatorLinePoints(date, shift, map.getZoom())
            const polyline = L.polyline(points, {
                color: '#000000',
                weight: 2,
                opacity: 0.2,
                interactive: false,
                smoothFactor: 1
            }).addTo(map)
            polyline._shift = shift
            terminatorPolylines.push(polyline)

            const nightPoly = drawNightOverlay(map, points, shift)
            nightPolygons.push(nightPoly)
        }
    }
}

// 更新晨昏線資料
export function updateTerminatorLine(map, status, polylines, polygons) {
    // 清除所有晨昏線和黑夜遮罩圖層
    polylines.forEach(polyline => map.removeLayer(polyline))
    polygons.forEach(polygon => map.removeLayer(polygon))
    polylines.length = 0
    polygons.length = 0

    if (status === 'enabled') {
        drawTerminatorLine(map, polylines, polygons)
    }
}