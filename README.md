# DO NOT REPLY TO THE MOON

**A short browser game that teaches you to spot phishing** — the fake emails and messages scammers use to steal passwords, money, and access.

▸ **Play it: https://kate-rose.github.io/lunacorp/**

You're the new Message Integrity Clerk at a 1989 lunar company town. Sort a night's worth of mail on an amber-CRT terminal desktop: **DELIVER** the real messages, **QUARANTINE** the fakes, and **VERIFY** anything you can't tell — by checking on a channel you already trust. About 15 minutes.

The lesson isn't "trust nothing." It's **routing**: real notices often look like scams, and scams look like notices, so the skill is taking anything strange to a channel you already had. The game scores routing, not suspicion — blocking real mail is a failure too.

Made by **Kate Bertash** (Digital Defense Fund). It's a standalone spin-off of the *A Field Guide to Counterfeit Correspondence* / civil-society security workshop games.

## What it covers

Lookalike sender addresses, display-name spoofing, link text vs. the real URL, subdomain tricks, dangerous attachments and macros, gift-card / wire "business email compromise," payroll-diversion, MFA fatigue (push-bombing), over-broad app permissions, genuine-but-scary notices, and a final spear-phish built from what you leaked during your own shift. The end-of-shift **Decoder** translates every in-world tell to its real-world twin.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5184
npm run build    # static site → dist/
```

Vanilla TypeScript + Vite, no framework, DOM-based (no canvas). The message deck is data in `src/data/`.

## Hosting

Pushes to `main` auto-build and deploy to GitHub Pages via `.github/workflows/deploy.yml`.
