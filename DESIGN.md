---
name: Academia Internacional de Música "Maestro José Calabrese"
description: Concert-hall burgundy and old gold for the academy that trains Carabobo's next symphonic musicians.
colors:
  wine-deep: "#4B0C0C"
  wine: "#7A1F1F"
  gold: "#C19310"
  gold-deep: "#A57F0D"
  gold-trim: "#BFA760"
  bronze: "#7A5C20"
  bronze-deep: "#5C4518"
  white: "#FFFFFF"
  paper: "#F3F4F6"
  line: "#E5E7EB"
  field-line: "#D0CFCF"
  ink: "#1F2937"
  ink-soft: "#4B5563"
  error: "#EF4444"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: "4rem"
  display-statement:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 1
  headline:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
  lede:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.75
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.33
rounded:
  md: "0.5rem"
  xl: "0.75rem"
  pill: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  section: "6rem"
  section-lg: "9rem"
components:
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "8px 32px"
  button-primary-hover:
    backgroundColor: "{colors.wine-deep}"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.white}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  button-gold-hover:
    backgroundColor: "{colors.gold-deep}"
  button-feature:
    backgroundColor: "{colors.bronze}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-feature-hover:
    backgroundColor: "{colors.bronze-deep}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.6em 1em"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  nav-link:
    textColor: "{colors.white}"
    typography: "{typography.body-small}"
    padding: "4px 0"
---

# Design System: Academia Internacional de Música "Maestro José Calabrese"

## Overview

**Creative North Star: "The Concert Hall"**

The site should feel like walking into the hall where the Orquesta Sinfónica de Carabobo plays. Deep wine fills the space like velvet curtains, old gold is the gilded trim, and photographs of students playing are the stage. The atmosphere is formal but warm: a place with fifty years of history that still welcomes children on their first day.

Composition comes in full-width bands. Burgundy sections run from deep wine to wine, separated by crisp white lines, and alternate with photography under a dark overlay and with plain white content areas. Headings are large and centered, set in Montserrat. Everything is flat: the hall's depth comes from color, photography and contrast, never from shadows. Buttons are the only things that respond to the pointer.

The hall is dignified. It is never childish, even when it speaks to young children or to the T21 Down program. It never looks like a corporate or tech product, and its gold never turns flashy.

**Key Characteristics:**
- Full-width burgundy bands (deep wine to wine, top to bottom) separated by white lines.
- Old gold as trim and as a secondary action color; never a large fill.
- Full-bleed photography of real students and ensembles under a black overlay at 30–50%.
- Montserrat throughout; large, centered, bold section headings.
- Completely flat: no shadows, and no borders on cards or buttons.
- Pill-shaped buttons are the only interactive surface that reacts on hover.

## Colors

A two-color world of wine and old gold, set on white and supported by cool neutral grays for reading surfaces.

### Primary
- **Deep Wine** (wine-deep): the top of every burgundy band gradient and of the inner-page header. Also the hover state for wine buttons.
- **Concert Wine** (wine): the bottom of band gradients, the main action color (Preinscripción, Reintentar, Cargar más), icons on light surfaces, and headings on white pages.

### Secondary
- **Old Gold** (gold): secondary pill buttons (Preinscripción in the nav, Cerrar sesión), social icon circles, and the focus color for form fields.
- **Burnished Gold** (gold-deep): hover state for Old Gold.
- **Gilt Trim** (gold-trim): the end of the bronze gradient, and short 48px × 2px trim marks above grouped text on burgundy. Never a fill behind white text: white on Gilt Trim is about 2.2:1.

### Tertiary
- **Bronze** (bronze): the warm brown-gold gradient panel ("El hogar de los músicos del mañana", running bronze to gilt trim) and the feature button.
- **Deep Bronze** (bronze-deep): hover state for the feature button.

### Neutral
- **White** (white): text on burgundy and photography, the separating lines between bands, card and input backgrounds.
- **Paper** (paper): footer background.
- **Hairline** (line): the footer's top rule and dividers on light surfaces.
- **Field Line** (field-line): input borders.
- **Ink** (ink): body text and headings on light surfaces.
- **Soft Ink** (ink-soft): secondary metadata (dates, locations, empty states).
- **Error** (error): required-field asterisks and validation messages.

