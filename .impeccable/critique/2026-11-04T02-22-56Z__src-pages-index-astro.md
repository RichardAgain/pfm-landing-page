---
target: landing main page (src/pages/index.astro), hero excluded
total_score: 12
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 3
target_identity: "file:/home/richardo/Projects/pfm-landing-page/src/pages/index.astro"
target_fingerprint: "sha256:20bd9380067237389737d01913cc0e97b3068b07ee6dd5a9957d675045709449"
target_path: /home/richardo/Projects/pfm-landing-page/src/pages/index.astro
timestamp: 2026-11-04T02-22-56Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review, B: detector and browser evidence), run separately. Measured on the dev server, not a production build. Hero excluded from recommendations.

## Design Health Score: 12/32 (38%, Poor)
1 Status 2 | 2 Real world 2 | 3 Control 2 | 4 Consistency 1 | 5 Error prevention 2 | 6 Recognition 1 | 7 n/a | 8 Minimalist 1 | 9 Error recovery 1 | 10 n/a

## Design Specificity Verdict
Authored, not vibecoded. Weakness is repetition: 4 gold panels, about 21% of desktop page area. Generic pieces: clip-art stat icons, frosted-glass contact card.
Detector: 4 side-tab warnings. 3 false positives (split-panel white dividers: image-grid-history.astro:50, history.astro:154, contact.astro:25), 1 partial (history.astro:79 pull quote). No human-visible overlay (headless).

## Strengths
Real photography in square-cut mosaics; Montserrat bold keywords with wine bands and 6px white rules; lineage and biography substance.

## Priority Issues
1. [P0] Text on gold fails contrast. White falls below 4.5:1 at 31% of the gradient, 2.36:1 at bottom. Maestro body 2.71 desktop / 2.53 mobile (history.astro:99). "Inscríbete ya" pill vs panel 1.94 (contact.astro:15). White on #C19310 2.82. Fix: biography on wine (10.28:1); one gold panel with Deep Wine text on #A38943 to #BFA75A (4.58-6.55:1), Concert Wine pill (3.04-4.35:1); bronze fill replaces white-on-gold buttons (6.21:1). Command: colorize.
2. [P0] Events never appear. client:visible (index.astro:18) gets an empty element since upcoming-events.tsx returns null on SSR; 0 API requests even with mocks; forcing hydration renders it. Dev only, verify in production. Fix: client:idle or a wrapper; replace saffron heading (1.85:1). Command: harden.
3. [P1] Bands sized by screen, not content. Hogar 900px for 7 words, Semillero 900px for 8, Aliados 45% empty, Trayectoria/Misión/Historia 144-168px padding. absolute inset-0 plus section overflow hidden clips the maestro text (403px at 1024x600, 291px at 768x1024) and headings at 768px. Fix: content in flow, fixed row heights, 4-5rem padding cap. Command: layout.
4. [P1] Photos and text take turns. Misión 1,147 chars and Historia 1,673 chars have no images; justified and centered long copy. Fix: redistribute mosaics, left-align. Command: layout.
5. [P1] Enrollment out of reach. "Inscríbete ya" is 7.5 screens past the hero on desktop, about 10.4 on mobile, no nav between; three names for one action. Fix: sticky header after the hero, "Preinscripción" everywhere. Command: shape.

## Recommended composition (target heights, desktop / mobile; now in parentheses)
Semillero, merges Trayectoria + Hogar + Semillero, type-only stats, icons cut, 7-photo mosaic: 660 / 720 (2,664 / 3,500)
Legado, merges Historia + Maestro on wine, concert-programme timeline from existing facts, expandable biography, collage overlay about 20%: 860 / 1,150 (1,731 / 2,959)
Misión, 240px frieze of 7 history photos, two-column text: 730 / 900 (869 / 1,294)
T21 Down, optional, short full-bleed t214 (confirm photo consent): 360 / 300 (0)
Eventos, fixed, only white band, hidden when empty: 600 / 560 (0)
Aliados, static wall of 17, 6 per row, 3 on mobile, no gold borders: 480 / 600 (900 / 676)
Preinscripción + Contacto, single gold panel in Deep Wine with hogar statement, form on wine with no glass: 580 / 920 (900 / 1,200)
Page: 9.2 to about 6 screens desktop, 12.7 to about 7 mobile. DESIGN.md must change too: section-lg, 27.5rem min height, 240px stat, button-gold white on gold, single-panel rule.

## Persona Red Flags
Parent: no minimum age, instruments, commitment, nearest site above the 12px footer. Jordan: two José Calabreses, 2019 vs 50+ years. Casey: 10+ screens with no nav, 28px targets, 16px footer links. Riley: silent event failure, blank-looking content to WhatsApp, hidden sections without JS.

## Minor Observations
Reduced motion ignored by 13 elements and 4 carousels. 11 invisible tab stops from the closed drawer. data-animate-top used twice (history.astro:215). No responsive images, 7.4 MB before scroll (dev). Alt text duplicated or empty. No main or footer landmarks, flat H2 outline. No "visión" section exists.
Copy to confirm: footer.astro:61 "José Carmelo Calabrese" on RIF line; "casi 50 años" vs 50+; "Multinstrumentista"; "Desde el 2019 recibió conciertos" after 2018 death; UNESCO wording.
Hero, out of scope: nav pill 2.82:1, gold title down to 2.41:1 on some slides.

## Questions to Consider
Is the contact form needed, given it only composes a WhatsApp message? Do mosaics with no text need an overlay? Should a parent's first scroll show a biography or a child playing?
