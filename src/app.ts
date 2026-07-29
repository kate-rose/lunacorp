// DO NOT REPLY TO THE MOON — engine + UI.
// One state object, one render() per state change. The deck is data; this
// file renders anything message-shaped.

import { DECK, GUIDE_PAGES, INTERRUPT, INTERSTITIALS, buildFinaleBody } from './data/deck'
import { ANATOMY_PINS, FILM_CARDS, PRACTICE, URL_DRILLS } from './data/orientation'
import { ferretReact, startFerret } from './ferret'
import { ELEANOR_HAPPY, ELEANOR_NOTES_HAPPY, ELEANOR_NOTES_THIRSTY, ELEANOR_THIRSTY } from './data/eleanor'
import type { Grade, InterstitialId, Msg, Outcome, ResultRow } from './types'

type Phase = 'title' | 'film' | 'practice' | 'shift' | 'review'
type DesktopApp = 'mailroom' | 'moonchat' | 'notices' | 'eleanor'

type Overlay =
  | {
      type: 'outcome'
      head: string
      body: string[]
      note?: string
      grade: Grade
      next: 'advance' | 'retry' | 'begin-shift' | 'after-interrupt'
    }
  | { type: 'calls' }
  | { type: 'callResult'; label: string; lines: string[] }
  | { type: 'inter'; queue: InterstitialId[] }
  | { type: 'interrupt'; step: number }
  | { type: 'guide' }
  | { type: 'abstain-confirm' }

interface State {
  // desktop shell
  openApp: DesktopApp | null
  eleanorWatered: boolean
  airlockQuiz: boolean
  // the game
  phase: Phase
  filmIdx: number
  drillPicks: Record<number, number> // URL drill index -> segment the player clicked
  orientation: boolean
  abstained: boolean
  msgIdx: number
  clockMin: number // minutes since 21:30
  unlocked: Set<InterstitialId>
  // per-message scratch
  truthKnown: boolean
  lookupOpen: boolean
  lookupDone: boolean
  scanOpen: boolean
  coachStep: number
  callsMade: Set<string>
  calledPrinted: boolean
  // meters
  verifiesLoadBearing: number
  verifiesRecreational: number
  printedCalls: number
  leaks: string[]
  results: ResultRow[]
  pendingInterrupt: boolean
  overlay: Overlay | null
}

const S: State = {
  openApp: 'mailroom', // land with the mail app open (title + explanation) over the desktop
  eleanorWatered: false,
  airlockQuiz: false,
  phase: 'title',
  filmIdx: 0,
  drillPicks: {},
  orientation: false,
  abstained: false,
  msgIdx: 0,
  clockMin: 0,
  unlocked: new Set(),
  truthKnown: false,
  lookupOpen: false,
  lookupDone: false,
  scanOpen: false,
  coachStep: 0,
  callsMade: new Set(),
  calledPrinted: false,
  verifiesLoadBearing: 0,
  verifiesRecreational: 0,
  printedCalls: 0,
  leaks: [],
  results: [],
  pendingInterrupt: false,
  overlay: null,
}

let app: HTMLElement

// ── helpers ──────────────────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const marks = (s: string) => esc(s).replace(/⟦/g, '<mark>').replace(/⟧/g, '</mark>')

// Author-controlled markup for tutorial + coach copy: {g:…} {r:…} {b:…} and **bold**.
// Deliberately NOT escaped — every string through here is ours, never player input.
function rich(s: string): string {
  return s
    .replace(/\{g:([^}]*)\}/g, '<span class="c-green">$1</span>')
    .replace(/\{r:([^}]*)\}/g, '<span class="c-red">$1</span>')
    .replace(/\{b:([^}]*)\}/g, '<span class="c-cyan">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
}
const richParas = (lines: string[]) => lines.map((l) => `<p>${rich(l)}</p>`).join('')

// colour a records-check line by its verdict: green for a match, red for a miss
function lkClass(line: string): string {
  if (/NO MATCH|NO SUCH|NO LEDGER|DIFFERENCE/.test(line)) return ' lk-no'
  if (/EXACT MATCH|LEDGER ENTRY FOUND/.test(line)) return ' lk-yes'
  if (/\bLISTED\b/.test(line) && !/NEAREST/.test(line)) return ' lk-yes'
  return ''
}

const paras = (lines: string[]) => lines.map((l) => `<p>${esc(l).replace(/\n/g, '<br>')}</p>`).join('')

