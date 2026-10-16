// Generates a giant-sequoia <symbol> (viewBox 0 0 200 800, ground at y=800) and
// splices it into index.html and vertical.html between the TREE markers.
// Seeded PRNG so the output is identical on every run.
import fs from "node:fs";
import path from "node:path";

let seed = 274.9 * 1000;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const r = (a, b) => a + (b - a) * rnd();
const f = (n) => n.toFixed(1);

// Trunk half-width by height: wide buttressed base, fast taper, then a slow column.
const trunkHalf = (y) => {
  const h = 800 - y; // height above ground
  if (h < 40) return 50 - h * 0.58 + Math.pow(Math.max(0, 40 - h) / 40, 2) * 8;
  return Math.max(4, h < 620 ? 27 - (h - 40) * 0.014 : 18.9 - (h - 620) * 0.12);
};
// Crown half-width envelope (narrow dome, widest around a third of the way down the crown).
const crownTop = 22, crownBottom = 470;
const crownHalf = (y) => {
  const t = (y - crownTop) / (crownBottom - crownTop); // 0 top .. 1 bottom
  if (t < 0) return 0;
  const dome = Math.sin(Math.min(1, t * 1.9) * Math.PI / 2);
  const taper = t > 0.75 ? 1 - (t - 0.75) * 1.2 : 1;
  return 18 + 62 * dome * taper;
};

// ---- trunk outline with slight wobble ----
const left = [], right = [];
for (let y = 800; y >= 90; y -= 10) {
  const w = trunkHalf(y) + (y > 700 ? r(-1.5, 1.5) : r(-0.6, 0.6));
  left.push([100 - w, y]);
  right.push([100 + w + (y > 760 ? 4 : 0), y]);
}
const trunkPath = "M" + left.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L") + " L" +
  right.reverse().map(([x, y]) => `${f(x)} ${f(y)}`).join(" L") + " Z";

// ---- bark fibres: long vertical strokes that follow the taper ----
let bark = "";
for (let i = 0; i < 26; i++) {
  const u = r(-0.85, 0.85);
  const y0 = r(560, 800), y1 = y0 - r(80, 260);
  const x0 = 100 + u * trunkHalf(y0), x1 = 100 + u * trunkHalf(Math.max(y1, 120));
  bark += `<path d="M${f(x0)} ${f(y0)} Q${f((x0 + x1) / 2 + r(-2, 2))} ${f((y0 + y1) / 2)} ${f(x1)} ${f(Math.max(y1, 120))}" stroke="#4a2114" stroke-opacity="${r(0.25, 0.55).toFixed(2)}" stroke-width="${r(0.8, 2.2).toFixed(1)}" fill="none"/>`;
}
// fire scar / burl near the base
bark += `<path d="M88 800 Q92 760 96 742 Q99 760 103 800 Z" fill="#3a1a10" opacity="0.55"/>`;

// ---- branches + foliage clumps ----
const clumps = [];
let branches = "";
const N = 22;
for (let i = 0; i < N; i++) {
  const y = crownBottom - 10 - i * ((crownBottom - 60) / N) + r(-6, 6);
  const side = i % 2 === 0 ? -1 : 1;
  const L = crownHalf(y) * r(0.7, 1.05);
  const sx = 100 + side * trunkHalf(y) * 0.6;
  const ex = 100 + side * L, ey = y - r(8, 34);
  const cx = 100 + side * L * 0.55, cy = y + r(-4, 10);
  const bw = Math.max(2, 11 - i * 0.42);
  branches += `<path d="M${f(sx)} ${f(y)} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}" stroke="#5a2a18" stroke-width="${f(bw)}" stroke-linecap="round" fill="none"/>`;
  for (const t of [0.5, 0.78, 1]) {
    const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
    const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * cy + t * t * ey;
    clumps.push({ x: px + r(-4, 4), y: py - r(2, 8), R: r(13, 20) * (0.55 + 0.45 * crownHalf(y) / 80), back: rnd() < 0.35 });
  }
}
// fill the core of the crown and cap the top
for (let y = 60; y < crownBottom - 30; y += 26) clumps.push({ x: 100 + r(-8, 8), y, R: r(14, 19), back: true });
clumps.push({ x: 100, y: 34, R: 15, back: false }, { x: 96, y: 52, R: 17, back: false });

// Each clump = many small circles in three tones (shadow below, mid, sunlit top-left).
const layer = (c, tone) => {
  let s = "";
  const n = tone === "dark" ? 9 : tone === "mid" ? 11 : 6;
  for (let k = 0; k < n; k++) {
    const a = r(0, Math.PI * 2), d = Math.sqrt(rnd()) * c.R * 0.85;
    let x = c.x + Math.cos(a) * d * 1.25, y = c.y + Math.sin(a) * d * 0.7;
    let rr = r(0.28, 0.46) * c.R;
    if (tone === "dark") y += c.R * 0.28;
    if (tone === "light") { x -= c.R * 0.25; y -= c.R * 0.32; rr *= 0.75; }
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}"/>`;
  }
  return s;
};
const foliage = (list) =>
  `<g fill="#2f5a40">${list.map((c) => layer(c, "dark")).join("")}</g>` +
  `<g fill="#4f8360">${list.map((c) => layer(c, "mid")).join("")}</g>` +
  `<g fill="#86b48f">${list.map((c) => layer(c, "light")).join("")}</g>`;

const back = clumps.filter((c) => c.back), front = clumps.filter((c) => !c.back);

const symbol = `<symbol id="sequoia" viewBox="0 0 200 800">
          <defs>
            <linearGradient id="bark-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stop-color="#7a3a22"/><stop offset="0.35" stop-color="#b8653d"/>
              <stop offset="0.7" stop-color="#94492b"/><stop offset="1" stop-color="#5e2c19"/>
            </linearGradient>
          </defs>
          <g opacity="0.92">${foliage(back)}</g>
          <path d="${trunkPath}" fill="url(#bark-grad)"/>
          <g>${bark}</g>
          <g>${branches}</g>
          ${foliage(front)}
        </symbol>`;

const dir = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")));
for (const file of ["index.html", "../sequoia-vertical/index.html"]) {
  const p = path.join(dir, file);
  const html = fs.readFileSync(p, "utf8");
  const out = html.replace(/<symbol id="sequoia"[\s\S]*?<\/symbol>/, symbol);
  if (out === html) throw new Error("symbol not found in " + file);
  fs.writeFileSync(p, out);
}
console.log("tree written:", clumps.length, "clumps");
