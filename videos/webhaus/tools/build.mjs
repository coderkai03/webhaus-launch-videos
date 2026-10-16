// Generates index.html for webhaus (16:9, 30s) and webhaus-vertical (9:16, 15s).
// Spine data is taken verbatim from webhaus.info's "addresses" shelf (see screenshots/webhaus-spines.txt).
// Usage: node tools/build.mjs   (run from videos/webhaus)
import fs from "node:fs";
import path from "node:path";

const SITES = [
  { key: "01-sequoia", name: "sequoia.info", font: "'Schibsted Grotesk'", weight: 700, size: 1, bg: "#14261f", mark: "#8fbf9d", shape: "circle",
    url: "sequoia.info", tag: "Everything about the biggest trees on Earth and where to see them.", chips: ["169 articles", "The parks and the trees", "Every fact cited"] },
  { key: "02-paristourist", name: "PARIS TOURIST", font: "'Barlow Semi Condensed'", weight: 700, size: 1.05, ls: "0.03em", bg: "#173f8f", mark: "#ffcd00", shape: "square",
    url: "paristourist.info", tag: "Straight answers about Paris, with sources.", chips: ["48 answers, one question per page", "1,879 tours listed", "An interactive map of the city"] },
  { key: "03-anaheim", name: "ANAHEIM", suffix: ".INFO", suffixColor: "#2ab4c6", font: "'Open Sans'", weight: 300, size: 0.92, ls: "0.12em", bg: "#2b2e33", mark: "#2ab4c6", shape: "triangle",
    url: "anaheim.info", tag: "Anaheim, the practical guide.", chips: ["72 guides at launch", "A map of 62 hotels with walking minutes", "A new post every Thursday"] },
  { key: "04-bavarianbistro", name: "Bavarian Bistro", font: "'UnifrakturCook'", weight: 700, size: 0.92, bg: "#2f5fa8", mark: "#f0c668", shape: "circle",
    url: "bavarianbistro.com", tag: "Bavaria, explained. Served warm.", chips: ["195 guides", "Food, beer, Oktoberfest, Munich", "Written under the pen name Resi Zauber"] },
  { key: "05-longbeach", name: "LongBeach", suffix: ".biz", suffixColor: "#2ec4b6", font: "'Source Serif 4'", weight: 600, size: 1, bg: "#1b3a5c", mark: "#2ec4b6", shape: "square",
    url: "longbeach.biz", tag: "The business intelligence desk for Long Beach, CA.", chips: ["88 guides", "Data pages built from the city's open data", "A map and a figure in most articles"] },
  { key: "06-boracay", name: "boracay", suffix: ".biz", suffixColor: "#ffd9a8", font: "system-ui", weight: 800, size: 1, bg: "#0b7a8a", mark: "#ffd9a8", shape: "triangle",
    url: "boracay.biz", tag: "The practical, current, cited guide to Boracay.", chips: ["50 guides", "6 maps, one layer each", "Built for the phone first"] },
  { key: "07-plushdogs", name: "plush dogs", font: "'Nunito'", weight: 900, size: 1, bg: "#581b87", mark: "#ffd9c7", shape: "circle",
    url: "plush-dogs.com", tag: "Stuffed dogs that look real.", chips: ["49 guides", "22 breeds, 8 makers, prices dated", "A plush of your own dog"] },
  { key: "08-familylawriverside", name: "Family Law Riverside", font: "'Palatino WH'", weight: 700, size: 0.92, bg: "#5f2230", mark: "#e0c9b0", shape: "square",
    url: "familylawriverside.com", tag: "The Riverside County family court, explained.", chips: ["26 guides, 10 of them in Spanish", "Cited to the court and the Family Code", "Legal information, not a law firm"] },
];

const FONTS = `
      @font-face { font-family: "Jost"; src: url("assets/fonts/jost.woff2") format("woff2"); font-weight: 300 800; }
      @font-face { font-family: "Schibsted Grotesk"; src: url("assets/fonts/schibsted-grotesk-700.woff2") format("woff2"); font-weight: 700; }
      @font-face { font-family: "Barlow Semi Condensed"; src: url("assets/fonts/barlow-semi-condensed-700.woff2") format("woff2"); font-weight: 700; }
      @font-face { font-family: "Open Sans"; src: url("assets/fonts/open-sans-300.woff2") format("woff2"); font-weight: 300; }
      @font-face { font-family: "UnifrakturCook"; src: url("assets/fonts/unifrakturcook-700.woff2") format("woff2"); font-weight: 700; }
      @font-face { font-family: "Source Serif 4"; src: url("assets/fonts/source-serif-4-600.woff2") format("woff2"); font-weight: 600; }
      @font-face { font-family: "Nunito"; src: url("assets/fonts/nunito-900.woff2") format("woff2"); font-weight: 900; }
      @font-face { font-family: "Palatino WH"; src: url("assets/fonts/palab.ttf") format("truetype"); font-weight: 700; }
      @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/plex-mono-500.woff2") format("woff2"); font-weight: 500; }`;

