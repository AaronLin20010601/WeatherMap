<template>
    <LegendBar
    title="Rain"
    :colors="[
        { hex: '#DEE0E0', label: 'rain_low' },
        { hex: '#B8BABA', label: '' },
        { hex: '#84888A', label: '' },
        { hex: '#4190F0', label: '' },
        { hex: '#50B952', label: '' },
        { hex: '#A8EDA3', label: '' },
        { hex: '#F2C363', label: '' },
        { hex: '#D84D42', label: '' },
        { hex: '#CC6B6B', label: 'rain_high' }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>