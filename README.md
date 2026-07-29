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
| **Address, license #** | Footer + JSON-LD | The bare "Memphis, TN" is a stand-in. The email (`info@prominentroofing.shop`) is live. |

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

**Colour** — black and white with a single red accent. `#0C0E11` near-black,
`#ECEDEF` zinc, `#565D66` slate, and `#CE1126` red (with `#F5333F` as the
brighter value for dark grounds). The neutrals carry a faint cool cast rather
than sitting on a dead grey axis — slate and galvanised zinc, the materials
actually on a roof.

Black, white and zinc carry all the mass. Red is spent only on actions and
small marks — buttons, eyebrow labels, step numbers, the hero's second line —
which is what makes it read as a pop rather than a second theme colour. Every
red pairing clears WCAG AA in both directions.

**Photography is monochrome** via a single CSS rule (search `grayscale` in
`style.css`). The source JPEGs are untouched full-colour files, so deleting
that one rule brings the colour back. Desaturating the photos is what lets the
red hit as hard as it does.

**Type** — Big Shoulders Display for headings (condensed American signage, the
lettering you'd see on a work truck), Archivo for body, Space Mono for eyebrows,
stat labels, and anything data-like. All three are self-hosted, so there's no
Google Fonts request and nothing to break if a CDN is blocked.

**Signature** — the craftsmanship section is laid up in staggered shingle
courses (a tiled SVG at ~6% white). It's the one decorative move on the page;
everything else stays quiet.

**Service cards lead with photographs** of the actual work rather than generic
icons, which is also where six of the seven supplied photos earn their keep.

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
