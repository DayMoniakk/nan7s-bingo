<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue';
import StreamButton from './StreamButton.vue';
import { getStreamLength, getStreamByIndex, StreamType } from '@/lib/StreamType';
import UserData from '@/lib/UserData';
import { getCurrentEvent, TimeEvent } from '@/lib/TimeEvents';

const isOpen = ref(false);
const emit = defineEmits(['onStreamChoosed', 'onTransitionEnded']);
const isLoadWindowOpen = ref(false);
const additionalCredits = ref(Array<string>());
const welcomeScreenContainer = useTemplateRef<HTMLDivElement>('welcome-screen-container');

let indexToLoad = -1;
let steamToLoad = StreamType.Error;

onMounted(() => {
    isOpen.value = true;

    setTimeout(() => {
        switch (getCurrentEvent()) {
            case TimeEvent.Christmas:
                const credits = Array<string>();
                credits.push("https://pixabay.com/users/kinggodarts-20322799/");
                credits.push("kinggodarts");
                credits.push("(Christmas background)");
                additionalCredits.value = credits;
                welcomeScreenContainer.value?.classList.add("event");
                break;
        }
    }, 100);
});

function onStreamClicked(streamIndex: number) {
    checkForSavedBoard(streamIndex);
}

function checkForSavedBoard(streamIndex: number) {
    const streamType = getStreamByIndex(streamIndex);
    if (UserData.hasSavedBoard(streamType)) {

        const isSaveFileValid = UserData.checkSavedBoardVersion(streamType);
        if (!isSaveFileValid) {
            UserData.clearBoard(streamType);
            console.log("Previous save of this board was created under a different version, deleting it.");
            
            loadBoard(streamIndex, streamType, false);
            return;
        }

        isLoadWindowOpen.value = true;

        indexToLoad = streamIndex;
        steamToLoad = streamType;

        document.addEventListener('keydown', handleLoadConfirmQuickExit);
    }
    else {
        loadBoard(streamIndex, streamType, false);
    }
}

function loadBoard(streamIndex: number, streamType: StreamType, loadSavedBoard: boolean) {
    isOpen.value = false;
    isLoadWindowOpen.value = false;
    emit('onStreamChoosed', streamIndex, streamType, loadSavedBoard);

    setTimeout(() => {
        emit('onTransitionEnded');
    }, 500);
}

function handleContinueClick() {
    loadBoard(indexToLoad, steamToLoad, true);
}

function handleNewBoardClick() {
    loadBoard(indexToLoad, steamToLoad, false);
}

function handleLoadConfirmQuickExit(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        isLoadWindowOpen.value = false;
        document.removeEventListener('keydown', handleLoadConfirmQuickExit);
    }
}
</script>

<template>
    <Transition name="slide">
        <div class="welcome-screen-container" ref="welcome-screen-container" v-if="isOpen">
            <h1>
                Welcome to
                <br>
                Everyday Nan7s Bingo!
            </h1>

            <div class="streams-list">
                <h2>Select a stream:</h2>

                <div v-for="streamType in getStreamLength()" :key="streamType">
                    <StreamButton :streamType="getStreamByIndex(streamType - 1)" :streamIndex="streamType - 1" @streamChoosed="onStreamClicked" />
                </div>
            </div>

            <div class="about">
                <p bind:this={aboutNanText}>
                    <b>Nan</b> (Nan7s_Peluche) is an independent Belgian streamer.
                    <br />
                    She is a clumsy clown who enjoys souls-like games
                    <br />
                    and drawing.
                </p>
                <div class="socials">
                    <a class="twitch" href="https://www.twitch.tv/nan7s_peluche" target="_blank">Twitch</a>
                    <a class="youtube" href="https://www.youtube.com/channel/UC76T9S4H41LmDayTgDC6_gQ"
                        target="_blank">Youtube</a>
                    <a class="twitter" href="https://x.com/ProNan7s" target="_blank">Twitter</a>
                    <a class="discord" href="https://discord.gg/xdHRkdyp4W" target="_blank">Discord</a>
                </div>
                <hr />
                <p style="font-size: 16px;" bind:this={aboutCredits}>
                    Brought to you by:
                    <br />
                    <a href="https://www.github.com/DayMoniakk" target="_blank">DayMoniakk</a> (Developer)
                    <br>
                    <a href="https://www.twitch.tv/nan7s_peluche" target="_blank">Nan7s_Peluche</a> &
                    <a href="https://www.twitch.tv/gluelle" target="_blank">Gluelle</a> (Art)
                    <br>
                    <a href="https://sozaino.site" target="_blank">OKUMONO</a> (Background)
                    <br>
                    <a v-if="additionalCredits.length > 0" :href="additionalCredits[0]" target="_blank">{{ additionalCredits[1] }}</a> {{ additionalCredits[2] }}
                    <br v-if="additionalCredits.length > 0">
                    <br />
                    Highly inspired by <a href="https://github.com/cjmaxik" target="_blank">CJMAXiK's Bingos</a>.
                </p>
            </div>
        </div>
    </Transition>

    <Transition name="fade">
        <div class="load-window" v-if="isLoadWindowOpen">
            <div class="load-window-content">
                <span>Do you wish to continue your previous bingo board?</span>
                <button class="continue" @click="handleContinueClick">Continue</button>
                <button class="new" @click="handleNewBoardClick">New Board (your progress will be lost)</button>
                <button class="close-btn btn" @click="isLoadWindowOpen = false">X</button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.welcome-screen-container {
    position: absolute;
    top: 410px;
    left: 50%;
    transform: translate(-50%, -50%);
    width: fit-content;
    max-width: 100%;
}
.welcome-screen-container.event {
    top: 420px;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translate(-50%, -120vh);
    opacity: 0;
}

