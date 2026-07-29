import type { FilmCard, Msg } from '../types'

// ── NEW CLERK ORIENTATION ▪ FILMSTRIP No. 7: "THE MAIL AND YOU" ──────────────

export const FILM_CARDS: FilmCard[] = [
  {
    title: 'LUNACORP NEW CLERK ORIENTATION',
    lines: [
      'FILMSTRIP No. 7 — "THE MAIL AND YOU"',
      '',
      'Runtime: 94 seconds.',
      'Attendance is mandatory and voluntary.',
      '',
      'This filmstrip contains everything the corporation',
      'is legally required to teach you.',
    ],
  },
  {
    title: 'MODULE 1 — THE POSITION',
    lines: [
      'Congratulations, Clerk. You have been selected for',
      'MESSAGE INTEGRITY on the basis of aptitude, availability,',
      'and being the only applicant.',
      '',
      'Every message to Port Armstrong passes through your',
      'terminal. Residents trust the mail because the mail',
      'passes through you.',
      '',
      'Do not dwell on this.',
    ],
  },
  {
    title: 'MODULE 2 — THE STAMPS',
    lines: [
      'You will read each message and apply exactly one (1)',
      'stamp. Stamps are corporate property.',
      '',
      'DELIVER (green) — the message is genuine. Route it.',
      'Most mail is genuine. You are a lock, not a wall.',
      '',
      'QUARANTINE (red) — the message is counterfeit. Burn it.',
      'Do not feel bad. It is not a person.',
      '',
      'VERIFY (blue) — you cannot tell. Ask someone you',
      'already trust, on a channel you already had. This is',
      'not cheating. This is the job.',
    ],
  },
  {
    title: 'MODULE 3 — THE RECORDS CHECK',
    lines: [
      'Your terminal is equipped with a RECORDS CHECK.',
      'CLICK any sender’s address to compare it against the',
      'STATION DIRECTORY and the vendor LEDGER.',
      '',
      'Counterfeits imitate listed addresses closely,',
      'but never exactly. Read character by character;',
      'the records check does it with you.',
      '',
      '(An exact match proves the address. Not the sender.',
      'More on this later, by telephone.)',
      '',
      'Additional equipment will be issued as budget permits.',
      'The budget is aware of you.',
    ],
  },
  {
    title: 'MODULE 4 — ERRORS',
    lines: [
      'Delivering a counterfeit endangers a resident.',
      'Quarantining genuine mail endangers the station.',
      'Both are recorded in your file.',
      '',
      'There is no third, safe kind of error.',
      '',
      'There is, however, the telephone.',
    ],
  },
  {
    title: 'MODULE 5 — THE NO-BLAME DOCTRINE (FORM 22-B)',
    lines: [
      'Your predecessor made an error. Errors are survivable;',
      'the corporation practices a No-Blame Doctrine.',
      '',
      'Your predecessor then told no one for three days.',
      'The Doctrine could not reach him in time.',
      '',
      'Report strange signals immediately. Saying',
      '"I received a strange signal" out loud is a normal',
      'and celebrated activity.',
    ],
  },
  {
    title: 'MODULE 6 — PRACTICE',
    lines: [
      'You will now process one (1) supervised practice',
      'message.',
      '',
      'It is not real. The resident it endangers is laminated.',
    ],
  },
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
