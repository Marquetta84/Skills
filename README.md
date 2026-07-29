# Prominent Roofing — Memphis, TN

A single-page marketing site for Prominent Roofing. Static HTML/CSS/JS — no build
step, no framework, no runtime dependencies. Open `index.html` or drop the folder
on any host.

```
index.html
assets/
  css/style.css      all styling + design tokens
  css/fonts.css      @font-face rules for the self-hosted webfonts
  js/main.js         nav drawer, FAQ accordion, scroll reveal, form handling
  fonts/*.woff2      Big Shoulders Display, Archivo, Space Mono (OFL)
  img/*.jpg          the seven supplied photos, resized and optimised
```

## Before you launch

These five things need real data. Each is marked with a `PLACEHOLDER` comment in
the source so you can find them fast (`grep -n PLACEHOLDER index.html`).

| What | Where | Why |
|---|---|---|
| **The estimate form goes nowhere** | `index.html` → `<form id="estimate-form">` | No backend is wired up. Right now submitting shows a message telling the visitor to call instead. See below. |
| **Stat figures** | Stats band under the hero | `4.9★`, `2,400+ roofs`, `24/7` are invented. Replace with your real numbers or delete the band. |
| **Testimonials** | Reviews section | The three reviews are written samples, not real customers. Swap in real, permissioned quotes. |
| **"Certified Installer" badge** | Credentials row | Only claim a manufacturer certification you actually hold (GAF Master Elite, Owens Corning Preferred, etc.). |
| **Email, address, license #** | Footer + JSON-LD | `hello@prominentroofing.com` and the bare "Memphis, TN" are stand-ins. |

Also update the `url` and `canonical` if the domain isn't `prominentroofing.com`,
and point the four social links (`href="#"`) at your real profiles.

### Connecting the form

The markup is standard, so any form service works. For [Formspree](https://formspree.io):

```html
<form class="f-grid" id="estimate-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

For Netlify, add `netlify` and `name="estimate"` to the `<form>` tag. Either way,
**delete the submit handler at the bottom of `assets/js/main.js`** (the block
under `--- estimate form ---`) so the browser posts normally.

## Design notes

**Colour** — `#14161C` storm slate, `#1D2330` bluff, `#B3352C` Memphis brick,
`#F2A93B` Beale marquee amber, `#EAECEF` zinc. The light sections use a cool
zinc rather than the usual warm cream: it reads like galvanised flashing and
shingle granules, which is the material the site is actually about. On dark
grounds amber carries the emphasis so brick red stays legible as "this is a
button."

**Type** — Big Shoulders Display for headings (condensed American signage, the
lettering you'd see on a work truck), Archivo for body, Space Mono for eyebrows,
stat labels, and anything data-like. All three are self-hosted, so there's no
Google Fonts request and nothing to break if a CDN is blocked.

**Signature** — the craftsmanship section is laid up in staggered shingle
courses (a tiled SVG at ~6% white), with an amber drip-edge rule marking the top
of the section. It's the one decorative move on the page; everything else stays
quiet.

**Sections butt flush.** There are no gaps or margins between them — all vertical
spacing lives inside sections via a single `.sec` utility, so backgrounds meet
edge to edge as requested.

## Responsive & accessibility

Verified at 390px, 820px, and 1440px: no horizontal overflow at any of them.

- Sticky call bar on phones (`Call Now` / `Free Estimate`), hidden from 900px up
- Slide-in nav drawer with Escape-to-close and focus handling
- All body text meets WCAG AA contrast; large text and UI meet AA at minimum
- Visible keyboard focus rings, working skip link, one-panel FAQ built on
  `<details>`/`<summary>`
- `prefers-reduced-motion` respected — reveals resolve to visible instead of
  animating
- `RoofingContractor` JSON-LD for local search

## Photo credits

The seven photos are the ones supplied for this build (Unsplash). Confirm the
licence terms for any you didn't shoot yourself before going live.
