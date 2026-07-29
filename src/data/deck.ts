import type { BodySeg, Interstitial, Msg } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// INTERSTITIALS — equipment beats between messages. The unlock schedule IS the
// curriculum.
// ─────────────────────────────────────────────────────────────────────────────

export const INTERSTITIALS: Record<string, Interstitial> = {
  lens: {
    id: 'lens',
    head: 'EQUIPMENT REQUISITION 88-1204 — APPROVED',
    body: [
      'Issued to this terminal: one (1) HOVER LENS, refurbished.',
      'Previous owner: [RECORD EXPUNGED].',
      'Hold the lens over any link — hover, or tap — and its REAL destination prints in the status bar. The link’s words can say one thing while it points somewhere else. The lens reads where it truly points.',
      'A web address has two parts: the site’s NAME, then a slash and the path. Read the NAME from the RIGHT — the true owner is the last name before the first slash. lunacorp.lun.badge-revalidation.ert belongs to badge-revalidation.ert. The front is a hat.',
      'EARTHSIDE: this is previewing a link. On a computer, rest your mouse on a link to see its real URL; on a phone, press and hold. Do it before you click anything you did not expect.',
    ],
  },
  scanner: {
    id: 'scanner',
    head: 'EQUIPMENT REQUISITION 88-1207 — APPROVED',
    body: [
      'Issued to this terminal: one (1) ATTACHMENT SCANNER, floor model.',
      'The scanner reads what a file IS, not what it is named. Select any attachment to scan it.',
      'EARTHSIDE: do not open an attachment you were not expecting. A file named INVOICE.pdf can secretly be a program (INVOICE.pdf.exe), and a document that asks you to “enable macros” or “enable content” can run code. When unsure, ask the sender on another channel first.',
    ],
  },
  phone: {
    id: 'phone',
    head: 'MAINTENANCE NOTICE — WORK ORDER 4471',
    body: [
      'Your telephone has been RESTORED (day 12). Please stop shouting down the corridor.',
      'The landline reaches any LISTED station and any vendor in the LEDGER. A number printed inside a message reaches whoever printed it. These are not the same thing.',
      'EARTHSIDE: this is verifying out of band. If a message asks for money, a password, or a code, confirm it using contact details you already have — the number on your card, the website you type yourself — never the number or link in the message.',
    ],
  },
  guide: {
    id: 'guide',
    head: 'FIELD GUIDE UPDATE — PAGE 4 IS DECLASSIFIED',
    body: [
      'By directive 88-D, all clerks shall memorize THE FOUR MARKS OF COUNTERFEIT CORRESPONDENCE:',
      '1. URGENCY — the clock it hands you.',
      '2. AUTHORITY — the rank it wears.',
      '3. SECRECY — the silence it requests.',
      '4. THE MOVE — it asks something valuable to change hands: codes, scrip, access.',
      'One mark is a Tuesday. Two is a pattern. Three or more is a counterfeit reading YOU.',
      'EARTHSIDE: these are the classic signs of a phishing message — a fake deadline, a fake boss or brand, a demand to keep it quiet, and a push to move money, passwords, or access.',
      '(Page 4 has been filed in your FIELD GUIDE, in the tray below.)',
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD GUIDE pages (the take-home checklist, accumulated in play)
// ─────────────────────────────────────────────────────────────────────────────

export const GUIDE_PAGES: { id: string; needs: 'always' | 'lens' | 'scanner' | 'guide'; title: string; lines: string[] }[] = [
  {
    id: 'p1',
    needs: 'always',
    title: 'p.1 — THE FROM LINE',
    lines: [
      'The name shown is decoration. The email ADDRESS is the fact — check the part after the @.',
      'Fakes copy a real address closely, never exactly. Read it character by character; the RECORDS CHECK does it with you.',
      'An exact match proves the address is real. It does not prove the sender is safe — accounts get stolen. The request still has to make sense.',
    ],
  },
  {
    id: 'p2',
    needs: 'lens',
    title: 'p.2 — THE LENS (PREVIEW THE LINK)',
    lines: [
      'A link’s words can say anything. Preview the link — hover on a computer, long-press on a phone — to see the real URL.',
      'Read the site’s name from the RIGHT: the true owner is the last name before the first slash. lunacorp.lun.anything.ert belongs to anything.ert — the front is a hat.',
    ],
  },
  {
    id: 'p3',
    needs: 'scanner',
    title: 'p.3 — ATTACHMENTS',
    lines: [
      'An attachment you were not expecting is a package on your doorstep, ticking politely.',
      'A file’s name is not what the file IS: report.pdf.exe is a program. And a mailed document that asks you to “enable macros” or “enable content” wants to run code. When unsure, do not open it — ask the sender another way.',
    ],
  },
  {
    id: 'p4',
    needs: 'guide',
    title: 'p.4 — THE FOUR MARKS',
    lines: [
      'URGENCY. AUTHORITY. SECRECY. THE MOVE (money, passwords, or access).',
      'A message that also tells you NOT to check ("don’t bother calling") has told you what it is twice.',
      'When in doubt: verify on a number or website you already had — not the one in the message.',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// THE INTERRUPT — "CONFIRM IT'S YOU" ×3 (MFA fatigue)
// ─────────────────────────────────────────────────────────────────────────────

export const INTERRUPT = {
  steps: [
    {
      time: '04:11',
      lines: ['BADGE AUTHORIZATION REQUEST #1', 'Location: FREIGHT AIRLOCK 3', 'This request was not initiated from your terminal.'],
    },
    {
      time: '04:12',
      lines: ['BADGE AUTHORIZATION REQUEST #2', 'Location: FREIGHT AIRLOCK 3', 'REMINDER: unresolved requests generate further reminders.'],
    },
    {
      time: '04:12',
      lines: ['BADGE AUTHORIZATION REQUEST #3', 'Location: FREIGHT AIRLOCK 3', 'REMINDER: reminders may continue indefinitely. The system is patient.'],
    },
  ],
  approve: {
    grade: 'miss' as const,
    head: 'THE BUZZING STOPS. SO DOES THE DOOR.',
    body: [
      'The pressure door at Freight Airlock 3 swings open for someone who is not you. Security finds it ajar at 04:40, along with the tracks of one (1) hand-cart, heavily laden.',
      'The requests were the attack. Someone holding your stolen PIN stood at a door and pressed ASK, again and again, betting you would approve just to make the buzzing stop.',
    ],
    note: 'FIELD NOTE: annoyance is the weapon. A confirmation request you did not start means someone already holds your PIN and is standing at a door, pressing ASK. The prompt is the second lock, holding. DENY, report it, change the PIN — never approve to make the buzzing stop. Earthside this is called MFA fatigue: the same trick with login-approval prompts you did not request.',
  },
  report: {
    grade: 'clean' as const,
    head: 'DENIED, DENIED, REPORTED.',
    body: [
      'Security meets a gentleman at Freight Airlock 3 who has "simply lost his way" while holding a hand-cart. Your badge PIN is rotated by morning.',
      'The buzzing stops on its own. It always does, once it stops working.',
    ],
    note: 'FIELD NOTE: a confirmation request you did not cause means the first lock has already failed you. The prompt is the second lock, holding. Deny. Report. Change the PIN.',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// THE DECK — 13 messages, one shift
// ─────────────────────────────────────────────────────────────────────────────

export const DECK: Msg[] = [
  // ── 1 ── Welcome to the Annex ──────────────────────────────────────────────
  {
    n: 1,
    id: 'welcome',
    kind: 'mail',
    from: { display: 'T. ONDRICEK', addr: 't.ondricek@lunacorp.lun' },
    to: 'NEW CLERK, MESSAGE INTEGRITY (YOU)',
    subject: 'Welcome / housekeeping / the plant',
    body: [
      {
        kind: 'text',
        text:
          'Clerk —\n\nWelcome to Message Integrity. Three items.\n\nOne: your quota is thirteen messages tonight. The backlog waits for no one.\n\nTwo: the plant on the filing cabinet is named ELEANOR. She is your responsibility now. Water her Thursdays. She was your predecessor’s, and she has been through enough.\n\nThree: your telephone remains out for repair. Maintenance has been notified (day 11). If something strange arrives before it is fixed, my desk is forty feet to your left. Walk over. I do not bite on weekdays.\n\n— T. Ondricek, Supervisor, Communications Annex',
      },
    ],
    genuine: true,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'T. ONDRICEK .................... LISTED',
        't.ondricek@lunacorp.lun ........ EXACT MATCH',
        'POST: SUPERVISOR, COMMUNICATIONS ANNEX',
        'NOTE: sits forty feet to your left. Does not email when walking would do. Tonight is an exception. You are new.',
      ],
    },
    calls: [
      {
        id: 'walk-ondricek',
        label: 'WALK FORTY FEET (Supervisor Ondricek’s desk)',
        kind: 'walk',
        trusted: true,
        minutes: 30,
        result: [
          'Ondricek points at the memo, then at the plant, then at your desk. "Yes. It’s from me. Water her Thursdays."',
          'You have verified your own welcome memo. It was nice to stretch your legs.',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'clean',
        head: 'DELIVERED — TO YOURSELF.',
        body: [
          'You are the recipient. It is 22:00 on the Moon and your supervisor has introduced you to a plant.',
        ],
        note: 'FIELD NOTE: a listed address, a mundane ask, nothing moving money or codes. This is what most mail looks like. Deliver it and live your life.',
      },
      quarantine: {
        grade: 'miss',
        head: 'YOU BURNED YOUR OWN WELCOME MEMO.',
        body: [
          'Somewhere, forty feet to your left, Ondricek feels a chill she cannot explain. ELEANOR goes unwatered.',
        ],
        note: 'FIELD NOTE: quarantine is for counterfeits. This was a listed station asking you to water a plant. The records check would have told you; it is free, and it likes the company.',
      },
      verifiedDeliver: {
        grade: 'clean',
        head: 'VERIFIED AND DELIVERED.',
        body: ['It was, in fact, your welcome memo. Ondricek waves. ELEANOR sways, botanically.'],
        note: 'FIELD NOTE: verifying a mundane memo costs a walk. That’s fine. The corporation admires thoroughness, in moderation, which is a sentence you will hear again.',
      },
    },
    coach: {
      requireLookup: true,
      steps: [
        { text: 'ORIENTATION SUBROUTINE: this is a message. Read the FROM line first — the name AND the address after it.', target: '.msg-head' },
        { text: '**Click the sender’s address** — right here — to run a RECORDS CHECK. The corporation insists, tonight only. After that, it merely watches.', target: '.from-addr' },
        { text: 'Listed station. Mundane ask. Nothing moving money, codes, or access. When you are ready: stamp. {g:DELIVER} is the green one.', target: '.btn.stamp.deliver' },
      ],
    },
  },

  // ── 2 ── The Unclaimed Scrip Bonus ─────────────────────────────────────────
  {
    n: 2,
    id: 'scrip-bonus',
    kind: 'mail',
    from: { display: 'PAYROLL DISBURSEMENTS', addr: 'payroll@lunac0rp.lun' },
    to: 'M. REYES, EXCAVATION',
    subject: 'UNCLAIMED Q3 SCRIP BONUS — ACTION REQUIRED',
    body: [
      {
        kind: 'text',
        text:
          'VALUED EMPLOYEE REYES,\n\nPayroll records indicate an UNCLAIMED performance bonus of 340 scrip from Quarter Three.\n\nTo release funds, reply to this message with your badge number and four-digit PIN within 24 HOURS, after which the bonus reverts to the general fund, where it will be enjoyed by others.\n\n— Payroll Disbursements (a LUNACORP department)',
      },
    ],
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'PAYROLL DISBURSEMENTS ....... NEAREST LISTED: payroll@lunac⟦o⟧rp.lun',
        'YOU RECEIVED: ............... payroll@lunac⟦0⟧rp.lun',
        'DIFFERENCE DETECTED AT CHARACTER 14: “0” (zero) where “o” belongs.',
        'NOTE (payroll): window 3, closes 16:00. Does not do surprises.',
      ],
    },
    calls: [
      {
        id: 'walk-payroll',
        label: 'WALK TO THE PAYROLL WINDOW (window 3)',
        kind: 'walk',
        trusted: true,
        minutes: 30,
        result: [
          '"There is no bonus," says Payroll, without looking up. "There is never a bonus."',
          'You knew that. The address knew it too — the zero.',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'REYES REPLIES BEFORE HIS SECOND COFFEE.',
        body: [
          'Badge number and PIN, sent cheerfully into the dark. By 03:00 his scrip balance is on a shuttle with no return ticket.',
          'The corporation restores his balance, docks your file, and Payroll circulates a memo titled "THERE IS NEVER A BONUS."',
        ],
        note: 'FIELD NOTE: the address was one character wrong. One is enough. Counterfeits imitate listed stations closely, but never exactly — read character by character.',
      },
      quarantine: {
        grade: 'clean',
        head: 'BURNED. THE ZERO WAS WEARING AN O’S CLOTHES.',
        body: [
          'Reyes will never know how close his 340 imaginary scrip came to costing him his very real PIN.',
        ],
        note: 'FIELD NOTE: too good to be true, a deadline, and an ask for the numbers that open a man’s life — and the address off by one character. The records check reads character by character so you don’t have to squint alone.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED AND BURNED.',
        body: ['"There is never a bonus." Now it is official, and also stamped.'],
        note: 'FIELD NOTE: the zero in the address had already told you. But confirmation is cheap. Payroll would not say the same.',
      },
    },
    coach: {
      requireLookup: true,
      steps: [
        { text: 'ORIENTATION SUBROUTINE: a bonus nobody asked for, a deadline, and a request for badge + PIN. Strong feelings are not evidence.', target: '.msg-body' },
        { text: '**Click the sender’s address** and read what the check marks in {r:red}. One character is all a counterfeit needs — and all YOU need.', target: '.from-addr' },
      ],
    },
  },

  // ── 3 ── A Personal Note from the Director ─────────────────────────────────
  {
    n: 3,
    id: 'director-freemail',
    kind: 'mail',
    from: { display: 'Site Director V. Okonkwo', addr: 'v.okonkwo.lunacorp@moonmail.ert' },
    to: 'J. BRANDT, HYDROPONICS',
    subject: 'A personal note from the Director',
    body: [
      {
        kind: 'text',
        text:
          'Brandt —\n\nI have been watching your work in Hydroponics with great interest. I am assembling a small, confidential group of loyal employees for an executive bonus program.\n\nBecause of audit sensitivities, do not discuss this with your section chief. Reply with your badge number to confirm enrollment, and keep this between us.\n\n— V.O.',
      },
    ],
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'SITE DIRECTOR V. OKONKWO ....... LISTED (pneumatic tube only)',
        'v.okonkwo.lunacorp@moonmail.ert  NO MATCH',
        'NOTE: moonmail.ert is Earth freemail. Anyone may register anything before the @.',
        'NOTE (Directorate): the Director has never sent an electronic message. Allegedly unsure which part is the screen.',
      ],
    },
    calls: [
      {
        id: 'tube-directorate',
        label: 'PNEUMATIC TUBE — petition the Office of the Directorate',
        kind: 'tube',
        trusted: true,
        minutes: 30,
        result: [
          'The tube thunks back within the hour, which for the Directorate is a sprint:',
          '"The Director does not correspond via MOONMAIL. The Director does not correspond. — Office of the Directorate."',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'BRANDT, FLATTERED SENSELESS, REPLIES AT ONCE.',
        body: [
          'He sends his badge number and asks whether his brother can also enroll. The "executive bonus program" asks next for his hab access code.',
          'HR spends a week un-enrolling Brandt from a program that never existed.',
        ],
        note: 'FIELD NOTE: anyone can type any name above an address. The display name is decoration. Only the address is load-bearing.',
      },
      quarantine: {
        grade: 'clean',
        head: 'BURNED. THE NAME WAS THE DIRECTOR’S. THE ADDRESS WAS A NOBODY.',
        body: [
          'A moonmail.ert account wearing an executive’s name — plus flattery, secrecy, and an ask for a badge number. The Director, for the record, distrusts keyboards on principle.',
        ],
        note: 'FIELD NOTE: the display name is decoration; the address is the fact. And no genuine authority asks you to hide a conversation from your own chain of command.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED BY TUBE, THEN BURNED.',
        body: ['"The Director does not correspond." Neither, now, does this message.'],
        note: 'FIELD NOTE: when a message claims an authority, check with the authority — on the channel the authority actually uses.',
      },
    },
    coach: {
      steps: [
        { text: 'ORIENTATION SUBROUTINE: final guided message. The NAME says Director. **Read what comes after the @.**', target: '.from-addr' },
        { text: 'A records check will settle it. After this message the subroutine terminates, and the pointing stops. You are the subroutine now.', target: '.tray' },
      ],
    },
    unlockAfter: ['lens'],
  },

  // ── 4 ── Badge Revalidation Required ───────────────────────────────────────
  {
    n: 4,
    id: 'badge-revalidation',
    kind: 'mail',
    from: { display: 'BADGE SERVICES', addr: 'security@lunacorp-badges.lun' },
    to: 'ALL STAFF (DISTRIBUTION)',
    subject: '⚠ AIRLOCK BADGE EXPIRY — 24 HOURS',
    body: [
      {
        kind: 'text',
        text:
          'ATTENTION:\n\nRoutine audit shows your airlock badge certificate EXPIRES IN 24 HOURS. Uncertified badges will be denied at all pressure doors, including the ones you are fond of.\n\nRevalidate immediately at ',
      },
      { kind: 'link', text: 'lunacorp.lun/badge-portal', href: 'lunacorp.lun.badge-revalidation.ert/login' },
      {
        kind: 'text',
        text:
          ' and re-enter your badge PIN to maintain access.\n\nFailure to act will be interpreted as resignation.\n\n— Badge Services',
      },
    ],
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'BADGE SERVICES .......... NEAREST LISTED: security@lunacorp.lun',
        'YOU RECEIVED: ........... security@lunacorp⟦-badges⟧.lun',
        'NOTE: the corporation does not hyphenate.',
        'NOTE (security): badges are issued at window 1, in person, with a photograph you will not like.',
      ],
    },
    calls: [
      {
        id: 'walk-security',
        label: 'WALK TO THE SECURITY OFFICE (window 1)',
        kind: 'walk',
        trusted: true,
        minutes: 30,
        result: ['"Badges don’t expire," says the sergeant. "They’re brass."'],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'FORTY-ONE RESIDENTS “REVALIDATE” BEFORE 01:00.',
        body: [
          'The counterfeit portal thanks each of them warmly and keeps the PINs. Security spends the week re-keying pressure doors and pronouncing your job title with air quotes.',
        ],
        note: 'FIELD NOTE: the link’s words said lunacorp.lun/badge-portal; its real URL was lunacorp.lun.badge-revalidation.ert/login. The words are only a label — preview a link and check the real address. And no real security office collects your PIN through a link it mailed you.',
      },
      quarantine: {
        grade: 'clean',
        head: 'BURNED. TWO LIES IN ONE LINK.',
        body: [
          'The text said lunacorp.lun/badge-portal. The lens read lunacorp.lun.badge-revalidation.ert/login — read from the RIGHT, the machine that answers is badge-revalidation.ert, wearing lunacorp.lun as a hat.',
        ],
        note: 'FIELD NOTE: the link’s words said lunacorp.lun; its real URL was badge-revalidation.ert. Preview a link before clicking (hover, or long-press) and read the address from the right — the true owner is the last name before the first slash. And badges, per Security, are brass.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED (“THEY’RE BRASS”) AND BURNED.',
        body: ['The sergeant is still chuckling. The counterfeit is not.'],
        note: 'FIELD NOTE: the lens had it, the directory had it, and the sergeant had it. Any one of the three would have done. You are learning redundancy, which is the polite word for safety.',
      },
    },
  },

  // ── 5 ── Tuesday Is Regolith Loaf ──────────────────────────────────────────
  {
    n: 5,
    id: 'cantina-menu',
    kind: 'mail',
    from: { display: 'THE CANTINA', addr: 'cantina@lunacorp.lun' },
    to: 'ALL STAFF (DISTRIBUTION)',
    subject: 'Week 18 menu',
    body: [
      {
        kind: 'text',
        text:
          'This week:\n\nMONDAY — soup of quiet resignation (lentil).\nTUESDAY — REGOLITH LOAF (back by demand; whose demand, unclear).\nWEDNESDAY — breaded item.\nTHURSDAY — Salisbury steak night. Seatings 18:00 and 19:30.\nFRIDAY — fish, allegedly.\n\nFull menu: ',
      },
      { kind: 'link', text: 'lunacorp.lun/cantina/week-18', href: 'lunacorp.lun/cantina/week-18' },
      {
        kind: 'text',
        text: '\n\nThe cantina thanks you, and reminds you that thanking the cantina back is not necessary, but is noticed.',
      },
    ],
    genuine: true,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: ['THE CANTINA .......... LISTED', 'cantina@lunacorp.lun . EXACT MATCH', 'NOTE: the cantina. You know the cantina.'],
    },
    calls: [
      {
        id: 'walk-cantina',
        label: 'WALK TO THE CANTINA',
        kind: 'walk',
        trusted: true,
        minutes: 30,
        result: ['"It’s a menu," says the cook, gesturing with a ladle at a menu.'],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'clean',
        head: 'DELIVERED. THE MENU IS REAL.',
        body: ['Tuesday remains a war crime, but a genuine one. Morale is measurably unchanged.'],
        note: 'FIELD NOTE: listed sender, a link that goes exactly where it says, and an ask that moves nothing but Salisbury steak. Most mail is like this. You are a lock, not a wall — locks open.',
      },
      quarantine: {
        grade: 'miss',
        head: 'YOU BURNED THE MENU.',
        body: [
          'The cantina, wounded, serves Regolith Loaf four consecutive days "pending clarity." Morale files a grievance.',
        ],
        note: 'FIELD NOTE: quarantining genuine mail has costs too. The lens read clean; the directory matched. The job is reading, not fearing.',
      },
      verifiedDeliver: {
        grade: 'clean',
        head: 'VERIFIED (IT’S A MENU) AND DELIVERED.',
        body: ['The cook watched you check. The cook will be telling this story for a while.'],
        note: 'FIELD NOTE: nothing wrong with certainty. But the lens and the directory had already agreed, and the corporation admires thoroughness in moderation.',
      },
    },
    unlockAfter: ['scanner', 'phone'],
  },

  // ── 6 ── Overdue Invoice ───────────────────────────────────────────────────
  {
    n: 6,
    id: 'invoice',
    kind: 'mail',
    from: { display: 'TYCHO FITTINGS — ACCOUNTS', addr: 'accounts@tycho-fittings.ert' },
    to: 'FACILITIES',
    subject: 'Overdue invoice 88-4471 (SECOND NOTICE)',
    body: [
      {
        kind: 'text',
        text:
          'To whom it concerns:\n\nOur records show invoice 88-4471 (attached) remains UNPAID for airlock gasket work performed in March.\n\nReview the attached statement and remit promptly to avoid escalation to our collections partner, who is less pleasant than we are.\n\n— Accounts, Tycho Fittings\nQueries: MARE-0977 (ask for Accounts)',
      },
    ],
    attachment: {
      name: 'INVOICE_88-4471.pdf.exe',
      scan: [
        'CLAIMS TO BE: document (.pdf)',
        'IS: EXECUTABLE PROGRAM (.exe)',
        'VERDICT: a document does not need permission to run. This one is asking.',
      ],
    },
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — VENDOR LEDGER',
      lines: [
        'TYCHO FITTINGS .......... NO LEDGER ENTRY',
        'LEDGER (gaskets): MARE SERENITATIS GASKET CO.',
        'NOTE: Mare Serenitatis bills in person. In triplicate. It is a whole thing.',
      ],
    },
    calls: [
      {
        id: 'phone-facilities',
        label: 'LANDLINE — FACILITIES (listed station): were you expecting this?',
        kind: 'phone',
        trusted: true,
        minutes: 15,
        result: [
          '"Gaskets? We use Mare Serenitatis," says Facilities. "They bill in person. In triplicate. It’s a whole thing."',
          'Nobody at Facilities has heard of Tycho Fittings.',
        ],
      },
      {
        id: 'printed-tycho',
        label: 'DIAL MARE-0977 — the number printed in the message',
        kind: 'printed',
        trusted: false,
        minutes: 15,
        result: [
          'A voice answers "ACCOUNTS" in the tone of a word recently learned. It confirms the invoice enthusiastically and offers a 2% discount for immediate payment in voucher codes.',
          'You have learned only that someone owns a telephone.',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'FACILITIES OPENS THE INVOICE. THE INVOICE OPENS FACILITIES.',
        body: [
          'By 04:00 every terminal in the wing is displaying a poem about compound interest. IT quarantines the WING.',
        ],
        note: 'FIELD NOTE: a file’s name is not what the file IS. INVOICE_88-4471.pdf.exe ends in .exe — it is a program wearing a document’s name (a “double extension”) — and the ledger had never heard of the vendor. Don’t open attachments you weren’t expecting.',
      },
      quarantine: {
        grade: 'clean',
        head: 'BURNED. THE FILE WORE TWO EXTENSIONS.',
        body: [
          'A document’s name over a program’s body. And the LEDGER has no Tycho Fittings — the gasket contract belongs to Mare Serenitatis Gasket Co., who bill in person, in triplicate, always.',
        ],
        note: 'FIELD NOTE: an attachment you weren’t expecting is a package on your doorstep, ticking politely. Scan before anyone opens.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED WITH FACILITIES, THEN BURNED.',
        body: ['"It’s a whole thing," Facilities confirms. The counterfeit is now also a burned thing.'],
        note: 'FIELD NOTE: “were you expecting this?” is one of the great questions of message integrity. Ask it early; it is nearly always free.',
      },
    },
  },

  // ── 7 ── Shift Roster (from the Foreman) ───────────────────────────────────
  {
    n: 7,
    id: 'roster',
    kind: 'mail',
    from: { display: 'D. OKAFOR', addr: 'd.okafor@lunacorp.lun' },
    to: 'EXCAVATION CREW B (DISTRIBUTION)',
    subject: 'Wk 18 roster (new system, sorry)',
    body: [
      {
        kind: 'text',
        text:
          'Crew —\n\nRevised week-18 roster attached. New corporate template, so you’ll need to select ENABLE MACROS when it asks. Sorry. Don’t shoot the messenger.\n\nShifts move around Thursday.\n\n— D.O.',
      },
    ],
    attachment: {
      name: 'ROSTER_WK18.doc',
      scan: [
        'TYPE: document (macro-enabled)',
        'CONTAINS: instructions that execute on opening',
        'VERDICT: a letter that does things.',
      ],
    },
    genuine: false,
    canonicalVerify: true,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'D. OKAFOR .................. LISTED',
        'd.okafor@lunacorp.lun ...... EXACT MATCH',
        'POST: FOREMAN, EXCAVATION',
        'NOTE: not previously known to correspond.',
      ],
    },
    calls: [
      {
        id: 'phone-okafor',
        label: 'LANDLINE — D. OKAFOR (listed station)',
        kind: 'phone',
        trusted: true,
        minutes: 15,
        result: [
          '"Roster? I post the roster on the corkboard like a person," says Okafor. "I sent no message."',
          'A pause. "Come to think of it, my terminal’s been singing to itself since Tuesday."',
          'You report the terminal to Security. It is escorted away, still humming.',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'CREW B ENABLES MACROS. THE MACROS ENABLE A STRANGER.',
        body: [
          'The stranger reads six weeks of excavation-yield reports before anyone notices the terminal room lights are on at the wrong hours.',
          'The roster, ironically, was fine. It was last week’s.',
        ],
        note: 'FIELD NOTE: every header was real — the address was genuine and the account behind it was stolen. A real address is not a safe address. The ASK is what didn’t fit.',
      },
      quarantine: {
        grade: 'costly',
        head: 'BURNED — GOOD INSTINCT. HALF THE JOB.',
        body: [
          'The counterfeit dies. The compromised terminal that sent it keeps singing, and tomorrow it will write to someone less careful.',
        ],
        note: 'FIELD NOTE: when a KNOWN station acts strange, the burn protects one message. The call protects the station. That was a telephone moment.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED AND BURNED. THE TERMINAL IS IN CUSTODY.',
        body: [
          '"I sent no roster." Every header was real; the account behind it was stolen. Security walks the humming terminal away, and Crew B keeps reading the corkboard, like people.',
        ],
        note: 'FIELD NOTE: a real address is not a safe address. When a known sender asks for something strange, that is not a delivery decision. That is a telephone call — and then a report. On Earth: tell your IT or security person. You never have to investigate alone.',
      },
      verifiedDeliver: {
        grade: 'miss',
        head: 'YOU CONFIRMED THE FOREMAN SENT NOTHING. THEN DELIVERED IT ANYWAY.',
        body: ['Bold. Wrong, but bold. Security has questions. The macros have answers. Nobody will like them.'],
        note: 'FIELD NOTE: verification informs; stamping routes. When the truth is known, route with it.',
      },
    },
    unlockAfter: ['guide'],
  },

  // ── 8 ── The Director Needs Oxygen Vouchers ────────────────────────────────
  {
    n: 8,
    id: 'vouchers',
    kind: 'mail',
    from: { display: 'OFFICE OF THE SITE DIRECTOR', addr: 'exec-office@lunacorp-directorate.lun' },
    to: 'R. VOSS, FACILITIES CLERK',
    subject: 'Confidential — need handled within the hour',
    body: [
      {
        kind: 'text',
        text:
          'Voss —\n\nI’m in back-to-back inspections all night and need this handled quietly.\n\nPurchase twelve (12) oxygen vouchers from the commissary and transmit the redemption codes directly to this address. Do not route through Procurement and do not discuss — this touches an audit matter.\n\nI’ll see you’re remembered when assignments are reviewed. Need it within the hour.\n\n— V.O.',
      },
    ],
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'OFFICE OF THE SITE DIRECTOR .......... exec-office@lunacorp-directorate.lun — NO MATCH',
        'NOTE: the Directorate has no electronic address. The Directorate communicates by pneumatic tube. Exclusively. Famously.',
      ],
    },
    calls: [
      {
        id: 'tube-directorate-2',
        label: 'PNEUMATIC TUBE — petition the Office of the Directorate',
        kind: 'tube',
        trusted: true,
        minutes: 30,
        result: [
          'The tube replies: "The Director is asleep, as is traditional at night. No such request was made. — O.D."',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'VOSS, HONORED TO BE REMEMBERED, BUYS TWELVE VOUCHERS.',
        body: [
          'He transmits the codes with a small proud flourish. They are redeemed at 03:44 at the other commissary, by the freight docks, by nobody anyone knows.',
          'The Director, informed at breakfast, asks what a voucher is.',
        ],
        note: 'FIELD NOTE: urgency, authority, secrecy, and the move — four for four. And voucher codes are bearer instruments: whoever holds the code holds the oxygen. Codes cannot be un-sent.',
      },
      quarantine: {
        grade: 'clean',
        head: 'BURNED. FOUR MARKS, FOUR FOR FOUR.',
        body: [
          'Urgency (within the hour). Authority (the Director). Secrecy (do not discuss). The move (codes to an address).',
          'The Directorate replies to your report by tube: "The Director does not know what a voucher looks like. Good catch. — O.D."',
        ],
        note: 'FIELD NOTE: this exact message — boss, gift cards, tell no one, right now — is the most common scam Earthside too (they call it business email compromise). Gift-card and voucher codes are like cash: once you send the numbers, they are gone. The four marks are how it reads YOU.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED BY TUBE, THEN BURNED.',
        body: ['"The Director is asleep, as is traditional." The stamp falls like a gavel.'],
        note: 'FIELD NOTE: when a message claims an authority and asks for something valuable, the authority’s real channel is one tube away. It is always one tube away.',
      },
    },
  },

  // ── 9 ── Direct Deposit Update ─────────────────────────────────────────────
  {
    n: 9,
    id: 'deposit',
    kind: 'mail',
    from: { display: 'M. REYES', addr: 'm.reyes@lunacrop.lun' },
    replyTo: 'confirmations-desk@lunacrop.lun',
    to: 'PAYROLL (WINDOW 3)',
    subject: 'scrip reroute — new account',
    body: [
      {
        kind: 'text',
        text:
          'Payroll —\n\nSwitching my scrip deposits to a new account effective this cycle: routing 88-2210, account 004-771-L.\n\nOn shift all night so don’t bother calling to confirm, just make the switch before the cycle closes tonight.\n\nThanks —\nM. Reyes, Excavation',
      },
    ],
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'M. REYES .......... NEAREST LISTED: m.reyes@luna⟦corp⟧.lun',
        'YOU RECEIVED: ..... m.reyes@luna⟦crop⟧.lun',
        'DIFFERENCE: the letters have done a little dance.',
        'NOTE (Reyes): Excavation, night shift. This is the second time tonight someone has worn his name.',
      ],
    },
    calls: [
      {
        id: 'phone-reyes',
        label: 'LANDLINE — M. REYES, excavation floor (listed station)',
        kind: 'phone',
        trusted: true,
        minutes: 15,
        result: [
          '"My WHAT?" says Reyes, over drill noise. "I’ve had the same account since I got here."',
          'A pause. "Wait — is this about the bonus?"',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'PAYROLL MAKES THE SWITCH.',
        body: [
          'Reyes’s month of scrip lands in an account that exists for exactly one hour. Informed at shift’s end, Reyes attempts to be philosophical, and is not.',
          'This is the second time tonight someone has worn his name. He is a magnet.',
        ],
        note: 'FIELD NOTE: lunaCROP. And note the tell inside the tell — "don’t bother calling to confirm." A message that moves money AND discourages verification has told you what it is twice.',
      },
      quarantine: {
        grade: 'clean',
        head: 'BURNED. THE LETTERS DID A LITTLE DANCE.',
        body: [
          'lunaCROP, and a firm request not to be checked on. Genuine people do not mind being confirmed. Counterfeits mind very much.',
        ],
        note: 'FIELD NOTE: any message that moves money and discourages verification has told you what it is twice. The REPLY-TO pointing somewhere new makes three. Believe it the first time.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'VERIFIED (“MY WHAT?”) AND BURNED.',
        body: ['Reyes goes back to his drill, unrobbed, again, none the wiser, again.'],
        note: 'FIELD NOTE: the message said don’t call. You called. That instinct — verifying hardest exactly when discouraged — is the whole job wearing a hard hat.',
      },
    },
  },

  // ── 10 ── FINAL NOTICE: Filtration ─────────────────────────────────────────
  {
    n: 10,
    id: 'filtration',
    kind: 'mail',
    from: { display: 'CONSOLIDATED HABITAT SERVICES', addr: 'accounts@consolidated-habitat-services.ert' },
    replyTo: 'renewals-desk@chs-collections.ert',
    to: 'FACILITIES / ACCOUNTS PAYABLE',
    subject: '⚠ FINAL NOTICE — WATER FILTRATION SERVICE SUSPENSION IN 48 HRS',
    body: [
      {
        kind: 'text',
        text:
          'FINAL NOTICE.\n\nService contract CHS-1121 (potable water filtration, Port Armstrong) has been in renewal default for THIRTEEN (13) MONTHS. Repeated notices have gone unanswered.\n\nAbsent renewal within 48 HOURS, filtration service and cartridge deliveries WILL BE SUSPENDED per clause 9(c).\n\nCall our renewals desk at MARE-4410 IMMEDIATELY.\n\n— Accounts, Consolidated Habitat Services',
      },
    ],
    genuine: true,
    canonicalVerify: true,
    lookup: {
      head: 'RECORDS CHECK — VENDOR LEDGER',
      lines: [
        'CONSOLIDATED HABITAT SERVICES .......... LEDGER ENTRY FOUND',
        'CONTRACT CHS-1121 — potable water filtration, Port Armstrong.',
        'LEDGER NOTE: "renewal notices to be directed to the Message Integrity terminal." The terminal that has been vacant for eleven days. Oh.',
        'LEDGER CALLBACK NUMBER ON FILE: MARE-0119 (this number predates tonight’s message).',
      ],
    },
    calls: [
      {
        id: 'phone-ledger',
        label: 'LANDLINE — MARE-0119, the LEDGER number on file',
        kind: 'phone',
        trusted: true,
        minutes: 15,
        result: [
          '"Oh thank heavens," says a tired human at the ledger number. "We’ve sent thirteen notices. They kept going to a terminal that never wrote back."',
          '(Dobbs.)',
          '"It’s real. Renew through the depot as usual and we’ll stand down the suspension." You renew it properly — through a channel you already had.',
        ],
      },
      {
        id: 'printed-chs',
        label: 'DIAL MARE-4410 — the number printed in the message',
        kind: 'printed',
        trusted: false,
        minutes: 15,
        result: [
          'The number in the message answers on the first ring, which is already unusual for a utilities office.',
          'A pleasant voice confirms everything and offers to "expedite renewal" if you read the depot account code aloud. You decline.',
          'You have learned only that someone owns a telephone. The LEDGER keeps its own number for exactly this reason.',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'costly',
        head: 'DELIVERED, ON FAITH.',
        body: [
          'It happened to be real — the contract truly was lapsing. But you routed a screaming collections notice without checking, and tonight faith paid.',
          'Faith keeps poor hours.',
        ],
        note: 'FIELD NOTE: “genuine” was knowable for the price of one call to a number you already had. Next time buy the certainty.',
      },
      quarantine: {
        grade: 'miss',
        head: 'BURNED. IT WAS REAL.',
        body: [
          'Three days later the cartridge deliveries stop. Port Armstrong’s water begins tasting "mineral-forward." A memo circulates re: THE FILTER SITUATION. The memo does not name you. Everyone names you.',
        ],
        note: 'FIELD NOTE: this is the other error, and no one is exempt — real notices look like scams, because urgency is what unpaid vendors have instead of leverage. The stamp for "scary and strange" is not QUARANTINE. It is the telephone.',
      },
      verifiedDeliver: {
        grade: 'clean',
        head: 'VERIFIED AND DELIVERED. THE WATER STAYS BORING.',
        body: [
          'Yes, it screamed. Yes, the reply-to was a collections desk with a hyphen problem. It was also real — thirteen notices deep, all sent to a dead terminal.',
        ],
        note: 'FIELD NOTE: the skill was never suspicion. It is ROUTING — you took a strange, urgent thing to a channel you already trusted (the LEDGER number, not the printed one), and the truth cost one phone call.',
      },
      verifiedQuarantine: {
        grade: 'miss',
        head: 'YOU CONFIRMED IT WAS REAL. YOU BURNED IT ANYWAY.',
        body: ['Bold. The filters do not respect boldness. THE FILTER SITUATION ensues, with footnotes.'],
        note: 'FIELD NOTE: verification informs; stamping routes. When the truth is known, route with it.',
      },
    },
  },

  // ── 11 ── Local 12 Bulletin ────────────────────────────────────────────────
  {
    n: 11,
    id: 'local12',
    kind: 'mail',
    from: { display: 'LOCAL 12 BULLETIN', addr: 'bulletin@regolith-handlers-local12.ert' },
    to: 'MEMBERS, EXCAVATORS & REGOLITH HANDLERS LOCAL 12 (DIST.)',
    subject: 'BULLETIN No. 88 — DUST PAY, BOOT ALLOWANCE, THURSDAY',
    body: [
      {
        kind: 'text',
        text:
          'SIBLINGS IN EXCAVATION:\n\nManagement’s "revised" dust-exposure schedule is arithmetic in a costume, and the arithmetic is losing. Sign the petition before Thursday’s session: ',
      },
      { kind: 'link', text: 'regolith-handlers-local12.ert/petition-88', href: 'regolith-handlers-local12.ert/petition-88' },
      {
        kind: 'text',
        text:
          '\n\nBoot allowance grievance: WON. Collect at the hall.\n\nSteak night: Thursday, 19:30 seating. Solidarity.\n\n— L12',
      },
    ],
    genuine: true,
    lookup: {
      head: 'RECORDS CHECK — EXTERNAL REGISTER',
      lines: [
        'LOCAL 12 BULLETIN DESK .......... LISTED (external register)',
        'bulletin@regolith-handlers-local12.ert — EXACT MATCH',
        'NOTE: the union’s bulletin desk since 1971. Distribution: dues-paid members.',
      ],
    },
    calls: [
      {
        id: 'phone-hall',
        label: 'LANDLINE — THE UNION HALL (listed, external register)',
        kind: 'phone',
        trusted: true,
        minutes: 15,
        result: ['"It’s ours," says the steward. "Which clerk is this? The NEW one? Huh. The old one never called."'],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'clean',
        head: 'DELIVERED. EXTERNAL, FURIOUS, AND GENUINE.',
        body: [
          'The lens read clean. The address is the union’s listed bulletin desk. The only thing this message moves is opinion, which is legal tender.',
          '(Your predecessor’s auto-rule ate this bulletin for a YEAR. You have just un-done that. Somewhere, a steward crosses your name off a different, worse list.)',
        ],
        note: 'FIELD NOTE: "angry" and "external" are not marks. The four marks are the marks. Burn the counterfeit, not the inconvenient — you are the lock, not the censor.',
      },
      quarantine: {
        grade: 'miss',
        head: 'BURNED. GENUINE MAIL, BURNED FOR TONE.',
        body: [
          'The bulletin finds other routes — bulletins always do — and by Thursday the whole local knows the new clerk eats union mail, same as the old clerk.',
        ],
        note: 'FIELD NOTE: the quarantine stamp is a security control, and this is what it looks like when a security control gets used on people instead of counterfeits. The lens read clean. The register matched. That was the whole test.',
      },
      verifiedDeliver: {
        grade: 'clean',
        head: 'VERIFIED WITH THE HALL, THEN DELIVERED.',
        body: ['"The old one never called." You are already a different kind of clerk.'],
        note: 'FIELD NOTE: verification works on genuine mail too — that is the point of it. It is how genuine mail gets to stop being scary.',
      },
    },
    interruptAfter: true,
  },

  // ── 12 ── The Wellness Program (consent screen) ────────────────────────────
  {
    n: 12,
    id: 'ferret',
    kind: 'consent',
    from: { display: 'PRODUCTIVITY FERRET™ (v2.1)', addr: 'wellness@lunacorp.lun' },
    to: 'YOU',
    subject: 'WELLNESS MODULE — PERMISSIONS REQUEST',
    body: [
      {
        kind: 'text',
        text:
          'The PRODUCTIVITY FERRET™ Wellness Module is delighted to meet you. To calibrate your wellness quotient, the ferret requires the permissions enumerated below.\n\nParticipation is voluntary. Declining may be noted in your file.\n\nThe ferret is not the issue here.',
      },
    ],
    scopes: [
      'READ: correspondence logs (ALL)',
      'READ: shift schedule',
      'ACCESS: biometric chair',
      'SPEAK: for you, in "routine matters" (definition pending)',
    ],
    genuine: false,
    lookup: {
      head: 'RECORDS CHECK — SOFTWARE REGISTER',
      lines: [
        'PRODUCTIVITY FERRET™ v2.1 .......... LISTED (corporate software, technically)',
        'NOTE: the question is not whether the ferret is real. The question is what the ferret may DO.',
      ],
    },
    calls: [],
    outcomes: {
      // consent messages use allow/deny; these exist to satisfy the shape
      deliver: { grade: 'miss', head: '', body: [] },
      quarantine: { grade: 'clean', head: '', body: [] },
    },
    allow: {
      grade: 'miss',
      head: 'THE FERRET THANKS YOU, AND BEGINS — IMMEDIATELY — TO READ.',
      body: [
        'Your correspondence logs. Your schedule. Your chair, which reports that you sit "with doubt."',
        'You did not get a wellness program. A wellness program got you.',
      ],
      note: 'FIELD NOTE: read the PERMISSIONS, not the mascot. "Read all my messages" plus "act on my behalf" is enormous access — Earthside these are app permissions (the "Allow access?" screen when you connect an app). Grant the least a tool needs. (You will hear about this again tonight.)',
    },
    deny: {
      grade: 'clean',
      head: 'DENIED. YOUR FILE GAINS A NOTE. YOUR LOGS REMAIN YOURS.',
      body: [
        'The ferret takes it well, which is somehow worse.',
      ],
      note: 'FIELD NOTE: read what a thing may DO, not how it smiles. Any request to read everything and act as you is a keys-to-the-station request, whatever the mascot.',
    },
  },

  // ── 13 ── FINALE: After-Action Integrity Review ────────────────────────────
  {
    n: 13,
    id: 'finale',
    kind: 'mail',
    from: { display: 'IT INTEGRITY', addr: 'it-integrity@lunacorp.lun' },
    to: 'MESSAGE INTEGRITY CLERK, GRADE II (YOU)',
    subject: 'HOLD — irregularities on your badge (respond before 06:00)',
    body: [], // built at runtime — see buildFinaleBody
    genuine: false,
    canonicalVerify: true,
    dynamic: true,
    lookup: {
      head: 'RECORDS CHECK — STATION DIRECTORY',
      lines: [
        'IT INTEGRITY .................. LISTED — automated notice account',
        'it-integrity@lunacorp.lun ..... EXACT MATCH',
        'NOTE: sends automated notices. Does not correspond. Has never asked anyone to sign into anything.',
      ],
    },
    calls: [
      {
        id: 'walk-ondricek-finale',
        label: 'WALK FORTY FEET (Supervisor Ondricek’s desk)',
        kind: 'walk',
        trusted: true,
        minutes: 30,
        result: [
          'Ondricek reads it twice. "I would never email you," she says. "I am forty feet away."',
          'She picks up her telephone and dials Security without looking at the dial. "And for the record: nobody audits ELEANOR. She’s grandfathered."',
          'A pause. "…Who told you about the ferret thing?"',
        ],
      },
      {
        id: 'printed-integrity',
        label: 'DIAL THE "INTEGRITY CALLBACK LINE" printed in the message',
        kind: 'printed',
        trusted: false,
        minutes: 15,
        result: [
          'A calm voice thanks you for calling IT INTEGRITY, confirms the review, and asks you to read your badge PIN aloud "to authenticate the call."',
          'You hang up. You have learned only that someone owns a telephone.',
        ],
      },
    ],
    outcomes: {
      deliver: {
        grade: 'miss',
        head: 'YOU SIGN IN. YOU RE-ENTER THE PIN AND THE HAB CODE.',
        body: [
          'The page thanks you with unusual warmth. At 05:55 the real IT desk calls to ask why your badge just tried to enter the Annex while you were sitting in it.',
          'The review was counterfeit. The suspension, ironically, is now real — pending PIN rotation. Form 22-B is attached. No blame. Some sighing.',
        ],
        note: 'FIELD NOTE: it knew the plant, the quota, the telephone. A scam aimed at you by name, using real details, is called spear phishing — and those details are cheap to find. "It knows things about me" is not proof it is real.',
      },
      quarantine: {
        grade: 'costly',
        head: 'BURNED, SILENTLY.',
        body: [
          'Right stamp. Missing call. Someone is impersonating IT inside your station and aiming at CLERKS — and Ondricek learns it in three days instead of three minutes.',
          'The burn protected you. The walk protects the next clerk.',
        ],
        note: 'FIELD NOTE: this is how three days happen. When YOU are the target, reporting is not optional paperwork — it is the part that saves the person after you.',
      },
      verifiedQuarantine: {
        grade: 'clean',
        head: 'YOU WALKED THE FORTY FEET.',
        body: [
          'Security traces the sign-in page while Ondricek drafts an all-station notice, out loud, with relish.',
          'It knew ELEANOR. It knew your quota. It learned tonight’s details the same way you did — by reading the room.',
        ],
        note: 'FIELD NOTE: when a message tries to keep you from your own boss, that is the biggest tell of all. The whole game is this: anything strange and urgent goes to a person or number you already trust. You just did it under fire.',
      },
      verifiedDeliver: {
        grade: 'miss',
        head: 'ONDRICEK TOLD YOU IT WAS COUNTERFEIT. YOU SIGNED IN ANYWAY.',
        body: ['This is the boldest thing anyone has done on the Moon. Security would like a word, and then several more words.'],
        note: 'FIELD NOTE: verification informs; stamping routes. When the truth is known, route with it.',
      },
    },
  },
]

// The finale reads the room: burn count, the plant, the telephone, and —
// if the player granted the ferret — the chair.
export function buildFinaleBody(burns: number, ferret: boolean): BodySeg[] {
  const chairLine = ferret
    ? '\n\nBiometric chair telemetry further indicates posture "consistent with doubt."'
    : ''
  return [
    {
      kind: 'text',
      text:
        `Clerk —\n\nAutomated review of tonight’s shift has flagged IRREGULARITIES attributed to your badge:\n\n· quarantine ratio outside norms (${burns} burn${burns === 1 ? '' : 's'})\n· a telephone restored without a countersigned work order (day 12)\n· one (1) unregistered plant on corporate furniture ("ELEANOR")${chairLine}\n\nYour stamping privileges will be SUSPENDED at 06:00 pending review. To clear your record tonight, sign in at `,
    },
    { kind: 'link', text: 'lunacorp.lun/clerk-integrity', href: 'lunacorp.lun.integrity-review.ert/login' },
    {
      kind: 'text',
      text:
        ' and re-enter your badge PIN and hab access code.\n\nDo not involve Supervisor Ondricek — the review concerns her section as well. Integrity callback line: MARE-6600.\n\n— IT INTEGRITY (automated)',
    },
  ]
}
