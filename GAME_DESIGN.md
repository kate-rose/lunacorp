# DO NOT REPLY TO THE MOON
### A solo phishing-triage game in the Papers, Please tradition
DRAFT v0.2 — Kate Bertash · folder `~/lunacorp` · port 5184
Lineage: *Papers, Please* (document inspection under quota) × the PRIORITY SIGNAL mechanic from *The Password Went Down With the Ship* × the Google Phishing Quiz (the benchmark to beat, in both minutes and pedagogy)

Runner-up titles, kept for marketing copy: *The Director Needs Oxygen Vouchers* (now the flagship event) · *Someone Is Impersonating Payroll Again* · *Your Badge Has Been Selected*

---

## LOCKED DECISIONS (2026-07-14)

1. **Tutorial = Filmstrip + guided Day 1.** 90-second corp orientation filmstrip → one supervised practice message (the resident it endangers is laminated) → messages 1–3 with ORIENTATION SUBROUTINE coach-marks. Skippable: "[ESC] ABSTAIN FROM ORIENTATION (noted in file)."
2. **VERIFY costs soft shift-time.** No hard cap. The clock advances; the Performance Review comments on overuse gently ("You telephoned the cantina regarding a menu"). Unnecessary verifies never downgrade a message's grade — verification stays normalized.
3. **Deck = 13 messages + 1 interrupt.** The subdomain lesson folded into the badge-revalidation link (#4 teaches both "text ≠ destination" and "read from the right" in one URL).
4. **Title = DO NOT REPLY TO THE MOON.**

**Canonical copy lives in `src/data/deck.ts` and `src/data/orientation.ts`** — this doc keeps the outline; the code keeps the words.

---

## Design intent (read this first, future Kate)

- **The verdict is three stamps, not two.** The Google quiz is binary — phishing or legitimate — and binary is the wrong skill. Our stamps are **DELIVER / QUARANTINE / VERIFY**, and some messages are *only* solvable by VERIFY: the genuine renewal notice that looks like a scam, the real address that's been compromised. The game scores **routing, not suspicion**. Paranoia that blocks real mail loses points just like credulity that delivers forgeries.
- **Errors hurt in both directions, visibly.** Quarantine the water-filter renewal and Port Armstrong smells like regolith in three days. The player must *feel* the false positive, or the lesson collapses into "trust nothing."
- **Everything stays literal.** FROM lines, domains, links, attachments — fictional TLDs but real anatomy, because the skill has to transfer on contact. The hover lens IS hovering. The records check IS your address book. The ledger number IS the number on the back of your card. No metaphors where the tells live.
- **The no-blame lesson is lore, not a lecture.** Your predecessor, Clerk Dobbs, clicked something. That was survivable. **He didn't tell anyone for three days. That wasn't.** The orientation filmstrip says it once, in corp-speak; the finale's "quarantine without reporting" outcome echoes it ("this is how three days happen").
- **Your own desktop is the data exhaust.** The finale spear-phish is assembled from details the shift itself surfaced (ELEANOR, the quota, the telephone repair) plus anything the player granted the Productivity Ferret. When MoonChat ships (later), its quiz answers join the same `leaks` state.
- **Length target: 12–16 minutes** including orientation.

**The Clerk's Oath (the whole game in three lines, on the title screen and the take-home):**
> I am the lock, not the wall.
> I am the lock, not the censor.
> When in doubt, I pick up the telephone.

---

## World bible

**Port Armstrong**, a LUNACORP company town on the Moon. The year is 1989-that-never-was: CRT terminals, tape drives, dot-matrix, pneumatic tubes for the executive floor. Bandwidth is company property, so every message to hab residents passes through the Communications Annex — through you, the new **Message Integrity Clerk, Grade II**.

The position has been vacant 11 days. The backlog is 47 messages (13 survive triage-worthy tonight). Your predecessor clicked something. His spider plant, **ELEANOR**, remains, and is your responsibility now.

### Cast
| Who | Address | Notes |
|---|---|---|
| Supervisor T. Ondricek | t.ondricek@lunacorp.lun | Your boss. Sits forty feet away. Would never email you. |
| Site Director V. Okonkwo | (unlisted — pneumatic tube only) | Has never sent an electronic message. Constantly impersonated. |
| Foreman D. Okafor | d.okafor@lunacorp.lun | Excavation. His terminal has been singing to itself since Tuesday. |
| M. Reyes | m.reyes@lunacorp.lun | Miner. A magnet for scams. Never finds out how close he came. |
| Local 12 | bulletin@regolith-handlers-local12.ert | Excavators & Regolith Handlers. Aware of you. |
| Consolidated Habitat Services | accounts@consolidated-habitat-services.ert | The water-filter vendor. Real. Writes like a ransom note. |
| Clerk Dobbs | [RECORD EXPUNGED] | Clicked something. Didn't tell anyone for three days. |

### The economy is the threat model (in-world → real-world)
| Port Armstrong | At your desk on Earth |
|---|---|
| Company scrip / direct-deposit reroute | Payroll diversion, BEC |
| Oxygen vouchers ("transmit the redemption codes") | Gift cards |
| Airlock badge + PIN, hab access code | Credentials, 2FA codes |
| Badge revalidation portal | Fake login page |
| The records check (directory + vendor ledger) | Your address book; the number on the back of your card |
| The landline / walking forty feet | Out-of-band verification |
| "CONFIRM IT'S YOU" popup spam | MFA fatigue / push bombing |
| Productivity Ferret access scopes | OAuth app permissions |
| Dobbs | Why we report fast and don't do blame |

### Domains
Internal: `@lunacorp.lun`. Earth mail: `.ert`. Forgeries use the classics: character swaps (`lunac0rp.lun`), transpositions (`lunacrop.lun`), near-domains (`lunacorp-badges.lun`), freemail with an executive display name (`@moonmail.ert`), and the subdomain hat trick (`lunacorp.lun.badge-revalidation.ert` — the real domain is at the RIGHT).

---

## Flow

**BOOT** (typewriter crawl, skippable) → **TITLE** ("DO NOT REPLY TO THE MOON"; ENTER = orientation, ESC = abstain, noted in file) → **ORIENTATION** (filmstrip ×6 cards → practice message) → **THE SHIFT** (13 messages, interstitials, interrupt) → **PERFORMANCE REVIEW** (scorecard → Decoder → oath → play again).

## Player verbs & tools

**Screen anatomy:** one message at a time. Header block (FROM / TO / SUBJECT / attachment chip), body, status bar at the bottom (lens readouts + system notices), stamp tray, shift clock ticking toward 06:00.

**Stamps:**
- **DELIVER** — route it. Wrong on a forgery = the consequence plays out on a resident.
- **QUARANTINE** — burn it. Wrong on genuine mail = the consequence plays out on the station.
- **VERIFY** — opens the call panel. Targets are per-message: **trusted channels** (a listed station on the landline, the vendor LEDGER number, walking forty feet, the pneumatic tube) always reveal the truth; **"the number printed in the message"** is always offered and always reaches whoever printed it ("You have learned only that someone owns a telephone"). Trusted verification sets TRUTH KNOWN; the player still stamps — verification informs, stamping routes.

**In-message tools:**
- **RECORDS CHECK** — click the FROM address: directory/ledger lookup with character-level diff against the nearest listed station ("DIFFERENCE DETECTED AT CHARACTER 8: '0' where 'o' belongs").
- **HOVER LENS** (unlocks after #3) — hover or tap any link for its true destination; links never navigate, only report. Pre-unlock: "HOVER LENS NOT INSTALLED — destination unreadable."
- **ATTACHMENT SCANNER** (unlocks after #5) — reads what a file IS, not what it is named.
- **FIELD GUIDE** (in the tray from the start with p.1; pages file in as their tools unlock, p.4 after #7) — THE FOUR MARKS OF COUNTERFEIT CORRESPONDENCE: **urgency, authority, secrecy, and the move** (it always asks something valuable to change hands).

**Feedback is immediate:** every stamp gets an outcome beat — verdict banner (CLEAN ROUTE / SAFE BUT COSTLY / MISROUTED), what happened, one FIELD NOTE teaching line.

**Grading:** CLEAN = correct routing via the canonical path (including verify-then-stamp where verify is canonical). COSTLY = correct final routing, suboptimal process (blind-burning the compromised foreman without the call; delivering the genuine scary notice on faith; routing correctly only after trusting the counterfeit's own number). MISROUTED = wrong routing, approving the MFA popup, or granting the ferret. Unnecessary trusted verifies never downgrade — they're review commentary only.

---

## New Clerk Orientation (the tutorial)

**Filmstrip No. 7: "THE MAIL AND YOU"** — six beige cards, advanced by keypress, ~90 seconds. Content: the position (you were the only applicant) → the three stamps → the records check → the two kinds of error ("there is no third, safe kind of error; there is, however, the telephone") → the No-Blame Doctrine (Form 22-B; the Dobbs card) → practice announcement.

**Practice message:** THE MOON LOTTERY COMMISSION — "YOU HAVE WON THE MOON," reply with badge PIN + hab code + mother's maiden name, expires in ONE HOUR, tell no one. Every mark at maximum volume. Wrong stamps are gently practice-reversed with corp-speak corrections; the practice resident is laminated. Also calibrates VERIFY: "The telephone is for doubt. This was not doubt."

**Guided Day 1:** messages 1–3 run with ORIENTATION SUBROUTINE coach-marks (highlight the FROM line; require one records check before stamps enable on #1–2; point at the display-name/address split on #3). Coach-marks end after #3: "ORIENTATION SUBROUTINE TERMINATING. YOU ARE THE SUBROUTINE NOW."

**Abstaining** skips filmstrip, practice, and coach-marks, and is noted in your file (the review mentions it, once, mildly).

---

## The Deck v0.2 — 13 messages + 1 interrupt (full copy in `src/data/deck.ts`)

**Phase I — the FROM line** (records check only)
1. **Welcome to the Annex** — Ondricek, genuine, DELIVER. Tutorial anatomy; plants ELEANOR, the quota, the broken telephone (all finale fuel).
2. **The Unclaimed Scrip Bonus** — `payroll@lunac0rp.lun`, zero-for-o, credential ask. QUARANTINE. ("There is never a bonus.")
3. **A Personal Note from the Director** — real display name, Earth freemail address. QUARANTINE. The address is the fact.

> UNLOCK: HOVER LENS (refurbished; previous owner: [RECORD EXPUNGED])

**Phase II — the link**
4. **Badge Revalidation Required** — link text `lunacorp.lun/badge-portal`, lens reads `lunacorp.lun.badge-revalidation.ert/login`. One URL, both lessons: text is a costume + read from the RIGHT. QUARANTINE.
5. **Tuesday Is Regolith Loaf** — cantina menu, link resolves exactly as printed. DELIVER. You are a lock, not a wall.

> UNLOCK: ATTACHMENT SCANNER + the telephone is repaired ("Please stop shouting down the corridor")

**Phase III — the attachment, and the telephone**
6. **Overdue Invoice** — `INVOICE_88-4471.pdf.exe`, vendor not in ledger (the gasket contract belongs to Mare Serenitatis Gasket Co., who bill in person, in triplicate). QUARANTINE.
7. **Shift Roster (from the Foreman)** — real listed address, compromised account, macro doc. **VERIFY** (call Okafor: "I sent no roster. My terminal's been singing to itself since Tuesday."). Blind quarantine = SAFE BUT COSTLY: the burn protects one message; the call protects the station.

> UNLOCK: FIELD GUIDE p.4 — THE FOUR MARKS

**Phase IV — the social layer**
8. **The Director Needs Oxygen Vouchers** — urgency + authority + secrecy + the move, four for four; voucher codes are bearer instruments. QUARANTINE. ("The Director does not know what a voucher looks like. Good catch.")
9. **Direct Deposit Update** — `m.reyes@lunacrop.lun`, transposition; moves money AND discourages verification ("don't bother calling") — a message that tells you what it is twice. QUARANTINE.
10. **FINAL NOTICE: Filtration Suspension** — screaming collections tone, sketchy reply-to, GENUINE (thirteen notices went to Dobbs's dead terminal). **VERIFY via the LEDGER number**, then DELIVER. The thesis message: real notices look like scams; the skill is routing. Quarantine = the filter situation.
11. **Local 12 Bulletin No. 88** — external, furious, genuine; the lens reads clean. DELIVER. You are the lock, not the censor. (Dobbs's auto-rule ate this bulletin for a year; delivering un-does that.)

> INTERRUPT: **"CONFIRM IT'S YOU" ×3** — badge push-bombing from Freight Airlock 3. DENY ALL & REPORT = clean; approving to make the buzzing stop = the door opens.

12. **The Wellness Program** — PRODUCTIVITY FERRET™ consent screen: read all correspondence, shift schedule, biometric chair, "speak for you in routine matters (definition pending)." DENY. Read the scopes, not the mascot. Granting feeds the finale an extra line.
13. **FINALE: After-Action Integrity Review** — addressed to YOU, from a plausible internal address; knows ELEANOR, your quota, your burn count, your telephone repair (+ chair telemetry if the ferret got you); lens reads `lunacorp.lun.integrity-review.ert/login`; "do not involve Supervisor Ondricek." **VERIFY = walk the forty feet.** ("I would never email you. I am forty feet away. …Who told you about the ferret thing?") Silent quarantine = SAFE BUT COSTLY — "this is how three days happen."

### Curriculum coverage (audit vs. the Google quiz)
Lookalike domain (2, 9) · display-name mismatch (3) · link text vs. destination (4) · subdomain trick (4) · credential-harvest page (4, 13) · double extension (6) · macro doc from compromised known sender (7) · authority (3, 8, 13) · urgency/deadline (2, 4, 8, 10, 13) · secrecy (3, 8, 13) · moves money (8, 9) · discourages verification (9) · verify-via-your-own-number-not-theirs (10) · OAuth scopes (12) · MFA fatigue (interrupt) · genuine-that-looks-forged (10, 11) · spear-phish personalization (13) · too-good-to-be-true (practice, 2).
**What we cover that Google's quiz can't:** VERIFY as a first-class verb, the printed-number trap, false-positive costs, MFA fatigue, and the spear-phish built from your own data exhaust.

---

## Scoring & the end screen

- Shift clock: starts 21:30; each message ~30 min, calls 15, walks 30. Past 06:00 = "OVERTIME NOTED," nothing worse.
- **Clerk Performance Review:** per-message table (route → grade), verify commentary (count, praised when load-bearing, teased when recreational), retention status by grade mix ("RETAINED. FAVORABLE. (FORM 22-B ON FILE, UNUSED.)" → "RETAINED. THE CORPORATION HAS NO ONE ELSE.").
- **The Decoder** (signature debrief move, solo edition): every in-world tell → its Earth twin, ending on "'I got a weird signal,' said out loud → the actual security control."
- Replayable: "[R] WORK ANOTHER SHIFT (same mail, new eyes)."

---

## The personal desktop (build LATER — hooks live NOW)

MoonChat (chat buddy; the "WHICH AIRLOCK ARE YOU?" quiz that harvests first-pet's-name) and the ambient Productivity Ferret idle animations ship in a later milestone. The `leaks` state already exists and the finale already consumes it — the ferret consent screen (#12) is the first leak source. MoonChat plugs into the same array.

## Is This Real, Dear? (née Sunset Orbital)

The senior-safety sibling graduated to a full design bible at **[docs/SUNSET-ORBITAL.md](docs/SUNSET-ORBITAL.md)** (title: *Is This Real, Dear?*; one week on the ring, spoons/trust economy, hang-up-look-up-call-back as the star verb; scaffold at `~/is-this-real-dear`, port 5185). It forks this engine — the deck schema's `channel` field and the `leaks` state are reserved for it.

## Tech notes

- **DOM, not canvas** — text, links, hover states, buttons; the browser does the work, including accessibility. Deliberate departure from house Phaser habit.
- Vanilla TypeScript + Vite, no framework. Port 5184, launch.json name `lunacorp`. Amber phosphor CRT per house palette.
- Deck is data (`src/data/deck.ts`); the engine renders anything message-shaped. Links never navigate — inspect only.
- `window.MOON` debug hook (jump to message N, dump state) for headless testing, à la breakshift's `window.BS`.
- Itch-ready static build.

## Build status

**2026-07-14 — v0.2 playable end-to-end and browser-verified:** boot → title → orientation (filmstrip ×7, laminated practice resident with practice-reversal, coached msgs 1–3 with a touch-safe records-check gate) → all 13 messages + interrupt → Performance Review with Decoder. A 37-agent multi-lens review (code / novice / pedagogy / voice, adversarially verified) returned 28 confirmed findings; all fixed except two deliberate keeps (the mantra repetitions, and the in-world "the lens never lies" — the Decoder carries the Earth caveat about shorteners/redirects). Notables: Field Guide modal soft-lock fixed; lens readout now `<mark>`s the registrable owner so read-from-the-right is shown, not told; repeat calls no longer double-bill the review meters; ESC now confirms before abstaining orientation; interrupt notes de-jargoned (no "first factor"/"rotate"); Decoder gained attachment + read-from-the-right rows and splits gift cards (gone on reading) from wires (speed claws back).

**2026-07-14 — v0.3, colour + plain-language pass (browser-verified):**
- **Semantic colour system** (was all-amber; now a Ferric-style multi-colour CRT). Amber = the terminal/chrome. **Green = DELIVER / ALLOW / genuine / clean route / a records-check match.** **Red = QUARANTINE / DENY / counterfeit / a miss / a mismatch.** **Cyan = VERIFY / the telephone / "truth known" / the lens's real-URL readout.** The three stamp buttons, the outcome-modal accent border + banner + heading, the records-check verdict lines (green LISTED/EXACT MATCH, red NO MATCH/DIFFERENCE), the review Assessment column, and the TRUTH KNOWN status bar are all colour-coded. Colours are *actions*, not verdicts — green DELIVER can still be the wrong call (that's the lesson); the palette just makes the three verbs read at a glance. Orientation Module 2 now names the colours.
- **Plain-language + real-word pass.** Each tool interstitial gained an **EARTHSIDE:** line naming the real skill in plain words ("previewing a link", "verifying out of band", "app permissions", "phishing"). The take-home Field Guide pages and the flagship field notes now use real vocabulary: *preview the link / the real URL / read the address from the right / double extension / enable macros / app permissions / business email compromise / gift-card codes are like cash / spear phishing / MFA fatigue.* The lens readout label changed from "TRUE DESTINATION" to "THE REAL URL". Kept the 1989 in-world voice for flavour; the plain instruction rides alongside it.

**2026-07-14 — v0.4, desktop shell + title/wording (browser-verified):**
- **The game now lives inside a desktop OS** (Night-in-the-Woods framing, our own amber-CRT style, not theirs). Boot → the clerk's **LUNACORP terminal desktop**: wallpaper + PORT ARMSTRONG watermark, a left column of app icons (MAILROOM/OS, MoonChat, NOTICES.TXT, ELEANOR), and a taskbar (LUNACORP ▪ focused-app ▪ **FERRET.EXE tray placeholder** ▪ MOON STD clock). The mail game runs as the **MAILROOM/OS window** (opens by default over the desktop); other icons open worldbuilding side-apps as windows. One focused window at a time (v1); the ✕ returns to the desktop and the game state persists (reopen resumes). Keyboard only drives the game when MAILROOM is focused; Esc closes a side-app/window.
  - **MoonChat** — GALLEY_KID banter + a "WHICH AIRLOCK ARE YOU?" quiz that seeds `leaks: ['moonchat']` (the finale spear-phish hook — the quiz "asks" first-pet's-name / childhood street; wire a finale line off it later).
  - **NOTICES.TXT** — company bulletin (jokes/worldbuilding). **ELEANOR** — the desk plant as an app, waterable, ASCII art placeholder.
  - **Ferret**: reserved as a taskbar tray placeholder ("FERRET.EXE ▸ zzz") — **this is the spot for Kate's pixel art**; upgrade to a roaming desktop-pet sprite when art arrives. State (`eleanorWatered`, `airlockQuiz`, `openApp`) is in the single `S` object.
- **Title screen** now opens with a plain-language explainer: "*A quick game that teaches you to spot phishing…*" + the colour-coded DELIVER/QUARANTINE/VERIFY one-liner + "~15 minutes". Buttons: START / SKIP (repeat players).
- **"Click the sender's address"** everywhere (was "select"), and the shift status-bar hint is now **prominent** — brighter, larger, with the action bolded and highlighted ("▸ **Click the sender's address** to check it").

**2026-07-29 — SHIPPED. Live at https://kate-rose.github.io/lunacorp/**
Public repo `kate-rose/lunacorp`. Pushes to `main` auto-build and deploy via `.github/workflows/deploy.yml` (Node 20 → `npm ci` → `npm run build` → upload `dist/` → deploy-pages). `vite.config.ts` sets `base: './'`, which is what makes a project-path URL work — **don't change it**. Setup gotcha for future repos: the workflow's GITHUB_TOKEN could NOT create the Pages site (`configure-pages` with `enablement: true` → "Resource not accessible by integration"); the site had to be created once out-of-band (`gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow`), after which the enablement flag was dropped and deploys are clean. **`docs/` is gitignored** — the *Is This Real, Dear?* bible stays private; `GAME_DESIGN.md` (this file) IS public.

## Open questions / playtest notes

- Does the practice-reversal loop in orientation read as charming or condescending to experienced players? (Mitigation: ESC works everywhere.)
- Stretch: if #7 is blind-quarantined, Okafor's compromised terminal sends a second, nastier message later in the shift — compromise unreported is compromise ongoing, mechanized. v2.
- MoonChat milestone: quiz leaks join the finale; desktop pet idles between messages.
- Sound (code-only chiptunes + CRT hum, breakshift-style): later milestone.
- Playtest the clock: does anyone actually notice overtime?
