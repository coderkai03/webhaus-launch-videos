// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track.
// familylawriverside: calm and reassuring. Soft clicks, light whooshes, two chimes. No impacts, risers or glitches.
import fs from "node:fs";
import path from "node:path";

const LEN = { chime: 2.5, click: 0.37, "click-soft": 0.37, pop: 0.72, "whoosh-short": 0.57, whoosh: 0.57 };

const CUES = {
  landscape: [
    ["chime", 3.3, 2.0, 0.3],            // the plain-words line resolves out of the jargon
    ["whoosh-short", 5.55, 0.57, 0.25],  // Riverside photo + masthead
    ["pop", 7.6, 0.72, 0.18], ["pop", 7.78, 0.72, 0.18], ["pop", 7.96, 0.72, 0.18], // cited / dated / EN·ES chips
    ["whoosh-short", 10.15, 0.57, 0.25], // wipe to the map
    ["click-soft", 11.85, 0.37, 0.35], ["click-soft", 12.3, 0.37, 0.35], ["click-soft", 12.75, 0.37, 0.35], ["click-soft", 13.2, 0.37, 0.35], // pins land
    ["whoosh-short", 14.78, 0.57, 0.25], // wipe to the forms
    ["click-soft", 15.75, 0.37, 0.3], ["click-soft", 16.2, 0.37, 0.3], ["click-soft", 16.65, 0.37, 0.3], // FL-100 / FL-110 / FL-105 settle
    ["pop", 18.0, 0.72, 0.22],           // "Effective Jan 1, 2026" chip
    ["whoosh", 19.55, 0.57, 0.3],        // into the dark EN/ES frame
    ["click", 21.0, 0.37, 0.35],         // EN -> ES toggle
    ["whoosh", 23.35, 0.57, 0.35],       // browser window rises
    ["whoosh-short", 23.95, 0.57, 0.2],  // page scroll
    ["whoosh", 26.4, 0.57, 0.3],         // burgundy band wipes across
    ["chime", 28.15, 1.85, 0.45],        // familylawriverside.com lands
  ],
  vertical: [
    ["chime", 2.75, 1.85, 0.3],
    ["whoosh-short", 4.35, 0.57, 0.25],
    ["pop", 5.9, 0.72, 0.18], ["pop", 6.08, 0.72, 0.18],
    ["whoosh-short", 7.55, 0.57, 0.25],
    ["click-soft", 8.25, 0.37, 0.3], ["click-soft", 8.6, 0.37, 0.3], ["click-soft", 8.95, 0.37, 0.3],
    ["pop", 10.35, 0.72, 0.22],
    ["whoosh", 11.25, 0.57, 0.3],
    ["chime", 12.75, 2.25, 0.45],
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
