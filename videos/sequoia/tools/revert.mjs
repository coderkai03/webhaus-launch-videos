// Undo retime.mjs: apply its replacements in reverse and strip the voiceover block.
import fs from "node:fs";
let src = fs.readFileSync("tools/retime.mjs", "utf8");
src = src.replace(/const rep = \((a), (b)\) =>/, "const rep = (b, a) =>");
src = src.replace(/const vo = [\s\S]*?(?=fs\.writeFileSync)/, "");
src = src.replace(/import fs from "node:fs";/, "");
new Function("fs", src)(fs);
let s = fs.readFileSync("index.html", "utf8");
s = s.replace(/\n\n      <!-- Voiceover[^\n]*-->\n(      <audio [^\n]*\n?)+/, "\n");
fs.writeFileSync("index.html", s);
console.log("reverted; audio tags left:", (s.match(/<audio/g) || []).length);
