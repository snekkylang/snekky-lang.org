<script>
    import { createEventDispatcher } from "svelte";

    import Select from "./elements/Select.svelte";
    import ButtonGroup from "./elements/ButtonGroup.svelte";

    const dispatch = createEventDispatcher();

    let examples;

    let examplesPopup = {
        title: "Select an example",
        updateTitle: true,
        values: [],
    };

    async function handleCodeChange(example) {
        dispatch("codeChange", {
			value: await fetch(examples.find(e => e.name === example).download_url)
                .then(res => res.text())
		});
    }

    async function fetchExamples() {
        let response = await fetch(
            "https://api.github.com/repositories/209589825/contents/examples"
        ).then(res => res.json());

        examplesPopup.values = response
            .filter(e => e.type === "file")
            .map(e => {
                return {
                    title: e.name,
                };
            });

        examplesPopup = examplesPopup;
        examples = response;
        if (getUrlArgument("gist") === null) {
            handleCodeChange("mod_inv.snek");
        }
    }

    fetchExamples();
</script>

<ButtonGroup>
    <Select
        onChange={handleCodeChange}
        text="Example"
        icon="fa-code"
        popup={examplesPopup}
    />
</ButtonGroup>