const BASE_CSS = `
      :root { --bg: #e9ebee; --card: #ffffff; --ink: #14161a; --dim: #555b66; --soft: #cfd3d9; --red: #d8352a; --blue: #1d4fa3; --yellow: #f2b90f;
              --frame-bar: #dfe2e7; --frame-dot: #a9aeb8; --frame-url: #3f4550; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; overflow: hidden; background: var(--bg); }
      svg { overflow: visible; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Jost", sans-serif; color: var(--ink); background: var(--bg); }
      .clip { position: absolute; inset: 0; }
      .abs { position: absolute; }
      .mask { overflow: hidden; display: block; }
      .mask > span { display: block; }
      .rule { position: absolute; height: 3px; background: var(--ink); transform-origin: left center; }
      .mark { display: block; flex: none; }
      .chip { border: 1.5px solid rgba(255,255,255,0.85); color: #fff; font-weight: 500; white-space: nowrap; }
      .frame { position: absolute; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 18px 50px rgba(0,0,0,0.28); }
      .frame .bar { background: var(--frame-bar); display: flex; align-items: center; gap: 8px; padding: 0 16px; }
      .frame .bar i { display: block; width: 11px; height: 11px; border-radius: 50%; background: var(--frame-dot); }
      .frame .bar b { font-family: "IBM Plex Mono", monospace; font-weight: 500; color: var(--frame-url); margin-left: 12px; }
      .frame .screen { background: #0e1012; }
      video.win { position: absolute; object-fit: cover; }`;

const markSvg = (s, px) => {
  const c = s.mark;
  if (s.shape === "circle") return `<svg class="mark" width="${px}" height="${px}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="${c}"/></svg>`;
  if (s.shape === "square") return `<svg class="mark" width="${px}" height="${px}" viewBox="0 0 10 10"><rect width="10" height="10" fill="${c}"/></svg>`;
  return `<svg class="mark" width="${px}" height="${px}" viewBox="0 0 10 10"><polygon points="5,0 10,10 0,10" fill="${c}"/></svg>`;
};
const nameHtml = (s) => `${s.name}${s.suffix ? `<span style="color:${s.suffixColor}">${s.suffix}</span>` : ""}`;
const nameStyle = (s, px) => `font-family:${s.font};font-weight:${s.weight};font-size:${Math.round(px * s.size)}px;letter-spacing:${s.ls || "0"};white-space:nowrap;line-height:1;`;

// The site's hero house (viewBox 0 0 420 330), with ids so each block can be animated.
const house = (id, w, x, y, outline) => `
        <svg id="${id}" class="abs" style="left:${x}px;top:${y}px" width="${w}" height="${Math.round(w * 330 / 420)}" viewBox="0 0 420 330">
          ${outline ? `<g id="${id}-outline" fill="none" stroke="#a9aeb8" stroke-width="3" stroke-dasharray="12 9">
            <rect x="60" y="150" width="200" height="180"/><polygon points="30,150 160,20 290,150"/></g>` : ""}
          <rect id="${id}-body" x="60" y="150" width="200" height="180" fill="#1d4fa3"/>
          <rect id="${id}-door" x="135" y="230" width="50" height="100" fill="#e9ebee"/>
          <polygon id="${id}-roof" points="30,150 160,20 290,150" fill="#f2b90f"/>
          <circle id="${id}-sun" cx="350" cy="70" r="56" fill="#d8352a"/>
          <rect id="${id}-ground" x="290" y="318" width="130" height="12" fill="#14161a"/>
        </svg>`;

