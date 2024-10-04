<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Bingo from "../components/bingo.svelte";
    import MobileWarning from "../components/mobileWarning.svelte";
    import Navbar from "../components/navbar.svelte";
    import Welcome, { type Payload } from "../components/welcome.svelte";
    import "../styles/bingo.css";
    import { loadCSV } from '$lib/i18n';
    import { loadLanguages } from "$lib/userData";

    let welcome: Welcome;
    let isLoadingTranslations: boolean = true;
    let bingoContainer: HTMLDivElement;
    let bingo: Bingo;
    let welcomeScreenVisible: boolean = false;

    function handleOnStreamChosen(event: Payload): void {
        bingo.open(event.index, event.key);
        welcomeScreenVisible = false;
        welcome.setIsOpen(false);
        bingoContainer.classList.add("transition"); // prevents the scrollbar to appear while the transition is playing
    }

    onMount(async () => {
        await loadCSV();
        isLoadingTranslations = false;
        
        welcomeScreenVisible = true;
        await new Promise((resolve) => setTimeout(resolve, 100));
        loadLanguages();
    })

    function handleTransitionEnd(): void { // allows the scrollbar to appear again after the transition is finished
        bingoContainer.classList.remove("transition");
        bingoContainer.classList.add("ready");
    }
</script>

<svelte:head>
    <title>Nan7s Bingo</title>
</svelte:head>


{#if isLoadingTranslations}
    <div class="loading" transition:fade={{duration: 500}}>
        <img src="preloader.gif" alt="">
    </div>
{/if}

<Navbar />

{#if welcomeScreenVisible}
    <Welcome bind:this={welcome} onStreamChosen={handleOnStreamChosen} />
{/if}

<div bind:this={bingoContainer} class="bingo-container">
    <Bingo bind:this={bingo} on:transitionEnd={handleTransitionEnd} />
</div>

<MobileWarning />

<style>
    @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap");

    :global(*) {
        font-family: "Fredoka", sans-serif;
    }

    :global(body) {
        background: linear-gradient(to bottom, #1e2a38, #2a2a6b);
        margin: 0;
        box-sizing: border-box;
        min-height: 100vh;
    }

    .loading {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(3, 3, 3, 0.644);
    }
</style>
