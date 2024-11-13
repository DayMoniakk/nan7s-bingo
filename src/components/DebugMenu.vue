<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue';
import { setSeedOverride, toggleSaving, clearData, refreshBoard } from '@/lib/DebugHandler';

const isActive = ref(false);
const isDebugWindowOpen = ref(false);
const inputOverrideSeed = useTemplateRef<HTMLInputElement>('input-override-seed');

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    isActive.value = urlParams.get('debug') != null;
});

function handleOverrideSeed() {
    if (inputOverrideSeed.value) {
        inputOverrideSeed.value.value = inputOverrideSeed.value.value.trim();
        setSeedOverride(inputOverrideSeed.value.value);
    }
}

</script>

<template>
    <div class="debug-menu-container" v-if="isActive">
        <button class="debug-btn" @click="isDebugWindowOpen = !isDebugWindowOpen">Debug<br>Tools</button>

        <Transition name="scale">
            <div class="debug-window" v-if="isDebugWindowOpen">
                <div class="debug-row">
                    <span>Override Seed</span>
                    <input type="text" placeholder="Leave blank for random" @change="handleOverrideSeed" ref="input-override-seed">
                </div>
                <div class="debug-row">
                    <span>Disable saving</span>
                    <input type="checkbox" @change="toggleSaving">
                </div>
                <div class="debug-row">
                    <button @click="clearData">Clear Data</button>
                </div>
                <div class="debug-row">
                    <button @click="refreshBoard">Refresh Board</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.debug-menu-container {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 16px;
    z-index: 9999;
}

.debug-btn {
    margin: 10px;
    font-size: 16px;
    color: white;
    background-color: #39489e;
    border: 2px solid rgb(26, 26, 26);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s;
    animation: debug-slide 1s;
}
.debug-btn:hover {
    background-color: #223381;
}

@keyframes debug-slide {
    from {
        transform: translateX(-100px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.debug-window {
    position: fixed;
    bottom: 60px;
    left: 10px;
    width: 300px;
    background-color: #39489e;
    border: 2px solid rgb(26, 26, 26);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    min-height: 200px;
}

.scale-enter-active,
.scale-leave-active {
    transition: width 0.25s ease, opacity 0.25s ease;
}

.scale-enter-from,
.scale-leave-to {
    width: 0;
    opacity: 0;
}

.debug-row {
    display: inline-flex;
    width: 100%;
    background-color: #2c3a7c;
    min-height: 50px;
    align-items: center;
    justify-content: space-around;
    border-bottom: 2px solid rgb(26, 26, 26);
}
.debug-row span {
    font-weight: 500;
    color: #8badec;
    padding: 5px;
}
.debug-row input[type="text"] {
    width: 100%;
    height: 21px;
    border: 2px solid rgb(26, 26, 26);
    background-color: rgb(180, 189, 197);
    color: black;
    text-align: center;
    padding: 5px;
    font-size: 16px;
}
.debug-row button {
    border: 2px solid rgb(26, 26, 26);
    background-color: rgb(180, 189, 197);
    color: black;
    text-align: center;
    padding: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.25s;
}
.debug-row button:hover {
    background-color: rgb(153, 166, 223);
}
.debug-row input[type="checkbox"] {
    width: 25px;
    height: 25px;
    border: 2px solid rgb(26, 26, 26);
    background-color: rgb(180, 189, 197);
    color: black;
    text-align: center;
    padding: 5px;
    font-size: 16px;
}
</style>