// Animates a house's blocks assembling, starting at t. Returns the time the build completes.
const buildHouse = (id, t, k = 1) => `
      tl.fromTo("#${id}-body", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: ${0.45 * k}, ease: "back.out(1.6)" }, ${t});
      tl.fromTo("#${id}-door", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: ${0.3 * k}, ease: "power3.out" }, ${t + 0.45 * k});
      tl.fromTo("#${id}-roof", { y: -420, opacity: 0 }, { y: 0, opacity: 1, duration: ${0.42 * k}, ease: "bounce.out" }, ${t + 0.7 * k});
      tl.fromTo("#${id}-sun", { scale: 0, transformOrigin: "50% 50%", x: 160 }, { scale: 1, x: 0, duration: ${0.5 * k}, ease: "back.out(2.2)" }, ${t + 1.25 * k});
      tl.fromTo("#${id}-ground", { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: ${0.35 * k}, ease: "power3.out" }, ${t + 1.5 * k});`;

const logoSvg = (px) => `<svg width="${px}" height="${px}" viewBox="0 0 30 30"><rect x="3" y="14" width="16" height="14" fill="#1d4fa3"/><polygon points="1,14 11,3 21,14" fill="#f2b90f"/><circle cx="24.5" cy="6.5" r="4.5" fill="#d8352a"/></svg>`;

