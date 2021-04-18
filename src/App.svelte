<script>
    import CodeEditor from "./playground/elements/CodeEditor.svelte";
    import Output from "./playground/Output.svelte";
    import RunGroup from "./playground/RunGroup.svelte";
    import ExampleGroup from "./playground/ExampleGroup.svelte";
    import FileGroup from "./playground/FileGroup.svelte";

    let editor;
    function getEditor(e) {
        editor = e;
    }
    let code = "";

    let outputMessages = [];

    function handleCodeChange(e) {
        code = e.detail.value;
    }

    function handleCodeSave(e) {
        let content = new Blob([code], {
            type: "text/plain",
        });

        let filename = `playground-${Date.now()}.snek`;

        let download = document.createElement("a");
        download.download = filename;

        download.href = window.URL.createObjectURL(content);
        download.click();
    }

    function handleExecuteCode(e) {
        const action = e.detail.action;
        const worker = new Worker("js/worker.js");
        outputMessages = [];

        worker.onmessage = e => {
            switch (e.data.type) {
                case "print": {
                    outputMessages = [...outputMessages, e.data.msg];

                    break;
                }

            }
        };

        switch (action) {
            case "Run": {
                worker.postMessage({ type: "eval", code: editor.getValue() });

                break;
            }
            case "Disassemble": {
                worker.postMessage({ type: "disassemble", code: editor.getValue() });

                break;
            }
            case "Decompile": {
                worker.postMessage({ type: "decompile", code: editor.getValue() });

                break;
            }
        }
    }
</script>

<main>
    <div class="app">
        <div class="header">
            <div class="logo-wrapper">
                <img class="logo" src="img/logo.png" alt="logo" />
                <h1>Snekky Language</h1>
            </div>
            <div class="links">
                <a href="https://github.com/snekkylang/snekky" target="_blank">
                    Source Code
                </a>
                &bull;
                <a
                    href="https://github.com/snekkylang/snekky/releases"
                    target="_blank"
                >
                    Releases
                </a>
                &bull;
                <a
                    href="https://github.com/snekkylang/snekky/tree/master/examples"
                    target="_blank"
                >
                    Examples
                </a>
            </div>
        </div>

        <div class="playground">
            <div class="buttons-wrapper">
                <RunGroup on:executeCode={handleExecuteCode} />
                <ExampleGroup on:codeChange={handleCodeChange} />
                <FileGroup
                    on:codeChange={handleCodeChange}
                    on:codeSave={handleCodeSave}
                />

                <div class="snekky-version">Version: {Snekky.Version}</div>
            </div>

            <CodeEditor on:codeChange={handleCodeChange} value={code} getEditor={getEditor} />

            <Output {outputMessages}></Output>

            <footer class="footer">
                Website is inspired by
                <a href="https://play.rust-lang.org/" target="_blank">
                    Rust's playground
                </a>.
            </footer>
        </div>
    </div>
</main>

<style>
    .snekky-version {
        margin: 20px 10px 20px 0;
        display: flex;
        align-items: flex-end;
        font-size: 12px;
        font-weight: 600;
        color: #5A5A58;
    }

    .buttons-wrapper {
        display: flex;
        flex-direction: row;
    }

    .app {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 900px;
        max-width: 95%;
    }

    .footer {
        font-size: 12px;
        color: #747471;
        margin-top: 15px;
    }

    .footer a:visited,
    .footer a {
        color: #747471;
    }

    .header {
        margin: 50px 0 10px 0;
    }

    .header .links a:visited,
    .header .links a {
        text-decoration: none;
        color: #0364dd;
        font-weight: 600;
    }

    .header .links a:hover {
        text-decoration: underline;
    }

    .header .logo-wrapper {
        margin-bottom: 5px;
    }

    .header .logo-wrapper h1 {
        font-size: 40px;
    }

    .header .logo-wrapper .logo {
        width: 130px;
    }
</style>
