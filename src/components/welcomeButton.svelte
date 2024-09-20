<script context="module" lang="ts">
    export interface Payload {
        index: number;
    };
</script>

<script lang="ts">
    export let name: string = "";
    export let index: number = 0;

    export let onClicked: (payload: Payload) => void;

    function onButtonPressed(): void {
        onClicked({index: index});
    }

    function onKeyDown(event: KeyboardEvent): void {
        if (event.key == "Enter") onButtonPressed();
    }
</script>

<svelte:options accessors/>

<span role="button" on:click={onButtonPressed} on:keydown={onKeyDown} tabindex="0">{name}</span>

<style>
    span {
        text-align: center;
        cursor: pointer;
        border-top: 1px solid rgb(219, 219, 219);
        padding: 5px;
        transition: background-color 0.3s;
        font-size: 20px;
    }
    span:hover {
        background-color: rgb(235, 235, 235);
    }
</style>