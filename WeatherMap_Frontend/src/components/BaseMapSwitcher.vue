<!-- 切換基底地圖 -->
<template>
    <div class="absolute top-20 right-4 z-50">
        <div class="mb-1.5 text-white font-bold text-sm whitespace-nowrap drop-shadow-[0_0_1px_black]">
            {{ t('map') }}
        </div>
        <select
            class="text-black bg-white border border-gray-300 rounded px-2 py-1"
            :value="selectedBaseMap"
            @change="changeMap($event.target.value)"
        >
            <option value="carto">Carto</option>
            <option value="osm">OSM</option>
        </select>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useBaseMapStore } from '@/stores/index.js'

const { t } = useI18n()
const baseMapStore = useBaseMapStore()
const selectedBaseMap = computed(() => baseMapStore.selectedBaseMap)

// 切換基底地圖
function changeMap(newMap) {
    baseMapStore.setBaseMap(newMap)
    localStorage.setItem('baseMap', newMap)
}
</script>