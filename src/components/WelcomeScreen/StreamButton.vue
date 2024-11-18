<script setup lang="ts">
import type { StreamType } from '@/lib/StreamType';

defineProps<{
    streamType?: StreamType
    streamIndex?: number
    isNewCategory?: boolean
}>();
</script>

<template>
    <button @click="$emit('streamChoosed', streamIndex)">
        {{ streamType }}
        <span v-if="isNewCategory">NEW</span>
    </button>
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
        position: relative;
    }
    button:hover {
        background-color: rgb(153, 166, 223);
    }

    span {
        font-size: 9px;
        position: absolute;
        background-color: rgb(224, 18, 18);
        border-radius: 10px;
        color: white;
        padding: 2px 4px;
        top: 2px;
        margin-left: 3px;
    }
</style>