<!-- 數值範圍色條 -->
<template>
    <div class="absolute bottom-10 left-2 z-[1000] w-[360px] select-none flex flex-col items-center">
        <div class="mb-1.5 text-white font-bold text-sm whitespace-nowrap drop-shadow-[0_0_1px_black]">{{ t('legends.' + title) }}</div>
        <div class="relative w-full h-6 rounded border border-white/40" :style="gradientStyle">
            <span
                v-for="(color, index) in colors"
                :key="index"
                class="absolute top-1/2 transform -translate-y-1/2 text-white font-bold text-[13px] whitespace-nowrap pointer-events-none drop-shadow-[0_0_1px_black]"
                :class="{
                    'left-0 translate-x-0': index === 0,
                    'left-full -translate-x-full': index === colors.length - 1,
                    '-translate-x-1/2': index !== 0 && index !== colors.length - 1
                }"
                :style="{ left: `${(index / (colors.length - 1)) * 100}%` }"
            >
                {{
                    (typeof color.label === 'string' && color.label !== '')
                    ? t('legends.' + color.label)
                    : color.label
                }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    colors: {
        type: Array,
        required: true
    }
})

const gradientStyle = computed(() => ({
    background: `linear-gradient(to right, ${props.colors.map((color, i) => {
        const percent = (i / (props.colors.length - 1)) * 100;
        return `${color.hex} ${percent}%`;
    }).join(', ')})`
}))
</script>