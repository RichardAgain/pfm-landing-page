---
target: catedras page (grouped inner-page critique)
total_score: 15
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:/home/richardo/Projects/pfm-landing-page/src/pages/catedras.astro"
target_fingerprint: "sha256:16482044f67d8ab81137dfa4a004fea3f257d60f7c86a13b5068c0b0afb2c379"
target_path: /home/richardo/Projects/pfm-landing-page/src/pages/catedras.astro
timestamp: 2026-11-05T02-32-11Z
slug: src-pages-catedras-astro
---
Method: dual-agent (A: design review agent · B: detector and browser agent)

# Critique: Cátedras, T21 Down, Galería, Eventos (reviewed as one group)

Evidence: 1440px and 390px renders, plus 768px for T21. Galería and Eventos checked with API down, MOCK (invented sample data) and LIVE (read-only responses from the fallback host in src/config/api.ts; not confirmed as the deployed host).

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | System status | 2 | Identical titles, no location cue, hung request shows skeletons indefinitely (30s MOCK) |
| 2 | Real world | 2 | Nav "Cátedras" vs page "Programa Académico"; institutional T21 voice |
| 3 | User control | 1 | Inner header is only a logo; footer links to none of the four pages |
| 4 | Consistency | 1 | Heading colors, photo treatments and container widths differ by page |
| 5 | Error prevention | 2 | Photos and benefit cards look clickable; instrument chips look like buttons |
| 6 | Recognition | 2 | All of Cátedras hidden behind four closed bars |
| 7 | Flexibility | n/a | Content pages with no repeated tasks |
| 8 | Aesthetic | 2 | Uncluttered, not composed |
| 9 | Error recovery | 3 | Clear message and retry; no other path |
| 10 | Help | n/a | No task complex enough to need docs |
| | Total | 15/32 (47%) | Poor, just under Acceptable |

## Design Specificity Verdict
LLM: content is authored for the academy; design is interchangeable (thin strip, white page, centered yellow heading, 3-column grid, gray footer). Home has wine bands with white rules, square-cut mosaics, left-aligned statements, italic ledes and gilt marks; these pages have none. Same event card gets a wine heading on home and a saffron heading on /eventos.

Detector: 1 source finding, side-tab at programa-t21-down.astro:95. Browser confirmed saffron text at 1.85:1 and T21 line length (123-124ch measured, ~156-159 detector estimate). False positives: overused-font (DESIGN.md requires Montserrat); most gallery low-contrast hits (read the placeholder behind the photo). Real gallery residual: long titles 3.8:1 over photo, 3.04:1 with no image (MOCK). Overlay ran headless; none visible to the user.

## Overall Impression
Going from home to these pages feels like leaving the concert hall for an office next door. Biggest opportunity: one shared opening band and a real header across all four pages, keeping current content.

## What's Working
- T21 photography: real faces, direct gazes, program shirts; dignified, never childish.
- Cátedras structure: grouping by instrument family, includes Cuatro Venezolano. Keep the organization.
- Gallery cover card: photo first, square-cut, details on gradient; closest to home's style.

## Priority Issues
[P1] 1. The Concert Hall stops at the home page.
Why: the "lacks style" complaint; saffron headings 1.85:1; #F4B400 named drift in DESIGN.md.
Fix: shared opening band (wine gradient or photo under overlay, white heading, gilt mark, white rule, ~280-360px desktop). Alternate white and wine bands. Replace saffron with wine text and old gold trim. Remove triple rule, shadows, card borders, hover movement. Files: programa-t21-down.astro:32,89,95,113; catedras.astro:106,152,170-178; gallery.tsx:10-12,21,94; events.tsx:78.
Command: /impeccable bolder, then /impeccable colorize.

[P1] 2. Inner header is a dead end, with no visible path to enroll.
Why: no Preinscripción outside a 12px footer link, breaking product principle 1; about 4,800px down on T21 mobile.
Fix: add the four page links and a Preinscripción pill to alt-header.tsx with a compact mobile menu; add pages to footer.astro:5-12; end each page with a wine band and CTA.
Command: /impeccable shape.

[P1] 3. T21 reads like a printed report and breaks at tablet width.
Why: 14px justified text, ~124ch on desktop; centered on phones, first photo at y=1079; at 768px benefit headings overflow cards (md:grid-cols-4 gap-12, programa-t21-down.astro:111).
Fix: open with split panel of text and mosaic; 16px left-aligned at 65-75ch; benefits as a flat row on wine with no boxes, md:2 lg:4; lift "el arte tiene el poder de transformar vidas" into a statement; remove photo dimming.
Command: /impeccable layout, then /impeccable typeset.

[P1] 4. Galería and Eventos only look right when full.
Why: LIVE has 0 events and 1 album; one tile, triple rule, blank space looks abandoned.
Fix: layout adapts to count (single album becomes feature panel); designed empty band for Eventos pointing to Galería, Instagram, Preinscripción; feature next event and split upcoming/past; wine panel with logo replaces gray and broken-image placeholders.
Command: /impeccable harden, then /impeccable layout.

[P2] 5. Cátedras looks like a form, not a programme.
Why: first screen is four closed outlined bars; shadowed chips look tappable.
Fix: concert-programme layout (family titles, instruments as plain text in columns, hairlines); show all or open Prácticas on desktop; restore commented descriptions (catedras.astro:114-116).
Command: /impeccable layout, then /impeccable polish.

## Persona Red Flags
- Jordan: "Cátedras" lands on "Programa Académico"; "Violín" does nothing; no next step; logo is the only way out at top.
- Casey: 72px sticky header with no action; T21 ~5,050px with 1.3 screens of centered text before first photo; footer links 16px tall.
- Sam: no h1, main or skip link; identical titles; T21 alts are filenames, one duplicated; focus falls to body after Reintentar/Cargar más; error and loading not announced.
- Parent of a child with Down syndrome: no ages, schedule, location, cost, requirements or how to join; copy praises the institution; no T21-specific action; WhatsApp is an unlabelled footer icon.

## Minor Observations
- 4 of 8 cognitive load checks fail, all on T21 (855-character opening paragraph).
- Three logo PNGs total 388 KB and are the largest part of page weight at 390px, except T21 after scrolling; logo-fosc.png 260 KB shown at 140x72.
- Portrait event covers break row alignment (229 vs 297px, MOCK); skeleton does not match final card.
- Buttons use hover:opacity-90 instead of Deep Wine; DESIGN.md 2px focus ring not implemented.
- Unused Program import (programa-t21-down.astro:4); text-zinc-850 and bare tracking in catedras.astro do nothing.

## Content to Confirm With the Academy
- Consent for photos of identifiable children before enlarging, especially t219.
- "herramienta terapéutica" and "se estimulan las funciones cerebrales" read as health claims.
- T21 says "Hesperia WTC Valencia"; footer says Naguanagua.

## Questions to Consider
- With the logo hidden, what on /eventos says this is the Sinfónica's own school?
- Is T21's first job to prove the foundation's virtue, or help a family picture their child there?
- Do the cátedras form a real path from Iniciación through Joven and Académica toward the OSC? If so, that path could be the page's signature.
