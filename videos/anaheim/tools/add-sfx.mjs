// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track.
import fs from "node:fs";
import path from "node:path";

const LEN = { chime: 2.5, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, "whoosh-short": 0.57, whoosh: 0.57, "click-soft": 0.37, ping: 1.32, typing: 1.5 };

// What-changed rows: strike (click-soft) then the update lands (pop).
const rows = (starts) => starts.flatMap((t) => [["click-soft", +(t + 0.45).toFixed(2), 0.37, 0.4], ["pop", +(t + 0.8).toFixed(2), 0.72, 0.28]]);

const CUES = {
  landscape: [
    ["whoosh-short", 0.15, 0.57, 0.35],   // live header drops in
    ["riser", 2.2, 3.4, 0.38],            // builds under the hook, crests on the headline (5.2s)
    ["impact-bass-1", 4.95, 2.12, 0.55],  // "Outside the gates: The practical guide."
    ["pop", 6.5, 0.72, 0.25],             // cited chip
    ["whoosh", 8.85, 0.57, 0.4],          // wipe to "What changed"
    ...rows([9.8, 11.3, 12.8, 14.3]),
    ["whoosh-short", 16.35, 0.57, 0.35],  // into the map
    ["pop", 16.9, 0.72, 0.25],            // venues
    ["pop", 17.3, 0.72, 0.2], ["pop", 17.75, 0.72, 0.2], // hotels popping
    ["ping", 18.95, 1.32, 0.2], ["ping", 19.55, 1.32, 0.2], ["ping", 20.15, 1.32, 0.2], // walking-minute badges
    ["whoosh", 21.55, 0.57, 0.4],         // browser flies in
    ["whoosh-short", 22.15, 0.57, 0.25],  // page scroll
    ["whoosh-short", 24.55, 0.57, 0.3],   // Ask Anaheim
    ["typing", 25.05, 1.2, 0.35],         // question types out
    ["click-soft", 26.3, 0.37, 0.45],     // search pressed
    ["pop", 26.45, 0.72, 0.3],            // answer card
    ["impact-bass-1", 27.0, 2.12, 0.45],  // end card
    ["chime", 27.45, 2.5, 0.45],          // wordmark lands
  ],
  vertical: [
    ["whoosh-short", 0.15, 0.57, 0.35],
    ["riser", 1.4, 3.1, 0.38],
    ["impact-bass-1", 4.15, 2.12, 0.55],
    ["whoosh", 7.25, 0.57, 0.4],
    ...rows([7.8, 8.9, 10.0]),
    ["impact-bass-1", 11.55, 2.12, 0.45],
    ["chime", 11.95, 2.5, 0.45],
    ["typing", 12.75, 1.2, 0.3],
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
