<!-- 開關晨昏線 -->
<template>
    <div class="absolute top-36 right-4 z-50">
        <div class="mb-1.5 text-white font-bold text-sm whitespace-nowrap drop-shadow-[0_0_1px_black]">
            {{ t('terminator.night_boundary') }}
        </div>
        <select
            class="text-black bg-white/85 border border-gray-300 rounded px-2 py-1"
            :value="isShowTerminator"
            @change="changeTerminator($event.target.value)"    
        >
            <option value="enabled">{{ t('terminator.enabled') }}</option>
            <option value="disabled">{{ t('terminator.disabled') }}</option>
        </select>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useTerminatorStore } from '@/stores/index.js'

const { t } = useI18n()
const terminatorStore = useTerminatorStore()
const isShowTerminator = computed(() => terminatorStore.isShowTerminator)

// 開關晨昏線
function changeTerminator(status) {
    terminatorStore.setShowTerminator(status)
    localStorage.setItem('terminator', status)
}
</script>