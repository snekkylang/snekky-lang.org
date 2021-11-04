<script>
    import { fly } from "svelte/transition";

    export let text;
    export let icon;
    export let onChange;
    export let popup;

    let active = false;
    let selectElement;

    let popupTop = 0;
    let popupLeft = 0;

    function handlePopupToggle(e) {
        active = !active;

        popupTop = selectElement.offsetTop + 60;
        popupLeft = selectElement.offsetLeft + selectElement.offsetWidth / 2;
    }

    function handleValueChange(v) {
        if (text !== null) {
            text = v;
        }

        onChange(v);
    }

    function handleWindowClick(e) {
        if (
            e.target !== selectElement &&
            e.target.parentNode !== selectElement &&
            e.target.parentNode.parentNode !== selectElement
        ) {
            active = false;
        }
    }
</script>

<div class="select" on:click={handlePopupToggle} bind:this={selectElement}>
    <div class="name">
        {text !== null ? `${text} ` : ""}
        <i
            class="fa {icon}"
            class:pad={text !== null}
            aria-hidden="true"
        />
    </div>
</div>

{#if active}
    <div
        class="popup"
        style="top: {popupTop}px; left: {popupLeft}px;"
        transition:fly={{ y: 7, duration: 200 }}
    >
        <div class="popup-name">{popup.title}</div>

        <div class="values">
            {#each popup.values as v}
                <div class="select-value" on:click={handleValueChange(v.title)}>
                    <div class="value-name">{v.title}</div>

                    {#if v.description}
                        <div class="value-description">{v.description}</div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
{/if}

<svelte:window on:click={handleWindowClick} />

<style>
    .select {
        position: relative;
        font-family: "Open Sans", sans-serif;
        background-color: #fdfdfd;
        padding: 10px 15px;
        width: max-content;
        cursor: pointer;
    }

    .select .name {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #333333;
    }

    .name .pad {
        padding-left: 5px;
    }

    .select:hover {
        background-color: #f0f0f0;
    }

    .popup {
        position: fixed;
        background-color: white;
        filter: drop-shadow(0 0 3px rgba(140, 140, 136, 0.9));
        border-radius: 4px;
        z-index: 1000;
        max-width: 270px;
        transform: translateX(-50%);
        user-select: none;
    }

    .popup .values {
        max-height: 300px;
        overflow: auto;
        padding: 5px 10px;
    }

    .popup::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid white;
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translate(-50%);
    }

    .popup .popup-name {
        font-size: 11px;
        text-transform: uppercase;
        color: #222222;
        border-bottom: solid 1px #dedede;
        padding-bottom: 5px;
        font-weight: 700;
        padding: 10px;
    }

    .popup .select-value {
        padding: 5px 0;
        cursor: pointer;
        color: #222222;
        transition: ease color 0.2s;
    }

    .popup .select-value:hover {
        color: #367c5c;
    }

    .popup .select-value .value-name {
        font-size: 13px;
        font-weight: 600;
    }

    .select-value .value-description {
        font-size: 12px;
        font-weight: 400;
    }

    ::-webkit-scrollbar-track {
        background-color: #f1f1f1;
        border-radius: 10px;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 10px;
    }
</style>
