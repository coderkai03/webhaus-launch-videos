// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track. Adapted from sequoia/tools/add-sfx.mjs.
import fs from "node:fs";
import path from "node:path";

const LEN = {
  chime: 2.5, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, "whoosh-short": 0.57, whoosh: 0.57,
  "click-soft": 0.37, typing: 1.5, ping: 1.32, "glitch-3": 3.1,
};

const CUES = {
  landscape: [
    ["riser", 0.4, 3.9, 0.35],           // builds under the sunrise, crests on "Until now." (3.4s)
    ["impact-bass-1", 3.15, 2.12, 0.55], // "Until now."
    ["whoosh", 4.4, 0.57, 0.38],         // sea sinks, sun parks in the corner
    ["pop", 5.0, 0.72, 0.3],             // b·b badge
    ["typing", 6.1, 1.4, 0.22],          // search placeholder types out
    ["whoosh", 8.55, 0.57, 0.38],        // sand wipe
    ["whoosh-short", 9.2, 0.57, 0.3],    // boarding pass slides in
    ["pop", 10.0, 0.72, 0.3], ["pop", 11.0, 0.72, 0.3], ["pop", 12.0, 0.72, 0.3], ["pop", 13.0, 0.72, 0.3], // four checks
    ["whoosh", 14.55, 0.57, 0.35],       // into the maps
    ["pop", 14.95, 0.72, 0.2], ["pop", 15.37, 0.72, 0.2], ["pop", 15.79, 0.72, 0.2], // tile cascade
    ["whoosh", 18.8, 0.57, 0.38],        // phone rises
    ["click-soft", 20.2, 0.37, 0.45],    // tap "Add to Home Screen"
    ["pop", 20.55, 0.72, 0.25],          // "Added" toast
    ["glitch-3", 21.2, 0.9, 0.18],       // signal drops
    ["click-soft", 22.35, 0.37, 0.45],   // tap a guide
    ["ping", 22.95, 1.32, 0.3],          // "Opened offline"
    ["whoosh", 24.0, 0.57, 0.38],        // browser window
    ["whoosh-short", 24.6, 0.57, 0.25],  // page scroll
    ["impact-bass-1", 26.85, 2.12, 0.45],// end card
    ["chime", 27.4, 2.5, 0.45],          // boracay.biz lands
  ],
  vertical: [
    ["riser", 0.3, 3.9, 0.35],           // crests on "Until now." (3.3s)
    ["impact-bass-1", 3.05, 2.12, 0.55],
    ["whoosh", 4.2, 0.57, 0.38],         // sun to the corner
    ["pop", 4.75, 0.72, 0.3],            // badge
    ["typing", 5.7, 1.2, 0.2],           // search types
    ["whoosh", 7.55, 0.57, 0.38],        // sand wipe + pass
    ["pop", 8.4, 0.72, 0.3], ["pop", 9.2, 0.72, 0.3], ["pop", 10.0, 0.72, 0.3], // three checks
    ["ping", 11.0, 1.32, 0.28],          // works-offline chip
    ["impact-bass-1", 12.25, 2.12, 0.45],// end card
    ["chime", 12.75, 2.2, 0.45],
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
