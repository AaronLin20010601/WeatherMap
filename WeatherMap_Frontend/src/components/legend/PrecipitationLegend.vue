<template>
    <LegendBar
    title="Precipitation"
    :colors="[
        { hex: '#C5CADA', label: 'precipitation_low' },
        { hex: '#BFC4DA', label: '' },
        { hex: '#A9ADDC', label: '' },
        { hex: '#989BDF', label: 'precipitation_high' }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>