#!/usr/bin/env python3
"""Bundle the site into ../preview.html — one self-contained, shareable file.

The preview embeds the fonts and photos as data URIs and inlines the CSS/JS, so
the page renders with no external requests at all. That makes it safe to drop
into a sandboxed viewer, email to a client, or open straight off a USB stick.

Photos are re-compressed smaller than production to keep the bundle quick to
load; the preview is for looking at, not for launch.

    python3 tools/build-preview.py

Requires Pillow (pip install pillow).
"""
import base64
import os
import re
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "preview.html")

# Width to downscale each photo to for the bundle. Aspect ratios are preserved,
# so the width/height attributes in the markup stay correct and nothing shifts.
PREVIEW_WIDTHS = {
    "hero-gables.jpg": 1500,
    "crew-shingle.jpg": 820,
    "aerial-inspection.jpg": 760,
    "tile-materials.jpg": 760,
    "install-detail.jpg": 760,
    "tearoff-crew.jpg": 760,
    "storm-tearoff.jpg": 760,
}
PREVIEW_QUALITY = 70

BANNER = (
    '<div class="preview-note"><strong>Design preview</strong>'
    "<span>Sample content &mdash; stats, reviews, and contact details are "
    "placeholders pending Prominent Roofing&rsquo;s real data.</span></div>"
)

BANNER_CSS = """
/* preview-only chrome, not part of the delivered site */
.preview-note{background:#241E14;color:#F0DFC0;
  border-bottom:1px solid rgba(242,169,59,.34);
  font-family:var(--mono);font-size:11.5px;line-height:1.5;letter-spacing:.02em;
  padding:9px clamp(20px,5vw,44px);display:flex;flex-wrap:wrap;gap:4px 12px;
  align-items:baseline}
.preview-note strong{color:var(--neon);text-transform:uppercase;
  letter-spacing:.18em;font-weight:700;white-space:nowrap}
"""


def read(*parts):
    return open(os.path.join(ROOT, *parts), encoding="utf-8").read()


def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()


def esc_html(s):
    """Non-ASCII becomes numeric entities, so the page reads correctly even if
    it is served without a charset declaration."""
    return "".join(c if ord(c) < 128 else f"&#{ord(c)};" for c in s)


def esc_js(s):
    """Same idea for script bodies, where HTML entities would not be decoded."""
    return "".join(c if ord(c) < 128 else f"\\u{ord(c):04x}" for c in s)


def shrink_photos(dest):
    for name, width in PREVIEW_WIDTHS.items():
        src = os.path.join(ROOT, "assets", "img", name)
        im = Image.open(src).convert("RGB")
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(os.path.join(dest, name), "JPEG", quality=PREVIEW_QUALITY,
                optimize=True, progressive=True)


def build(photo_dir):
    html = read("index.html")
    css = read("assets", "css", "style.css")
    fonts = read("assets", "css", "fonts.css")
    js = read("assets", "js", "main.js")

    fonts = re.sub(
        r"url\('\.\./fonts/([^']+)'\)",
        lambda m: "url('" + data_uri(os.path.join(ROOT, "assets", "fonts", m.group(1)),
                                     "font/woff2") + "')",
        fonts,
    )

    for name in set(re.findall(r'src="assets/img/([^"]+)"', html)):
        html = html.replace(f'src="assets/img/{name}"',
                            f'src="{data_uri(os.path.join(photo_dir, name), "image/jpeg")}"')
    html = re.sub(r'"assets/img/[^"]+"', '""', html)  # og:image and JSON-LD refs
    html = html.replace('<script src="assets/js/main.js" defer></script>\n', "")

    title = re.search(r"<title>(.*?)</title>", html, re.S).group(1)
    body = re.search(r"<body>(.*)</body>", html, re.S).group(1)

    return (
        f"<title>{esc_html(title)}</title>\n"
        "<style>\n" + fonts + "\n"
        "/* the site keeps its brand colours in either viewer theme */\n"
        ":root{color-scheme:light}\n"
        + esc_html(css) + esc_html(BANNER_CSS) + "\n</style>\n"
        + BANNER + "\n" + esc_html(body) + "\n"
        "<script>\n" + esc_js(js) + "\n</script>\n"
    )


def main():
    with tempfile.TemporaryDirectory() as tmp:
        shrink_photos(tmp)
        doc = build(tmp)

    open(OUT, "w", encoding="ascii").write(doc)

    leftovers = re.findall(r'(?:src|href)="(?:https?:)?//[^"]+', doc)
    print(f"wrote {os.path.relpath(OUT, ROOT)}  ({os.path.getsize(OUT) // 1024} KB)")
    print(f"external references: {leftovers or 'none'}")


if __name__ == "__main__":
    main()
