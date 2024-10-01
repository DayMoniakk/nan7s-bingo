<script lang="ts">
    import { getTranslation } from '$lib/i18n';
    import { setNextLanguage, getCurrentLanguage } from '$lib/userData';
    import { onMount } from 'svelte';
    import { scale, fade, fly } from 'svelte/transition';

    let helpWindowOpen: boolean = false;
    let currentLanguage: string = 'en';
    let helpText: HTMLParagraphElement;

    function returnHome(): void {
        window.location.href = "/";
    }

    function toggleHelpWindow(): void {
        helpWindowOpen = !helpWindowOpen;
        if (helpWindowOpen) {
            setTimeout(() => {
                helpText.innerHTML = getTranslation("ui_help");
            }, 200);
        }
    }

    onMount (() => {
        document.addEventListener("languageChanged", () => {
            currentLanguage = getCurrentLanguage();
        })
    });

    function changeLanguage(): void {
        setNextLanguage();
    }
</script>

<nav transition:fly={{ y: -50, duration: 500 }}>
    <div class="title" on:click={returnHome} on:keypress={returnHome} tabindex="-1" role="button" title="Return to main page">
        <img src="NanClown.webp" alt="Nan7s with a clown wig">
        <h1>Everyday <b>Nan7s</b> Bingo</h1>
    </div>
    <button class="help-btn" on:click={toggleHelpWindow}></button>

    <button on:click={changeLanguage} class="language-select"><img src={"flag_" + currentLanguage +".svg"} alt="language flag icon" /></button>
</nav>

{#if helpWindowOpen}
    <div class="help-window" on:click={toggleHelpWindow} on:keypress={toggleHelpWindow} tabindex="-1" role="button" transition:fade>
        <div class="window" transition:scale>
            <h2>Everyday Nan7s Bingo</h2>
            <button>X</button> <!-- It's funny cuz this button is fake, idk why the transition prevent the button to be clicked on, another Svelte weirdness I guess -->
            <p bind:this={helpText}>
                Examine the board before the stream. 
                <br>
                It has 25 randomly generated prompts
                that we expect <b>Nan</b> to say, do, or mention.
                <br>
                <br>
                Once she do, click on the appropriate prompt to mark it out.
                <br>
                <b>Bingo</b> is complete when all prompts in the vertical, horizontal or diagonal row are marked out.
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
{/if}

<style>
    nav {
        background-color: #385bbb;
        width: 100vw;
        height: 50px;
        user-select: none;
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
        color: #4FD1C5;
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

    .help-window {
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

    .window {
        background-color: white;
        max-width: 90vw;
        width: 600px;
        padding: 10px;
        font-size: 20px;
        position: relative;
        border-radius: 5px;
    }

    .window h2 {
        text-align: center;
        font-weight: 400;
        padding-bottom: 20px;
    }
    .window b {
        font-weight: 600;
        color: #3bb9ad;
    }
    .window button {
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
    .window button:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .language-select {
        position: absolute;
        top: 7px;
        right: 60px;
        border: none;
        cursor: pointer;
        padding: 0;
        background-color: transparent;
        border-radius: 50%;
        height: 35px;
        width: 35px;
        transition: scale 0.15s;
    }
    .language-select img {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border-radius: 100%;
        object-fit: cover;
    }
    .language-select:hover {
        scale: 1.05;
    }
</style>