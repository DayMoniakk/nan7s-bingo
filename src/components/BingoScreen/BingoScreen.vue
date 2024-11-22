<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue';
import BingoTile from './BingoTile.vue';
import type { TileHighlightChangedEvent } from '@/lib/events/TileHighlightChangedEvent';
import { playVictoryEffects } from '@/lib/VictoryEffects';
import { preparePrompts, getCurrentSeed } from '@/lib/prompts/PromptsManager';
import UserData from '@/lib/UserData';
import type { StreamType } from '@/lib/StreamType';
import type { TilesLoadedEvent } from '@/lib/events/TilesLoaded';
import { version } from '@/lib/BingoVersion';

const props = defineProps<{
    streamIndex?: number,
    streamType?: StreamType,
    loadSavedBoard?: boolean
}>();

const GRID_SIZE: number = 5;
const bingoTilesValues: boolean[] = new Array(25).fill(false);

let isVisible = false;
let alreadyWon = false;

onMounted(() => {
    bingoTilesValues[12] = true;

    window.addEventListener('beforeunload', saveOnUnload);
    document.addEventListener('DEBUG_onRefreshBoard', handleDebugOnRefreshBoard);
});

onBeforeUnmount(() => {
    saveOnUnload();
    window.removeEventListener('beforeunload', saveOnUnload);
    document.removeEventListener('DEBUG_onRefreshBoard', handleDebugOnRefreshBoard);
});

watch(() => props.streamIndex, () => {
    if (isVisible) return;

    isVisible = true;
    startBoard();
});

function handleDebugOnRefreshBoard() {
    if (!isVisible) {
        alert("You have to select a stream before refreshing the board.");
        return;
    }

    startBoard(true);
    bingoTilesValues.forEach((_value: boolean, index: number) => {
        bingoTilesValues[index] = false;
        tileSetHighlight(index, false);
    })
}

function startBoard(bypassSavedData = false) {
    if (!props.loadSavedBoard) {
        
        const seed = preparePrompts(props.streamIndex!);
        console.log(`Seed: ${seed}`);
        document.dispatchEvent(new Event('DEBUG_OnBoardStarted'));
        return;
    }

    const savedData = UserData.loadBoard(props.streamType!); 

    if (savedData && !bypassSavedData) {
        for (let i = 0; i < savedData.tilesState.length; i++) {
            bingoTilesValues[i] = savedData.tilesState[i];
        }

        const seed = savedData.seed;
        preparePrompts(props.streamIndex!, seed);
        console.log(`Loaded seed: ${seed}`);

        setTimeout(() => {
            loadTiles();
            refreshTiles();
        }, 100);
    }
    else {
        const seed = preparePrompts(props.streamIndex!);
        console.log(`Seed: ${seed}`);
    }

    document.dispatchEvent(new Event('DEBUG_OnBoardStarted'));
}

function handleTilesChecked(index: number, value: boolean) {
    bingoTilesValues[index] = value;

    refreshTiles();

    UserData.saveBoard({
        streamType: props.streamType!,
        tilesState: bingoTilesValues,
        seed: getCurrentSeed(),
        bingoVersion: version
    });
}

function refreshTiles() {
    if (!checkVictory()) {
        unhighlightAll();
        alreadyWon = false;
    }
    else {
        if (!alreadyWon) {
            alreadyWon = true;
            playVictoryEffects();
        }
    }
}

function tileSetHighlight(index: number, value: boolean) {
    const event = new CustomEvent<TileHighlightChangedEvent>('onTileHighlightChanged', {
        detail: { index, value }
    });

    document.dispatchEvent(event);
}

function loadTiles() {
    for (let i = 0; i < bingoTilesValues.length; i++) {
        const event = new CustomEvent<TilesLoadedEvent>('onTilesLoaded', {
            detail: { index: i, value: bingoTilesValues[i] }
        });

        document.dispatchEvent(event);
    }
}

function saveOnUnload() {
    UserData.saveBoard({
        streamType: props.streamType!,
        tilesState: bingoTilesValues,
        seed: getCurrentSeed(),
        bingoVersion: version
    }, true);  // Bypass debounce to save immediately
}

function checkVictory(): boolean {
    return checkRows() || checkColumns() || checkDiagonals();
}

//#region Check Victory
function checkRows(): boolean {
    for (let row = 0; row < GRID_SIZE; row++) {
        let rowComplete = true;
        for (let col = 0; col < GRID_SIZE; col++) {
            if (!bingoTilesValues[row * GRID_SIZE + col]) {
                rowComplete = false;
                break;
            }
        }
        if (rowComplete) {
            highlightRow(row);
            return true;
        }
    }
    return false;
}

