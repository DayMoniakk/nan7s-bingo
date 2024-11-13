<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';
import type { TileHighlightChangedEvent } from "@/lib/events/TileHighlightChangedEvent";
import { addTypedEventListener, removeTypedEventListener } from '@/lib/Utilities';
import { getRandomPrompt, PromptType, type Prompt } from '@/lib/prompts/PromptsManager';
import { getMiddleTileImage } from '@/lib/prompts/PromptMiddleTile';
import type { StreamType } from '@/lib/StreamType';
import type { TilesLoadedEvent } from '@/lib/events/TilesLoaded';

const props = defineProps<{
    isMiddleTile?: boolean,
    streamType?: string,
    tileIndex: number
}>();

const emit = defineEmits(['onTileChecked']);
const isChecked = ref(false);
const isHighlighted = ref(false);
const promptContent = ref('');
const promptClass = ref('');
const middleTile = useTemplateRef<HTMLImageElement>('middle-tile');

onMounted(() => {
    addTypedEventListener<TileHighlightChangedEvent>('onTileHighlightChanged', handleOnTileHighlightChanged);

    if (props.isMiddleTile) {
        isChecked.value = true

        if (middleTile.value) {
            middleTile.value.src = getMiddleTileImage(props.streamType as StreamType);
        }
    }
    else {
        fillPrompt();

        addTypedEventListener<TilesLoadedEvent>('onTilesLoaded', handleOnTilesLoaded);
        document.addEventListener('DEBUG_onRefreshBoard', handleDebugOnRefreshBoard);
    }
});

onUnmounted(() => {
    removeTypedEventListener<TileHighlightChangedEvent>('onTileHighlightChanged', handleOnTileHighlightChanged);
    
    if (props.isMiddleTile) {
        removeTypedEventListener<TilesLoadedEvent>('onTilesLoaded', handleOnTilesLoaded);
        document.removeEventListener('DEBUG_onRefreshBoard', handleDebugOnRefreshBoard);
    }
});

function handleDebugOnRefreshBoard() { 
    fillPrompt();
    isChecked.value = false;
}

function fillPrompt() { 
    const prompt: Prompt = getRandomPrompt();
    promptContent.value = prompt.content;

    if (prompt.promptType === PromptType.Generic) {
        promptClass.value = "prompt-generic";
    }
    else if (prompt.promptType === PromptType.Error) {
        promptClass.value = "prompt-error";
    }
    else {
        promptClass.value = "";
    }
}

function handleOnTileHighlightChanged(event: CustomEvent) {
    if (event.detail.index !== props.tileIndex) return;

    isHighlighted.value = event.detail.value;
}

function handleOnTilesLoaded(event: CustomEvent) {
    if (event.detail.index !== props.tileIndex) return;

    isChecked.value = event.detail.value;
}

function handleClick() {
    if (props.isMiddleTile) return;

    isChecked.value = !isChecked.value
    emit('onTileChecked', isChecked.value)
}
</script>

<template>
    <div class="button-container" v-if="isMiddleTile">
        <button :class="['bingo-btn', 'middle-tile', isHighlighted ? 'highlighted' : '']">
            <img src="/nans7.png" alt="Middle tile artwork" draggable="false" ref="middle-tile">
            <span>{{ streamType }}</span>
        </button>
    </div>
    <button :class="['bingo-btn', promptClass, isChecked ? 'checked' : '', isHighlighted ? 'highlighted' : '']" v-else
        @click="handleClick()">{{ promptContent }}</button>
</template>

<style scoped>
.button-container {
    position: relative;
}

.button-container span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background-color: #243a7781;
    color: white;
    padding: 2px 0;
    word-wrap: break-word;
    user-select: none;
    pointer-events: none;
}

.bingo-btn {
    width: 185px;
    height: 130px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    border: 4px solid transparent;
    font-size: 20px;
    padding: 2px;
    user-select: none;
    transition: background-color 0.5s, border 0.3s;
}

.bingo-btn.prompt-error {
    background-color: red;
    border: 4px solid #a51c1c;
}

.bingo-btn.prompt-generic {
    background-color: rgb(202, 202, 202);
    border: 4px solid #b9b9b9;
}

.bingo-btn.checked {
    background-color: #60a5fa;
    border: 4px solid #4b83c7;
}

.bingo-btn.highlighted {
    background-color: #38A169;
    border: 4px solid #31915e;
}

.middle-tile {
    background: linear-gradient(to top, rgb(30, 59, 138), rgb(89, 124, 221));
    background-color: rgb(89, 124, 221);
    border: none;
    cursor: default;
    overflow: hidden;
    transition: background-color 0.25s;
}

.middle-tile.highlighted {
    background: none;
    background-color: #38A169;
    border: none;
    cursor: default;
    overflow: hidden;
    transition: background-color 0.25s;
}

.middle-tile img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    transition: scale 0.25s;
}

.middle-tile img:hover {
    scale: 1.5;
}
</style>