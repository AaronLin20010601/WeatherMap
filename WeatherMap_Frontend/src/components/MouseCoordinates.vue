<!-- 經緯度顯示 -->
<template>
    <div
        v-if="lat !== null && lng !== null"
        class="absolute bottom-2 left-2 px-3 py-1.5 text-white font-bold text-sm whitespace-nowrap drop-shadow-[0_0_1px_black] pointer-events-none z-[1000]"
    >
        {{ t('coordinates.lat') }}: {{ formattedLatitude }}, {{ t('coordinates.lng') }}: {{ formattedLongitude }}
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    lat: Number,
    lng: Number
})

// 取得緯度
const formattedLatitude = computed(() => {
    if (props.lat === null || props.lat === undefined) return '---'
    const dir = props.lat >= 0 ? 'N' : 'S'
    return `${Math.abs(props.lat).toFixed(4)}° ${dir}`
})

//取得經度
const formattedLongitude = computed(() => {
    if (props.lng === null || props.lng === undefined) return '---'
    let lng = ((props.lng + 180) % 360 + 360) % 360 - 180
    const dir = lng >= 0 ? 'E' : 'W'
    return `${Math.abs(lng).toFixed(4)}° ${dir}`
})
</script>