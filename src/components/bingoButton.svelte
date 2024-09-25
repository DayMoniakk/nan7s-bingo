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

    let promptContent: string;
    let buttonRef: HTMLButtonElement;
    let isChecked: boolean = false;
    let easterEggDispatch = createEventDispatcher();
    
    let addedClass = "";
    $: addedStyle = addedClass;

    onMount(() => {
        if (isMiddleTile) {
            buttonRef.addEventListener("click", handleEasterEgg);
            return;
        }

        const prompt: Prompt = getRandomPrompt();
        promptContent = prompt.content;
        buttonRef.innerHTML = getTranslation(promptContent);

        if (prompt.promptType === PromptType.Generic) {
            buttonRef.classList.add("prompt-generic");
            addedClass = "prompt-generic";
        } 
        else if (prompt.promptType === PromptType.Error) {
            buttonRef.classList.add("prompt-error");
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
        buttonRef.classList.add("highlighted");
    }

    export function unhighlight(): void {
        buttonRef.classList.remove("highlighted");
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
    <button bind:this={buttonRef} class="bingo-btn middle-tile"><img src={getRandomImagePath()} alt="middle tile artwork" draggable="false" /></button>
{:else}
    <button bind:this={buttonRef} on:click={handleClick} class={isChecked ? "bingo-btn checked" : "bingo-btn " + addedStyle}></button>
{/if}

<style>
    .bingo-btn.checked {
        background-color: #60a5fa;
        border: 4px solid #4b83c7;
    }
</style>
