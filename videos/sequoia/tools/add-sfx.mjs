// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track.
import fs from "node:fs";
import path from "node:path";

const LEN = { chime: 2.5, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, "whoosh-short": 0.57, whoosh: 0.57 };

const CUES = {
  landscape: [
    ["riser", 2.0, 4.2, 0.4],          // builds under the pull-out, crests as the tree lands (5.0s)
    ["impact-bass-1", 4.75, 2.12, 0.6], // tree at full height / "So we measured it."
    ["whoosh-short", 5.85, 0.57, 0.35], // chart pans, headline rises
    ["whoosh", 10.9, 0.57, 0.4],        // wipe to the light "plan a visit" scene
    ["pop", 12.85, 0.72, 0.35], ["pop", 14.0, 0.72, 0.35], ["pop", 15.15, 0.72, 0.35], ["pop", 16.3, 0.72, 0.35], // cited chips
    ["whoosh-short", 18.9, 0.57, 0.35], // into the facts
    ["pop", 19.2, 0.72, 0.22], ["pop", 19.55, 0.72, 0.22], ["pop", 19.9, 0.72, 0.22],
    ["whoosh", 23.35, 0.57, 0.4],       // browser window flies in
    ["whoosh-short", 23.95, 0.57, 0.25],// page scroll
    ["impact-bass-1", 27.05, 2.12, 0.45], // end-card tree grows
    ["chime", 27.55, 2.5, 0.45],        // sequoia.info lands
  ],
  vertical: [
    ["riser", 1.8, 4.2, 0.4],
    ["impact-bass-1", 4.55, 2.12, 0.6],
    ["whoosh-short", 5.6, 0.57, 0.35],
    ["whoosh", 9.5, 0.57, 0.4],
    ["pop", 9.7, 0.72, 0.22], ["pop", 9.95, 0.72, 0.22], ["pop", 10.2, 0.72, 0.22],
    ["impact-bass-1", 12.45, 2.12, 0.45],
    ["chime", 12.9, 2.1, 0.45],
  ],
};

const [dir, kind] = process.argv.slice(2);
const file = path.join(dir, "index.html");
let html = fs.readFileSync(file, "utf8");
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
