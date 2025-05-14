<template>
    <div class="legend-container">
        <div class="legend-title">{{ title }}</div>
        <div class="gradient-bar" :style="gradientStyle">
            <span
                v-for="(color, index) in colors"
                :key="index"
                class="label"
                :class="{ 'left-edge': index === 0, 'right-edge': index === colors.length - 1 }"
                :style="{ left: `${(index / (colors.length - 1)) * 100}%` }"
            >
                {{ color.label }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

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

<style scoped>
.legend-container {
    position: absolute;
    bottom: 20px;
    left: 10px;
    z-index: 1000;
    width: 360px;
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.legend-title {
    margin-bottom: 6px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    font-weight: bold;
    font-size: 14px;
    color: white;
    text-shadow:
        -1px -1px 1px black,
        1px -1px 1px black,
        -1px  1px 1px black,
        1px  1px 1px black;
    white-space: nowrap;
}

.gradient-bar {
    position: relative;
    width: 100%;
    height: 24px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.4);
}

.label {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Segoe UI', 'Arial', sans-serif;
    font-weight: bold;
    font-size: 13px;
    font-stretch: semi-expanded;
    color: white;
    text-shadow:
        -1px -1px 1px black,
        1px -1px 1px black,
        -1px  1px 1px black,
        1px  1px 1px black;
    pointer-events: none;
    white-space: nowrap;
}

.left-edge {
    transform: translate(0%, -50%);
}
.right-edge {
    transform: translate(-100%, -50%);
}
</style>