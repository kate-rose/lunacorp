import type { FilmCard, Msg } from '../types'

// ── NEW CLERK ORIENTATION ▪ FILMSTRIP No. 7: "THE MAIL AND YOU" ──────────────

// The web-address drill. Each URL is split into segments; the player clicks the
// one that shows who really owns the site. `owner` marks the correct segment.
export const URL_DRILLS: { segs: { t: string; owner?: boolean }[]; ok: string; no: string }[] = [
  {
    segs: [{ t: 'lunacorp.lun', owner: true }, { t: '/badge-portal' }],
    ok: 'Yes. lunacorp.lun sits right before the slash, so this really is LUNACORP.',
    no: 'Not quite. Everything after the slash is just the page. Look at what comes right BEFORE the first slash.',
  },
  {
    segs: [{ t: 'lunacorp.lun.' }, { t: 'badge-revalidation.ert', owner: true }, { t: '/login' }],
    ok: 'Yes. badge-revalidation.ert owns this. The "lunacorp.lun." in front is just decoration.',
    no: 'That is the trap. Anyone can put "lunacorp.lun." at the front. The owner is the last name before the slash: badge-revalidation.ert.',
  },
  {
    segs: [{ t: 'secure-lunacorp.lun', owner: true }, { t: '/verify' }],
    ok: 'Right. And notice: secure-lunacorp.lun is NOT lunacorp.lun. A hyphen makes a whole different site.',
    no: 'Close. The owner is secure-lunacorp.lun. And that is not lunacorp.lun at all: a hyphen makes a whole different site.',
  },
]

// Inline markup available in `lines`:  {g:green}  {r:red}  {b:blue}  **bold**
export const FILM_CARDS: FilmCard[] = [
  {
    title: '1 — WHAT THIS IS',
    lines: [
      'This game teaches you to spot phishing: fake messages that try to steal passwords, money, or access.',
      '',
      'You are the new mail clerk at Port Armstrong, a company town on the Moon. Every message to the station passes your desk. Some are real. Some are not.',
      '',
      'It takes about 15 minutes.',
      '',
      '**Go back and forth at your own pace** with the buttons below, the numbered dots, or the arrow keys.',
    ],
  },
  {
    title: '2 — THE THREE STAMPS',
    lines: [
      'Every message gets exactly one stamp.',
      '',
      '{g:**DELIVER**} means it is real. Pass it along. Most mail is real, so this is the most common answer.',
      '',
      '{r:**QUARANTINE**} means it is fake. Delete it.',
      '',
      '{b:**VERIFY**} means you cannot tell yet. Check with someone you already trust, using contact details you already have.',
      '',
      'The buttons at the bottom of the screen use these same colours.',
    ],
  },
  {
    title: '3 — WHAT A MESSAGE LOOKS LIKE',
    lines: ['The numbered parts are the ones that can lie to you.'],
    diagram: true,
  },
  {
    title: '4 — CHECK WHO SENT IT',
    lines: [
      '**Click any sender address** to look it up in the station directory.',
      '',
      'A fake address copies a real one closely, but never exactly. The check compares them one character at a time and marks a match {g:green} or a mismatch {r:red}.',
      '',
      'One thing to remember: a matching address proves the address is real. It does not prove the sender is safe. Accounts get stolen. What the message asks for still has to make sense.',
    ],
  },
  {
    title: '5 — READING A WEB ADDRESS',
    lines: [
      'Links lie more often than anything else, and this is the one trick worth learning properly.',
      '',
      '**Find the first single slash. The real site is the name just before it.** Everything further left is decoration, and anyone can put anything there.',
    ],
    urlLesson: true,
  },
  {
    title: '6 — TWO WAYS TO GET IT WRONG',
    lines: [
      'Passing along a fake hurts a person.',
      'Blocking real mail hurts the station.',
      '',
      'Both count against you, so "block everything" is not a strategy. When you cannot tell, that is what {b:VERIFY} is for.',
      '',
      'One more thing. The clerk before you clicked something bad. That happens, and it was survivable. He then told nobody for three days, and that part was not. If something looks wrong, say so out loud right away. Nobody here gets blamed for reporting.',
    ],
  },
  {
    title: '7 — PRACTICE',
    lines: [
      'One practice message next. Nothing here can hurt anyone.',
      '',
      'The terminal will point at what to look at.',
    ],
  },
]

