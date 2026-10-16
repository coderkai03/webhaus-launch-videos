# Webhaus launch videos: brand sheet and HyperFrames concepts

All 8 sites are published by Webhaus LLC (Sacramento). Each one follows the same playbook: an independent reference site in plain language where every fact is cited and every price or date shows when it was checked. The site is not affiliated with the place or brand it covers.

Screenshots are in `screenshots/`. Each site has `*-desktop-hero/full`, `*-mobile` (dark mode where the site has one) and `*-light-hero/full/mobile`. The raw extracted CSS is in `brand-data.json` and `brand-data-light.json`.

## Shared video system (all 8)

- **Length and formats:** a 30s 16:9 master (1920×1080) plus a 15s 9:16 cutdown (1080×1920) for Reels, Shorts and TikTok.
- **Shared grammar:** each video ends with a "cited · dated" stamp. A small date chip ("checked Oct 2026") pops onto the facts as they appear. This is the network's real differentiator, so every video should show it.
- **Structure:** Hook (0–4s) → Problem (4–9s) → Site in action (9–22s, real screenshots or HTML rebuilds of UI) → Proof stamp (22–26s) → URL end card (26–30s).
- **Shared end card:** the site URL in its own brand font, then a 1s "a Webhaus site" tag.
- **HyperFrames build:** one composition per site, made from GSAP-timed HTML scenes using each site's real fonts and color tokens below. Screenshots are used as textures for the "site in action" scenes.

---

## 1. sequoia.info — "Giant sequoias, documented."
**What it is:** A visitor and science reference for giant sequoias and Sequoia/Kings Canyon National Parks. It covers reservations, fees, chains, hiking, lodging, fire ecology, growing sequoias and kids' material.

| Token | Value |
|---|---|
| Forest (hero bg) | `#14261F` |
| Moss panel | `#1F4A36` |
| Sage tree | ~`#6B9A7A` |
| Mist (light bg) | `#F2F4F1` / `#E9EDE8` |
| Ink | `#121614` |
| Fonts | **Schibsted Grotesk** 600 (headlines) and **IBM Plex Mono** (labels, measurements) |

**Concept: "To Scale."** The opening shot is a 6 ft person silhouette on a ruler in the site's mono-font chart style. The camera tilts up while the ruler counts from 6 ft through 100 ft and 200 ft to the 274.9 ft General Sherman, which draws itself in sage. The headline lands: "Giant sequoias, documented." Fast cuts follow: "Do I need chains?", "Reservations?" and "Best month?". Each gets a cited answer card with a date chip. The video closes on a 3,000-year counter and then the URL.
**Hook line:** "You won't fit this in a photo. So we measured it."

## 2. paristourist.info — "Straight answers about Paris, with sources."
**What it is:** A Paris question-and-answer reference with one question per page, answered from official sources. It covers sights, transit, "which one?" comparisons, planning, day trips, kids' printables, tours and an interactive map.

| Token | Value |
|---|---|
| Paris blue | `#173F8F` (deep `#0E2A63`) |
| Metro yellow | `#FFCD00` |
| Go green | `#1B7A4B` |
| Tricolore rule | blue `#0064B0` / white / red stripe |
| Tint | `#F2F5FB` |
| Fonts | **Barlow Semi Condensed** 700 (headlines, metro-sign feel) and a system sans for body text |

**Concept: "Next Stop: The Answer."** The whole video is a Paris Metro line. Each numbered section (1 Sights, 2 Getting around…) is a station dot on a line diagram. A search bar types "Do I need a ticket for Notre-Dame?". The line slides to the next station, the answer card opens, and a source chip ticks on. Next stops: "Eiffel stairs or elevator?" and "Is the Museum Pass worth it?". The video ends with the tricolore stripe wiping in the URL.
**Hook line:** "Paris has a thousand opinions. This site has sources."

