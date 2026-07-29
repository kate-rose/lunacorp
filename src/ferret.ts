// FERRET.EXE — the terminal pet.
//
// Lives OUTSIDE #app so the game's re-renders never destroy it. Wanders the
// bottom of the screen, naps, and occasionally says something. Corporate
// wellness software that is also a small animal: charming on purpose, and
// quietly the reason the last message of the night knows so much about you.
//
// The sprite is text for now. To swap in pixel art later, replace SPRITE with
// an <img>/sprite-sheet and keep the same state names.

const SPRITE = 'ᘛ⁐̤ᕐᐷ'

const IDLE_LINES = [
  'Productivity: nominal!',
  'You are doing a great job. Logging that.',
  'Posture check! …no notes.',
  'Have you considered a wellness break?',
  'I am a colleague, not a snack.',
  'Just noting your keystrokes. For wellness.',
  'Morale is mandatory at 09:00.',
  'I like it here. I like it a normal amount.',
]

const PET_LINES = [
  'Ferret happy! Logging that too.',
  '*chirp*',
  'Affection recorded in your file. Positively!',
  'This interaction has been noted. Warmly.',
  '*wiggles*',
]

let host: HTMLElement | null = null
let el: HTMLElement | null = null
let bubble: HTMLElement | null = null
let x = 40
let facingLeft = false
let asleep = false
let timer: number | undefined
let bubbleTimer: number | undefined

const rand = (n: number) => Math.floor(Math.random() * n)
const pick = <T,>(a: T[]): T => a[rand(a.length)]

export function startFerret() {
  if (el) return
  host = document.getElementById('crt')
  if (!host) return

  el = document.createElement('div')
  el.id = 'ferret'
  el.title = 'FERRET.EXE — click to pet'
  el.innerHTML = `<div class="ferret-bubble"></div><div class="ferret-sprite">${SPRITE}</div>`
  host.appendChild(el)
  bubble = el.querySelector('.ferret-bubble')

  el.addEventListener('click', () => {
    wake()
    say(pick(PET_LINES))
    el?.classList.add('petted')
    setTimeout(() => el?.classList.remove('petted'), 600)
  })

  x = 150
  place()
  schedule(1200)
}

function place() {
  if (!el) return
  el.style.left = `${x}px`
  el.classList.toggle('flip', facingLeft)
  el.classList.toggle('asleep', asleep)
}

function schedule(ms: number) {
  window.clearTimeout(timer)
  timer = window.setTimeout(tick, ms)
}

function tick() {
  if (!el) return
  const roll = rand(10)
  if (asleep) {
    // mostly keep sleeping; wake now and then
    if (roll < 3) wake()
    else say('z z z', 1800)
    schedule(4000 + rand(4000))
    return
  }
  if (roll < 5) wander()
  else if (roll < 7) say(pick(IDLE_LINES))
  else if (roll < 8) sleep()
  schedule(3500 + rand(5000))
}

function wander() {
  if (!el) return
  // keep clear of both edges so the speech bubble always fits on screen
  const min = 150
  const max = Math.max(min + 40, window.innerWidth - 170)
  const target = min + rand(max - min)
  facingLeft = target < x
  x = target
  el.classList.add('walking')
  place()
  window.setTimeout(() => el?.classList.remove('walking'), 2200)
}

function sleep() {
  asleep = true
  place()
  say('z z z', 1800)
}

function wake() {
  asleep = false
  place()
}

export function say(text: string, ms = 2600) {
  if (!bubble) return
  bubble.textContent = text
  bubble.classList.add('show')
  window.clearTimeout(bubbleTimer)
  bubbleTimer = window.setTimeout(() => bubble?.classList.remove('show'), ms)
}

/** the game pokes the ferret when something notable happens */
export function ferretReact(kind: 'clean' | 'costly' | 'miss' | 'verify') {
  wake()
  if (kind === 'clean') say(pick(['Nice routing!', 'Clean. Logging that.', '*approving chirp*']))
  else if (kind === 'miss') say(pick(['Oh no. Noted, though!', 'That one got away.', 'Form 22-B is right there.']))
  else if (kind === 'verify') say(pick(['Good call!', 'The telephone! Classic.', 'Checking is free. Sort of.']))
  else say('Close enough for the Moon.')
}