const page = ({ w, h, id, dur, css, body, script, title }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${w}, height=${h}" />
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>${FONTS}${BASE_CSS}
      html, body { width: ${w}px; height: ${h}px; }${css}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${id}" data-start="0" data-duration="${dur}" data-width="${w}" data-height="${h}">
${body}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
${script}
      window.__timelines["${id}"] = tl;
    </script>
  </body>
</html>
`;

// ------------------------------------------------------------------ 16:9 master
function landscape() {
  const RACK_X = 140, RACK_Y = 210, RACK_H = 760, SPINE = 74, GAP = 8, OPEN = 1640 - 7 * SPINE - 7 * GAP; // 1066
  const T0 = 10.95, STEP = 1.3;
  const opens = SITES.map((_, i) => +(T0 + i * STEP).toFixed(2));
  const FR = { x: 100, y: 250, w: 760, bar: 36 }; // frame inside an open spine
  const vidH = Math.round(FR.w * 9 / 16);

  const spines = SITES.map((s, i) => `
          <div class="spine" id="sp${i}" style="background:${s.bg}">
            <div class="sp-head">${markSvg(s, 18)}</div>
            <div class="sp-name" style="${nameStyle(s, 30)}color:#fff">${nameHtml(s)}</div>
            <div class="pc" id="pc${i}">
              <div class="pc-name" style="${nameStyle(s, 68)}color:#fff">${nameHtml(s)}</div>
              <div class="pc-tag">${s.tag}</div>
              <div class="pc-chips">${(s.chips.join("").length > 85 ? s.chips.slice(0, 2) : s.chips).map((c) => `<span class="chip">${c}</span>`).join("")}</div>
              <div class="frame" style="left:0;top:${FR.y - 44}px;width:${FR.w}px;height:${FR.bar + vidH}px">
                <div class="bar" style="height:${FR.bar}px"><i></i><i></i><i></i><b style="font-size:15px">${s.url}</b></div>
                <div class="screen" style="height:${vidH}px;background:#0e1012 url(assets/posters/${s.key}.jpg) center/cover no-repeat"></div>
              </div>
            </div>
          </div>`).join("");

  const videos = SITES.map((s, i) => {
    const left = RACK_X + i * (SPINE + GAP) + FR.x;
    const top = RACK_Y + FR.y + FR.bar;
    const start = +(opens[i] + 0.5).toFixed(2);
    const d = i < 7 ? +(STEP - 0.52).toFixed(2) : 0.98;
    return `      <video id="v${i}" class="clip win" src="assets/clips/${s.key}.mp4" muted playsinline data-start="${start}" data-duration="${d}" data-media-start="0.15" data-track-index="${3 + (i % 2)}"
        style="inset:auto;left:${left}px;top:${top}px;width:${FR.w}px;height:${vidH}px;border-radius:0 0 10px 10px"></video>`;
  }).join("\n");

  const css = `
      #hero-words { left: 140px; top: 300px; }
      .stamp { font-size: 108px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.05; }
      #wordmark { left: 132px; top: 130px; font-size: 240px; font-weight: 700; letter-spacing: -0.045em; line-height: 0.8; }
      #hero-sub { left: 140px; top: 600px; width: 720px; font-size: 38px; font-weight: 400; line-height: 1.42; }
      #header { left: 0; top: 0; width: 1920px; height: 96px; }
      #header .logo { position: absolute; left: 140px; top: 28px; display: flex; align-items: center; gap: 14px; font-size: 32px; font-weight: 600; }
      #header .nav { position: absolute; right: 140px; top: 34px; display: flex; gap: 34px; font-size: 22px; font-weight: 500; }
      #shelf-title { left: 140px; top: 112px; font-size: 64px; font-weight: 700; letter-spacing: -0.03em; }
      #shelf-sub { right: 140px; top: 142px; font-size: 25px; color: var(--dim); }
      #rack { position: absolute; left: ${RACK_X}px; top: ${RACK_Y}px; width: 1640px; height: ${RACK_H}px; display: flex; gap: ${GAP}px; }
      .spine { position: relative; flex: none; width: ${SPINE}px; height: 100%; overflow: hidden; }
      .sp-head { position: absolute; left: 0; width: ${SPINE}px; top: 30px; display: flex; justify-content: center; }
      .sp-name { position: absolute; left: 0; width: ${SPINE}px; top: 74px; writing-mode: vertical-rl; display: flex; align-items: center; }
      .pc { position: absolute; left: ${FR.x}px; top: 44px; width: 920px; height: ${RACK_H - 44}px; }
      .pc-name { position: absolute; left: 0; top: 0; }
      .pc-tag { position: absolute; left: 0; top: 92px; width: 900px; font-size: 30px; font-weight: 500; color: #fff; line-height: 1.25; }
      .pc-chips { position: absolute; left: 0; top: 146px; display: flex; gap: 12px; }
      .pc-chips .chip { font-size: 19px; padding: 7px 14px; }
      #cta-tri { left: 140px; top: 400px; }
      #cta-text { left: 330px; top: 372px; width: 1400px; font-size: 76px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.12; }
      #cta-mail { position: relative; display: inline-block; }
      #cta-line { position: absolute; left: 0; right: 0; bottom: 2px; height: 5px; background: var(--ink); transform-origin: left center; }
      #end-wrap { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
      #end-name { font-size: 176px; font-weight: 700; letter-spacing: -0.045em; line-height: 1; margin-top: 30px; }
      #end-tag { font-size: 48px; font-weight: 500; margin-top: 22px; letter-spacing: -0.01em; }
      #end-url { font-size: 30px; color: var(--dim); margin-top: 26px; }
      #end-meta { left: 0; width: 1920px; top: 968px; text-align: center; font-size: 21px; color: var(--dim); }`;

  const body = `
      <!-- Sound effects -->
__SFX__

      <!-- 1–2: vacant lot, then the house builds and the wordmark lands -->
      <section id="s-hero" class="clip" data-start="0" data-duration="9.7" data-track-index="0">
        <div id="hero-inner" class="abs" style="inset:0">
          ${house("h", 600, 1180, 250, true)}
          <div id="hero-words" class="abs" data-layout-allow-overlap data-layout-allow-overflow>
            <div class="mask" data-layout-allow-overflow><span class="stamp" id="w1">Undeveloped.</span></div>
            <div class="mask" data-layout-allow-overflow><span class="stamp" id="w2" style="color:var(--red)">Underperforming.</span></div>
          </div>
          <div id="wordmark" class="abs" data-layout-allow-overlap data-layout-allow-overflow><div class="mask" data-layout-allow-overflow><span id="wm1">web</span></div><div class="mask" data-layout-allow-overflow><span id="wm2">haus</span></div></div>
          <div id="hero-sub" class="abs">We give undeveloped and underperforming web addresses a home, and fill it with a real purpose.</div>
        </div>
      </section>

      <!-- Site header (persists from the wordmark through the shelf) -->
      <section id="s-header" class="clip" data-start="7.6" data-duration="13.9" data-track-index="1">
        <div id="header" class="abs">
          <div class="logo">${logoSvg(34)}<span>webhaus</span></div>
          <div class="nav"><span>Addresses</span><span>Press</span><span>Contact</span></div>
          <div class="rule" id="hdr-rule" style="left:140px;top:92px;width:1640px"></div>
        </div>
      </section>

      <!-- 3: pick a spine -->
      <section id="s-shelf" class="clip" data-start="9.3" data-duration="12.2" data-track-index="2">
        <div id="shelf-inner" class="abs" style="inset:0">
          <div id="shelf-title" class="abs">addresses</div>
          <div id="shelf-sub" class="abs">8 live sites · pick a spine</div>
          <div id="rack">${spines}
          </div>
        </div>
      </section>

      <!-- Clips from each site's launch video, playing inside the open spine's browser frame -->
${videos}

      <!-- 4: the ask -->
      <section id="s-cta" class="clip" data-start="21.5" data-duration="4.4" data-track-index="2">
        <div id="cta-inner" class="abs" style="inset:0">
          <div class="rule" id="cta-r1" style="left:140px;top:300px;width:1640px"></div>
          <svg id="cta-tri" class="abs" width="150" height="130" viewBox="0 0 150 130"><polygon points="75,0 150,130 0,130" fill="#f2b90f"/></svg>
          <div id="cta-text" class="abs">
            <div class="mask" data-layout-allow-overflow><span id="cta-l1">Own a web address that deserves</span></div>
            <div class="mask" data-layout-allow-overflow><span id="cta-l2">a better home? Write to</span></div>
            <div class="mask" data-layout-allow-overflow><span id="cta-l3"><span id="cta-mail">hello@webhaus.info<i id="cta-line"></i></span>.</span></div>
          </div>
          <div class="rule" id="cta-r2" style="left:140px;top:770px;width:1640px"></div>
        </div>
      </section>

      <!-- 5: end card -->
      <section id="s-end" class="clip" data-start="25.9" data-duration="4.1" data-track-index="2">
        <div id="end-wrap">
          ${house("e", 230, 0, 0, false).replace('class="abs" style="left:0px;top:0px"', 'style="position:relative"')}
          <div id="end-name">webhaus</div>
          <div id="end-tag">Good homes for good domains.</div>
          <div id="end-url">webhaus.info</div>
        </div>
        <div id="end-meta" class="abs">Webhaus LLC · An independent publisher · Sacramento, California</div>
      </section>`;

  let script = `
      // 1. vacant lot
      tl.fromTo("#h-outline", { opacity: 0, scale: 0.94, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 0.2);
      gsap.set(["#h-body", "#h-door", "#h-roof", "#h-sun", "#h-ground"], { opacity: 0 });
      tl.set(["#h-body", "#h-door", "#h-roof", "#h-sun", "#h-ground"], { opacity: 1 }, 4.45);
      tl.fromTo("#w1", { yPercent: 105 }, { yPercent: 0, duration: 0.55, ease: "power4.out" }, 0.9);
      tl.fromTo("#w2", { yPercent: 105 }, { yPercent: 0, duration: 0.55, ease: "power4.out" }, 1.7);
      tl.to(["#w1", "#w2"], { yPercent: -140, opacity: 0, duration: 0.45, ease: "power3.in", stagger: 0.08 }, 4.1);

      // 2. the house builds, then the wordmark
${buildHouse("h", 4.45)}
      tl.to("#h-outline", { opacity: 0, duration: 0.4 }, 5.3);
      tl.fromTo("#wm1", { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: "power4.out" }, 6.35);
      tl.fromTo("#wm2", { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: "power4.out" }, 6.55);
      tl.fromTo("#hero-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 7.15);
      tl.fromTo("#header .logo, #header .nav", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 }, 7.6);
      tl.fromTo("#hdr-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 7.7);
      tl.to("#hero-inner", { y: -700, opacity: 0, duration: 0.7, ease: "power3.in" }, 9.0);

      // 3. pick a spine
      tl.fromTo("#shelf-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 9.45);
      tl.fromTo("#shelf-sub", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 9.65);
      tl.fromTo(".spine", { y: 820 }, { y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 }, 9.55);
      gsap.set(".pc", { opacity: 0 });`;
  SITES.forEach((_, i) => {
    const t = opens[i];
    script += `
      tl.to("#sp${i}", { width: ${OPEN}, duration: 0.5, ease: "power3.inOut" }, ${t});${i > 0 ? `
      tl.to("#sp${i - 1}", { width: ${SPINE}, duration: 0.5, ease: "power3.inOut" }, ${t});
      tl.to("#pc${i - 1}", { opacity: 0, duration: 0.18 }, ${t});` : ""}
      tl.fromTo("#sp${i} .sp-name", { opacity: 1 }, { opacity: 0, duration: 0.2 }, ${t});${i > 0 ? `
      tl.to("#sp${i - 1} .sp-name", { opacity: 1, duration: 0.3 }, ${(t + 0.3).toFixed(2)});` : ""}
      tl.fromTo("#pc${i}", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, ${(t + 0.22).toFixed(2)});
      tl.fromTo("#v${i}", { opacity: 0 }, { opacity: 1, duration: 0.2 }, ${(t + 0.5).toFixed(2)});`;
  });
  script += `
      tl.to("#shelf-inner", { y: -80, opacity: 0, duration: 0.4, ease: "power2.in" }, 21.1);
      tl.to("#v7", { opacity: 0, duration: 0.4 }, 21.1);
      tl.to("#header", { opacity: 0, duration: 0.4 }, 21.1);

      // 4. the ask
      tl.fromTo("#cta-r1", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 21.55);
      tl.fromTo("#cta-tri", { scale: 0, rotation: -90, transformOrigin: "50% 70%" }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" }, 21.8);
      tl.fromTo(["#cta-l1", "#cta-l2", "#cta-l3"], { yPercent: 105 }, { yPercent: 0, duration: 0.55, ease: "power4.out", stagger: 0.16 }, 22.0);
      tl.fromTo("#cta-line", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 23.0);
      tl.fromTo("#cta-r2", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 22.6);
      tl.to("#cta-inner", { opacity: 0, duration: 0.35 }, 25.5);

      // 5. end card
${buildHouse("e", 25.95, 0.6)}
      tl.fromTo("#end-name", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 26.75);
      tl.fromTo("#end-tag", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 27.05);
      tl.fromTo("#end-url", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 27.35);
      tl.fromTo("#end-meta", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 27.8);`;

  const sfx = [
    ["pop", 0.95, 0.3], ["pop", 1.75, 0.3],
    ["riser", 3.4, 0.3, 3.4],              // crests on "web"
    ["whoosh-short", 4.4, 0.3], ["click-soft", 4.85, 0.35],
    ["impact-bass-1", 4.95, 0.45],         // roof lands ~5.2
    ["pop", 5.75, 0.4], ["whoosh-short", 5.95, 0.22],
    ["impact-bass-1", 6.15, 0.55],         // wordmark
    ["whoosh", 8.95, 0.4],
    ["click-soft", 9.65, 0.25], ["click-soft", 9.95, 0.22], ["click-soft", 10.25, 0.2],
    ...opens.map((t) => ["whoosh-short", +(t - 0.05).toFixed(2), 0.28]),
    ["whoosh", 21.05, 0.38], ["pop", 21.85, 0.4], ["click", 23.0, 0.35],
    ["whoosh", 25.45, 0.35], ["impact-bass-1", 25.95, 0.45], ["chime", 26.7, 0.45],
  ];
  return { css, body, script, sfx, dur: 30 };
}

// ------------------------------------------------------------------ 9:16 cut
function vertical() {
  const RACK_X = 80, RACK_Y = 300, BAR = 84, GAP = 8, OPEN = 1400 - 7 * BAR - 7 * GAP; // 756
  const ORDER = [1, 3, 5, 7]; // Paris, Bavarian Bistro, Boracay, Family Law Riverside
  const T0 = 7.15, STEP = 1.15;
  const FR = { x: 30, y: 240, w: 840, bar: 34 };
  const vidH = Math.round(FR.w * 9 / 16);

  const bars = SITES.map((s, i) => `
          <div class="vbar" id="sp${i}" style="background:${s.bg}">
            <div class="vb-head">${markSvg(s, 20)}<span class="vb-name" style="${nameStyle(s, 36)}color:#fff">${nameHtml(s)}</span></div>
            <div class="pc" id="pc${i}">
              <div class="pc-tag">${s.tag}</div>
              <div class="pc-chips">${s.chips.slice(0, 2).map((c) => `<span class="chip">${c}</span>`).join("")}</div>
              <div class="frame" style="left:0;top:${FR.y - 92}px;width:${FR.w}px;height:${FR.bar + vidH}px">
                <div class="bar" style="height:${FR.bar}px"><i></i><i></i><i></i><b style="font-size:16px">${s.url}</b></div>
                <div class="screen" style="height:${vidH}px;background:#0e1012 url(assets/posters/${s.key}.jpg) center/cover no-repeat"></div>
              </div>
            </div>
          </div>`).join("");

  const videos = ORDER.map((i, n) => {
    const top = RACK_Y + i * (BAR + GAP) + FR.y + FR.bar;
    const start = +(T0 + n * STEP + 0.5).toFixed(2);
    const d = n < 3 ? +(STEP - 0.52).toFixed(2) : 1.25;
    return `      <video id="v${i}" class="clip win" src="assets/clips/${SITES[i].key}.mp4" muted playsinline data-start="${start}" data-duration="${d}" data-media-start="0.15" data-track-index="${3 + (n % 2)}"
        style="inset:auto;left:${RACK_X + FR.x}px;top:${top}px;width:${FR.w}px;height:${vidH}px;border-radius:0 0 10px 10px"></video>`;
  }).join("\n");

  const css = `
      #hero-words { left: 80px; top: 960px; }
      .stamp { font-size: 108px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.06; }
      #wordmark { left: 72px; top: 860px; font-size: 250px; font-weight: 700; letter-spacing: -0.045em; line-height: 0.8; }
      #hero-sub { left: 80px; top: 1300px; width: 900px; font-size: 44px; line-height: 1.38; }
      #shelf-title { left: 80px; top: 170px; font-size: 76px; font-weight: 700; letter-spacing: -0.03em; }
      #shelf-sub { left: 80px; top: 262px; font-size: 26px; color: var(--dim); display: none; }
      #rack { position: absolute; left: ${RACK_X}px; top: ${RACK_Y}px; width: 920px; display: flex; flex-direction: column; gap: ${GAP}px; }
      .vbar { position: relative; flex: none; width: 920px; height: ${BAR}px; overflow: hidden; }
      .vb-head { position: absolute; left: 30px; top: 0; height: ${BAR}px; display: flex; align-items: center; gap: 22px; }
      .pc { position: absolute; left: ${FR.x}px; top: 92px; width: 860px; }
      .pc-tag { font-size: 36px; font-weight: 500; color: #fff; line-height: 1.25; }
      .pc-chips { display: flex; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
      .pc-chips .chip { font-size: 22px; padding: 7px 14px; }
      #end-wrap { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 200px; }
      #end-name { font-size: 170px; font-weight: 700; letter-spacing: -0.045em; line-height: 1; margin-top: 40px; }
      #end-tag { font-size: 50px; font-weight: 500; margin-top: 24px; }
      #end-url { font-size: 34px; color: var(--dim); margin-top: 22px; }
      #end-cta { left: 80px; width: 920px; top: 1420px; text-align: center; font-size: 34px; font-weight: 500; line-height: 1.35; }
      #end-cta b { font-weight: 600; border-bottom: 4px solid var(--ink); }`;

  const body = `
      <!-- Sound effects -->
__SFX__

      <section id="s-hero" class="clip" data-start="0" data-duration="6.6" data-track-index="0">
        <div id="hero-inner" class="abs" style="inset:0">
          ${house("h", 640, 220, 330, true)}
          <div id="hero-words" class="abs" data-layout-allow-overlap data-layout-allow-overflow>
            <div class="mask" data-layout-allow-overflow><span class="stamp" id="w1">Undeveloped.</span></div>
            <div class="mask" data-layout-allow-overflow><span class="stamp" id="w2" style="color:var(--red)">Underperforming.</span></div>
          </div>
          <div id="wordmark" class="abs" data-layout-allow-overlap data-layout-allow-overflow><div class="mask" data-layout-allow-overflow><span id="wm1">web</span></div><div class="mask" data-layout-allow-overflow><span id="wm2">haus</span></div></div>
          <div id="hero-sub" class="abs">We give undeveloped and underperforming web addresses a home, and fill it with a real purpose.</div>
        </div>
      </section>

      <section id="s-shelf" class="clip" data-start="6.3" data-duration="6.2" data-track-index="2">
        <div id="shelf-inner" class="abs" style="inset:0">
          <div class="rule" id="sh-rule" style="left:80px;top:140px;width:920px"></div>
          <div id="shelf-title" class="abs">addresses</div>
          <div id="rack">${bars}
          </div>
        </div>
      </section>

${videos}

      <section id="s-end" class="clip" data-start="12.4" data-duration="2.6" data-track-index="2">
        <div id="end-wrap">
          ${house("e", 300, 0, 0, false).replace('class="abs" style="left:0px;top:0px"', 'style="position:relative"')}
          <div id="end-name">webhaus</div>
          <div id="end-tag">Good homes for good domains.</div>
          <div id="end-url">webhaus.info</div>
        </div>
        <div id="end-cta" class="abs">Own a web address that deserves a better home? Write to <b>hello@webhaus.info</b>.</div>
      </section>`;

  let script = `
      tl.fromTo("#h-outline", { opacity: 0, scale: 0.94, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0.1);
      gsap.set(["#h-body", "#h-door", "#h-roof", "#h-sun", "#h-ground"], { opacity: 0 });
      tl.set(["#h-body", "#h-door", "#h-roof", "#h-sun", "#h-ground"], { opacity: 1 }, 2.9);
      tl.fromTo("#w1", { yPercent: 105 }, { yPercent: 0, duration: 0.5, ease: "power4.out" }, 0.6);
      tl.fromTo("#w2", { yPercent: 105 }, { yPercent: 0, duration: 0.5, ease: "power4.out" }, 1.25);
      tl.to(["#w1", "#w2"], { yPercent: -140, opacity: 0, duration: 0.4, ease: "power3.in", stagger: 0.06 }, 2.6);
${buildHouse("h", 2.9, 0.8)}
      tl.to("#h-outline", { opacity: 0, duration: 0.3 }, 3.6);
      tl.fromTo("#wm1", { yPercent: 105 }, { yPercent: 0, duration: 0.55, ease: "power4.out" }, 4.25);
      tl.fromTo("#wm2", { yPercent: 105 }, { yPercent: 0, duration: 0.55, ease: "power4.out" }, 4.42);
      tl.fromTo("#hero-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 4.95);
      tl.to("#hero-inner", { y: -1000, opacity: 0, duration: 0.6, ease: "power3.in" }, 6.1);
      tl.fromTo("#sh-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 6.4);
      tl.fromTo("#shelf-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 6.45);
      tl.fromTo(".vbar", { x: -1000 }, { x: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 }, 6.5);
      gsap.set(".pc", { opacity: 0 });`;
  ORDER.forEach((i, n) => {
    const t = +(T0 + n * STEP).toFixed(2);
    const prev = n > 0 ? ORDER[n - 1] : null;
    script += `
      tl.to("#sp${i}", { height: ${OPEN}, duration: 0.5, ease: "power3.inOut" }, ${t});${prev !== null ? `
      tl.to("#sp${prev}", { height: ${BAR}, duration: 0.5, ease: "power3.inOut" }, ${t});
      tl.to("#pc${prev}", { opacity: 0, duration: 0.18 }, ${t});` : ""}
      tl.fromTo("#pc${i}", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, ${(t + 0.2).toFixed(2)});
      tl.fromTo("#v${i}", { opacity: 0 }, { opacity: 1, duration: 0.2 }, ${(t + 0.5).toFixed(2)});`;
  });
  script += `
      tl.to("#shelf-inner", { y: -80, opacity: 0, duration: 0.3, ease: "power2.in" }, 12.15);
      tl.to("#v7", { opacity: 0, duration: 0.25 }, 12.15);
${buildHouse("e", 12.45, 0.55)}
      tl.fromTo("#end-name", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 13.15);
      tl.fromTo("#end-tag", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 13.4);
      tl.fromTo("#end-url", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 13.65);
      tl.fromTo("#end-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 13.9);`;

  const sfx = [
    ["pop", 0.65, 0.3], ["pop", 1.3, 0.3],
    ["riser", 1.3, 0.3, 3.0],
    ["whoosh-short", 2.85, 0.3], ["impact-bass-1", 3.25, 0.45], ["pop", 3.85, 0.38],
    ["impact-bass-1", 4.05, 0.55],
    ["whoosh", 6.05, 0.4], ["click-soft", 6.55, 0.22], ["click-soft", 6.8, 0.2],
    ...ORDER.map((_, n) => ["whoosh-short", +(T0 + n * STEP - 0.05).toFixed(2), 0.28]),
    ["whoosh", 12.05, 0.35], ["impact-bass-1", 12.35, 0.45], ["chime", 12.95, 0.45, 2.05],
  ];
  return { css, body, script, sfx, dur: 15 };
}

// ------------------------------------------------------------------ write both
const LEN = { chime: 2.5, "impact-bass-1": 2.12, pop: 0.72, riser: 10.03, "whoosh-short": 0.57, whoosh: 0.57, click: 0.37, "click-soft": 0.37 };
function sfxTags(cues) {
  const ends = [];
  return cues.map(([name, start, vol, maxDur], i) => {
    const d = +Math.min(maxDur || LEN[name], LEN[name]).toFixed(2);
    let t = ends.findIndex((e) => e <= start); if (t === -1) { t = ends.length; ends.push(0); }
    ends[t] = start + d;
    return `      <audio id="sfx-${i + 1}" src="assets/sfx/${name}.mp3" data-start="${start}" data-duration="${d}" data-volume="${vol}" data-track-index="${10 + t}"></audio>`;
  }).join("\n");
}

const here = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")));
for (const [dir, fn, w, h, id, title] of [
  [here, landscape, 1920, 1080, "main", "webhaus — Good homes for good domains"],
  [path.join(path.dirname(here), "webhaus-vertical"), vertical, 1080, 1920, "vertical", "webhaus — vertical"],
]) {
  const { css, body, script, sfx, dur } = fn();
  const html = page({ w, h, id, dur, css, body: body.replace("__SFX__", sfxTags(sfx)), script, title });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log("wrote", path.join(path.basename(dir), "index.html"), `(${sfx.length} sfx)`);
}
