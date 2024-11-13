import { StreamType } from "../StreamType";

export function getMiddleTileImage(streamType: StreamType): string {
    switch(streamType) {
        case StreamType.SoulsLike:
            return soulsLike[Math.floor(Math.random() * soulsLike.length)];
        case StreamType.Art:
            return art[Math.floor(Math.random() * art.length)];
        default:
            return generic[Math.floor(Math.random() * generic.length)];
    }
}

const generic = [
    "heart.webp",
    "NanClown.webp",
    "nans7silly.png",
    "nanShocked.webp",
    "smile.webp",
    "tanaka.webp",
    "tanakaOHOH.gif",
    "zote.webp"
];

const soulsLike = [
    "noBonfire.webp",
];

const art = [
    "nans7.png",
];
