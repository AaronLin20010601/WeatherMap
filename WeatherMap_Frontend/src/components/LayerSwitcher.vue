<!-- 選擇天氣圖層 -->
<template>
    <div class="absolute top-1/2 left-2 z-[1000] flex flex-col items-center gap-2 bg-white/85 p-2 rounded-md -translate-y-1/2">
        <button
        v-for="layer in layers"
        :key="layer.value"
        :class="[
            'flex flex-col items-center border-none bg-transparent cursor-pointer p-1 transition-transform',
            modelValue === layer.value ? 'border-b-2 border-blue-500 scale-105' : ''
        ]"
        @click="$emit('update:modelValue', layer.value)"
        >
            <img :src="layer.image" :alt="layer.label" class="w-6 h-6" />
            <span class="text-xs">{{ layer.label }}</span>
        </button>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    layers: Array
})
defineEmits(['update:modelValue'])
</script>