h1 {
    color: white;
    font-weight: 400;
    background-color: #39489e;
    width: 480px;
    max-width: 100%;
    text-align: center;
    padding: 10px 15px;
    border-radius: 5px;
    margin: 70px 0 10px 0;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.streams-list {
    display: flex;
    flex-direction: column;
    background-color: #F0F4FF;
    border-radius: 5px;
    padding: 10px 5% 10px 5%;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.streams-list h2 {
    font-weight: 500;
    text-align: center;
    margin: 20px 5px;
}

hr {
    width: 90%;
    margin: auto;
    border: none;
    border-top: 1px solid rgb(196, 201, 207);
    margin: 20px auto 0 auto;
}

p a {
    color: #456edf;
    text-decoration: none;
}

.about {
    display: flex;
    flex-direction: column;
    background-color: #F0F4FF;
    border-radius: 5px;
    padding: 10px 0 10px 0;
    margin-top: 10px;
    max-width: 510px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.about p {
    text-align: center;
    font-size: 18px;
    padding: 0 5px 0 5px;
}

.socials {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    width: 90%;
    margin: auto;
}

.socials a {
    width: 95%;
    color: white;
    border-radius: 4px;
    font-size: 18px;
    text-align: center;
    text-decoration: none;
    padding: 5px;
    transition:
        background-color 0.15s,
        scale 0.15s;
    user-select: none;
}

.socials a:hover {
    scale: 1.02;
}

.socials a.twitch {
    background-color: #6441a5;
}

.socials a.twitch:hover {
    background-color: #5b3f9b;
}

.socials a.youtube {
    background-color: #d31616;
}

.socials a.youtube:hover {
    background-color: #b31212;
}

.socials a.twitter {
    background-color: #1da1f2;
}

.socials a.twitter:hover {
    background-color: #0f8ed6;
}

.socials a.discord {
    background-color: #7289da;
}

.socials a.discord:hover {
    background-color: #6073b8;
}

.load-window {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.671);
    display: flex;
    justify-content: center;
    align-items: center;
}

.load-window-content {
    background-color: #c2cae2;
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    position: relative;
}

.load-window-content span {
    text-align: center;
    font-size: 24px;
    width: 100%;
    display: block;
    margin-bottom: 30px;
}

.load-window-content button {
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0 0 0;
    transition: background-color 0.25s, padding 0.25s;
    cursor: pointer;
    font-size: 16px;
}

.load-window-content button.continue {
    background-color: #456edf;
}

.load-window-content button.continue:hover {
    background-color: #3b5ecb;
    padding: 10px 20px;
}

.load-window-content button.new {
    background-color: #ee291b;
}

.load-window-content button.new:hover {
    background-color: #d01a0e;
    padding: 10px 20px;
}

.load-window-content .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    transition: background-color 0.25s;
    background-color: transparent;
    color: black;
    font-weight: 900;
    font-size: 25px;
    border-radius: 100%;
    padding: 2px 8px;
    margin: 0;
}

.load-window-content .close-btn:hover {
    background-color: #a5afb4;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>