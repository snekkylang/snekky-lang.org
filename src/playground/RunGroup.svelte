<script>
    import { createEventDispatcher } from "svelte";
    import Button from "./elements/Button.svelte";
    import Select from "./elements/Select.svelte";
    import ButtonGroup from "./elements/ButtonGroup.svelte";

    const dispatch = createEventDispatcher();

    let action = "Run";
    let actionsPopup = {
        title: "What do you want to do?",
        updateTitle: true,
        values: [
            {
                title: "Run",
                description: "Build and run the code, showing the output."
            },
            {
                title: "Show hex",
                description: "Build and show the raw bytecode."
            },
            {
                title: "Disassemble",
                description: "Build and show the disassembled bytecode."
            },
            {
                title: "Decompile",
                description: "Build and show the decompiled bytecode."
            }
        ]
    };

    function handleRunClick() {
        dispatch("executeCode", {
            action: action
		});
    }

    function handleActionChange(newAction) {
        action = newAction;
        dispatch("executeCode", {
            action: action
        });
    }
</script>

<ButtonGroup>
    <Button onClick={handleRunClick} text={action} icon="fa-play" special={true} />
    <Select onChange={handleActionChange} text={null} icon="fa-ellipsis-h" popup={actionsPopup} />
</ButtonGroup>