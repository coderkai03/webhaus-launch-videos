// Finds the teal (hotel) and orange (venue) dots baked into the site's map card.
import fs from "node:fs";
const W = 1200, H = 675, buf = fs.readFileSync(new URL("./map.rgb", import.meta.url));
const kind = (r, g, b) => {
  if (Math.abs(r - 42) < 40 && Math.abs(g - 180) < 35 && Math.abs(b - 198) < 35 && b > r + 80) return "t";
  if (r > 220 && Math.abs(g - 154) < 30 && b < 80) return "o";
  return null;
};
const seen = new Uint8Array(W * H), out = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x; if (seen[i]) continue;
  const k = kind(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]); if (!k) continue;
  const st = [i]; seen[i] = 1; let n = 0, sx = 0, sy = 0;
  while (st.length) { const j = st.pop(); const jx = j % W, jy = (j / W) | 0; n++; sx += jx; sy += jy;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = jx + dx, ny = jy + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx; if (seen[q]) continue; if (kind(buf[q*3], buf[q*3+1], buf[q*3+2]) === k) { seen[q] = 1; st.push(q); } } }
  if (n > 25) out.push({ k, x: +(sx / n).toFixed(1), y: +(sy / n).toFixed(1), n });
}
console.log(JSON.stringify(out));
console.error(out.filter(d=>d.k==="t").length, "teal", out.filter(d=>d.k==="o").length, "orange");
