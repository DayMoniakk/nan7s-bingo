export function getRandomImagePath(): string {
    const prefersReducedMotion: boolean = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        return staticImahesPaths[Math.floor(Math.random() * staticImahesPaths.length)];
    }
    else {
        return imagePaths[Math.floor(Math.random() * imagePaths.length)];
    }
}

const imagePaths: string[] = [
    "heart.webp",
    "NanClown.webp",
    "nanLoading.gif",
    "nans7.png",
    "nans7silly.png",
    "nanShocked.webp",
    "noBonfire.webp",
    "smile.webp",
    "tanaka.webp",
    "tanakaOHOH.gif",
    "zote.webp"
];

const staticImahesPaths: string[] = [
    "heart.webp",
    "NanClown.webp",
    "nans7.png",
    "nans7silly.png",
    "nanShocked.webp",
    "noBonfire.webp",
    "smile.webp",
    "tanaka.webp",
    "zote.webp"
];