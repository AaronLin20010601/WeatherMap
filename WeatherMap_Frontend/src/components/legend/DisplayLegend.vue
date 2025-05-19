<!-- 提示範圍色條 -->
<template>
    <component :is="getLegendComponent" v-if="getLegendComponent" />
</template>

<script setup>
import { computed } from 'vue'
import { useWeatherLayerStore } from '@/stores'

import PrecipitationLegend from '../legend/PrecipitationLegend.vue'
import TemperatureLegend from '../legend/TemperatureLegend.vue'
import WindLegend from '../legend/WindLegend.vue'
import PressureLegend from '../legend/PressureLegend.vue'
import SnowLegend from '../legend/SnowLegend.vue'
import RainLegend from '../legend/RainLegend.vue'

const weatherLayerStore = useWeatherLayerStore()

// 圖層與圖例對應
const legendMap = {
    'precipitation_new': PrecipitationLegend,
    'temp_new': TemperatureLegend,
    'wind_new': WindLegend,
    'pressure_new': PressureLegend,
    'snow': SnowLegend,
    'rain': RainLegend
}

// 根據 layer 決定要顯示哪一個圖例
const getLegendComponent = computed(() => {
    return legendMap[weatherLayerStore.selectedLayer] || null
})
</script>