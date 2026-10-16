# Webhaus launch videos: build guide

Every site gets two HyperFrames projects:

| Project | Format | Composition id | Length |
|---|---|---|---|
| `videos/<key>/` | 1920×1080 | `main` | 30s |
| `videos/<key>-vertical/` | 1080×1920 | `vertical` | 15s |

**Never put two root compositions in one project.** The checker errors (`multiple_root_compositions`) and the audio can double.

The approved reference is **sequoia.info**. Read these before you write anything, and match their structure, polish and code style:

- `videos/sequoia/index.html`: the 30s master
- `videos/sequoia-vertical/index.html`: the 15s cut
- `videos/sequoia/tools/add-sfx.mjs`: the sound-effects cue placer (copy and adapt it)
- `videos/sequoia/tools/make-tree.mjs`: an example of a seeded, procedurally generated SVG illustration

Inputs live in the session root (one level above `videos/`):

- `launch-video-concepts.md`: the brand tokens and approved concept for each site
- `screenshots/<key>-desktop-{hero,full,mobile}.png`: dark mode where the site has one
- `screenshots/<key>-light-{hero,full,mobile}.png`
- `screenshots/brand-data.json` and `screenshots/brand-data-light.json`: computed CSS (fonts, colors, variables)

Screenshot keys are `paristourist`, `anaheim`, `bavarianbistro`, `longbeach`, `boracay`, `plushdogs` and `familylawriverside`.

## User feedback so far (follow it)

- The user loved the sequoia layout and motion overall. Aim for the same level of quality.
- The user **hated an illustration that looked like stacked bubbles**. Any drawn object must look like the real thing: proper shapes, shading, detail. If you can't draw something convincingly, use cropped real photos from the screenshots or typography instead.
- **No voiceover and no music.** Sound effects only, placed on visual beats.

## Setup

```bash
cd videos
HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes init <key> --example blank --non-interactive </dev/null
HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes init <key>-vertical --example blank --non-interactive </dev/null
```

Then replace each `index.html`. Run every `npx hyperframes …` command from **inside** that project folder.

## Composition rules (HyperFrames)

- Load GSAP with `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`. Use one `gsap.timeline({ paused: true })`, registered as `window.__timelines["main"]` (or `["vertical"]`), and make the key match the root `data-composition-id`.
- The root needs `data-start="0" data-duration=… data-width=… data-height=…`. Scenes are `<section class="clip" data-start data-duration data-track-index>`.
- Never tween `visibility`, `display` or `autoAlpha` on a `.clip`. Animate its children.
- Never set a CSS `transform` on something you also tween with GSAP x/y/scale. Use `fromTo`.
- Keep it deterministic: no `Math.random` (use a seeded PRNG like make-tree.mjs does), no `Date`, no network calls.
- Count-ups use a proxy object with `onUpdate`; see `facts` in sequoia's `index.html`.
- **Fonts must be local files** with `@font-face`, or lint fails (`font_family_without_font_face`). Download the latin `.woff2` files into `assets/fonts/`. To get the URLs, fetch the Google Fonts CSS2 API with a Chrome user-agent:
  `curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" "https://fonts.googleapis.com/css2?family=…&display=swap"`
  - A site's own theme font may be downloadable from its `/wp-content/themes/…/fonts/` URL (see `fontLinks` in brand-data.json).
  - If a site uses a system font (boracay uses `system-ui`), use `system-ui` with no named family, or pick a close Google font.
  - For Palatino-style serifs, a Windows font file such as `C:/Windows/Fonts/pala.ttf` and `palab.ttf` may be copied into `assets/fonts`.
- Add `svg { overflow: visible; }` so SVG art isn't clipped at the viewBox.
- No `<br>` inside body text. Size text so it never wraps awkwardly or overlaps other elements.

## Content rules

