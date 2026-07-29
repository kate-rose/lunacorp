// Data model for DO NOT REPLY TO THE MOON.
// The deck is data; the engine renders anything message-shaped.

export type Grade = 'clean' | 'costly' | 'miss'
export type Route = string // e.g. 'DELIVERED', 'VERIFIED → QUARANTINED', 'REPORTED'

export interface BodyText {
  kind: 'text'
  text: string
}
export interface BodyLink {
  kind: 'link'
  text: string // what the link claims
  href: string // what the lens reads
}
export type BodySeg = BodyText | BodyLink

export interface Attachment {
  name: string
  scan: string[] // scanner readout lines
}

export type CallKind = 'phone' | 'walk' | 'tube' | 'printed'

export interface CallTarget {
  id: string
  label: string
  kind: CallKind // 'phone' needs the telephone repaired; walk/tube always work; 'printed' reaches whoever printed it
  trusted: boolean
  minutes: number
  result: string[]
}

export interface Outcome {
  grade: Grade
  head: string
  body: string[]
  note?: string // FIELD NOTE — the teaching line
}

export interface LookupResult {
  head: string
  lines: string[] // ⟦ ⟧ wraps characters to highlight
}

export type InterstitialId = 'lens' | 'scanner' | 'phone' | 'guide'

export interface Interstitial {
  id: InterstitialId
  head: string
  body: string[]
}

export interface Msg {
  n: number // display number, 1-based
  id: string
  kind: 'mail' | 'consent'
  from: { display: string; addr: string }
  replyTo?: string
  to: string
  subject: string
  body: BodySeg[]
  attachment?: Attachment
  genuine: boolean
  canonicalVerify?: boolean // clean grade requires a trusted verify first
  lookup: LookupResult
  calls: CallTarget[]
  outcomes: {
    deliver: Outcome
    quarantine: Outcome
    verifiedDeliver?: Outcome // used instead when truth is known
    verifiedQuarantine?: Outcome
  }
  // consent-kind messages use these instead of stamps
  scopes?: string[]
  allow?: Outcome
  deny?: Outcome
  coach?: { requireLookup?: boolean; steps: CoachStep[] }
  unlockAfter?: InterstitialId[]
  interruptAfter?: boolean
  dynamic?: boolean // finale: body assembled at runtime
}

export interface FilmCard {
  title: string
  lines: string[]
  /** renders the annotated sample-message diagram beneath the lines */
  diagram?: boolean
  /** renders the URL breakdown + click-the-owner drill beneath the lines */
  urlLesson?: boolean
}

/** a single coach-mark beat; `target` is a selector the callout points its arrow at */
export interface CoachStep {
  text: string
  target?: string
}

export interface ResultRow {
  n: number | string
  label: string
  route: Route
  grade: Grade
}
