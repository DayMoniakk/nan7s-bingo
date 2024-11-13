<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const helpWindowOpen = ref(false);
const helpWindowInner = ref(false);

onMounted(() => {
    document.addEventListener('keydown', handleQuickHelpExit);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleQuickHelpExit);
});

function handleQuickHelpExit(event: KeyboardEvent) {
    if (!helpWindowOpen.value) return;

    if (event.key === 'Escape') {
        setHelpWindowOpen(false)
    }
}

function setHelpWindowOpen(state: boolean) {
    helpWindowInner.value = true

    if (state) {
        helpWindowOpen.value = true
    }
    else
    {   
        helpWindowInner.value = false
        setTimeout(() => {
            helpWindowOpen.value = false
        }, 100)
    }
}

function goToHome() {
    window.location.href = '/'
}
</script>

<template>
    <nav>
        <div class="title" @click="goToHome()">
            <img src="/NanClown.webp" alt="">
            <h1>Everyday <b>Nan7s</b> Bingo</h1>
        </div>
        <button class="help-btn" @click="setHelpWindowOpen(true)"></button>
    </nav>

    <Transition name="fade">
        <div class="help-window-container" v-if="helpWindowOpen">
            <div :class="['help-window', helpWindowInner ? 'scale-in' : 'scale-out']">
                <h2>Everyday Nan7s Bingo</h2>
                <button class="close-btn" @click="setHelpWindowOpen(false)">X</button>
                <p>
                    Examine the board before the stream.
                    <br>
                    It has 25 randomly generated prompts
                    that we expect <b>Nan</b> to say, do, or mention.
                    <br>
                    <br>
                    Once she do, click on the appropriate prompt to mark it out.
                    <br>
                    <b>Bingo</b> is complete when all prompts in the vertical, horizontal or diagonal row are marked
                    out.
                    <br>
                    The center is free by the way.
                    <br>
                    <br>
                    You don't win anything by playing this Bingo, it's just for fun.
                    <br>
                    Your board is randomly generated specifically for you.
                    <br>
                    If you are not sure if the prompt needs to
                    be marked out, ask your fellow viewers.
                </p>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
nav {
    background-color: #323f86;
    width: 100%;
    height: 50px;
    user-select: none;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
}

.title {
    width: 500px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    margin-left: 5px;
    gap: 10px;
    cursor: pointer;
}

.title h1 {
    color: white;
    margin: 0;
    font-weight: 400;
    width: fit-content;
}

.title b {
    font-weight: 600;
    color: #489ff0;
}

.title img {
    width: 30px;
    border-radius: 50%;
}

.help-btn {
    position: absolute;
    right: 10px;
    top: 5px;
    background-image: url("/question-circle.svg");
    width: 40px;
    height: 40px;
    border: none;
    background-color: transparent;
    filter: invert();
    cursor: pointer;
    transition: filter 0.15s, scale 0.15s;
}

.help-btn:hover {
    filter: invert(0.9);
    scale: 1.05;
}

.help-window-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.568);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
}

.help-window {
    background-color: #F0F4FF;
    max-width: 90vw;
    width: 600px;
    padding: 10px;
    font-size: 20px;
    position: relative;
    border-radius: 5px;
}

.help-window h2 {
    text-align: center;
    font-weight: 400;
    padding-bottom: 20px;
}

.help-window b {
    font-weight: 600;
    color: #3d94f7;
}

.help-window button {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 40px;
    height: 40px;
    border: none;
    cursor: pointer;
    font-weight: 900;
    font-size: 30px;
    border-radius: 50%;
    background-color: transparent;
    transition: background-color 0.15s;
}

.help-window button:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
}

@keyframes scaleOut {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(0);
    }
}

.help-window.scale-in {
    animation: scaleIn 0.5s ease forwards;
}

.help-window.scale-out {
    animation: scaleOut 0.3s ease forwards;
}
</style>
