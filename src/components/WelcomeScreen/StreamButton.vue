<script setup lang="ts">
import type { StreamType } from '@/lib/StreamType';

defineProps<{
    streamType?: StreamType
    streamIndex?: number
}>();
</script>

<template>
    <button @click="$emit('streamChoosed', streamIndex)">{{ streamType }}</button>
</template>

<style scoped>
    button {
        width: 100%;
        text-align: center;
        cursor: pointer;
        border: none;
        border-top: 1px solid rgb(196, 201, 207);;
        padding: 5px;
        transition: background-color 0.3s;
        font-size: 20px;
        background-color: transparent;
    }
    button:hover {
        background-color: rgb(153, 166, 223);
    }
</style>