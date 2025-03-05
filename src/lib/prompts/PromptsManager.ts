import seedRandom from "seedrandom";
import { isSeedOverriden, getSeedOverride } from "../DebugHandler";

import { genericPrompts } from "./Generic";
import { soulsLikePrompts } from "./SoulsLike";
import { artPrompts } from "./Art";
import { horrorGamesPrompts } from "./HorrorGames";
import { rhythmGamesPrompts } from "./RhythmGames";
import { languageGuessrPrompts } from "./LanguageGuessr";
import { otherGamesPrompts } from "./OtherGames";

let rng: seedRandom.PRNG;
let currentSeed: string;
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

export function getCurrentSeed(): string {
  return currentSeed;
}

export function preparePrompts(streamIndex: number, seed: string = ""): string {
  if (isSeedOverriden()) {
    seed = getSeedOverride();
  }

  currentSeed = seed;

  if (seed !== "") rng = seedRandom(seed);
  else {
    currentSeed = Math.random().toString(36).slice(2) + Date.now().toString(36);
    rng = seedRandom(currentSeed);
  }

  switch (streamIndex) {
    case 0:
      availableCategoryPrompts = [...soulsLikePrompts];
      break;
    case 1:
      availableCategoryPrompts = [...artPrompts];
      break;
    case 2:
      availableCategoryPrompts = [...horrorGamesPrompts];
      break;
    case 3:
      availableCategoryPrompts = [...rhythmGamesPrompts];
      break;
    case 4:
      availableCategoryPrompts = [...languageGuessrPrompts];
      break;
    case 5:
      availableCategoryPrompts = [...otherGamesPrompts];
      break;
  }

  availableGenericPrompts = [...genericPrompts]; // Copy generic prompts separately

  genericPromptCount = 0; // Reset the count of used generic prompts

  return currentSeed;
}

export function getRandomPrompt(): Prompt {
  const maxGenericCount: number = Math.floor(
    BINGO_CARD_SIZE * MAX_GENERIC_RATIO
  );

  if (
    availableCategoryPrompts.length === 0 &&
    availableGenericPrompts.length === 0
  ) {
    return { content: "ERROR", promptType: PromptType.Error };
  }

  let prompt: string;
  if (
    genericPromptCount < maxGenericCount &&
    availableGenericPrompts.length > 0
  ) {
    // There's still room for generic prompts, randomly decide between generic and category
    if (
      (rng() < 0.5 && availableCategoryPrompts.length > 0) ||
      availableGenericPrompts.length === 0
    ) {
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
    promptType: genericPrompts.includes(prompt)
      ? PromptType.Generic
      : PromptType.Category,
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