- **Use only facts from the site itself.** Those are the facts given in your task prompt or visible in that site's screenshots. Never invent numbers, prices, dates, reviews or features. If unsure, use the site's own phrasing.
- Don't draw or show third-party logos or trademarks (Disney, Booking.com, Viator, the Eiffel Tower logo, court seals and so on). Generic depictions of places are fine.
- Every video carries the network motif: a mono "cited · dated" style chip or stamp on facts.
- Every video ends on the end card: the site wordmark/URL in its brand font, its tagline, and a final "a Webhaus site" in small mono.
- The 16:9 skeleton is hook (0–5s) → headline → 2–3 "product in action" scenes (the concept) → a scroll of the full-page screenshot in a browser frame (`<key>-desktop-full.png`, or the light version if it fits the brand better) → end card. Total 30s.
- The 9:16 skeleton is hook → headline → one proof beat → end card, 15s. Keep key content inside the vertical safe area: roughly 80px side margins, and nothing important in the bottom 280px.
- **Imagery:** crop real photos out of the screenshots with ffmpeg (`ffmpeg -i in.png -vf "crop=w:h:x:y" out.png`) and put them in `assets/`. Site images can sometimes be fetched with curl, but some sites block it (Cloudflare). SVG and CSS illustrations are fine when they look polished.

## Sound effects (bundled library, no sign-in)

Source: `~/.claude/skills/media-use/audio/assets/sfx/` (see `manifest.json` there). Available effects: `chime`, `click`, `click-soft`, `error`, `glitch-1/2/3`, `impact-bass-1/2`, `key-press`, `notification`, `ping`, `pop`, `riser`, `sparkle`, `typing`, `whoosh`, `whoosh-short`, `whoosh-cinematic`.

Copy the ones you use into `assets/sfx/` and place them with an adapted `add-sfx.mjs`, which assigns tracks so cues don't overlap.

Measured peaks:

| Effect | Peaks at | How to use it |
|---|---|---|
| `riser` | ~3.0s after it starts, then fades by 4.5s | Start it 3s before the reveal |
| `impact-bass-1` | 0.25s | Start it 0.25s before the hit |
| `whoosh-cinematic` | 2.5s | |

Volumes: whooshes 0.35–0.4, pops 0.22–0.35, impacts 0.45–0.6, chime 0.45. Keep the mix tasteful, not busy.

## Verify, render, deliver

1. `npx hyperframes check </dev/null` must show 0 errors. Warnings named `nested_structure_needs_subcomposition` and `timeline_track_too_dense` are fine, and so is `escaped_container` or `container_overflow` on an intentional zoom or scroll. Fix everything else.
2. Run `npx hyperframes snapshot --at <6–8 key times> --no-end -o snaps </dev/null`, then **Read `snaps/contact-sheet.jpg`** and look at it critically: text overlaps, wrapping, clipping, empty frames, ugly art. Fix and repeat.
3. Render with `npx hyperframes render -o renders/<key>-launch-16x9.mp4 -q delivery -w 2 </dev/null` (or `-9x16` for the vertical). **Always use `-w 2`**, because other builds render at the same time.
4. Check the real MP4. Tile frames with
   `ffmpeg -v error -y -i X.mp4 -vf "select='eq(n\,N1)+eq(n\,N2)+…',scale=480:-1,tile=4x2" -frames:v 1 check.jpg`
   and Read the result. Confirm the audio with `ffmpeg -hide_banner -i X.mp4 -af "volumedetect,silencedetect=n=-45dB:d=0.3" -f null -`.
5. Copy the finals to `videos/final/NN-<key>-16x9.mp4` and `videos/final/NN-<key>-9x16.mp4`.

## Shell gotchas (Windows, Git Bash)

- In a `while read` loop, give every `npx …` call `</dev/null`, or it swallows the loop's input.
- Never run `cat > file` without a heredoc; it hangs waiting on input.
- Keep paths short. Python venvs in deep folders hit Windows path-length limits, but you shouldn't need Python.
- Only touch your own two project folders and your files in `videos/final/`. Don't modify sequoia or any other site.
