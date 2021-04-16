<script>
    import { onMount, afterUpdate } from "svelte";

    export let value;

    let editorElement;
    let editor;

    onMount(() => {
        editor = ace.edit(editorElement);
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");
        editor.getSession().setUseWorker(false);
        editor.setValue(value);
        editor.clearSelection();

        new ResizeObserver(() => {
            editor.resize();
            editor.renderer.updateFull();
        }).observe(editorElement);
    });

    afterUpdate(() => {
        editor.setValue(value);
        editor.clearSelection();
    });
</script>

<div bind:this={editorElement} class="code" id="codeArea" />

<style>
    .code {
        min-height: 400px;
        font-size: 16px;
        padding: 5px;
        font-family: monospace;
        box-shadow: 0px 0px 5px 0px rgba(140, 140, 136, 1);
        border-radius: 3px;
        resize: vertical;
        overflow: auto;
    }
</style>
