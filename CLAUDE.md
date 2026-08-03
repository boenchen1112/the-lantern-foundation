# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Marketing/informational website for **The Lantern Foundation** (天燈之夢), a
student-founded nonprofit in Taipei. It is a static, no-build, no-dependency
site: plain HTML/CSS/JS served as-is, no `package.json`, no bundler, no
framework. There is no test suite, linter, or build command — "running" the
site means opening the HTML files (or serving the folder) directly in a
browser.

## Development

- No install/build step. Edit the HTML/CSS/JS files directly and refresh the
  browser.
- To preview locally with working relative paths, serve the folder instead of
  opening files via `file://` (e.g. `python -m http.server`), then visit the
  page in a browser.
- No automated tests. Verify changes by loading the affected page(s) in a
  browser and checking the console for errors.

## Site structure

Five top-level pages, each a self-contained HTML file that pulls in shared
assets:
- `index.html` — home
- `about.html` — org story + team (`#team` anchor)
- `our-work.html` — the three program branches: **BrightNotes**, **LightAid**,
  **HeartLink** (see `#brightnotes`, `#lightaid`, `#heartlink` sections)
- `the-problem.html` — problem statement / context
- `news-events.html` — events, including `#hunger-game` and `#love-lit` anchors
- `get-involved.html` — CTA / involvement page

Each page follows the same pattern: shared `<head>` boilerplate, links to
`assets/css/shared.css` and `assets/css/enhance.css`, an inline `<style>`
block in `<head>` for page-specific CSS, shared `<nav class="site-nav">` /
`.nav-mob` markup, page content, and three scripts loaded in a fixed order at
the bottom of `<body>`:
```html
<script src="assets/js/image-slot.js"></script>
<script src="assets/js/nav.js"></script>
<script src="assets/js/interactive.js"></script>
```
`nav.js` must load before `interactive.js` isn't required, but this load
order is consistent across every page — keep it when adding scripts.

## CSS architecture

- `assets/css/shared.css` — global reset, design tokens (CSS custom
  properties under `:root`: `--dark`, `--gold*`, `--cream*`, `--text-*`,
  `--font-serif` (Playfair Display) / `--font-sans` (DM Sans), layout tokens
  like `--container`, `--nav-h`, `--section-v`, `--gap`), typography scale
  classes (`.t-display`, `.t-h1`/`.t-h2`/`.t-h3`, `.t-label`), and reusable
  component classes shared across all pages (nav, buttons, cards).
- `assets/css/enhance.css` — supplemental/progressive-enhancement styles
  layered on top of `shared.css`.
- Page-specific, one-off styles (hero sections, unique layouts) live in the
  inline `<style>` block inside that page's own `<head>` rather than in the
  shared stylesheets. Follow this convention: only promote a style to
  `shared.css`/`enhance.css` if it's genuinely reused across pages.
- Dark, gold-accented visual theme; use the existing custom properties
  instead of hardcoding colors.

## JavaScript architecture

Three global (non-module) IIFE scripts, each responsible for a distinct
concern, run on every page:

- **`assets/js/nav.js`** — sticky nav on scroll, dropdown menus (`.nav-dd`),
  mobile hamburger nav (`.nav-ham`/`.nav-mob`), scroll-reveal
  (`IntersectionObserver` on `.reveal`), animated stat counters
  (`[data-count]` elements with `data-prefix`/`data-suffix`), and
  active-nav-link highlighting based on `location.pathname`.
- **`assets/js/interactive.js`** — purely progressive/decorative enhancements,
  each in its own IIFE: scroll progress bar, cursor-follow glow on card
  elements (`.branch-card`, `.challenge-card`, etc. via `data-glow`),
  magnetic-hover buttons (`.btn-gold`, `[data-magnetic]`), parallax
  (`[data-parallax]`, reads `data-parallax` as a speed multiplier), a reusable
  floating-lantern `<canvas class="lantern-canvas" data-count="N">` particle
  animation, a lightbox for `<image-slot>` galleries (grouped via
  `[data-lightbox-group]`, triggered by `.lb-btn`), and scrollspy for
  `[data-scrollspy]` nav lists.
- **`assets/js/image-slot.js`** — a custom element `<image-slot>` (Web
  Component) implementing a drag-and-drop-fillable image placeholder, built
  for the "omelette" design-tool runtime (`window.omelette.writeFile`) with a
  `.image-slots.state.json` sidecar for persistence. Outside that runtime the
  slot is **read-only** — this only matters if editing via the omelette
  design tool; for normal static hosting, `<image-slot>` elements should
  generally already have their image content baked in via the `src`
  attribute or sidecar state, and don't need runtime fill behavior. Full
  usage docs (attributes: `id`, `shape`, `radius`, `mask`, `fit`, `position`,
  `placeholder`, `src`) are in the `/* BEGIN USAGE */ … /* END USAGE */`
  comment block at the top of the file — read it before modifying this
  component's behavior.

When adding new interactive behavior, prefer adding a new self-contained IIFE
section to `interactive.js` (numbered comment headers like `/* ---- N. NAME
---- */`) over creating a new script file, unless the behavior is a
genuinely new custom element/component like `image-slot.js`.

## Assets

- `assets/images/officers/` — headshots, named `First_Last.jpg`.
- `assets/images/general/` — event/program photos, grouped in subfolders per
  event (e.g. `Brightnotes_concert/`, `Harmony_Home/`, `HUNGER_Games/`) plus a
  `logos/` subfolder.
- `assets/docs/` — supporting documents (e.g. officer bios `.docx`).
