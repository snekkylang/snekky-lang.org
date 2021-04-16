<script>
    import { createEventDispatcher } from "svelte";
    import Button from "./elements/Button.svelte";
    import ButtonDivider from "./elements/ButtonDivider.svelte";
    import ButtonGroup from "./elements/ButtonGroup.svelte";

    const dispatch = createEventDispatcher();

    function newFile() {
        dispatch("exampleChange", {
            value: "",
        });
    }

    function saveFile() {
        dispatch("exampleSave", {});
    }
</script>

<ButtonGroup>
    <Button onClick={newFile} text="New" icon={null} special={false} />
    <ButtonDivider />
    <Button onClick={saveFile} text="Save" icon={null} special={false} />
</ButtonGroup>
