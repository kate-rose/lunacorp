import './style.css'
import { startApp } from './app'

const app = document.getElementById('app') as HTMLDivElement

const BOOT_TEXT = [
  'LUNACORP CONSOLIDATED ▪ PORT ARMSTRONG COMMUNICATIONS ANNEX',
  'MAILROOM/OS v2.11 — build 1989.04.22',
  '(c) LUNACORP. UNAUTHORIZED USE IS DISLOYAL.',
  '',
  'PERFORMING SELF-TEST ......... OK',
  'PHOSPHOR ..................... WARM',
  'TAPE DRIVE ................... ADEQUATE',
  'TELEPHONE .................... OUT FOR REPAIR (DAY 11)',
  'PLANT (ELEANOR) .............. NEEDS WATER',
  'PREVIOUS CLERK ............... [RECORD EXPUNGED]',
  '',
  'NOTICE: Position vacant 11 days. Message backlog: 47.',
  'NOTICE: Your predecessor clicked something.',
  '',
  '[ PRESS ANY KEY ]',
].join('\n')

const CPS = 260

let done = false
let started = false
let startedAt = performance.now()

const pre = document.createElement('pre')
pre.id = 'boot'
app.appendChild(pre)

function frame(now: number) {
  if (started) return
  if (!done) {
    const shown = Math.floor(((now - startedAt) / 1000) * CPS)
    pre.textContent = BOOT_TEXT.slice(0, shown)
    if (shown >= BOOT_TEXT.length) done = true
  }
  requestAnimationFrame(frame)
}

function advance(e?: Event) {
  if (e instanceof KeyboardEvent && e.repeat) return
  if (!done) {
    pre.textContent = BOOT_TEXT
    done = true
    return
  }
  if (started) return
  started = true
  window.removeEventListener('keydown', advance)
  window.removeEventListener('pointerdown', advance)
  app.innerHTML = ''
  startApp()
}

window.addEventListener('keydown', advance)
window.addEventListener('pointerdown', advance)
requestAnimationFrame(frame)
