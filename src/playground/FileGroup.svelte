<script>
    import { createEventDispatcher } from "svelte";
    import Button from "./elements/Button.svelte";
    import ButtonDivider from "./elements/ButtonDivider.svelte";
    import ButtonGroup from "./elements/ButtonGroup.svelte";

    const dispatch = createEventDispatcher();

    function newFile() {
        dispatch("codeChange", {
            value: ""
        });
    }

    function saveFile() {
        dispatch("codeSave", {});
    }

    function shareCode() {
        dispatch("shareCode", {});
    }
</script>

<div class="wrapper">
    <ButtonGroup>
        <Button onClick={newFile} text="New" icon={null} special={false} />
        <ButtonDivider />
        <Button onClick={saveFile} text="Save" icon={null} special={false} />
        <ButtonDivider />
        <Button onClick={shareCode} text="Share" icon={null} special={false} />
    </ButtonGroup>
</div>

<style>
    @media only screen and (max-width: 500px) {
        .wrapper {
            display: none;
        }
    }
</style>
