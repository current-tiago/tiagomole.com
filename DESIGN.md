# Design System — tiagomole.com

The single source of truth for how this site looks and feels. Read this before touching any page. `HANDOVER.md` covers *what exists and how it works*; this file covers *why it looks the way it does and the rules for extending it*.

---

## 1. Aesthetic direction

**Editorial / high-end print.** The site should feel like a well-set literary magazine or a gallery catalogue, not a web app: cream paper, ink text, one confident accent colour, monospace marginalia, generous whitespace, and restrained motion. Every page — public portfolio and private page alike — shares this language.

Guiding instincts:

- **Paper, not screen.** Cream background with a noise-texture overlay on every page. No pure white, no drop-shadow cards, no rounded corners anywhere (sole exception: circular dots/rings on maps and timelines).
- **One accent, used sparingly.** Orange is for labels, links, highlights, and moments of emphasis — never for large surfaces.
- **Type does the design.** Hierarchy comes from the serif/mono contrast and scale jumps, not from boxes, borders, or colour fills.
- **Flat with one trick.** The only shadow in the system is the hard offset block shadow (`box-shadow: Npx Npx 0 rgba(13,13,13,0.06)`) — a print-registration effect, used on the password modal and photo frames. Never use soft/blurred shadows.
- **Asymmetry over centring.** Heroes are split or weighted to a corner; metadata hangs in margins; centred layouts are reserved for intimate content (poems, the daily game).

---

## 2. Tokens

Defined in `:root` on every page. Use the variables, never raw hex.

| Token | Value | Role |
|-------|-------|------|
| `--cream` | `#F5F0E8` | Page background — the "paper" |
| `--ink` | `#0D0D0D` | Primary text |
| `--ink-soft` | `#2A2A2A` | Secondary text |
| `--red` | `#FF8800` | The accent. Labels, links, em-words, dots, stars (T) |
| `--muted` | `#8A8070` | Tertiary text, captions, hints — warm grey-brown, not cool grey |
| `--line` | `rgba(13,13,13,0.12)` | All dividers, borders, hairlines |
| `--pink` | `#e8829a` | **Rocky's Home only.** Imy's colour (see §6) |

Derived greys must stay on the ink axis: `rgba(13,13,13,α)`. Never introduce a new hue without a reason as strong as `--pink`'s.

Soft gold `#D4A017` exists only for `top-rated` film titles. Do not reuse it elsewhere.

---

## 3. Typography

Two families, loaded from Google Fonts. **Never add a third.**

### Cormorant Garamond (serif) — the voice
- Display titles: weight 300–400, tight `line-height` (0.92–1.15), `letter-spacing: -0.02em` at hero scale
- Body/captions: weight 300, often italic for subtitles, captions, and anything spoken *to* the reader
- Italic + `--red` `<em>` inside a title is the standard emphasis move (`Rocky's <em>Home</em>`)

### DM Mono (monospace) — the apparatus
All "machinery" text: nav, section labels, dates, coordinates, counters, hints, legends, footers. Always the same recipe:

```css
font-family: 'DM Mono', monospace;
font-size: 0.5–0.65rem;          /* tiny — that's the point */
letter-spacing: 0.15–0.25em;
text-transform: uppercase;
```

Colour: `--red` when it labels something, `--muted` when it whispers (hints, footers, sub-notes). Ticking numbers use `font-variant-numeric: tabular-nums`.

**Rule of thumb:** if a piece of text is *content*, it's Cormorant. If it's *metadata about content*, it's DM Mono.

### Scale anchors
- Hero names/titles: `clamp(4rem, 7vw, 7rem)`
- Section titles inside content: 1.8–1.9rem serif
- Body: 1.05–1.2rem serif
- Mono labels: 0.5–0.65rem

---

## 4. Layout patterns

- **Section skeleton:** `padding: 4.5rem 3rem` (mobile: `4rem 1.5rem`), separated by `border-top: 1px solid var(--line)`. No alternating background colours.
- **Section label:** DM Mono red label with a hairline extending to the right (`.section-label` flex + `::after` line). Every section starts with one.
- **Heroes:** full-viewport, two-column grid split by a vertical hairline; primary content bottom-left, apparatus (clocks, meta) pinned to corners.
- **Content widths:** intimate content 600px (poems), reading content 680px (articles), structured content 860px (grids, timelines).
- **Numbered lists** (writing, films): `01`-prefixed mono numbers, row grid `4rem 1fr auto`, hairline between rows, exclusive-accordion description panels.
- **Two-column newspaper split** for long lists (films): `grid-auto-flow: column` so order reads *down* each column, not across.
- **Horizontal filmstrip** for long photo sequences (Our Story): draggable `overflow-x` strip with scroll-snap, edge gradient fades, mono drag hint. Prefer this over stacking — page height is a budget (see §8).

