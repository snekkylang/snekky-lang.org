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

    let currentExample = "mod_inv.snek";

    async function handleCodeChange(example) {
        dispatch("codeChange", {
			value: await fetch(examples.find(e => e.name === example).download_url)
                .then(res => res.text())
		});
        window.location.href = `${window.location.origin}/#example=${example}`;
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
            currentExample = getUrlArgument("example") || "mod_inv.snek";
            handleCodeChange(currentExample);
        }
    }

    fetchExamples();
</script>

<ButtonGroup>
    <Select
        onChange={handleCodeChange}
        text={currentExample}
        icon="fa-code"
        popup={examplesPopup}
    />
</ButtonGroup>
