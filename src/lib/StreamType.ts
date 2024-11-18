export enum StreamType {
    Error = "ERROR",
    SoulsLike = "Souls-like",
    Art = "Art",
    HorrorGames = "Horror Games",
    RhythmGames = "Rhythm Games",
    OtherGames = "Other Games"
}

export function getStreamByIndex(index: number): StreamType {
    switch (index) {
        case 0:
            return StreamType.SoulsLike;
        case 1:
            return StreamType.Art;
        case 2:
            return StreamType.HorrorGames;
        case 3:
            return StreamType.RhythmGames;
        case 4:
            return StreamType.OtherGames;
        default:
            return StreamType.Error;
    }
}

export function getStreamLength(): number {
    return 5;
}