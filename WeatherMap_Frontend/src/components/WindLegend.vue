<template>
    <LegendBar
    title="Wind"
    :colors="[
        { hex: '#D9D4D8', label: 'light' },
        { hex: '#D4C6D4', label: '' },
        { hex: '#C4A8CD', label: '' },
        { hex: '#AB97B1', label: '' },
        { hex: '#8E8292', label: 'strong' }
    ]"
/>
</template>

<script setup>
import LegendBar from './LegendBar.vue';
</script>