// The annotated sample message shown on MODULE 3 — a fake terminal card with
// numbered highlight boxes, then a legend. Teaches the interface before the
// player is asked to use it under pressure.
export const ANATOMY_PINS: { n: number; label: string }[] = [
  { n: 1, label: 'The name shown. Decoration. Anyone can type anything here.' },
  { n: 2, label: 'The actual address. This is the fact. **Click it** to look it up.' },
  { n: 3, label: 'The subject line. Where fake deadlines like to live.' },
  { n: 4, label: 'A link. Hover it, or long-press on a phone, to see the real address.' },
  { n: 5, label: 'An attachment. Click to check what the file really is.' },
  { n: 6, label: 'The status bar. Your terminal tells you things here.' },
  { n: 7, label: 'The stamps: {g:DELIVER}, {r:QUARANTINE}, {b:VERIFY}. One per message.' },
]

// ── THE PRACTICE MESSAGE ─────────────────────────────────────────────────────
// Wrong stamps are practice-reversed; the correct stamp begins the shift.

export const PRACTICE: Msg = {
  n: 0,
  id: 'practice',
  kind: 'mail',
  from: { display: 'THE MOON LOTTERY COMMISSION', addr: 'winner-services@moon-lottery-official.ert' },
  to: '(PRACTICE RESIDENT)',
  subject: 'CONGRATULATIONS!!! YOU HAVE WON THE MOON',
  body: [
    {
      kind: 'text',
      text:
        'DEAR LUCKY RESIDENT,\n\nYour badge number has been selected from ALL BADGE NUMBERS to receive: THE MOON.\n\nTo claim your prize, simply reply with your badge PIN, your hab access code, and your mother’s maiden name for verification purposes.\n\nThis offer expires in ONE HOUR. Tell no one, as jealousy is corrosive.\n\n— The Commission',
    },
  ],
  genuine: false,
  lookup: {
    head: 'RECORDS CHECK — STATION DIRECTORY + VENDOR LEDGER',
    lines: [
      '"MOON LOTTERY COMMISSION" ......... NO MATCH',
      'winner-services@moon-lottery-official.ert ......... NO MATCH',
      '',
      'NOTE: there is no lottery. There is barely a moon.',
    ],
  },
  calls: [
    {
      id: 'practice-call',
      label: 'THE DIRECTORY DESK (all-purpose practice line)',
      kind: 'walk',
      trusted: true,
      minutes: 0,
      result: [
        'You telephone the Directory about THE MOON LOTTERY COMMISSION. The Directory has never heard of it, and now, neither have you.',
        'ORIENTATION SUBROUTINE: when every mark is present and the sender does not exist, you may stamp with confidence. The telephone is for doubt. This was not doubt.',
      ],
    },
  ],
  coach: {
    requireLookup: true,
    steps: [
      {
        text: 'PRACTICE. Nothing here can hurt anyone. Start where you always start: **the FROM line** — the name, and then the address after it.',
        target: '.msg-head',
      },
      {
        text: '**Click the sender’s address** — the underlined part in &lt;angle brackets&gt;, right there. That runs the RECORDS CHECK.',
        target: '.from-addr',
      },
      {
        text: 'No such station. Now read the message itself: a prize from nowhere, ONE HOUR, "tell no one", and it wants the numbers that open a person’s life.',
        target: '.msg-body',
      },
      {
        text: 'That is a counterfeit. Burn it: **{r:QUARANTINE}**, the red stamp. (Guess wrong and we simply do it again — the resident is laminated.)',
        target: '.btn.stamp.quarantine',
      },
    ],
  },
  outcomes: {
    deliver: {
      grade: 'miss',
      head: 'PRACTICE-REVERSED',
      body: [
        'The practice resident has practice-lost his savings. Fortunately, he is laminated.',
        'Observe what you delivered: a prize he never entered for, a one-hour deadline, a request for silence, and an ask for the exact numbers that open his life.',
        'The stamp has been practice-reversed. Try again.',
      ],
    },
    quarantine: {
      grade: 'clean',
      head: 'CORRECT. PRACTICE CONCLUDED.',
      body: [
        'There is no lottery. Note what you saw: a prize out of nowhere, a deadline, secrecy, and a request for the numbers that open a person’s life.',
        'You will see all of these again tonight, wearing better suits.',
      ],
      note: 'The practice resident thanks you, flatly, from inside the laminate.',
    },
  },
}
