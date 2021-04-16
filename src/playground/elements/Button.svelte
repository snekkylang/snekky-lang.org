<script>
    export let onClick;
    export let text;
    export let icon;
    export let special;
</script>

<button on:click={onClick} class="button" class:special>
    {text} 
    {#if icon !== null}
    <i class="fa {icon}" aria-hidden="true" />
    {/if}
</button>

<style>
    .button {
        font-family: "Open Sans", sans-serif;
        background-color: #fdfdfd;
        border: none;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        padding: 10px 15px;
        color: #333333;
        cursor: pointer;
    }

    .button:hover {
        background-color: #f0f0f0;
    }

    .button i {
        padding-left: 5px;
    }

    .button.special {
        background-color: #367c5c;
        color: white;
    }

    .button.special:hover {
        background-color: #2d664c;
    }
</style>
