<script context="module" lang="ts">
    export interface Payload {
        index: number;
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import WelcomeButton from "./welcomeButton.svelte";
    import { getTranslation } from "$lib/i18n";

    export let onStreamChosen: (payload: Payload) => void;

    const streamTypes: string[] = [
        "ui_category_souls_like", "ui_category_art", "ui_category_horror_games", "ui_category_other_games"
    ];

    let isOpen = true;
    let welcomeText: HTMLElement;
    let selectStreamText: HTMLElement;
    let streamButtons: WelcomeButton[] = new Array(streamTypes.length);
    let aboutNanText: HTMLElement;
    let aboutCredits: HTMLElement;

    onMount(() => {
        document.addEventListener("languageChanged", () => {
            updateLanguage();
        });
    });

    function selectStream(index: number): void {
        onStreamChosen({ index: index });
    }

    function updateLanguage(): void {
        if (!isOpen) return;

        welcomeText.innerHTML = getTranslation("ui_welcome");
        selectStreamText.innerHTML = getTranslation("ui_select_stream");

        for (let i = 0; i < streamButtons.length; i++) {
            streamButtons[i].name = getTranslation(streamTypes[i]);
        }

        aboutNanText.innerHTML = getTranslation("ui_about_nan");
        aboutCredits.innerHTML = getTranslation("ui_about_credits");
    }

    export function setIsOpen(value: boolean): void {
        isOpen = value;
    }
</script>

<div class="container" transition:fly={{ y: -500, duration: 500 }}>
    <h1 bind:this={welcomeText}>
        Welcome to
        <br />
        Everyday Nan7s Bingo!
    </h1>

    <div class="streams-list">
        <h2 bind:this={selectStreamText}>Select a stream:</h2>

        {#each streamTypes as stream, i}
            <WelcomeButton bind:this={streamButtons[i]} name={getTranslation(stream)} index={i} onClicked={(event) => selectStream(event.index)} />
        {/each}
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
            <a class="youtube" href="https://www.youtube.com/channel/UC76T9S4H41LmDayTgDC6_gQ" target="_blank">Youtube</a>
            <a class="twitter" href="https://x.com/ProNan7s" target="_blank">Twitter</a>
            <a class="discord" href="https://discord.gg/xdHRkdyp4W" target="_blank">Discord</a>
        </div>
        <hr />
        <p style="font-size: 16px;" bind:this={aboutCredits}>
            Brought to you by:
            <br />
            <a href="https://www.github.com/DayMoniakk" target="_blank">DayMoniakk</a> (Developer) -
            <a href="https://www.twitch.tv/nan7s_peluche" target="_blank">Nan7s_Peluche</a> &
            <a href="https://www.twitch.tv/gluelle" target="_blank">Gluelle</a> (Art)
            <br />
            <br />
            Highly inspired by <a href="https://bingo.berber.uk/" target="_blank">Everyday Cerber Bingo</a>.
        </p>
    </div>
</div>

<style>
    .container {
        margin: auto;
        width: fit-content;
        animation: fadein 1s;
    }

    h1 {
        color: white;
        font-weight: 400;
        background-color: #456edf;
        width: fit-content;
        width: 480px;
        text-align: center;
        padding: 10px 15px;
        border-radius: 5px;
        margin: 30px 0 10px 0;
    }

    .streams-list {
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 5px;
        padding: 10px 5% 10px 5%;
    }
    .streams-list h2 {
        font-weight: 500;
        text-align: center;
        margin: 20px 5px;
    }

    hr {
        width: 90%;
        margin: auto;
        border-top: 1px solid rgb(219, 219, 219);
        margin: 20px auto 0 auto;
    }

    p a {
        color: #456edf;
        text-decoration: none;
    }

    .about {
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 5px;
        padding: 10px 0 10px 0;
        margin-top: 10px;
        max-width: 510px;
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

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