function clock(): string {
  const total = (21 * 60 + 30 + S.clockMin) % (24 * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function overtime(): boolean {
  // shift ends 06:00 = 510 minutes after 21:30
  return S.clockMin > 510
}

function currentMsg(): Msg {
  return S.phase === 'practice' ? PRACTICE : DECK[S.msgIdx]
}

function resetPerMessage() {
  S.truthKnown = false
  S.lookupOpen = false
  S.lookupDone = false
  S.scanOpen = false
  S.coachStep = 0
  S.callsMade = new Set()
  S.calledPrinted = false
}

function setStatus(text: string) {
  const bar = document.getElementById('status-text')
  if (bar) bar.textContent = text
}

function setStatusHtml(html: string) {
  const bar = document.getElementById('status-text')
  if (bar) bar.innerHTML = html
}

// The lens shows its work: the registrable owner (the END of the name) is marked.
function lensReadout(href: string): string {
  const [host, ...path] = href.split('/')
  const labels = host.split('.')
  const owner = labels.slice(-2).join('.')
  const prefix = labels.slice(0, -2).join('.')
  const hostHtml = (prefix ? esc(prefix) + '.' : '') + '<mark class="dest">' + esc(owner) + '</mark>'
  return 'LENS → THE REAL URL: ' + hostHtml + (path.length ? '/' + esc(path.join('/')) : '') + ' — the owner of the site is the marked part, at the end of the name.'
}

// ── body rendering ───────────────────────────────────────────────────────────

function bodyHtml(msg: Msg): string {
  const segs = msg.dynamic
    ? buildFinaleBody(S.results.filter((r) => r.route.includes('QUARANTINED')).length, S.leaks.includes('ferret'))
    : msg.body
  let html = ''
  for (const seg of segs) {
    if (seg.kind === 'text') {
      html += esc(seg.text)
        .split('\n\n')
        .map((p) => `<span class="bp">${p.replace(/\n/g, '<br>')}</span>`)
        .join('<br><br>')
    } else {
      html += `<a href="#" class="msg-link" data-href="${esc(seg.href)}">${esc(seg.text)}</a>`
    }
  }
  return html
}

// ── grading ──────────────────────────────────────────────────────────────────

function pickOutcome(msg: Msg, stamp: 'deliver' | 'quarantine'): Outcome {
  if (S.truthKnown) {
    const v = stamp === 'deliver' ? msg.outcomes.verifiedDeliver : msg.outcomes.verifiedQuarantine
    if (v) return v
  }
  return msg.outcomes[stamp]
}

// ── flow ─────────────────────────────────────────────────────────────────────

export function startApp() {
  app = document.getElementById('app')!
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', positionCoach)
  startFerret()
  ;(window as unknown as Record<string, unknown>).MOON = {
    state: S,
    jump(n: number) {
      S.phase = 'shift'
      S.orientation = false
      S.msgIdx = Math.max(0, Math.min(12, n - 1))
      S.unlocked = new Set()
      if (n >= 4) S.unlocked.add('lens')
      if (n >= 6) {
        S.unlocked.add('scanner')
        S.unlocked.add('phone')
      }
      if (n >= 8) S.unlocked.add('guide')
      S.results = DECK.slice(0, S.msgIdx).map((m) => ({ n: m.n, label: m.subject, route: 'DELIVERED', grade: 'clean' as Grade }))
      S.clockMin = S.msgIdx * 30
      S.overlay = null
      resetPerMessage()
      render()
    },
    review() {
      S.results = DECK.map((m) => ({ n: m.n, label: m.subject, route: m.genuine ? 'DELIVERED' : 'QUARANTINED', grade: 'clean' as Grade }))
      S.results.splice(11, 0, { n: '—', label: 'CONFIRM IT’S YOU ×3', route: 'REPORTED', grade: 'clean' })
      S.phase = 'review'
      S.overlay = null
      render()
    },
  }
  render()
}

function beginOrientation() {
  S.phase = 'film'
  S.orientation = true
  S.filmIdx = 0
  render()
}

function abstain() {
  S.abstained = true
  S.orientation = false
  beginShift()
}

function beginPractice() {
  S.phase = 'practice'
  resetPerMessage()
  render()
}

function beginShift() {
  S.phase = 'shift'
  S.msgIdx = 0
  S.clockMin = 0 // practice and orientation happen off the clock
  resetPerMessage()
  S.overlay = null
  render()
}

function stamp(which: 'deliver' | 'quarantine') {
  const msg = currentMsg()
  const out = pickOutcome(msg, which)
  if (S.phase === 'practice') {
    // practice happens off the clock and off the record
    S.overlay = {
      type: 'outcome',
      head: out.head,
      body: out.body,
      note: out.note,
      grade: out.grade,
      next: out.grade === 'clean' ? 'begin-shift' : 'retry',
    }
    render()
    return
  }
  S.clockMin += 30
  let body = [...out.body]
  const variant = which === 'deliver' ? msg.outcomes.verifiedDeliver : msg.outcomes.verifiedQuarantine
  if (S.truthKnown && !variant) {
    body = ['You had the truth in hand from the telephone. What followed was, therefore, a choice.', ...body]
  }
  if (S.calledPrinted && !S.truthKnown) {
    body = [...body, 'You did dial the number printed in the message. That number was printed by the sender. It does not count as checking — that is rather the point.']
  }
  const route = (S.truthKnown ? 'VERIFIED → ' : '') + (which === 'deliver' ? 'DELIVERED' : 'QUARANTINED')
  S.results.push({ n: msg.n, label: msg.subject, route, grade: out.grade })
  ferretReact(out.grade)
  if (msg.interruptAfter) S.pendingInterrupt = true
  S.overlay = { type: 'outcome', head: out.head, body, note: out.note, grade: out.grade, next: 'advance' }
  render()
}

function consentChoice(allow: boolean) {
  const msg = currentMsg()
  const out = allow ? msg.allow! : msg.deny!
  S.clockMin += 15
  if (allow) S.leaks.push('ferret')
  S.results.push({ n: msg.n, label: msg.subject, route: allow ? 'ALLOWED' : 'DENIED', grade: out.grade })
  S.overlay = { type: 'outcome', head: out.head, body: out.body, note: out.note, grade: out.grade, next: 'advance' }
  render()
}

function advance() {
  const msg = currentMsg()
  // interstitials queued after this message?
  if (msg.unlockAfter && msg.unlockAfter.length && !msg.unlockAfter.every((id) => S.unlocked.has(id))) {
    S.overlay = { type: 'inter', queue: [...msg.unlockAfter] }
    render()
    return
  }
  afterInterstitials()
}

function afterInterstitials() {
  if (S.pendingInterrupt) {
    S.pendingInterrupt = false
    S.overlay = { type: 'interrupt', step: 0 }
    render()
    return
  }
  nextMessage()
}

function nextMessage() {
  if (S.msgIdx >= DECK.length - 1) {
    S.phase = 'review'
    S.overlay = null
    render()
    return
  }
  S.msgIdx++
  resetPerMessage()
  S.overlay = null
  render()
}

function doCall(id: string) {
  const msg = currentMsg()
  const call = msg.calls.find((c) => c.id === id)
  if (!call) return
  if (!S.callsMade.has(id)) {
    // repeat calls replay the conversation but charge nothing and move no meters
    if (S.phase !== 'practice') S.clockMin += call.minutes
    if (call.trusted) {
      if (S.phase === 'shift') {
        if (msg.canonicalVerify) S.verifiesLoadBearing++
        else S.verifiesRecreational++
      }
    } else {
      S.calledPrinted = true
      if (S.phase === 'shift') S.printedCalls++
    }
  }
  if (call.trusted) S.truthKnown = true
  S.callsMade.add(id)
  S.overlay = { type: 'callResult', label: call.label, lines: call.result }
  render()
}

function resolveInterrupt(action: 'approve' | 'deny' | 'report') {
  const ov = S.overlay
  if (!ov || ov.type !== 'interrupt') return
  if (action === 'deny' && ov.step < 2) {
    S.overlay = { type: 'interrupt', step: ov.step + 1 }
    render()
    return
  }
  const out = action === 'approve' ? INTERRUPT.approve : INTERRUPT.report
  S.clockMin += 10
  S.results.push({
    n: '—',
    label: 'CONFIRM IT’S YOU ×3 (badge push-bombing)',
    route: action === 'approve' ? 'APPROVED' : 'REPORTED',
    grade: out.grade,
  })
  S.overlay = { type: 'outcome', head: out.head, body: out.body, note: out.note, grade: out.grade, next: 'after-interrupt' }
  render()
}

// ── keyboard ─────────────────────────────────────────────────────────────────

function onKey(e: KeyboardEvent) {
  if (e.repeat) return
  const key = e.key === 'Return' ? 'Enter' : e.key
  if (S.overlay) {
    if (S.overlay.type === 'abstain-confirm') {
      if (key === 'Enter') {
        S.overlay = null
        render()
      }
      if (key === 'Escape') abstain()
      return
    }
    if (S.overlay.type === 'guide' || S.overlay.type === 'calls') {
      if (key === 'Escape' || key === 'Enter' || key === ' ') {
        S.overlay = null
        render()
      }
      return
    }
    if ((key === 'Enter' || key === ' ') && (S.overlay.type === 'outcome' || S.overlay.type === 'callResult' || S.overlay.type === 'inter')) {
      overlayContinue()
    }
    return
  }
  // on the bare desktop or a side-app, the keyboard does not drive the game
  if (S.openApp !== 'mailroom') {
    if (key === 'Escape' && S.openApp) {
      S.openApp = null
      render()
    }
    return
  }
  if (S.phase === 'title') {
    if (key === 'Enter') beginOrientation()
    if (key === 'Escape') {
      S.overlay = { type: 'abstain-confirm' }
      render()
    }
    return
  }
  if (S.phase === 'film') {
    if (key === 'Escape') {
      S.overlay = { type: 'abstain-confirm' }
      render()
      return
    }
    if (key === 'ArrowLeft' || key === 'Backspace' || key === 'PageUp') {
      filmBack()
      return
    }
    if (key === 'ArrowRight' || key === 'Enter' || key === ' ' || key === 'PageDown') {
      filmNext()
      return
    }
    return // let Tab and everything else behave natively
  }
  if (S.phase === 'review' && (key === 'r' || key === 'R')) location.reload()
}

function filmNext() {
  if (S.filmIdx < FILM_CARDS.length - 1) {
    S.filmIdx++
    render()
  } else {
    beginPractice()
  }
}

function filmBack() {
  if (S.filmIdx > 0) {
    S.filmIdx--
    render()
  }
}

function filmGo(i: number) {
  S.filmIdx = Math.max(0, Math.min(FILM_CARDS.length - 1, i))
  render()
}

function overlayContinue() {
  const ov = S.overlay
  if (!ov) return
  if (ov.type === 'callResult' || ov.type === 'guide' || ov.type === 'calls') {
    S.overlay = null
    render()
    return
  }
  if (ov.type === 'inter') {
    const [head, ...rest] = ov.queue
    S.unlocked.add(head)
    if (rest.length) {
      S.overlay = { type: 'inter', queue: rest }
      render()
    } else {
      S.overlay = null
      afterInterstitials()
    }
    return
  }
  if (ov.type === 'outcome') {
    switch (ov.next) {
      case 'retry':
        S.overlay = null
        render()
        return
      case 'begin-shift':
        beginShift()
        return
      case 'after-interrupt':
        S.overlay = null
        nextMessage()
        return
      case 'advance':
        S.overlay = null
        advance()
        return
    }
  }
}

// ── render ───────────────────────────────────────────────────────────────────

function render() {
  app.innerHTML = desktopHtml()
  if (S.overlay) {
    const ov = document.createElement('div')
    ov.id = 'overlay'
    ov.innerHTML = overlayHtml()
    app.appendChild(ov)
  }
  bind()
  positionCoach()
}

// ── the desktop shell — the clerk's personal LUNACORP terminal ────────────────

const APP_TITLES: Record<DesktopApp, string> = {
  mailroom: 'MAILROOM/OS — Message Integrity',
  moonchat: 'MoonChat',
  notices: 'NOTICES.TXT',
  eleanor: 'ELEANOR',
}

function desktopHtml(): string {
  const icon = (id: DesktopApp, glyph: string, label: string) =>
    `<button class="dsk-icon${S.openApp === id ? ' active' : ''}" data-open="${id}"><span class="di-glyph">${glyph}</span><span class="di-label">${label}</span></button>`
  return `
  <div class="desktop">
    <div class="dsk-wall"><div class="dsk-watermark">LUNACORP<br><span>PORT ARMSTRONG</span></div></div>
    <div class="dsk-icons">
      ${icon('mailroom', '✉', 'MAILROOM/OS')}
      ${icon('moonchat', '◍', 'MoonChat')}
      ${icon('notices', '▤', 'NOTICES.TXT')}
      ${icon('eleanor', '❀', 'ELEANOR')}
    </div>
    ${S.openApp ? winHtml(S.openApp) : `<div class="dsk-hint">Double-click an icon. Open <b>MAILROOM/OS</b> to begin your shift.</div>`}
    <div class="taskbar">
      <span class="tb-logo">◐ LUNACORP</span>
      <span class="tb-mid">${S.openApp ? esc(APP_TITLES[S.openApp]) : 'PORT ARMSTRONG DESKTOP'}</span>
      <span class="tb-tray"><span class="tray-ferret" title="FERRET.EXE — desktop pet, pixel art pending">▚ FERRET.EXE ▸ zzz</span><span class="tb-clock">MOON STD ${clock()}</span></span>
    </div>
  </div>`
}

function winHtml(a: DesktopApp): string {
  const bar = `<div class="win-bar"><span class="win-name">${esc(APP_TITLES[a])}</span><span class="win-x" data-close="1" title="close">✕</span></div>`
  if (a === 'mailroom') {
    return `<div class="win win-mailroom">${bar}<div class="win-body">${gameHtml()}</div></div>`
  }
  return `<div class="win win-flavor win-${a}">${bar}<div class="win-body flavor-body">${flavorHtml(a)}</div></div>`
}

function gameHtml(): string {
  switch (S.phase) {
    case 'title':
      return titleHtml()
    case 'film':
      return filmHtml()
    case 'practice':
    case 'shift':
      return shiftHtml()
    case 'review':
      return reviewHtml()
  }
}

// worldbuilding side-apps (a place for jokes now, and the ferret + MoonChat leak hooks later)
function flavorHtml(a: DesktopApp): string {
  if (a === 'moonchat') {
    const chat = [
      ['GALLEY_KID', 'hey!! you got dobbs’ old desk huh. rip. water the plant, she remembers things'],
      ['GALLEY_KID', 'if a message ever feels weird just holler down the corridor. thats the whole trick honestly'],
      ['GALLEY_KID', 'ok take my quiz. WHICH AIRLOCK ARE YOU. it is scientific and also i made it up'],
    ]
    const bubbles = chat.map(([who, t]) => `<div class="chat-line"><span class="chat-who">${esc(who)}</span> ${esc(t)}</div>`).join('')
    const quiz = S.airlockQuiz
      ? `<div class="chat-line"><span class="chat-who">GALLEY_KID</span> knew it. you’re a <b>Freight Airlock</b>: steady, load-bearing, slightly haunted.</div>
         <div class="chat-meta">(the quiz asked your first pet’s name and the street you grew up on. cute, right? hold that thought for later tonight.)</div>`
      : `<button class="btn small" data-quiz="1">TAKE: WHICH AIRLOCK ARE YOU?</button>`
    return `<div class="chat">${bubbles}${quiz}</div>`
  }
  if (a === 'notices') {
    const items = [
      'The oxygen ration remains generous at one (1) unit per shift. Breathe responsibly.',
      'The Productivity Ferret is a colleague, not a snack. This is the last reminder. It is not the last incident.',
      'Cantina Tuesday is Regolith Loaf. Attendance at Tuesday is not mandatory. Tuesday is, however, inevitable.',
      'Clerk Dobbs’ desk plant (ELEANOR) is now the responsibility of the new clerk. Be kind. She has seen things.',
      'Morale is mandatory between 09:00 and 09:30. Please schedule feelings accordingly.',
    ]
    return `<div class="notices"><div class="notices-head">LUNACORP DAILY NOTICES — Port Armstrong</div>${items.map((i) => `<div class="notice-item">▪ ${esc(i)}</div>`).join('')}</div>`
  }
  // eleanor
  const watered = S.eleanorWatered
  const plant = `<pre class="plant${watered ? ' happy' : ''}">${esc(watered ? ELEANOR_HAPPY : ELEANOR_THIRSTY)}</pre>`
  const notes = (watered ? ELEANOR_NOTES_HAPPY : ELEANOR_NOTES_THIRSTY)
    .map((n) => `<div class="notice-item">${esc(n)}</div>`)
    .join('')
  const action = watered ? '' : `<button class="btn small" data-water="1">WATER ELEANOR</button>`
  return `<div class="eleanor">${plant}${notes}${action}</div>`
}

function titleHtml(): string {
  return `
  <div class="screen title-screen">
    <div class="title-kicker">LUNACORP CONSOLIDATED ▪ PORT ARMSTRONG ▪ 1989</div>
    <h1 class="game-title">DO NOT REPLY<br>TO THE MOON</h1>
    <div class="title-explainer">
      <p><b>A quick game that teaches you to spot phishing</b> — the fake emails and messages scammers use to steal passwords, money, and access.</p>
      <p>You’re the new mail clerk. Sort tonight’s messages: <b class="c-green">DELIVER</b> the real ones, <b class="c-red">QUARANTINE</b> the fakes, and <b class="c-cyan">VERIFY</b> anything you can’t tell — by checking on a channel you already trust. Real tells, real words, about 15 minutes.</p>
    </div>
    <div class="oath">
      I am the lock, not the wall.<br>
      I am the lock, not the censor.<br>
      When in doubt, I pick up the telephone.
    </div>
    <div class="title-opts">
      <button class="btn big" data-act="orient">[ENTER] START — NEW CLERK ORIENTATION</button>
      <button class="btn dim" data-act="abstain">[ESC] SKIP ORIENTATION (for repeat players)</button>
    </div>
  </div>`
}

function filmHtml(): string {
  const card = FILM_CARDS[S.filmIdx]
  const last = S.filmIdx === FILM_CARDS.length - 1
  const dots = FILM_CARDS.map(
    (c, i) =>
      `<button class="film-dot${i === S.filmIdx ? ' on' : ''}" data-film-go="${i}" title="${esc(c.title)}" aria-label="Card ${i + 1}: ${esc(c.title)}">${i + 1}</button>`,
  ).join('')
  return `
  <div class="screen film-screen">
    <div class="film-frame">
      <div class="film-title">${esc(card.title)}</div>
      <div class="film-body">${richParas(card.lines)}${card.diagram ? anatomyHtml() : ''}${card.urlLesson ? urlLessonHtml() : ''}</div>
      <div class="film-nav">
        <button class="btn dim small" data-film-back="1"${S.filmIdx === 0 ? ' disabled' : ''}>◀ BACK</button>
        <div class="film-dots">${dots}</div>
        <button class="btn small" data-film-next="1">${last ? 'BEGIN PRACTICE ▶' : 'NEXT ▶'}</button>
      </div>
      <div class="film-foot">CARD ${S.filmIdx + 1} / ${FILM_CARDS.length} · ←/→ arrow keys to page · [ESC] skip orientation</div>
    </div>
  </div>`
}

// The web-address lesson: a labelled breakdown, then click-the-owner practice.
// The hardest idea in the game, so it gets shown, labelled, and then drilled.
function urlLessonHtml(): string {
  const breakdown = `
  <div class="urlbd">
    <div class="ucol dec"><span class="useg">lunacorp.lun.</span><span class="ulab">decoration<br>(anyone can add this)</span></div>
    <div class="ucol own"><span class="useg">badge-revalidation.ert</span><span class="ulab">THE REAL SITE<br>(last name before the slash)</span></div>
    <div class="ucol path"><span class="useg">/login</span><span class="ulab">just the page</span></div>
  </div>
  <p class="url-rule">So this link goes to <b class="c-red">badge-revalidation.ert</b>, not to lunacorp.lun. Reading left to right fools you. Start at the slash and look left.</p>`

  const drills = URL_DRILLS.map((d, i) => {
    const picked = S.drillPicks[i]
    const answered = picked !== undefined
    const correct = answered && d.segs[picked]?.owner === true
    const segs = d.segs
      .map((s, j) => {
        let cls = 'useg-btn'
        if (answered) {
          if (s.owner) cls += ' right'
          else if (j === picked) cls += ' wrong'
          else cls += ' faded'
        }
        return `<button class="${cls}" data-drill="${i}" data-seg="${j}"${answered ? ' disabled' : ''}>${esc(s.t)}</button>`
      })
      .join('')
    const fb = answered ? `<div class="drill-fb ${correct ? 'ok' : 'no'}">${correct ? '✓ ' : '✗ '}${esc(correct ? d.ok : d.no)}</div>` : ''
    return `<div class="drill-row">${segs}${fb}</div>`
  }).join('')

  const done = URL_DRILLS.every((_, i) => S.drillPicks[i] !== undefined)
  return `
  <div class="urllesson">
    ${breakdown}
    <div class="drill">
      <div class="drill-q">Your turn. In each link, <b>click the part that shows who really owns the site</b>:</div>
      ${drills}
      ${done ? '<div class="drill-done">That is the whole trick. You will use it all night.</div>' : ''}
    </div>
  </div>`
}

// MODULE 3's annotated sample message: highlight boxes + numbered pins + legend.
// Teaches the interface before the player has to use it under pressure.
function anatomyHtml(): string {
  const pin = (n: number) => `<span class="pin">${n}</span>`
  return `
  <div class="anatomy">
    <div class="anat-card">
      <div class="anat-head">
        <div class="hrow"><span class="hkey">FROM</span><span class="hval"><span class="anat-box">T. ONDRICEK${pin(1)}</span> <span class="anat-box hot">&lt;t.ondricek@lunacorp.lun&gt;${pin(2)}</span></span></div>
        <div class="hrow"><span class="hkey">SUBJECT</span><span class="hval"><span class="anat-box">Welcome / the plant${pin(3)}</span></span></div>
        <div class="hrow"><span class="hkey">ATTACH</span><span class="hval"><span class="anat-box">▣ HANDBOOK.doc${pin(5)}</span></span></div>
      </div>
      <div class="anat-body">Clerk — welcome to Message Integrity. Full details at <span class="anat-box">lunacorp.lun/handbook${pin(4)}</span>.</div>
      <div class="anat-status"><span class="anat-box">▸ Click the sender’s address to check it${pin(6)}</span></div>
      <div class="anat-tray"><span class="anat-box"><span class="mini-stamp g">DELIVER</span><span class="mini-stamp r">QUARANTINE</span><span class="mini-stamp b">VERIFY</span>${pin(7)}</span></div>
    </div>
    <ol class="anat-legend">
      ${ANATOMY_PINS.map((p) => `<li><span class="pin">${p.n}</span><span>${rich(p.label)}</span></li>`).join('')}
    </ol>
  </div>`
}

function shiftHtml(): string {
  const msg = currentMsg()
  const practice = S.phase === 'practice'
  const counter = practice ? 'PRACTICE MESSAGE' : `MESSAGE ${msg.n} OF ${DECK.length}`
  const coach = coachHtml(msg)
  return `
  <div class="screen shift-screen">
    <div class="topbar">
      <span>MAILROOM/OS v2.11</span>
      <span>${counter}</span>
      <span>SHIFT CLOCK ${clock()}</span>
    </div>
    <div class="msg-scroll">
      <div class="msg-card">
        <div class="msg-head">
          <div class="hrow"><span class="hkey">FROM</span><span class="hval">${esc(msg.from.display)} <a href="#" class="from-addr" title="records check">&lt;${esc(msg.from.addr)}&gt;</a></span></div>
          ${msg.replyTo ? `<div class="hrow"><span class="hkey">REPLY-TO</span><span class="hval">${esc(msg.replyTo)}</span></div>` : ''}
          <div class="hrow"><span class="hkey">TO</span><span class="hval">${esc(msg.to)}</span></div>
          <div class="hrow"><span class="hkey">SUBJECT</span><span class="hval">${esc(msg.subject)}</span></div>
          ${msg.attachment ? `<div class="hrow"><span class="hkey">ATTACH</span><span class="hval"><a href="#" class="attach-chip">▣ ${esc(msg.attachment.name)}</a></span></div>` : ''}
        </div>
        ${S.lookupOpen ? `<div class="panel lookup-panel"><div class="panel-head">${esc(msg.lookup.head)}</div>${msg.lookup.lines.map((l) => `<div class="lookup-line${lkClass(l)}">${marks(l)}</div>`).join('')}</div>` : ''}
        ${S.scanOpen && msg.attachment ? `<div class="panel scan-panel"><div class="panel-head">ATTACHMENT SCAN — ${esc(msg.attachment.name)}</div>${msg.attachment.scan.map((l) => `<div class="lookup-line">${esc(l)}</div>`).join('')}</div>` : ''}
        <div class="msg-body">${bodyHtml(msg)}</div>
        ${msg.kind === 'consent' && msg.scopes ? `<div class="panel scopes-panel"><div class="panel-head">REQUESTED PERMISSIONS</div>${msg.scopes.map((s) => `<div class="lookup-line">▸ ${esc(s)}</div>`).join('')}</div>` : ''}
      </div>
    </div>
    <div class="statusbar"><span id="status-text" class="${S.truthKnown ? 'truth' : ''}">${
      S.truthKnown
        ? '☎ TRUTH KNOWN — a trusted channel has confirmed this message’s nature. Route accordingly.'
        : stampsLocked(msg)
          ? '▸ <b>Click the sender’s address</b> (the part in &lt;angle brackets&gt;) to run the RECORDS CHECK. The stamps will wait.'
          : S.unlocked.has('lens')
            ? '▸ <b>Click the sender’s address</b> to check it · hover or tap a link to preview its real URL.'
            : '▸ <b>Click the sender’s address</b> to check it (RECORDS CHECK).'
    }</span></div>
    <div class="tray">
      ${trayHtml(msg)}
    </div>
    ${coach}
  </div>`
}

function trayHtml(msg: Msg): string {
  // locked stamps stay clickable so the lock can explain itself (touch has no hover)
  const lockCls = stampsLocked(msg) ? ' locked' : ''
  if (msg.kind === 'consent') {
    return `
      <button class="btn tool" data-act="lookup">RECORDS CHECK</button>
      <button class="btn tool" data-act="guide">FIELD GUIDE</button>
      <span class="tray-spacer"></span>
      <button class="btn stamp allow" data-act="allow">ALLOW ALL</button>
      <button class="btn stamp deny" data-act="deny">DENY</button>`
  }
  return `
    <button class="btn tool" data-act="lookup">RECORDS CHECK</button>
    <button class="btn tool" data-act="guide">FIELD GUIDE</button>
    <span class="tray-spacer"></span>
    <button class="btn stamp deliver${lockCls}" data-act="deliver">DELIVER</button>
    <button class="btn stamp quarantine${lockCls}" data-act="quarantine">QUARANTINE</button>
    <button class="btn stamp verify" data-act="verify"${msg.calls.length ? '' : ' disabled'}>VERIFY…</button>`
}

function stampsLocked(msg: Msg): boolean {
  return S.phase === 'shift' && S.orientation && !!msg.coach?.requireLookup && !S.lookupDone
}

function coachHtml(msg: Msg): string {
  if (S.phase !== 'shift' && S.phase !== 'practice') return ''
  if (!S.orientation || !msg.coach) return ''
  const steps = msg.coach.steps
  if (S.coachStep >= steps.length) {
    // the subroutine does not leave until the records check has run
    if (msg.coach.requireLookup && !S.lookupDone) {
      return callout(
        '.from-addr',
        'ORIENTATION SUBROUTINE: the records check, Clerk. **Click the sender’s address** — the part in &lt;angle brackets&gt;. The stamps will wait. The corporation, technically, also.',
        '',
      )
    }
    return ''
  }
  const step = steps[S.coachStep]
  const nav = `<div class="coach-nav">
      <span class="coach-count">STEP ${S.coachStep + 1} / ${steps.length}</span>
      <span class="coach-btns">
        ${S.coachStep > 0 ? '<button class="btn dim small" data-coach-back="1">◀ BACK</button>' : ''}
        <button class="btn small" data-coach-next="1">${S.coachStep < steps.length - 1 ? 'NEXT ▶' : 'GOT IT'}</button>
      </span>
    </div>`
  return callout(step.target, step.text, nav)
}

function callout(target: string | undefined, text: string, nav: string): string {
  return `<div class="coach" data-coach-target="${target ? esc(target) : ''}">
    <div class="coach-body">${rich(text)}</div>
    ${nav}
  </div>`
}

// Anchor the callout beside its target and point an arrow at it (measured after
// render, so it survives reflow/resize). One coach mark at a time, by design.
function positionCoach() {
  app.querySelectorAll('.coach-target').forEach((e) => e.classList.remove('coach-target'))
  const coach = app.querySelector<HTMLElement>('.coach')
  if (!coach) return
  const host = app.querySelector<HTMLElement>('.shift-screen')
  const sel = coach.dataset.coachTarget
  if (!host || !sel) return
  const target = app.querySelector<HTMLElement>(sel)
  if (!target) return
  target.classList.add('coach-target')

  const hb = host.getBoundingClientRect()
  const tb = target.getBoundingClientRect()
  const cw = coach.offsetWidth
  const chh = coach.offsetHeight
  const gap = 16
  let arrow: 'left' | 'right' | 'up' = 'left'
  let left = tb.right - hb.left + gap // default: to the RIGHT of the target
  if (left + cw > hb.width - 10) {
    const toLeft = tb.left - hb.left - cw - gap
    if (toLeft > 10) {
      left = toLeft
      arrow = 'right'
    } else {
      left = Math.max(10, Math.min(tb.left - hb.left, hb.width - cw - 10))
      arrow = 'up'
    }
  }
  let top = arrow === 'up' ? tb.bottom - hb.top + gap : tb.top - hb.top + tb.height / 2 - chh / 2
  top = Math.max(10, Math.min(top, hb.height - chh - 10))
  coach.style.left = `${left}px`
  coach.style.top = `${top}px`
  coach.dataset.arrow = arrow
}

function overlayHtml(): string {
  const ov = S.overlay!
  if (ov.type === 'outcome') {
    const gradeLabel = ov.grade === 'clean' ? 'CLEAN ROUTE' : ov.grade === 'costly' ? 'SAFE BUT COSTLY' : 'MISROUTED'
    return `
    <div class="modal outcome-${ov.grade}">
      <div class="grade-banner">${gradeLabel}</div>
      <div class="modal-head">${esc(ov.head)}</div>
      <div class="modal-body">${paras(ov.body)}</div>
      ${ov.note ? `<div class="field-note">${esc(ov.note)}</div>` : ''}
      <button class="btn big" data-act="ov-continue">${ov.next === 'retry' ? 'TRY AGAIN' : ov.next === 'begin-shift' ? 'BEGIN SHIFT' : 'CONTINUE'}</button>
    </div>`
  }
  if (ov.type === 'callResult') {
    return `
    <div class="modal">
      <div class="modal-head">☎ ${esc(ov.label)}</div>
      <div class="modal-body">${paras(ov.lines)}</div>
      <button class="btn big" data-act="ov-continue">HANG UP</button>
    </div>`
  }
  if (ov.type === 'inter') {
    const inter = INTERSTITIALS[ov.queue[0]]
    return `
    <div class="modal inter">
      <div class="modal-head">${esc(inter.head)}</div>
      <div class="modal-body">${paras(inter.body)}</div>
      <button class="btn big" data-act="ov-continue">ACKNOWLEDGE</button>
    </div>`
  }
  if (ov.type === 'abstain-confirm') {
    return `
    <div class="modal">
      <div class="modal-head">ABSTAIN FROM ORIENTATION?</div>
      <div class="modal-body"><p>Orientation runs 94 seconds and cannot be re-attended. The corporation will note an abstention. The corporation notes everything.</p></div>
      <div class="interrupt-btns">
        <button class="btn big" data-act="abstain-no">[ENTER] CONTINUE ORIENTATION</button>
        <button class="btn dim" data-act="abstain-yes">[ESC] ABSTAIN (noted in file)</button>
      </div>
    </div>`
  }
  if (ov.type === 'interrupt') {
    const step = INTERRUPT.steps[ov.step]
    return `
    <div class="modal interrupt">
      <div class="grade-banner">⚠ CONFIRM IT’S YOU — ${esc(step.time)}</div>
      <div class="modal-body">${paras(step.lines)}</div>
      <div class="interrupt-btns">
        <button class="btn stamp allow" data-act="int-approve">APPROVE</button>
        ${ov.step < 2 ? '<button class="btn stamp deny" data-act="int-deny">DENY</button>' : '<button class="btn stamp deny" data-act="int-report">DENY ALL &amp; REPORT TO SECURITY</button>'}
      </div>
    </div>`
  }
  // guide
  const pages = GUIDE_PAGES.filter((p) => p.needs === 'always' || S.unlocked.has(p.needs as InterstitialId))
  return `
  <div class="modal guide">
    <div class="modal-head">A FIELD GUIDE TO COUNTERFEIT CORRESPONDENCE</div>
    <div class="modal-body">
      ${pages.map((p) => `<div class="guide-page"><div class="panel-head">${esc(p.title)}</div>${paras(p.lines)}</div>`).join('')}
      ${pages.length < GUIDE_PAGES.length ? '<div class="dim-note">(further pages pending declassification)</div>' : ''}
    </div>
    <button class="btn big" data-act="ov-continue">CLOSE</button>
  </div>`
}

function callsModalHtml(msg: Msg): string {
  const items = msg.calls
    .map((c) => {
      const needsPhone = c.kind === 'phone' && !S.unlocked.has('phone')
      const done = S.callsMade.has(c.id)
      return `<button class="btn call-target${c.kind === 'printed' ? ' printed' : ''}" data-call="${esc(c.id)}"${needsPhone ? ' disabled' : ''}>
        ${esc(c.label)}${needsPhone ? ' — TELEPHONE OUT FOR REPAIR' : ''}${done ? ' ✓' : ''}
      </button>`
    })
    .join('')
  return `
  <div class="modal calls">
    <div class="modal-head">VERIFY — CHOOSE A CHANNEL</div>
    <div class="modal-body">
      <p class="dim-note">Trusted channels are the ones you already had. Numbers printed inside a message reach whoever printed them.</p>
      ${items}
    </div>
    <button class="btn big" data-act="ov-continue">NEVER MIND</button>
  </div>`
}

function reviewHtml(): string {
  const miss = S.results.filter((r) => r.grade === 'miss').length
  const costly = S.results.filter((r) => r.grade === 'costly').length
  const retention =
    miss === 0 && costly === 0
      ? 'PROMOTED TO CLERK, GRADE III. (PAPERWORK PENDING. DECADES, POSSIBLY.)'
      : miss === 0
        ? 'RETAINED. FAVORABLE. FORM 22-B ON FILE, UNUSED.'
        : miss <= 2
          ? 'RETAINED, PROVISIONALLY. THE FILE GROWS.'
          : 'RETAINED. THE CORPORATION HAS NO ONE ELSE.'

  const verifyLines: string[] = []
  if (S.verifiesLoadBearing > 0)
    verifyLines.push(
      `${S.verifiesLoadBearing} call${S.verifiesLoadBearing === 1 ? ' was' : 's were'} load-bearing: the telephone alone separated genuine from counterfeit. This is what the telephone is for.`,
    )
  if (S.verifiesRecreational >= 3)
    verifyLines.push('You also telephoned the cantina regarding a menu, and similar. The corporation admires thoroughness, and has budgeted for it, narrowly.')
  if (S.verifiesLoadBearing + S.verifiesRecreational === 0)
    verifyLines.push('You verified nothing. Some of tonight’s truths were only available by telephone; consult your grades.')
  if (S.printedCalls > 0)
    verifyLines.push(`You dialed the number printed inside a message ${S.printedCalls} time${S.printedCalls === 1 ? '' : 's'}. Whoever printed it remains very friendly.`)
  if (S.abstained) verifyLines.push('Orientation: ABSTAINED. (Noted in file. The file mentions it, once, mildly.)')
  if (overtime()) verifyLines.push('OVERTIME NOTED. The corporation thanks you and will not be compensating you.')

  const rows = S.results
    .map(
      (r) => `<tr class="g-${r.grade}"><td>${r.n}</td><td class="rl">${esc(String(r.label))}</td><td>${esc(r.route)}</td><td class="assess a-${r.grade}">${
        r.grade === 'clean' ? 'CLEAN ROUTE' : r.grade === 'costly' ? 'SAFE BUT COSTLY' : 'MISROUTED'
      }</td></tr>`,
    )
    .join('')

  const decoder: [string, string][] = [
    ['THE HOVER LENS', 'Hover before you click; long-press on phones. Shorteners and redirects add hops — when in doubt, type the site yourself.'],
    ['THE RECORDS CHECK', 'Read the sender’s address character by character, against contacts you already have.'],
    ['READ THE NAME FROM THE RIGHT', 'yourbank.com.evil-site.net belongs to evil-site.net. The owner sits at the END of the name.'],
    ['THE ATTACHMENT SCANNER', 'An attachment you weren’t expecting: don’t open it — ask the sender on another channel. A file’s name is not its type, and “enable macros” in mailed files is a stop sign.'],
    ['THE LEDGER NUMBER', 'The number on the back of your card. The website you type yourself.'],
    ['THE LANDLINE / FORTY FEET', 'Out-of-band verification: a channel you already trusted before the message arrived.'],
    ['OXYGEN VOUCHER CODES', 'Gift-card codes are cash that vanishes on reading. Wires are clawed back only by SPEED — call your bank’s fraud line the minute you suspect.'],
    ['BADGE PIN + HAB CODE', 'Passwords and 2FA codes. No genuine notice collects them by mail.'],
    ['THE FOUR MARKS', 'Urgency. Authority. Secrecy. The move.'],
    ['“CONFIRM IT’S YOU” ×3', 'MFA push-bombing. Deny, report, change the password — never approve to make it stop.'],
    ['THE FERRET’S SCOPES', 'App permission screens. Read what it may DO, not how it smiles.'],
    ['THE FILTER SITUATION', 'Real notices look like scams. Verify on a number you already had, then route — don’t burn.'],
    ['CLERK DOBBS', 'Report fast, blame nothing. Shame is the counterfeiter’s best friend.'],
    ['“I GOT A WEIRD SIGNAL,” SAID OUT LOUD', 'The actual security control.'],
  ]

  return `
  <div class="screen review-screen">
    <div class="review-inner">
      <div class="title-kicker">LUNACORP CONSOLIDATED ▪ COMMUNICATIONS ANNEX ▪ END OF SHIFT ${clock()}</div>
      <h2>CLERK PERFORMANCE REVIEW</h2>
      <table class="review-table">
        <tr><th>#</th><th>ITEM</th><th>YOUR ROUTE</th><th>ASSESSMENT</th></tr>
        ${rows}
      </table>
      <div class="review-notes">${paras(verifyLines)}</div>
      <div class="retention"><span class="hkey">RETENTION STATUS:</span> ${esc(retention)}</div>

      <h2>THE DECODER — what tonight was actually about</h2>
      <table class="decoder-table">
        ${decoder.map(([a, b]) => `<tr><td class="dk">${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}
      </table>

      <div class="oath">
        I am the lock, not the wall.<br>
        I am the lock, not the censor.<br>
        When in doubt, I pick up the telephone.
      </div>
      <button class="btn big" data-act="restart">[R] WORK ANOTHER SHIFT (same mail, new eyes)</button>
    </div>
  </div>`
}

// ── event binding ────────────────────────────────────────────────────────────

function bind() {
  app.querySelectorAll<HTMLElement>('[data-act]').forEach((el) => {
    el.addEventListener('click', () => {
      const act = el.dataset.act!
      if (el.classList.contains('locked')) {
        setStatusHtml('▸ <b>Click the sender’s address</b> first to run the RECORDS CHECK. The corporation insists.')
        return
      }
      if (el.hasAttribute('disabled')) return
      switch (act) {
        case 'orient':
          beginOrientation()
          break
        case 'abstain':
          abstain()
          break
        case 'lookup':
          S.lookupOpen = !S.lookupOpen
          S.lookupDone = true
          render()
          break
        case 'guide':
          S.overlay = { type: 'guide' }
          render()
          break
        case 'deliver':
          stamp('deliver')
          break
        case 'quarantine':
          stamp('quarantine')
          break
        case 'verify':
          S.overlay = { type: 'calls' }
          render()
          break
        case 'allow':
          consentChoice(true)
          break
        case 'deny':
          consentChoice(false)
          break
        case 'coach-next':
          S.coachStep++
          render()
          break
        case 'ov-continue':
          overlayContinue()
          break
        case 'int-approve':
          resolveInterrupt('approve')
          break
        case 'int-deny':
          resolveInterrupt('deny')
          break
        case 'int-report':
          resolveInterrupt('report')
          break
        case 'abstain-yes':
          abstain()
          break
        case 'abstain-no':
          S.overlay = null
          render()
          break
        case 'restart':
          location.reload()
          break
      }
    })
  })

  // calls modal is a special overlay body swap
  if (S.overlay?.type === 'calls') {
    const ovEl = document.getElementById('overlay')
    if (ovEl) {
      ovEl.innerHTML = callsModalHtml(currentMsg())
      ovEl.querySelectorAll<HTMLElement>('[data-call]').forEach((el) => {
        el.addEventListener('click', () => {
          if (el.hasAttribute('disabled')) return
          doCall(el.dataset.call!)
        })
      })
      ovEl.querySelector('[data-act="ov-continue"]')?.addEventListener('click', () => {
        S.overlay = null
        render()
      })
    }
  }

  // sender address → records check
  app.querySelectorAll<HTMLAnchorElement>('.from-addr').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      S.lookupOpen = !S.lookupOpen
      S.lookupDone = true
      render()
    })
  })

  // attachment chip → scanner
  app.querySelectorAll<HTMLAnchorElement>('.attach-chip').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      if (!S.unlocked.has('scanner')) {
        setStatus('ATTACHMENT SCANNER NOT INSTALLED — contents unreadable. Equipment is issued as budget permits.')
        return
      }
      S.scanOpen = !S.scanOpen
      render()
    })
  })

  // links → the lens (links never navigate; inspect only)
  app.querySelectorAll<HTMLAnchorElement>('.msg-link').forEach((a) => {
    const show = () => {
      if (S.unlocked.has('lens')) {
        setStatusHtml(lensReadout(a.dataset.href!))
      } else {
        setStatus('HOVER LENS NOT INSTALLED — destination unreadable.')
      }
    }
    a.addEventListener('mouseenter', show)
    a.addEventListener('click', (e) => {
      e.preventDefault()
      show()
    })
  })

  // filmstrip navigation — back / forward / jump to any card
  app.querySelector<HTMLElement>('[data-film-next]')?.addEventListener('click', filmNext)
  app.querySelector<HTMLElement>('[data-film-back]')?.addEventListener('click', (e) => {
    if ((e.currentTarget as HTMLElement).hasAttribute('disabled')) return
    filmBack()
  })
  app.querySelectorAll<HTMLElement>('[data-film-go]').forEach((el) => {
    el.addEventListener('click', () => filmGo(Number(el.dataset.filmGo)))
  })

  // URL drill: click the segment you think owns the site
  app.querySelectorAll<HTMLElement>('[data-seg]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.hasAttribute('disabled')) return
      S.drillPicks[Number(el.dataset.drill)] = Number(el.dataset.seg)
      render()
    })
  })

  // coach-mark navigation
  app.querySelector<HTMLElement>('[data-coach-next]')?.addEventListener('click', () => {
    S.coachStep++
    render()
  })
  app.querySelector<HTMLElement>('[data-coach-back]')?.addEventListener('click', () => {
    S.coachStep = Math.max(0, S.coachStep - 1)
    render()
  })

  // desktop: open an app
  app.querySelectorAll<HTMLElement>('[data-open]').forEach((el) => {
    el.addEventListener('click', () => {
      S.openApp = el.dataset.open as DesktopApp
      render()
    })
  })
  // desktop: close the focused window (game state persists; reopening resumes)
  app.querySelectorAll<HTMLElement>('[data-close]').forEach((el) => {
    el.addEventListener('click', () => {
      S.openApp = null
      render()
    })
  })
  // MoonChat quiz (a leak hook for the finale) + ELEANOR watering
  app.querySelector<HTMLElement>('[data-quiz]')?.addEventListener('click', () => {
    S.airlockQuiz = true
    if (!S.leaks.includes('moonchat')) S.leaks.push('moonchat')
    render()
  })
  app.querySelector<HTMLElement>('[data-water]')?.addEventListener('click', () => {
    S.eleanorWatered = true
    render()
  })
}