---

## 5. Motion

Motion is punctuation, not decoration.

- **Page load:** one orchestrated sequence — `fadeUp` (opacity + 16–20px translateY) with staggered `animation-delay` (0.2s → 1.4s). Nothing else animates on load.
- **Scroll reveal:** `IntersectionObserver` adds `.visible`; items fade up over 0.6s with 60–80ms stagger. Observe once, then unobserve.
- **Micro-interactions:** colour transitions 0.2–0.3s; accordions via `grid-template-rows`/max-height transitions; the polaroid tilt (±1.4°) straightens on hover; wrong-password shake (0.3s, ±6px).
- **Tick frequency:** live counters update at 1s in a single shared `setInterval` (`updateClocks` on Rocky's Home).
- No parallax, no scroll-jacking (the filmstrip wheel-capture releases at the strip's ends), no spring/bounce easings — `ease` only.

---

## 6. Rocky's Home: the duet motif

The private page extends the system with one concept: **two people, two colours.**

- `--red` (orange) = Tiago · `--pink` = Imy
- Film star ratings: T row orange, R row pink; legend "T Tiago · R Imy"
- Story filmstrip dots alternate orange/pink down the timeline
- A faint pink radial blush warms the hero (`radial-gradient`, opacity ≈ 0.05)
- Everything else stays on the shared cream/ink system — pink is an accent *on* the accent, not a second theme

**Voice rule:** the entire page addresses Imy directly ("you", never "her"/"she"). Captions use Tiago's own words verbatim — do not invent sentiment (see HANDOVER for the caption provenance rules).

**The open ending:** the story filmstrip closes with an empty dashed frame ("to be continued"). Keep it last when adding photos.

### Tried and removed — do not reintroduce
- Portuguese sub-labels on section titles
- Giant ghost "2" watermark behind the hero

---

## 7. Imagery

- **Photos** (Rocky's Home): 3:4 portrait frames, `object-fit: cover`, 1px `--line` border, hard offset shadow, polaroid tilt. Processed before commit: max 1600px, JPEG q78, **EXIF/GPS stripped**, hashed filename in `rh-m/` (see HANDOVER §Our Story).
- **Maps** are the site's signature illustration style: hand-built SVGs in cream/ink with `rgba(13,13,13,…)` strokes at low opacity, orange three-ring location dots (outer ring 0.25, mid 0.50, core solid), DM Mono uppercase labels. Europe (Mercator), Lisbon (custom), world (equirectangular). Coordinate formulas live in HANDOVER.
- No stock imagery, no icons/emoji, no illustration styles outside the map language.

---

## 8. Page-height budget

Long pages get restructured, not scrolled. Targets: **≤ ~6 viewport-heights** for Rocky's Home, less for the portfolio. Tools, in order of preference: horizontal filmstrip · two-column split · accordion · cut content. Section padding stays at 4.5rem — don't reclaim height by crushing whitespace.

---

## 9. Voice & microcopy

- Mono microcopy is lowercase-feeling despite the uppercase transform: terse, warm, unpunctuated ("first to last · drag →", "made with love in Lisbon · 38.72° N · 9.14° W")
- Interpuncts (`·`) separate mono fragments, never slashes or pipes
- Em-dashes and ellipses in serif text; degree-symbol coordinates as a recurring signature
- Status text changes in place rather than via toasts/alerts (the atelier modal label: "Enter password" → "Checking…" → "Welcome back")
- Facts must be sourced: film descriptions from IMDb/official synopses; game facts verified; articles word-for-word from source material

---

## 10. Checklist for new work

1. Cream background + noise overlay present?
2. Only Cormorant + DM Mono, used per §3's content/metadata split?
3. All colours via tokens? No new hues, no soft shadows, no rounded corners?
4. Section opens with a mono label + hairline?
5. Reveal animation consistent with §5 (fadeUp, stagger, once)?
6. Mobile: single column at 768px, padding 1.5rem, tap targets preserved?
7. On Rocky's Home: duet colours respected, page addresses Imy, no invented captions?
8. Page-height budget respected (§8)?
9. Photos processed (resize, strip EXIF, hash) before committing?
10. Anything removed-by-request (§6) staying removed?
