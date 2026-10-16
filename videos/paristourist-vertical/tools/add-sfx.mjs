// Inserts (or replaces) the sound-effects block in a project's index.html.
// Usage: node tools/add-sfx.mjs <project-dir> <landscape|vertical>
// Cue: [file, start(s), duration(s), volume]. Tracks are assigned greedily so no two
// overlapping cues share a track.
import fs from "node:fs";
import path from "node:path";

const LEN = { chime: 2.5, click: 0.37, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, typing: 1.5, "whoosh-short": 0.57, whoosh: 0.57 };

const CUES = {
  landscape: [
    ["whoosh-short", 0.3, 0.57, 0.3],    // metro line starts drawing
    ["impact-bass-1", 2.95, 2.12, 0.55], // "This site has sources." lands (3.2s)
    ["whoosh-short", 5.05, 0.57, 0.35],  // headline rises
    ["whoosh", 9.55, 0.57, 0.4],         // tint wipe into the journey
    ["typing", 10.75, 1.1, 0.3],         // "Do I need a ticket for Notre-Dame?"
    ["click", 11.95, 0.37, 0.4],         // SEARCH
    ["pop", 12.85, 0.72, 0.32],          // cited chip
    ["whoosh-short", 13.5, 0.57, 0.32],  // line slides to stop 2
    ["typing", 14.25, 0.8, 0.3],
    ["click", 15.15, 0.37, 0.4],
    ["pop", 16.0, 0.72, 0.32],
    ["whoosh-short", 16.6, 0.57, 0.32],  // line slides to stop 3
    ["typing", 17.35, 0.8, 0.3],
    ["click", 18.25, 0.37, 0.4],
    ["pop", 19.0, 0.72, 0.32],
    ["whoosh-short", 19.6, 0.57, 0.3],   // into the sights
    ["pop", 20.15, 0.72, 0.22], ["pop", 20.3, 0.72, 0.22], ["pop", 20.45, 0.72, 0.22], ["pop", 20.6, 0.72, 0.22],
    ["whoosh", 23.65, 0.57, 0.4],        // browser flies in
    ["whoosh-short", 24.2, 0.57, 0.25],  // page scroll
    ["riser", 24.15, 3.2, 0.3],          // crests as the end card lands (~27.15s)
    ["impact-bass-1", 26.9, 2.12, 0.45], // tricolore wipe begins
    ["chime", 27.6, 2.4, 0.45],          // URL fully revealed
  ],
  vertical: [
    ["whoosh-short", 0.25, 0.57, 0.3],
    ["impact-bass-1", 2.6, 2.12, 0.55],  // "sources." lands (2.85s)
    ["whoosh-short", 4.15, 0.57, 0.35],
    ["whoosh", 7.55, 0.57, 0.4],
    ["typing", 8.65, 1.1, 0.3],
    ["click", 9.85, 0.37, 0.4],
    ["pop", 10.75, 0.72, 0.32],
    ["riser", 9.3, 3.2, 0.3],
    ["impact-bass-1", 12.15, 2.12, 0.45],
    ["chime", 12.85, 2.15, 0.45],
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