## 3. anaheim.info — "Ask Anaheim."
**What it is:** A practical guide to everything outside the Disneyland gates: transit, hotels by walking distance, the Honda Center, the convention center, LA28, and "what changed" updates (for example, the ART shuttle shutting down).

| Token | Value |
|---|---|
| Night charcoal | `#1B1D21` / `#2B2E33` |
| Panel | `#24272C` |
| Pool teal | `#2AB4C6` (deep `#0F6F7C`) |
| Sunset orange | `#F39A24` |
| Fonts | **Open Sans** 700, with wide-tracked caps for the wordmark |

**Concept: "What Changed."** The opening is the site's own live header: a clock, "84°F", and a sunset palm-plaza photo. Then a news-ticker style sequence plays: "ART shuttle: ended Mar 31, 2026", "Honda Center parking: now included" and "OCTA 553: new, weekdays". Each item has a strike-through then an update animation in teal and orange. Then the map scene runs: hotels pop up with walking-minute badges ("7 min to the gates"). The close is the "Ask Anaheim." search bar typing a question.
**Hook line:** "The parks have an app. Everything outside the gates has this."

## 4. bavarianbistro.com — "Bavaria, explained. Served warm."
**What it is:** A personal, opinionated guide to Bavarian food, beer, Oktoberfest, Munich, home Oktoberfest parties and tracht. It is written by "Resi Zauber" for non-Germans.

| Token | Value |
|---|---|
| Bavarian blue | `#2F5FA8` (ink `#244B85`, sky `#8FB0E6`) |
| Beer amber | `#D9A441` (ink `#8A5F12`) |
| Beer-garden dark | `#1F2A24` / `#141A16` |
| Light | `#FFFFFF` / `#F3F5F9`, ink `#1F2430` |
| Fonts | **Nunito Sans** 800, **UnifrakturCook** (the "Served warm." blackletter flourish) and **Lora** serif |

**Concept: "Served Warm."** A Bavarian blue-and-white lozenge pattern fills the frame, then a Maß fills with amber "beer" (a rising CSS gradient). Foam settles and becomes the headline, with "Served warm." stamped in Fraktur. A quick-fire run of real guide titles follows: "Is the Hofbräuhaus worth it?", "Oktoberfest without a reservation" and "Weißwurst: the noon rule". Each is a card flip using the site's food photos. Resi's dry aside about budgeting for the toilet line pops up as a speech bubble. The video ends on two split CTAs from the site: "Throw an Oktoberfest" (amber) / "Go to Munich" (blue).
**Hook line:** "Your first Oktoberfest, minus the rookie mistakes."

## 5. longbeach.biz — "The business intelligence desk for Long Beach, CA."
**What it is:** A business, property and visitor intelligence desk. It covers licenses, leases, permits, zoning, ADUs and contracts, plus a data desk (2026 business-license chart), cruise/Catalina/convention logistics and a hotels map.

| Token | Value |
|---|---|
| Harbor navy | `#1B3A5C` (deep `#0F2238`) |
| Signal teal | `#5FE0D3` (accent rule) |
| Desk dark | `#15191F` / `#1C2129` |
| Paper | `#EDE8DC` (on dark), white (light mode) |
| Fonts | **Source Serif 4** 600 (headlines), **IBM Plex Sans** (body), **IBM Plex Mono** (eyebrows, data) |

**Concept: "The Desk."** A Bloomberg-terminal feel. A teal rule draws across the screen, then the mono eyebrow "THE LONG BEACH, CALIFORNIA DESK" types out. The 2026 business-license bar chart builds month by month, and the recent months shimmer "Pending". Three desk cards slam in: "I am opening a business", "I own or am buying property" and "I am arriving with a purpose". Each one flashes a real figure (bus fare $1.25, Convention Center parking $10–15, LA28 Jul 12–29, 2028).
**Hook line:** "Before you sign the lease, read the desk."

