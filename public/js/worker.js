importScripts("snekky.js", "snekkyp.js", "snekkyd.js");

onmessage = function(e) {
    console.log = function(...m) {
        postMessage({ type: "print", msg: m });
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
            postMessage({ type: "print", msg: [SnekkyDecompiler.decompileBytes(byteCode)] });

            break;
        }
    }
    
    postMessage({ type: "exit", success: true });
};