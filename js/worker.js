importScripts("snekky.js", "snekkyd.js");

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

    if (e.data.type === "eval") {
        postMessage({ type: "state", msg: "Evaluating..." });
        try {
            Snekky.evaluateBytes(byteCode);
        } catch(err) {

        }
    } else {
        postMessage({ type: "state", msg: "Disassembling..." });
        SnekkyD.disassemble(byteCode);
    }
    
    postMessage({ type: "exit", success: true });
};