// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track.
import fs from "node:fs";
import path from "node:path";

const LEN = { chime: 2.5, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, "whoosh-short": 0.57, whoosh: 0.57, typing: 1.5, "click-soft": 0.37, ping: 1.32 };

const CUES = {
  landscape: [
    ["whoosh-short", 0.15, 0.57, 0.3],   // teal rule draws across
    ["typing", 1.0, 1.35, 0.3],          // eyebrow types out
    ["riser", 0.6, 3.6, 0.3],            // builds under the hook, crests on "read the desk."
    ["impact-bass-1", 3.2, 2.12, 0.5],   // "read the desk." lands (3.45)
    ["whoosh-short", 5.0, 0.57, 0.3],    // headline rises
    ["pop", 6.6, 0.72, 0.22],            // desk tabs
    ["whoosh", 9.5, 0.57, 0.38],         // into the data desk
    ["click-soft", 10.6, 0.37, 0.25], ["click-soft", 10.78, 0.37, 0.22], ["click-soft", 10.96, 0.37, 0.22],
    ["click-soft", 11.14, 0.37, 0.22], ["click-soft", 11.32, 0.37, 0.22], ["click-soft", 11.5, 0.37, 0.22],
    ["click-soft", 11.68, 0.37, 0.22], ["click-soft", 11.86, 0.37, 0.22], ["click-soft", 12.04, 0.37, 0.25], // bars, month by month
    ["ping", 12.55, 1.32, 0.3],          // "Pending" tag
    ["whoosh", 15.05, 0.57, 0.38],       // into the three desks
    ["impact-bass-1", 15.8, 2.12, 0.5], ["impact-bass-1", 16.8, 2.12, 0.42], ["impact-bass-1", 17.8, 2.12, 0.42], // cards slam (t+0.3)
    ["pop", 16.35, 0.72, 0.26], ["pop", 17.35, 0.72, 0.26], ["pop", 18.35, 0.72, 0.26], // figures flash
    ["whoosh", 22.5, 0.57, 0.4],         // browser flies in
    ["whoosh-short", 23.2, 0.57, 0.25],  // page scroll
    ["impact-bass-1", 26.7, 2.12, 0.45], // end-card wordmark
    ["chime", 27.0, 2.5, 0.45],
  ],
  vertical: [
    ["whoosh-short", 0.15, 0.57, 0.3],   // teal rule draws
    ["typing", 0.9, 1.3, 0.3],           // eyebrow types out
    ["riser", 0.0, 3.4, 0.3],            // crests on "read the desk."
    ["impact-bass-1", 2.7, 2.12, 0.5],   // "read the desk." lands (2.96)
    ["whoosh-short", 4.05, 0.57, 0.3],   // headline rises
    ["whoosh", 6.9, 0.57, 0.38],         // into the three desks
    ["impact-bass-1", 7.35, 2.12, 0.48], ["impact-bass-1", 8.15, 2.12, 0.4], ["impact-bass-1", 8.95, 2.12, 0.4], // cards slam
    ["pop", 7.85, 0.72, 0.26], ["pop", 8.65, 0.72, 0.26], ["pop", 9.45, 0.72, 0.26], // figures flash
    ["impact-bass-1", 12.15, 2.12, 0.45], // end-card wordmark
    ["chime", 12.45, 2.5, 0.45],
  ],
};

const [dir, kind] = process.argv.slice(2);
const file = path.join(dir, "index.html");
let html = fs.readFileSync(file, "utf8");
html = html.replace(/\n      <!-- Sound effects[\s\S]*?<!-- \/Sound effects -->\n/, "\n");

const sorted = CUES[kind].slice().sort((a, b) => a[1] - b[1]);
const trackEnds = [];
const tags = sorted.map(([name, start, dur, vol], i) => {
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
