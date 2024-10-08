import seedRandom from "seedrandom";

let rng: seedRandom.PRNG;
let availableCategoryPrompts: string[] = [];
let availableGenericPrompts: string[] = [];
let genericPromptCount: number = 0; // Count of used generic prompts

export enum PromptType {
    Error,
    Generic,
    Category,
}

export interface Prompt {
    content: string;
    promptType: PromptType;
}

const MAX_GENERIC_RATIO: number = 0.4; // Max x% generic prompts
const BINGO_CARD_SIZE: number = 25; // Assuming a 5x5 bingo card

export function preparePrompts(streamIndex: number): string {
    fillPrompts();

    let currentSeed: string = Math.random().toString(36).slice(2) + Date.now().toString(36);
    rng = seedRandom(currentSeed);

    switch (streamIndex) {
        case 0:
            availableCategoryPrompts = soulsLikePrompts;
            break;
        case 1:
            availableCategoryPrompts = artPrompts;
            break;
        case 2:
            availableCategoryPrompts = horrorGamePrompts;
            break;
        case 3:
            availableCategoryPrompts = otherGamesPrompts;
            break;
    }

    availableGenericPrompts = [...genericPrompts]; // Copy generic prompts separately

    genericPromptCount = 0; // Reset the count of used generic prompts

    return currentSeed;
}

export function getRandomPrompt(): Prompt {
    const maxGenericCount: number = Math.floor(BINGO_CARD_SIZE * MAX_GENERIC_RATIO);

    if (availableCategoryPrompts.length === 0 && availableGenericPrompts.length === 0) {
        return { content: "ERROR", promptType: PromptType.Error };
    }

    let prompt: string;
    if (genericPromptCount < maxGenericCount && availableGenericPrompts.length > 0) {
        // There's still room for generic prompts, randomly decide between generic and category
        if (rng() < 0.5 && availableCategoryPrompts.length > 0 || availableGenericPrompts.length === 0) {
            prompt = getCategoryPrompt();
        } else {
            prompt = getGenericPrompt();
        }
    } else {
        // If we've hit the max limit of generic prompts, or there are no more generic prompts, get a category prompt
        prompt = getCategoryPrompt();
    }

    return {
        content: prompt,
        promptType: genericPrompts.includes(prompt) ? PromptType.Generic : PromptType.Category,
    };
}

function getGenericPrompt(): string {
    const index: number = Math.floor(rng() * availableGenericPrompts.length);
    const prompt: string = availableGenericPrompts.splice(index, 1)[0];
    genericPromptCount++; // Track number of generic prompts used
    return prompt;
}

function getCategoryPrompt(): string {
    const index: number = Math.floor(rng() * availableCategoryPrompts.length);
    return availableCategoryPrompts.splice(index, 1)[0];
}

function fillPrompts(): void {
    // Fill the generic and category prompts
    for (let i: number = 0; i < genericPromptsAmount; i++) {
        genericPrompts.push(`generic_${i.toString().padStart(2, "0")}`);
    }

    for (let i: number = 0; i < soulsLikePromptsAmount; i++) {
        soulsLikePrompts.push(`souls_like_${i.toString().padStart(2, "0")}`);
    }

    for (let i: number = 0; i < artPromptsAmount; i++) {
        artPrompts.push(`art_${i.toString().padStart(2, "0")}`);
    }

    for (let i: number = 0; i < horrorGamePromptsAmount; i++) {
        horrorGamePrompts.push(`horror_game_${i.toString().padStart(2, "0")}`);
    }

    for (let i: number = 0; i < otherGamesPromptsAmount; i++) {
        otherGamesPrompts.push(`other_games_${i.toString().padStart(2, "0")}`);
    }
}

const genericPromptsAmount: number = 39;
let genericPrompts: string[] = [];

const soulsLikePromptsAmount: number = 38;
let soulsLikePrompts: string[] = [];

const artPromptsAmount: number = 16;
let artPrompts: string[] = [];

const horrorGamePromptsAmount: number = 23;
let horrorGamePrompts: string[] = [];

const otherGamesPromptsAmount: number = 25;
let otherGamesPrompts: string[] = [];
