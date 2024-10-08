<script context="module" lang="ts">
    export interface Payload {
        checked: boolean;
    }
</script>

<script lang="ts">
    import "../styles/bingo.css";
    import { createEventDispatcher, onMount } from "svelte";
    import { getRandomPrompt, type Prompt, PromptType } from "$lib/prompts";
    import { getRandomImagePath } from "$lib/middleTileImages";
    import { getTranslation } from "$lib/i18n";

    export let onChecked: (payload: Payload) => void;
    export let isMiddleTile: boolean = false;
    export let categoryName: string = "Error";

    let promptContent: string;
    let buttonRef: HTMLButtonElement;
    let isChecked: boolean = false;
    let easterEggDispatch = createEventDispatcher();
    
    let addedClass = "";
    $: addedStyle = addedClass;
    let isHighlighted: boolean = false;
    $: isHighlightedReactive = isHighlighted;

    onMount(() => {
        if (isMiddleTile) {
            buttonRef.addEventListener("click", handleEasterEgg);
            return;
        }

        const prompt: Prompt = getRandomPrompt();
        promptContent = prompt.content;
        buttonRef.innerHTML = getTranslation(promptContent);

        if (prompt.promptType === PromptType.Generic) {
            addedClass = "prompt-generic";
        } 
        else if (prompt.promptType === PromptType.Error) {
            addedClass = "prompt-error";
        }

        document.addEventListener("languageChanged", () => {
            buttonRef.innerHTML =  getTranslation(promptContent);
        });
    });

    function handleClick(): void {
        if (isMiddleTile) return;

        isChecked = !isChecked;
        onChecked({ checked: isChecked });
    }

    export function highlight(): void {
        isHighlighted = true;
    }

    export function unhighlight(): void {
        isHighlighted = false;
    }

    let last7Calls: number[] = [];
    function handleEasterEgg(): void {
        const now = performance.now();
        last7Calls.push(now);

        if (last7Calls.length > 7) {
            last7Calls.shift();
        }

        if (last7Calls.length === 7 && last7Calls[6] - last7Calls[0] < 3000) {
            last7Calls = [];
            easterEggDispatch("easterEggTriggered", {});
        }
    }
</script>

{#if isMiddleTile}
    <div class="button-container">
        <button bind:this={buttonRef} class={"bingo-btn " + (isHighlightedReactive ? "middle-tile-highlighted" : "middle-tile")}><img src={getRandomImagePath()} alt="middle tile artwork" draggable="false" /></button>
        <span>{categoryName}</span>
    </div>
{:else}
    <button bind:this={buttonRef} on:click={handleClick} class={ "bingo-btn " + (isChecked ? "checked " : "") + addedStyle + (isHighlightedReactive ? " highlighted" : "")}></button>
{/if}

<style>
    .button-container{
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
</style>
