# Prominent Roofing, Memphis TN

A one page lead generation site. Static HTML, CSS and JS plus one PHP file for
the contact form. No build step, no framework, no npm install. Upload and go.

---

## Before it goes live

Four things need a real value. The rest works as shipped.

| What | Where | Why |
|---|---|---|
| **Replace the three sample reviews** | `index.html`, `#reviews` section | The quotes currently say "Sample review". They are placeholder text and must be swapped for real, verbatim Google reviews with the reviewers' real first names before launch. |
| **Set the mail addresses** | `contact.php`, lines 13 to 14 | `TO_EMAIL` is where leads land. `FROM_EMAIL` must be a mailbox that actually exists on the domain, created in hPanel under Emails, or Hostinger drops the message as spoofed. |
| **Add the street address** | `index.html`, the `PostalAddress` block in the JSON-LD | Google Business Profile matching is much stronger with a full street address. The schema is valid without it, but add it if the business has a public address. |
| **Confirm the domain** | `index.html` and `sitemap.xml` | Everything points at `https://prominentroofing.shop/`. Find and replace if that changes. |

---

## Deploying to Hostinger

1. In hPanel, open **File Manager** and go to `public_html`.
2. Upload **the contents of this folder**, not the folder itself. `index.html`
   must sit directly in `public_html`.
3. Make sure `.htaccess` came across. It is a hidden file, so switch on
   "show hidden files" in File Manager if you do not see it.
4. In hPanel go to **Emails** and create the mailbox you put in `FROM_EMAIL`.
5. Set PHP to 8.0 or newer under **Advanced, PHP Configuration**.
6. Load the site and send yourself a test lead through the form.

### After launch

- Submit `https://prominentroofing.shop/sitemap.xml` in Google Search Console.
- Claim and fill in the Google Business Profile. For a local roofer that
  listing drives more calls than the site itself does.
- Keep the name, address, phone and hours identical between the site footer
  and the Google listing. Google cross checks them.

---

## What is where

```
index.html            the whole page
thank-you.html        where the form lands after a successful send
contact.php           form handler, sends mail, no dependencies
.htaccess             https redirect, compression, cache headers, clean urls
robots.txt
sitemap.xml
assets/
  css/site.css        design system and every style on the site
  js/site.js          reveals, mobile menu, lazy video, form checks
  fonts/              Archivo and Instrument Sans, self hosted, ~120 kB
  img/                illustrations, logo, favicon, social share image
  video/              empty, drop hero.mp4 and hero.webm here, see README.txt
```

---

## The hero video

Optional. The hero looks finished without it.

Drop `hero.mp4` and `hero.webm` into `assets/video/` and it starts playing.
Full encoding instructions are in `assets/video/README.txt`.

The video only loads when the screen is at least 900px wide, the visitor has
not asked for reduced motion, and the connection is not slow or on Data Saver.
It fades in once real frames play, so a missing file leaves the poster up with
no visible error and no wasted bytes.

---

## Swapping in real photos

The illustrations in `assets/img/` are a placeholder art direction, not a
substitute for photography. Real job site photos will convert better. To swap:

1. Export at the sizes below, as `.jpg` at quality 80, or `.webp`.
2. Drop them in `assets/img/`.
3. In `index.html`, change the `src` on that image and update `width` and
   `height` to the real pixel dimensions. Leave `loading="lazy"` alone.
4. Rewrite the `alt` text to describe the actual photo.

| File | Used for | Size |
|---|---|---|
| `hero-poster.svg` | hero background, and the video poster | 1920 x 1080 |
| `service-replacement.svg` | roof replacement card | 1000 x 750 |
| `service-repair.svg` | roof repair card | 1000 x 750 |
| `service-inspection.svg` | free inspection card | 1000 x 750 |
| `service-storm.svg` | storm card, and the claims section | 1000 x 750 |
| `work-*.svg` | six recent work tiles | 900 x 700, wide ones 1200 x 800 |
| `og-cover.jpg` | social sharing preview | 1200 x 630, keep as jpg |

Best photos for a roofing site, in order: finished roofs shot in late afternoon
light, crew actually working on a roof, before and after pairs, and storm damage
close ups. Avoid stock. Homeowners can tell.

---

## Design notes

**Colour** comes off the material. `#0F1317` is wet asphalt shingle and carries
the dark sections. `#C1272D` is the only colour that ever means "do this", so
it appears on buttons, eyebrows and nothing else. `#F3F2EF` is the daylight
section. `#F2645B` is the lifted red used where the deep red would fail
contrast on a dark background.

**Type** is Archivo for display, run expanded and heavy in caps so headlines
read like fabricated signage rather than a default UI font, against Instrument
Sans for anything a person actually has to read. Both are self hosted and
variable, so the whole type scale costs two files.

**The pitch mark** is the through line. The same roof angle is the logo, the
tick before every section eyebrow, and the shape of the claims rail. It is a
roof profile, so it means something rather than decorating.

**Numbering** appears once, on the claims process, because that content really
is a sequence and the order carries information the reader needs. It is not
used anywhere else.

**Motion** is one hero load sequence, a gentle fade up per section on scroll, a
rail that draws down the claims steps as you read them, and a review count that
counts up once. All of it is off under `prefers-reduced-motion`.

---

## Measured on this build

| | |
|---|---|
| Page weight, first load | 189 kB total, of which 117 kB is fonts |
| Largest Contentful Paint | 184 ms |
| Cumulative Layout Shift | 0 |
| Images loaded up front | 1, the hero poster. The other 11 are lazy |
| Text contrast | every pair passes WCAG AA, lowest is 5.2:1 |
| Headings | one `h1`, no skipped levels |
| Keyboard | every stop has a visible focus ring |
