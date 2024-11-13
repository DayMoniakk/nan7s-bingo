import Cookies from 'js-cookie';
import { StreamType } from './StreamType';
import { isSavingDisabled } from './DebugHandler';

export interface BoardData {
    streamType: StreamType;
    tilesState: boolean[];
    seed: string;
}

class UserData {
    private static saveTimeout: number | null = null; // Timeout ID to avoid spamming the save function
    private static debounceDelay = 5000;

    // Save progress for a specific board
    static saveBoard(streamData: BoardData, bypassDebounce = false): void {
        if (isSavingDisabled()) return;

        const key = `bingo_${streamData.streamType}`;
        const serializedData = JSON.stringify(streamData);

        // If bypassing debounce, clear any existing timeout and save immediately
        if (bypassDebounce) {
            if (this.saveTimeout !== null) {
                clearTimeout(this.saveTimeout);
                this.saveTimeout = null;
            }
            Cookies.set(key, serializedData, { expires: 1 });
            return;
        }

        // If not bypassing debounce, set a delayed save
        if (this.saveTimeout !== null) {
            clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = window.setTimeout(() => {
            Cookies.set(key, serializedData, { expires: 1 });
            this.saveTimeout = null; // Reset timeout ID after saving
            console.log("Saved board data");
            
        }, this.debounceDelay);
    }

    // Load progress for a specific board
    static loadBoard(streamType: StreamType): BoardData | null {
        const key = `bingo_${streamType}`;
        const savedData = Cookies.get(key);
        if (savedData) {
            try {
                return JSON.parse(savedData) as BoardData;
            } catch (error) {
                console.error("Error parsing saved data for", streamType, error);
            }
        }
        return null; // Return null if no data is found or parsing fails
    }

    static hasSavedBoard(streamType: StreamType): boolean {
        const key = `bingo_${streamType}`;
        return Cookies.get(key) !== undefined;
    }

    static clearBoard(streamType: StreamType): void {
        const key = `bingo_${streamType}`;
        Cookies.remove(key);
    }

    static clearAllBoards(): void {
        Object.values(StreamType).forEach((streamType) => {
            Cookies.remove(`bingo_${streamType}`);
        });
    }
}

export default UserData;