### Named Rules
**The Old Gold Rule.** Old Gold and its siblings are the only yellows. The bright saffron (#F4B400) on Cátedras, Eventos, Galería and T21 Down is drift: replace it with Old Gold on light surfaces, or with Concert Wine where the yellow is too weak for text on white.

**The One Wine Rule.** All burgundy actions use Concert Wine, with Deep Wine on hover. The hero's #56070C/#7A1A1F, the login and reset pages' #700303, and their hover variants (#6E0A11, #942026) are drift to consolidate.

**The Trim Rule.** Gold accents things; it never fills a section. No gold-background bands and no gold gradients over large areas, except the single bronze-to-gilt statement panel.

## Typography

**Display Font:** Montserrat (with sans-serif)
**Body Font:** Montserrat (with sans-serif). `body` falls back to Inter, but nearly every element sets Montserrat explicitly.

**Character:** a single geometric sans carries the whole hall. Hierarchy comes from contrast between light and bold weights, plus italic for taglines, rather than from a second family.

### Hierarchy
- **Display** (700, 3.75rem desktop / 2.25rem mobile, 4rem line height): the academy name in the hero, "Maestro José Calabrese". It follows the line "Academia Internacional de Música", set at 300 weight, 3rem.
- **Display Statement** (400 with bold keywords, 4.5rem desktop / 3rem mobile): one-off statement panels like "El **hogar** de los **músicos** del **mañana**". Emphasis is set in bold, never in color.
- **Headline** (700, 3rem desktop / 2.25rem mobile): centered section titles ("Nuestra trayectoria", "Nuestros aliados", "Eventos").
- **Title** (600, 1.125–1.25rem): card titles, accordion summaries, feature button text.
- **Lede** (300, 1.25rem, often italic): taglines under headlines and mission text on burgundy.
- **Body** (400, 1rem): running text. Keep it to 65–75ch on white pages.
- **Body Small** (400–500, 0.875rem): nav links, card metadata, standard buttons.
- **Label** (600, 0.8rem): form labels and input text. Footer text is 0.75rem.

### Named Rules
**The Single Voice Rule.** Montserrat only. Hierarchy comes from weight (300 to 700), size and italic, never from a second display face.

**The Italic Tagline Rule.** Taglines and mottos ("Desde el corazón de Carabobo, resonando con historia y pasión") are set italic at Lede weight, directly under the heading they support.

## Layout

The page is a vertical stack of full-width bands. Content inside a band sits in a centered column 85vw wide (75–80% on inner pages), with a 16px minimum gutter on phones. Burgundy bands use generous vertical padding (section: 6rem; section-lg: 9rem on desktop) and a minimum height around 27.5rem. The hero fills the viewport on desktop and is 32.5rem tall on mobile.

Grids break from one column to three at `md` (768px). Card grids go 1 → 2 (`sm`, 640px) → 3 (`lg`, 1024px) columns with a 1.5rem gap. The main navigation collapses into a side sheet below `lg` (1024px). Split panels (statement text plus photo mosaic) stack on mobile and sit side by side at `md`, with the white separating line switching from the bottom edge to the right edge.

Elements enter as they scroll into view: fade and slide from the bottom, left or right, 0.8s ease-out, staggered about 750ms apart in the hero. Number counters count up over 2s.

## Elevation & Depth

This system is completely flat. Depth comes only from tonal bands (deep wine to wine), the white lines between them, and dark overlays on photography (black at 30–50%, or a bottom-up gradient to 80% black behind hero text). The `shadow`, `shadow-sm` and `hover:shadow-lg` classes on cards in Cátedras, Eventos and Galería are drift to remove.

### Named Rules
**The No-Shadow Rule.** No `box-shadow` anywhere, at rest or on hover. If something needs to stand apart, change its background color or put a white line between it and its neighbor.

## Shapes

Buttons are always full pills (pill). Cards, inputs and image tiles use gentle corners (md, 0.5rem); accordions and logo tiles go up to xl (0.75rem). Photography in full-bleed bands and mosaics is square-cut.

The only structural lines are the 6px white lines that separate burgundy bands, and the 1px hairlines on light surfaces (the footer's top rule, input borders, dividers inside accordions).

### Named Rules
**The Borderless Rule.** Cards, logo tiles, content boxes and buttons have no decorative border. The incumbent 4px gilt-trim borders on mission cards and ally logos, the saffron borders on inner-page cards, and the 2px gilt-trim outline on the "Conoce nuestras cátedras" button are drift. A card is separated from its surroundings by its white fill against burgundy or gray; a button by its solid fill.

## Components

### Buttons
Ceremonial pills. Buttons are the only interactive surface that changes on hover.
- **Shape:** full pill (pill).
- **Primary (Concert Wine):** white Montserrat medium text, padded 8px × 32px on desktop (4px × 16px on mobile). For enrollment and data actions (Preinscripción, Reintentar, Cargar más). Hover turns Deep Wine over 300ms. In the hero, "Preinscripción" carries a trailing ➔.
- **Gold:** Old Gold fill, white text, compact padding (6px × 16px), Body Small. Used for the header Preinscripción, Cerrar sesión, and the circular social icons (40px). Hover turns Burnished Gold.
- **Feature:** Bronze fill, Title-size bold text, padded 16px × 32px, no border. For a large standalone call to action such as "Conoce nuestras cátedras"; hover turns Deep Bronze.
- **Focus:** the incumbent buttons have no visible focus style. Use a 2px white ring on burgundy or photography, and a 2px Concert Wine ring on light surfaces, with a 2px offset.

### Cards / Containers
- **Corner Style:** gentle (md, 0.5rem).
- **Background:** white on gray, white or burgundy surfaces.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none (see the Borderless Rule).
- **Hover:** the card itself stays still. The link or button inside it carries the affordance. The incumbent `hover:-translate-y-2` lift and the mission cards' `hover:scale-110` are drift.
- **Internal Padding:** 16px (sm) for event cards, 24px (md) for text cards.
- **Event card:** a 16:10 cover image (gray placeholder while it loads), then a Title, a date and a location with 16px Concert Wine icons, and a "Más información" link in Concert Wine pinned to the bottom.

### Inputs / Fields
- **Style:** white background, 1px Field Line border, md radius, Label typography (0.8rem Montserrat), padding 0.6em × 1em.
- **Labels:** Montserrat 600, 0.8rem, above the field, with a red asterisk on required fields.
- **Focus:** Old Gold ring, and on floating-label fields the label also turns Old Gold.
- **Error:** border turns Error red, with a 0.75rem red message under the field.

### Navigation
- **Home (over photography):** white Montserrat medium links at Body Small, centered between the white logo (left) and the gold Preinscripción pill (right). Hover adds a 2px white underline. Below 1024px, links move into a side sheet.
- **Inner pages:** a sticky header with a Deep Wine to Concert Wine gradient, 64px tall, the round academy icon on the left (linking home) and actions on the right.
- **Footer:** Paper background with a hairline top rule. It holds the academy and FOSC logos side by side, divided by a hairline, both site addresses, a link grid in 0.75rem Ink, Old Gold social circles, and the two RIF lines.

### Stat Counter
The signature proof element on burgundy: a 240px photo above a bold white number (Headline size) that counts up on scroll, followed by a 1.5rem white label (Estudiantes, Cátedras, Años de historia). Three across on desktop, stacked on mobile.

## Do's and Don'ts

### Do:
- **Do** build sections as full-width bands: burgundy gradients (wine-deep to wine, top to bottom), photography under a 30–50% black overlay, or plain white.
- **Do** separate adjacent burgundy and photo bands with a 6px white line.
- **Do** use Concert Wine for every primary action and Old Gold for secondary pills, both as full pills.
- **Do** set everything in Montserrat, with emphasis from weight and italic.
- **Do** use real photographs of students, classes and ensembles from `src/assets/`.
- **Do** respect `prefers-reduced-motion` for the entrance slides and counters (the incumbent code does not yet).

### Don't:
- **Don't** use shadows: no `box-shadow`, at rest or on hover.
- **Don't** put borders on cards, logo tiles, content boxes or buttons.
- **Don't** animate cards on hover (no scaling, no lifting). Only buttons respond.
- **Don't** use the saffron yellow #F4B400 or any burgundy other than wine-deep and wine.
- **Don't** look childish: no cartoon illustrations, rainbow palettes or playful display fonts, including on T21 Down and children's content.
- **Don't** look like a corporate or tech product: no glassmorphism, neon or purple-blue gradients, or dashboard-style cards.
- **Don't** make gold flashy: no glitter, glow, metallic gradients or large gold fills.
