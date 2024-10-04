<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import BingoButton, { type Payload } from "./bingoButton.svelte";
    import { preparePrompts } from "$lib/prompts";
    import { playVictoryEffects, playEasterEggEffects } from "$lib/victoryEffects";
    import { createEventDispatcher } from "svelte";
    import { getTranslation } from "$lib/i18n";

    const GRID_SIZE: number = 5;

    const dispatch = createEventDispatcher();
    let isOpen: boolean = false;
    let streamIndex: number = -1;
    let streamKey: string = "ERROR";
    let categoryName: string;
    let alreadyWon: boolean = false;

    let bingoButtons: BingoButton[] = new Array(25);
    let bingoButtonsValues: boolean[] = new Array(25).fill(false);
    let hintTextContent: string;

    export function open(_streamIndex: number, _key: string): void {
        isOpen = true;
        streamIndex = _streamIndex;
        streamKey = _key;
        const generationSeed = preparePrompts(streamIndex);
        console.log(`Seed: ${generationSeed}`);
        
        window.onbeforeunload = function (): boolean {
            return true;
        };

        bingoButtonsValues[12] = true;

        hintTextContent = getTranslation("ui_hint_gray_tiles");
        categoryName = getTranslation(streamKey);

        document.addEventListener("languageChanged", () => {
            hintTextContent = getTranslation("ui_hint_gray_tiles");
            categoryName = getTranslation(streamKey);
        });
    }

    function handleButtonsClick(buttonIndex: number, event: Payload): void {
        bingoButtonsValues[buttonIndex] = event.checked;
        if (!checkVictory()) {
            unhighlightAll();
            alreadyWon = false;
        } else {
            if (!alreadyWon) {
                alreadyWon = true;
                playVictoryEffects();
            }
        }
    }

    function handleEasterEgg(): void {
        playEasterEggEffects();
    }

    function handleTransitionEnd(): void {
        dispatch("transitionEnd", {});
    }

    //#region Check victory

    function checkVictory(): boolean {
        return checkRows() || checkColumns() || checkDiagonals();
    }

    function checkRows(): boolean {
        for (let row = 0; row < GRID_SIZE; row++) {
            let rowComplete = true;
            for (let col = 0; col < GRID_SIZE; col++) {
                if (!bingoButtonsValues[row * GRID_SIZE + col]) {
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
                if (!bingoButtonsValues[row * GRID_SIZE + col]) {
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
            if (!bingoButtonsValues[i * GRID_SIZE + i]) {
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
            if (!bingoButtonsValues[i * GRID_SIZE + (GRID_SIZE - i - 1)]) {
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
    function highlightRow(row: number): void {
        for (let col = 0; col < GRID_SIZE; col++) {
            bingoButtons[row * GRID_SIZE + col].highlight();
        }
    }

    // Unhighlight buttons in a specific row
    function unhighlightRow(row: number): void {
        for (let col = 0; col < GRID_SIZE; col++) {
            bingoButtons[row * GRID_SIZE + col].unhighlight();
        }
    }

    // Highlight column buttons
    function highlightColumn(col: number): void {
        for (let row = 0; row < GRID_SIZE; row++) {
            bingoButtons[row * GRID_SIZE + col].highlight();
        }
    }

    // Unhighlight buttons in a specific column
    function unhighlightColumn(col: number): void {
        for (let row = 0; row < GRID_SIZE; row++) {
            bingoButtons[row * GRID_SIZE + col].unhighlight();
        }
    }

    // Highlight left-right diagonal buttons
    function highlightDiagonal1(): void {
        for (let i = 0; i < GRID_SIZE; i++) {
            bingoButtons[i * GRID_SIZE + i].highlight();
        }
    }

    // Unhighlight buttons in the left-right diagonal
    function unhighlightDiagonal1(): void {
        for (let i = 0; i < GRID_SIZE; i++) {
            bingoButtons[i * GRID_SIZE + i].unhighlight();
        }
    }

    // Highlight the left-right diagonal buttons
    function highlightDiagonal2(): void {
        for (let i = 0; i < GRID_SIZE; i++) {
            bingoButtons[i * GRID_SIZE + (GRID_SIZE - i - 1)].highlight();
        }
    }

    // Unhighlight buttons in the right-left diagonal
    function unhighlightDiagonal2(): void {
        for (let i = 0; i < GRID_SIZE; i++) {
            bingoButtons[i * GRID_SIZE + (GRID_SIZE - i - 1)].unhighlight();
        }
    }

    // Unhighlight all buttons when no victory is detected
    function unhighlightAll(): void {
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

{#if isOpen}
    <div class="container" transition:fly={{ y: 500, duration: 500, delay: 500 }} on:introend={handleTransitionEnd}>
        <div class="bingo-grid">
            {#each Array(25) as _, index}
                <BingoButton bind:this={bingoButtons[index]} onChecked={(event) => handleButtonsClick(index, event)} isMiddleTile={index === 12} on:easterEggTriggered={handleEasterEgg} {categoryName} />
            {/each}
        </div>

        <span>{hintTextContent}</span>
    </div>
{/if}

<style>
    .container {
        width: 100%;
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
        color: rgb(153, 153, 153);
        display: block;
        text-align: center;
        text-decoration: underline;
        margin-top: 5px;
        width: fit-content;
        margin: auto;
        padding: 5px 10px;
        border-radius: 5px;
    }
</style>