## 6. boracay.biz — "Boracay, the practical guide."
**What it is:** A question-led Boracay travel guide. It covers entry rules and registration systems (iPass, eTravel), fees "where sources conflict", when to go (monsoons, algae, typhoons), station-by-station hotel maps, power outages and remote work. It also works offline as an installable app.

| Token | Value |
|---|---|
| Deep sea | `#0D2B3A` |
| Sea teal | `#0B7A8A` (light `#7FD6DF` for ".biz") |
| Sunset orange | `#E8742C` |
| Sand | `#F6F1E7` |
| Ink | `#1C2A31` |
| Fonts | system-ui sans (bold rounded feel), with the "b·b" badge logo |

**Concept: "Before You Land."** The site's corner sun graphic rises over a sand-to-sea gradient. A boarding-pass checklist slides in: "eTravel ✓", "Terminal fee ✓", "Which port this season? ✓". Each check pulls a real headline card. The map tiles (Station 1/2/3 in orange, Ports and Banks in teal) cascade in like the homepage grid. A phone mockup shows "Add to home screen", and the screen keeps working as a "No signal" icon appears. That shows the offline PWA as the punchline.
**Hook line:** "The island is easy. Getting there isn't. Until now."

## 7. plush-dogs.com — "Stuffed dogs that look real."
**What it is:** A lifelike plush dog buying guide covering 23 breeds and 8 makers with dated prices. It also covers custom plushes from photos of your dog, Rainbow Bridge memorials, companion plushes for dementia care, gift guides, and an honest "before a real dog" note.

| Token | Value |
|---|---|
| Violet | `#581B87` (mid `#9333EA`, light `#C084FC`) |
| Lilac | `#EDE4FB` / `#F3E8FF` |
| Peach / mint / sun | `#FFD9C7` / `#D6F5E9` / `#FFE9A8` |
| Ink | `#1F1A2E` |
| Night mode | `#17121F` / `#241C36` |
| Fonts | **Nunito** 900 (very round, heavy) |

**Concept: "Real or Plush?"** A game-show format. Close-ups of a golden retriever appear and the screen asks "Real… or plush?". Paw-print buttons wiggle. The reveal comes with a bouncy violet "PLUSH!" stamp. This happens 3 times with different breeds. Then the site's cartoon pup mascot bounces in. Stat pills pop: "23 breeds · 8 makers · prices dated Oct 2026". A gentle tonal shift follows: "Your own dog, from photos" and then a soft lilac Rainbow Bridge beat. The video ends with the breed search typing "corgi…" → "from $3.99".
**Hook line:** "Wait… that's not a real dog?"

## 8. familylawriverside.com — "The Riverside County family court, explained."
**What it is:** A plain-language, bilingual (EN/ES) guide to Riverside County family court. It covers the 4 courthouses, filing fees ($450, waivable), forms (FL-100, FL-110…), custody/CCRC mediation, child support, restraining orders, free help, printable checklists and accessibility settings. It is clearly "not a law firm".

| Token | Value |
|---|---|
| Burgundy | `#5F2230` (header and theme) |
| Court navy | `#22325A` (text `#1C2541`) |
| Rust accent | `#9B3D1C` |
| Parchment | `#F4EFE4` / `#FBF8F1` |
| Fonts | **Iowan Old Style / Palatino** (headlines, an old-book courthouse feel) and a system sans body |

**Concept: "Plain Words."** This one should be calm, not salesy. The video opens on a dense legal paragraph full of jargon in tiny grey text. The words fade out one by one until a single serif line remains: "Family court in Riverside County, explained in plain words." Then 4 courthouse pins drop on a Riverside County outline (Riverside, Menifee, Indio, Blythe). A form-stack beat shows the FL-100, FL-110 and FL-105 cards fanning in order, with "$450 (fee waiver available)". An EN ⇄ ES toggle flips the whole frame to Spanish for one beat. The close shows the burgundy band, "Legal information, not legal advice", and the URL.
**Hook line:** "No lawyer yet? Start with plain words."
