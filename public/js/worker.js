importScripts("snekky.js", "snekkyp.js", "snekkyd.js", "hexviewer.js", "ansi_up.js");

onmessage = function(e) {
    const ansiUp = new AnsiUp();

    const log = console.log;
    console.log = function(...m) {
        let html = ansiUp.ansi_to_html(m[0]);
        postMessage({ type: "print", msg: html });
    };

    postMessage({ type: "state", msg: "Compiling..." });
    let byteCode;
    try {
        byteCode = Snekky.compileString("playground.snek", e.data.code, true, false);
    } catch (err) {
        postMessage({ type: "exit", success: false });
        return;
    }

    switch (e.data.type) {
        case "eval": {
            postMessage({ type: "state", msg: "Evaluating..." });
            try {
                Snekky.evaluateBytes(byteCode);
            } catch(err) {
    
            }

            break;
        }
        case "disassemble": {
            postMessage({ type: "state", msg: "Disassembling..." });
            SnekkyP.disassemble(byteCode);
            
            break;
        }
        case "decompile": {
            postMessage({ type: "state", msg: "Decompiling..." });
            postMessage({ type: "print", msg: SnekkyDecompiler.decompileBytes(byteCode) });

            break;
        }
        case "showHex": {
            postMessage({ type: "state", msg: "Decoding..." });
            HexViewer.printBytes(byteCode);

            break;
        }
    }
    
    postMessage({ type: "exit", success: true });
};