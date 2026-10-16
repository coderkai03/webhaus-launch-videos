// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track. Adapted from sequoia/tools/add-sfx.mjs.
import fs from "node:fs";
import path from "node:path";

const LEN = {
  chime: 2.5, "click-soft": 0.37, "impact-bass-1": 2.12, "key-press": 0.4, ping: 1.32, pop: 0.72,
  sparkle: 1.8, typing: 1.5, "whoosh-short": 0.57, whoosh: 0.57,
};

const CUES = {
  landscape: [
    ["whoosh-short", 0.05, 0.57, 0.35],   // round 1 card lands
    ["pop", 0.8, 0.72, 0.25],             // paw buttons pop in
    ["click-soft", 1.2, 0.37, 0.3],       // buttons wiggle
    ["impact-bass-1", 1.65, 2.12, 0.45],  // REAL. stamp (round 1, hit 1.9)
    ["pop", 2.3, 0.72, 0.22],             // breed tag
    ["whoosh-short", 2.95, 0.57, 0.35],   // round 2 card swaps in
    ["click-soft", 3.45, 0.37, 0.3],
    ["impact-bass-1", 3.9, 2.12, 0.4],    // REAL. stamp (round 2, hit 4.15)
    ["pop", 4.55, 0.72, 0.22],
    ["whoosh-short", 4.95, 0.57, 0.35],   // round 3 card
    ["click-soft", 5.45, 0.37, 0.3],
    ["impact-bass-1", 5.9, 2.12, 0.5],    // REAL. stamp (round 3, hit 6.15)
    ["pop", 6.55, 0.72, 0.22],
    ["whoosh", 6.95, 0.57, 0.35],         // cards line up
    ["pop", 7.5, 0.72, 0.3],              // "All three? Real."
    ["whoosh", 8.9, 0.57, 0.4],           // circle wipe to the headline
    ["pop", 9.6, 0.72, 0.35],             // Biscuit lands
    ["sparkle", 9.75, 1.8, 0.2],
    ["pop", 10.5, 0.72, 0.22], ["pop", 10.7, 0.72, 0.22], ["pop", 10.9, 0.72, 0.22], // stat pills
    ["whoosh", 13.95, 0.57, 0.3],         // tonal shift: your own dog
    ["click-soft", 14.6, 0.37, 0.3], ["click-soft", 14.85, 0.37, 0.3], ["click-soft", 15.1, 0.37, 0.3], // photos
    ["sparkle", 18.3, 1.8, 0.16],         // rainbow arc, gentle
    ["whoosh-short", 21.3, 0.57, 0.3],    // search slides up
    ["typing", 21.98, 0.8, 0.35],         // "corgi"
    ["click-soft", 22.85, 0.37, 0.4],     // Find
    ["whoosh-short", 23.0, 0.57, 0.25],   // result card
    ["ping", 23.6, 1.32, 0.3],            // from $3.99
    ["whoosh", 24.65, 0.57, 0.4],         // browser flies in
    ["whoosh-short", 25.25, 0.57, 0.25],  // page scroll
    ["impact-bass-1", 27.5, 2.12, 0.45],  // end-card pup lands
    ["chime", 27.8, 2.2, 0.45],           // plush-dogs.com
  ],
  vertical: [
    ["whoosh-short", 0.05, 0.57, 0.35],
    ["pop", 0.7, 0.72, 0.25],
    ["click-soft", 1.1, 0.37, 0.3],
    ["impact-bass-1", 1.45, 2.12, 0.45],  // stamp 1 (hit 1.7)
    ["pop", 2.1, 0.72, 0.22],
    ["whoosh-short", 2.6, 0.57, 0.35],
    ["click-soft", 3.05, 0.37, 0.3],
    ["impact-bass-1", 3.45, 2.12, 0.5],   // stamp 2 (hit 3.7)
    ["pop", 4.1, 0.72, 0.22],
    ["pop", 4.75, 0.72, 0.3],             // "Both? Real."
    ["whoosh", 5.95, 0.57, 0.4],          // headline wipe
    ["pop", 6.6, 0.72, 0.35],             // Biscuit lands
    ["sparkle", 6.75, 1.8, 0.2],
    ["pop", 7.6, 0.72, 0.22], ["pop", 7.8, 0.72, 0.22], ["pop", 8.0, 0.72, 0.22],
    ["whoosh-short", 9.6, 0.57, 0.3],
    ["typing", 10.1, 0.75, 0.35],
    ["click-soft", 10.95, 0.37, 0.4],
    ["whoosh-short", 11.05, 0.57, 0.25],
    ["ping", 11.6, 1.32, 0.3],
    ["impact-bass-1", 12.55, 2.12, 0.45],
    ["chime", 12.85, 2.1, 0.45],
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