function checkColumns(): boolean {
    for (let col = 0; col < GRID_SIZE; col++) {
        let columnComplete = true;
        for (let row = 0; row < GRID_SIZE; row++) {
            if (!bingoTilesValues[row * GRID_SIZE + col]) {
                columnComplete = false;
                break;
            }
        }
        if (columnComplete) {
            highlightColumn(col);
            return true;
        }
    }
    return false;
}

function checkDiagonals(): boolean {
    // Diagonal from left to right (indexes: 0, 6, 12, 18, 24)
    let diagonal1Complete = true;
    for (let i = 0; i < GRID_SIZE; i++) {
        if (!bingoTilesValues[i * GRID_SIZE + i]) {
            diagonal1Complete = false;
            break;
        }
    }
    if (diagonal1Complete) {
        highlightDiagonal1();
        return true;
    }

    // Diagonal from right to left (indexes: 4, 8, 12, 16, 20)
    let diagonal2Complete = true;
    for (let i = 0; i < GRID_SIZE; i++) {
        if (!bingoTilesValues[i * GRID_SIZE + (GRID_SIZE - i - 1)]) {
            diagonal2Complete = false;
            break;
        }
    }
    if (diagonal2Complete) {
        highlightDiagonal2();
        return true;
    }

    return false;
}

// Highlight line buttons
function highlightRow(row: number) {
    for (let col = 0; col < GRID_SIZE; col++) {
        tileSetHighlight(row * GRID_SIZE + col, true);
    }
}

// Unhighlight buttons in a specific row
function unhighlightRow(row: number) {
    for (let col = 0; col < GRID_SIZE; col++) {
        tileSetHighlight(row * GRID_SIZE + col, false);
    }
}

// Highlight column buttons
function highlightColumn(col: number) {
    for (let row = 0; row < GRID_SIZE; row++) {
        tileSetHighlight(row * GRID_SIZE + col, true);
    }
}

// Unhighlight buttons in a specific column
function unhighlightColumn(col: number) {
    for (let row = 0; row < GRID_SIZE; row++) {
        tileSetHighlight(row * GRID_SIZE + col, false);
    }
}

// Highlight left-right diagonal buttons
function highlightDiagonal1() {
    for (let i = 0; i < GRID_SIZE; i++) {
        tileSetHighlight(i * GRID_SIZE + i, true);
    }
}

// Unhighlight buttons in the left-right diagonal
function unhighlightDiagonal1() {
    for (let i = 0; i < GRID_SIZE; i++) {
        tileSetHighlight(i * GRID_SIZE + i, false);
    }
}

// Highlight the left-right diagonal buttons
function highlightDiagonal2() {
    for (let i = 0; i < GRID_SIZE; i++) {
        tileSetHighlight(i * GRID_SIZE + (GRID_SIZE - i - 1), true);
    }
}

// Unhighlight buttons in the right-left diagonal
function unhighlightDiagonal2() {
    for (let i = 0; i < GRID_SIZE; i++) {
        tileSetHighlight(i * GRID_SIZE + (GRID_SIZE - i - 1), false);
    }
}

// Unhighlight all buttons when no victory is detected
function unhighlightAll() {
    for (let row = 0; row < GRID_SIZE; row++) {
        unhighlightRow(row);
    }
    for (let col = 0; col < GRID_SIZE; col++) {
        unhighlightColumn(col);
    }
    unhighlightDiagonal1();
    unhighlightDiagonal2();
}
//#endregion
</script>

<template>
    <div class="bingo-container" v-if="isVisible">
        <div class="bingo-grid">
            <BingoTile v-for="tile in 25" :key="tile"
            :isMiddleTile="tile - 1 === 12" 
            :streamType="props.streamType"
            :tileIndex="tile - 1"
            @onTileChecked="(value: boolean) => handleTilesChecked(tile - 1, value)" />
        </div>
        <span>
            The gray tiles are general actions that are not related to the current category.
            <br>
            If a tile is impossible to complete, consider it as free.
        </span>
    </div>
</template>

<style scoped>
@keyframes slide {
    from {
        transform: translateY(200vh);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.bingo-container {
    width: 100%;
    animation: slide 0.5s ease;
}

.bingo-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    width: fit-content;
    gap: 3px;
    margin: 20px auto;
}
span {
        color: rgba(153, 153, 153, 0.815);
        display: block;
        text-align: center;
        margin-top: 5px;
        width: fit-content;
        margin: auto;
        padding: 5px 10px;
        border-radius: 5px;
    }
</style>