<template>
    <LegendBar
    title="Temperature (°C)"
    :colors="[
        { hex: '#D6B8DC', label: -40 },
        { hex: '#D6BFE4', label: -30 },
        { hex: '#C0D5F3', label: -20 },
        { hex: '#9FC8E0', label: -10 },
        { hex: '#B5ECEE', label: 0 },
        { hex: '#D0E4A6', label: 10 },
        { hex: '#F3F8BA', label: 20 },
        { hex: '#FBE8BA', label: 30 },
        { hex: '#FAD5B4', label: 40 }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>