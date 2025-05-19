<template>
    <LegendBar
    title="Pressure"
    :colors="[
        { hex: '#7FC1EA', label: 970 },
        { hex: '#A1D7D8', label: 985 },
        { hex: '#BBE1C4', label: 1000 },
        { hex: '#CEDD8C', label: 1015 },
        { hex: '#E1B888', label: 1030 }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>