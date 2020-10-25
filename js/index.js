const codeArea = document.querySelector("#codeArea");
const buttonSave = document.querySelector("#buttonSave");
const buttonNew = document.querySelector("#buttonNew");
const buttonRun = document.querySelector("#buttonRun");
const consoleOut = document.querySelector("#console");
const selectExamples = document.querySelector("#selectExamples");
const buttonDisassemble = document.querySelector("#buttonDisassemble");

let examples = null;

function downloadFile() {
    let content = new Blob([editor.getValue()], {
        type: "text/plain"
    });

    let filename = `playground-${Date.now()}.snek`;

    let download = document.createElement("a");
    download.download = filename;

    download.href = window.URL.createObjectURL(content);
    download.click();
}

document.addEventListener("DOMContentLoaded", async () => {
    examples = await fetch("https://api.github.com/repositories/209589825/contents/examples")
        .then(res => res.json());

    selectExamples.innerHTML = "";
    for (const example of examples) {
        if (example.type != "file") {
            continue;
        }
        const optionElement = document.createElement("option");
        optionElement.value = example.name;
        optionElement.innerHTML = example.name;
        optionElement.setAttribute("data-download-url", example.download_url);
        selectExamples.appendChild(optionElement);

        if (example.name === "mod_inv.snek") {
            optionElement.selected = "selected";
        }
    }

    selectExamples.dispatchEvent(new Event("change"));
});

selectExamples.addEventListener("change", async () => {
    editor.setValue(await fetch(selectExamples[selectExamples.selectedIndex].getAttribute("data-download-url"))
        .then(res => res.text()), -1);
});

let editor = ace.edit("codeArea");
editor.setTheme("ace/theme/xcode");
editor.getSession().setMode("ace/mode/javascript");
editor.getSession().setUseWorker(false);

buttonSave.addEventListener("click", downloadFile)

buttonNew.addEventListener("click", () => {
    editor.setValue("");
    consoleOut.innerHTML = "";
});

buttonDisassemble.addEventListener("click", () => {
    buttonDisassemble.innerHTML = `<i class="fa fa-spinner" aria-hidden="true"></i> Disassembling...`;
    buttonDisassemble.disabled = "disabled";

    consoleOut.innerHTML = "";
    const code = editor.getValue();
    const worker = new Worker("js/worker.js");
    worker.postMessage({ type: "disassemble", code: code });

    const table = document.createElement("table");
    table.classList.add("table-disassemble");
    const titleRow = document.createElement("tr");
    table.appendChild(titleRow)

    const insCountCol = document.createElement("th");
    insCountCol.innerHTML = "Count";
    titleRow.appendChild(insCountCol);

    const insPosCol = document.createElement("th");
    insPosCol.innerHTML = "Position";
    titleRow.appendChild(insPosCol);

    const insDataCol = document.createElement("th");
    insDataCol.innerHTML = "Instruction";
    titleRow.appendChild(insDataCol);

    worker.onmessage = function(e) {
        if (e.data.type == "exit") {
            buttonDisassemble.removeAttribute("disabled");
            buttonDisassemble.innerHTML = `<i class="fa fa-bug" aria-hidden="true"></i> Disassemble`;
            consoleOut.appendChild(table);
        } else {
            const insData = e.data.msg[0].split(" | ");

            const insRow = document.createElement("tr");
            const insCountCol = document.createElement("td");
            insCountCol.innerHTML = insData[0];
            insRow.appendChild(insCountCol);
        
            const insPosCol = document.createElement("td");
            insPosCol.innerHTML = insData[1];
            insRow.appendChild(insPosCol);
        
            const insDataCol = document.createElement("td");
            insDataCol.innerHTML = insData[2];
            insRow.appendChild(insDataCol);

            table.appendChild(insRow);
        }
    }
});

buttonRun.addEventListener("click", () => {
    buttonRun.innerHTML = `<i class="fa fa-spinner" aria-hidden="true"></i> Running...`;
    buttonRun.disabled = "disabled";

    consoleOut.innerHTML = "";
    const code = editor.getValue();
    const worker = new Worker("js/worker.js");
    worker.postMessage({ type: "eval", code: code });

    worker.onmessage = function(e) {
        if (e.data.type == "exit") {
            buttonRun.removeAttribute("disabled");
            buttonRun.innerHTML = `<i class="fa fa-play" aria-hidden="true"></i> Run`;
        } else {
            const output = document.createElement("pre");
            output.innerHTML = e.data.msg;
            consoleOut.scrollTop = consoleOut.scrollHeight;
        
            consoleOut.appendChild(output);
        }
    }
});
