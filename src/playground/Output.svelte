<script>
    import { afterUpdate } from "svelte";
    import { fade } from "svelte/transition";

    export let outputMessages;
    export let executing;

    let outputElement;

    afterUpdate(() => {
        outputElement.scrollTop = outputElement.scrollHeight;
    });
</script>

<div class="output" bind:this={outputElement}>
    {#if executing}
        Running...
    {/if}{#each outputMessages as m}
        <pre in:fade="{{ duration: 200 }}" class="output-message">{@html m}</pre>
    {/each}
</div>

<style>
    .output {
        min-height: 200px;
        height: 200px;
        font-size: 16px;
        padding: 10px;
        box-shadow: 0px 0px 5px 0px rgba(140, 140, 136, 1);
        border-radius: 3px;
        background-color: white;
        margin-top: 15px;
        resize: vertical;
        overflow: auto;
        font-family: "Fira Code", monospace;
        font-variant-ligatures: none;
    }

    .output-message {
        font-family: "Fira Code", monospace;
    }

    .output:empty::before {
        content: "Waiting for output...";
    }
</style>