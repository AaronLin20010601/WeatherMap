<template>
    <LegendBar
    title="Precipitation"
    :colors="[
        { hex: '#C5CADA', label: 'light' },
        { hex: '#BFC4DA', label: '' },
        { hex: '#A9ADDC', label: '' },
        { hex: '#989BDF', label: 'heavy' }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>