# Product

<!-- impeccable:product-schema 1 -->

> Written from repository evidence, then confirmed in one interview round (2026-11-02): purpose and success, positioning, home-page metrics. Facts still marked _(inferred)_ are unconfirmed.

## Platform

web

## Users

- Families and prospective students in Carabobo, Venezuela, deciding to enroll or re-enroll (preinscripción / reinscripción) in the academy. _(inferred from hero CTA, `/registro`, recent copy changes)_
- Existing students and representatives who log in to manage registration and reset credentials (`/registro`, `/reset-password`, `/restablecer-credenciales`). _(inferred)_
- Public audience following academy events and galleries published from the admin panel. _(inferred from `/eventos`, `/evento`, `/galeria`)_

## Product Purpose

Public site of the Academia Internacional de Música "Maestro José Calabrese". It presents the academy's legacy, cátedras, T21 Down program, allies and events, and funnels visitors into preinscripción.

Success has two equal parts: (1) more completed preinscripciones and reinscripciones, and (2) building the academy's public reputation through its legacy, events and galleries. Neither should be sacrificed for the other.

## Positioning

- Run by the Fundación Orquesta Sinfónica de Carabobo (FOSC); formerly the Programa de Formación Musical "Maestro José Calabrese", now Academia Internacional.
- Lineage of maestro José Calabrese (Giuseppe Calabrese Di Stefano) and José Carmelo Calabrese; trains the next generations of Orquesta Sinfónica de Carabobo musicians.
- Programa de Formación y Estimulación Musical T21 Down (since 2019), an inclusion program for people with Down syndrome, run through an alliance of Fundación "Familia T21 Down", Hesperia WTC Valencia and FOSC.

**The OSC lineage leads.** The history of the Calabrese family and the pathway into the Orquesta Sinfónica de Carabobo are the main differentiator. The T21 Down program is an important, distinctive program, but it comes second in positioning.

## Operating Context

- Two physical sites: Salón MZ-08, Hotel Hesperia WTC (Naguanagua, Carabobo) and Edificio 4, Piso 1, Universidad José Antonio Páez (San Diego, Carabobo).
- Content for galleries, events and announcements is managed in a Laravel admin panel and served through the public Publicaciones API (`PUBLICACIONES_API.md`, `eventos-api.md`).
- Social channels: Instagram `@sinfocarabobo`, WhatsApp, YouTube, Facebook.

## Capabilities and Constraints

- Pages: home (`/`), `/catedras`, `/programa-t21-down`, `/galeria`, `/eventos`, `/evento`, `/registro`, password reset flows, `404`.
- Registration and login are React islands backed by the Laravel API; forms use react-hook-form + zod and Cloudflare Turnstile; registration can produce PDFs (`@react-pdf/renderer`).
- Events/galleries come from `GET /api/publicaciones` (filter by `tipo`, `upcoming`); only `publicado = true` items appear; images are WebP up to 1920px.
- Stack: Astro 5, React 19 islands, Tailwind CSS 4.
- UI language: Spanish (`lang="es"`).
- Footer must show the company RIF.

## Brand Commitments

- Name: Academia Internacional de Música "Maestro José Calabrese".
- Logos: `/public/logo.png` (academy) and `/public/logo-fosc.png` (FOSC) appear together.
- Tagline in use: "Desde el corazón de Carabobo, resonando con historia y pasión"; "El hogar de los músicos del mañana".
- Whether the current palette and typography are binding is undecided; DESIGN.md does not exist yet.

## Evidence on Hand

- Metrics shown on home: 500+ estudiantes, 30+ cátedras, 50+ años de historia. Confirmed accurate; safe to reuse.
- Photography: `src/assets/about/`, `src/assets/gallery/` (classes, choir, orchestra, T21 program).
- Allies section (`src/components/allies.astro`).
- No testimonials, press, pricing or case studies exist in the repo. Do not fabricate them.

## Product Principles

1. Enrollment and reputation together: every page leaves a clear path to preinscripción or reinscripción, and the public face (legacy, events, galleries) is treated as a goal in itself, not just support for the sign-up form.
2. Legacy is proof: institutional history and the OSC link carry credibility; state them factually, never inflate.
3. Inclusion is real, not decorative: the T21 Down program is presented with dignity and accuracy.
4. Admin-driven content must degrade gracefully: empty, missing-image and unpublished states are normal.

## Accessibility & Inclusion

No formal standard established. The T21 Down audience and their families make plain language and clear navigation a product need. _(inferred)_
