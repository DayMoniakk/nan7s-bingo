import UserData from "./UserData";

let savingDisabled = false;
let seedOverride = "";

export function setSeedOverride(override: string) {
    seedOverride = override;
}

export function isSeedOverriden(): boolean {
    return seedOverride !== "";
}

export function getSeedOverride(): string {
    return seedOverride;
}

export function toggleSaving() {
    savingDisabled = !savingDisabled;
}

export function isSavingDisabled(): boolean {
    return savingDisabled;
}

export function clearData() {
    UserData.clearAllBoards();
}

export function refreshBoard() {
    document.dispatchEvent(new Event('DEBUG_onRefreshBoard'));
}