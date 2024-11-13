<script setup lang="ts">
import { ref } from 'vue';

import NavBar from './components/NavBar.vue';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen.vue';
import BingoScreen from './components/BingoScreen/BingoScreen.vue';
import { StreamType } from './lib/StreamType';
import DebugMenu from './components/DebugMenu.vue';

const currentStreamIndex = ref(-1);
const currentStreamType = ref(StreamType.Error);
const currentLoadSavedBoard = ref(false);
const mainStyleClass = ref('');

function handleOnStreamChoosed(streamIndex: number, streamType: StreamType, loadSavedBoard: boolean): void {
  currentStreamIndex.value = streamIndex;
  currentStreamType.value = streamType;
  currentLoadSavedBoard.value = loadSavedBoard;

  mainStyleClass.value = 'transition-start';
}

function handleOnTransitionEnded() {
  mainStyleClass.value = '';
}

//#region Easter egg
const styling = `
    color:white;
    background-color: black;
    border: 1px solid red;
    padding: 8px;
    font-weight: 600;
    font-family: Courier;
    font-size: 16px;
`;

console.log(`%c 👀 You shouldn't be here. 👀`, `${styling}`);
//#endregion
</script>

<template>
  <main :class="mainStyleClass">
    <NavBar />
    <WelcomeScreen @onStreamChoosed="handleOnStreamChoosed" @onTransitionEnded="handleOnTransitionEnded" />
    <BingoScreen :streamIndex="currentStreamIndex" :streamType="currentStreamType" :loadSavedBoard="currentLoadSavedBoard" />
  </main>

  <DebugMenu />
</template>

<style scoped>
main.transition-start {
  overflow-y: hidden;
  height: 100vh;
}
main {
  overflow-y: initial;
}
</style>
