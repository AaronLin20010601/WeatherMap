<template>
    <LegendBar
    title="Snow"
    :colors="[
        { hex: '#DEE0E0', label: 'snow_low' },
        { hex: '#B8BABA', label: '' },
        { hex: '#84888A', label: '' },
        { hex: '#4190F0', label: '' },
        { hex: '#50B952', label: '' },
        { hex: '#A8EDA3', label: '' },
        { hex: '#F2C363', label: '' },
        { hex: '#D84D42', label: '' },
        { hex: '#CC6B6B', label: 'snow_high' }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>