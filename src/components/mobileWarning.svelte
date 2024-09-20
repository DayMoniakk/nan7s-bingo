<script lang="ts">
    import { onMount } from "svelte";

    let warningWindow: HTMLElement;

    function handleClose(): void {
        if (warningWindow) {
            warningWindow.remove();
            // Set the cookie with a name and value, no expiration, so it's a session cookie
            document.cookie = "mobileWarningClosed=true; SameSite=Strict; Path=/";
        }
    }

    onMount(() => {
        if (document.cookie.includes("mobileWarningClosed=true")) {
            if (warningWindow) {
                warningWindow.remove();
            }
        }

        // DEBUG: delete the cookie
        //document.cookie = "mobileWarningClosed=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; SameSite=Strict";

        const styling = `
            color:white;
            background-color: black;
            border: 1px solid red;
            padding: 8px;
            font-weight: 600;
            font-family: Courier;
            font-size: 16px;
        `;

        console.log(`%c 👀 You shouldn't be here. 👀`, `${styling}`);
    });

</script>

<div class="warning" bind:this={warningWindow}>
    <div class="container">
        <h1>⚠ This website is not meant to be used on mobile screens!</h1>
        <span>You can try to rotate your device in order to display the website properly.</span>
        <button on:click={handleClose}>Close</button>
    </div>
</div>

<style>
    .warning {
        display: none;
        background-color: rgba(0, 0, 0, 0.822);
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 1s;
    }

    .container {
        max-width: 90vw;
    }

    h1 {
        color: black;
        background-color: red;
        font-weight: 400;
        text-align: center;
        padding: 5px;
        border-radius: 5px;
    }

    span {
        color: rgb(0, 0, 0);
        background-color: rgb(189, 189, 189);
        margin: auto;
        text-align: center;
        width: fit-content;
        display: block;
        padding: 5px;
        font-size: 18px;
        border-radius: 5px;
    }

    button {
        margin: 40px auto 0 auto;
        display: block;
        padding: 5px 20px;
        font-size: 25px;
        border-radius: 5px;
        border: none;
        background-color: #5b69e2;
        color: white;
        cursor: pointer;
    }

    @media only screen and (max-width: 950px) {
        .warning {
            display: flex;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
