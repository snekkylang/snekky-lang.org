<script>
    import CodeEditor from "./playground/elements/CodeEditor.svelte";
    import Output from "./playground/Output.svelte";
    import RunGroup from "./playground/RunGroup.svelte";
    import ExampleGroup from "./playground/ExampleGroup.svelte";
    import FileGroup from "./playground/FileGroup.svelte";
    import Version from "./playground/Version.svelte";

    let editor;
    function getEditor(e) {
        editor = e;
    }
    let code = "";

    let outputMessages = [];

    async function handleShareCode(e) {
        let token;
        if (!localStorage.getItem("github_token")) {
            token = prompt("Please provide a GitHub personal token with permissions to create Gists. It will NOT be sent to our server.");
            if (!token) {
                return;
            }
            localStorage.setItem("github_token", token);
        } else {
            token = localStorage.getItem("github_token");
        }

        const body = {
            description: `Created by snekky-lang.org playground.`,
            public: false,
            accept: "application/vnd.github.v3+json",
            files: {
                file: {
                    content: editor.getValue()
                }
            }
        };

        const response = await fetch("https://api.github.com/gists", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Authorization": `bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 201) {
            const gistUrl = data.url.split("/").pop();

            window.location.href = `${window.location.origin}/#gist=${gistUrl}`;
        } else {
            alert("Invalid GitHub personal token!");
            localStorage.removeItem("github_token");
        }
    }

    async function loadCodeFromGist() {
        const gistId = getUrlArgument("gist");
        if (gistId === null) {
            return;
        }
        const gistInfo = await fetch(`https://api.github.com/gists/${gistId}`)
            .then(res => res.json());

        const file = await fetch(gistInfo.files.file.raw_url)
            .then(res => res.text());

        code = file;
    }

    loadCodeFromGist();

    function handleCodeChange(e) {
        code = e.detail.value;
    }

    function handleCodeSave(e) {
        let content = new Blob([editor.getValue()], {
            type: "text/plain",
        });

        let filename = `playground-${Date.now()}.snek`;

        let download = document.createElement("a");
        download.download = filename;

        download.href = window.URL.createObjectURL(content);
        download.click();
    }

    let executing = false;
    function handleExecuteCode(e) {
        const action = e.detail.action;
        const worker = new Worker("js/worker.js");
        outputMessages = [];
        executing = true;

        worker.onmessage = e => {
            switch (e.data.type) {
                case "print": {
                    outputMessages = [...outputMessages, e.data.msg];

                    break;
                }
                case "exit": {
                    executing = false;

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
            case "Show hex": {
                worker.postMessage({ type: "showHex", code: editor.getValue() });

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
                <a href="https://github.com/snekkylang" target="_blank">
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
                    on:shareCode={handleShareCode}
                />

                <Version />
            </div>

            <CodeEditor on:codeChange={handleCodeChange} value={code} getEditor={getEditor} />

            <Output {outputMessages} {executing}></Output>

            <footer class="footer">
                Website is inspired by
                <a href="https://play.rust-lang.org/" target="_blank">Rust's playground</a>.
            </footer>
        </div>
    </div>
</main>

<style>
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

    .playground {
        margin-bottom: 60px;
    }

    @media only screen and (max-width: 500px) {
        .playground {
            margin-bottom: 20px;
        }

        .header {
            margin-top: 20px;
        }
    }
</style>
