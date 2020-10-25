importScripts("snekky.js", "snekkyd.js");

onmessage = function(e) {
    console.log = function(...m) {
        postMessage({ type: "print", msg: m });
    };

    const byteCode = Snekky.compileString("playground.snek", e.data.code, true, false);

    if (e.data.type === "eval") {
        try {
            Snekky.evaluateBytes(byteCode);
        } catch(err) { }
    } else {
        SnekkyD.disassemble(byteCode);
    }
    
    postMessage({ type: "exit" });
};