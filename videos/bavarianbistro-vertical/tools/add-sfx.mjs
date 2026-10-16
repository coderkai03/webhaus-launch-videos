// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track. Adapted from sequoia/tools/add-sfx.mjs.
import fs from "node:fs";
import path from "node:path";

const LEN = { chime: 2.5, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, "whoosh-short": 0.57, whoosh: 0.57 };

const CUES = {
  landscape: [
    ["whoosh-short", 0.05, 0.57, 0.3],  // lozenges flip in
    ["whoosh", 0.85, 0.57, 0.35],       // the Maß slides up
    ["riser", 1.6, 4.2, 0.35],          // builds under the pour, crests on the push into the foam (~4.6s)
    ["whoosh", 4.5, 0.57, 0.4],         // push into the foam
    ["impact-bass-1", 6.25, 2.12, 0.55], // "Served warm." stamp lands (6.5s)
    ["pop", 7.6, 0.72, 0.3],            // "Written by Resi" roundel
    ["whoosh", 10.15, 0.57, 0.38],      // wipe to the guide cards
    ["whoosh-short", 10.55, 0.57, 0.3], ["whoosh-short", 12.15, 0.57, 0.3], // card flips
    ["whoosh-short", 13.95, 0.57, 0.3], ["whoosh-short", 15.75, 0.57, 0.3],
    ["pop", 18.2, 0.72, 0.35],          // speech bubble
    ["pop", 19.15, 0.72, 0.28],         // "Budget for the toilet line."
    ["whoosh", 20.8, 0.57, 0.4],        // browser flies in
    ["whoosh-short", 21.5, 0.57, 0.25], // page scroll
    ["whoosh", 24.15, 0.57, 0.4],       // split CTAs slam in
    ["pop", 25.0, 0.72, 0.3],           // "or" roundel
    ["impact-bass-1", 27.0, 2.12, 0.45], // end card
    ["chime", 27.45, 2.5, 0.45],        // wordmark lands
  ],
  vertical: [
    ["whoosh-short", 0.05, 0.57, 0.3],
    ["whoosh", 0.7, 0.57, 0.35],
    ["riser", 1.25, 4.2, 0.35],
    ["whoosh", 4.15, 0.57, 0.4],
    ["impact-bass-1", 5.6, 2.12, 0.55],
    ["pop", 6.8, 0.72, 0.3],
    ["whoosh", 8.25, 0.57, 0.38],
    ["whoosh-short", 8.6, 0.57, 0.3], ["whoosh-short", 9.85, 0.57, 0.3], ["whoosh-short", 11.1, 0.57, 0.3],
    ["impact-bass-1", 12.2, 2.12, 0.45],
    ["chime", 12.6, 2.4, 0.45],
  ],
};

const [dir, kind] = process.argv.slice(2);
const file = path.join(dir, "index.html");
let html = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
html = html.replace(/\n      <!-- Sound effects[\s\S]*?<!-- \/Sound effects -->\n/, "\n");

const trackEnds = [];
const tags = CUES[kind].map(([name, start, dur, vol], i) => {
  dur = Math.min(dur, LEN[name]);
  let t = trackEnds.findIndex((end) => end <= start);
  if (t === -1) { t = trackEnds.length; trackEnds.push(0); }
  trackEnds[t] = start + dur;
  return `      <audio id="sfx-${i + 1}" src="assets/sfx/${name}.mp3" data-start="${start}" data-duration="${dur}" data-volume="${vol}" data-track-index="${10 + t}"></audio>`;
});

const block = `\n      <!-- Sound effects (HyperFrames bundled SFX library) -->\n${tags.join("\n")}\n      <!-- /Sound effects -->\n`;
const anchor = '      <div class="bg"></div>\n';
if (!html.includes(anchor)) throw new Error("anchor not found");
html = html.replace(anchor, anchor + block);
fs.writeFileSync(file, html);
console.log(`${kind}: ${tags.length} cues on ${trackEnds.length} tracks`);
