import seedRandom from "seedrandom";
import { getTranslation } from "$lib/i18n";

let rng: seedRandom.PRNG;
let availablePrompts: string[] = [];

export enum PromptType {
    Error,
    Generic,
    Category,
}
export interface Prompt {
    content: string;
    promptType: PromptType;
}

export function preparePrompts(streamIndex: number): string {
    fillPrompts();

    let currentSeed: string = Math.random().toString(36).slice(2) + Date.now().toString(36);
    rng = seedRandom(currentSeed);

    switch (streamIndex) {
        case 0:
            availablePrompts = soulsLikePrompts;
            break;
        case 1:
            availablePrompts = artPrompts;
            break;
        case 2:
            availablePrompts = horrorGamePrompts;
            break;
        case 3:
            availablePrompts = otherGamesPrompts;
            break;
    }

    availablePrompts = availablePrompts.concat(genericPrompts);

    return currentSeed;
}

export function getRandomPrompt(): Prompt {
    if (availablePrompts.length === 0) {
        return { content: "ERROR", promptType: PromptType.Error };
    }

    const index: number = Math.floor(rng() * availablePrompts.length);
    const prompt: string = availablePrompts.splice(index, 1)[0];
    return {
        content: prompt,
        promptType: genericPrompts.includes(prompt) ? PromptType.Generic : PromptType.Category,
    };
}

function fillPrompts(): void {
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

const genericPromptsAmount: number = 33;
let genericPrompts: string[] = [];

const soulsLikePromptsAmount: number = 30;
let soulsLikePrompts: string[] = [];

const artPromptsAmount: number = 16;
let artPrompts: string[] = [];

const horrorGamePromptsAmount: number = 23;
let horrorGamePrompts: string[] = [];

const otherGamesPromptsAmount: number = 23;
let otherGamesPrompts: string[] = [];
