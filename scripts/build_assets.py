"""
Builds every image asset the site uses from the sources in assets/.

  python3 scripts/build_assets.py

Requires Python 3 with numpy and Pillow (WebP support). Outputs:
  public/brand/melbet-logo.{webp,png}   transparent, trimmed Melbet wordmark
  src/app/favicon.ico, icon.png, apple-icon.png   from the Melbet brand mark
  src/app/opengraph-image.png           social sharing image
  public/images/football-*.webp         rendered footballs (scripts/render_football.py)
  public/images/scene-*.webp            rendered sports scenes (scripts/render_scenes.py)
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
PUBLIC = ROOT / "public"
APP = ROOT / "src" / "app"
(PUBLIC / "brand").mkdir(parents=True, exist_ok=True)
(PUBLIC / "images").mkdir(parents=True, exist_ok=True)
BG = (8, 9, 11)


def run(*args):
    subprocess.run([sys.executable, *map(str, args)], check=True)


# --- Logo: key out the black background without recolouring the artwork ----
src = np.asarray(Image.open(ASSETS / "brand" / "melbet-logo-source.webp").convert("RGB")).astype(float)
peak = src.max(axis=-1)
alpha = np.clip((peak - 12) / (200 - 12), 0, 1)
rgb = np.where(alpha[..., None] > 0, src / np.maximum(alpha[..., None], 1e-6), 0)
# Un-premultiplying edge pixels can overshoot; keep the source hue and only restore brightness.
rgb = np.clip(rgb, 0, 255)
logo = Image.fromarray(np.dstack([rgb, alpha * 255]).round().astype(np.uint8), "RGBA")
logo = logo.crop(logo.getbbox())
logo_h = 120  # 3x for a ~40px display height
logo = logo.resize((round(logo.width * logo_h / logo.height), logo_h), Image.LANCZOS)
logo.save(PUBLIC / "brand" / "melbet-logo.png", optimize=True)
logo.save(PUBLIC / "brand" / "melbet-logo.webp", quality=92, method=6)
print("logo", logo.size)

# --- Favicons from the brand mark ---------------------------------------------
# The source mark is a yellow disc on a white square; cut the disc out with an
# anti-aliased circular mask and remove the white background bleed at its edge.
msrc = np.asarray(Image.open(ASSETS / "brand" / "melbet-mark-source.png").convert("RGB")).astype(float)
n = msrc.shape[0]
ss = 4
g = (np.arange(n * ss) + 0.5) / ss - n / 2
cov = (np.add.outer(g**2, g**2) <= (n / 2) ** 2).astype(float)
cov = cov.reshape(n, ss, n, ss).mean(axis=(1, 3))
unmixed = (msrc - (1 - cov[..., None]) * 255) / np.maximum(cov[..., None], 1e-6)
mrgb = np.where(cov[..., None] > 0.999, msrc, np.clip(unmixed, 0, 255))
mark = Image.fromarray(np.dstack([mrgb, cov * 255]).round().astype(np.uint8), "RGBA")
mark.resize((48, 48), Image.LANCZOS).save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
mark.resize((192, 192), Image.LANCZOS).save(APP / "icon.png", optimize=True)
apple = Image.new("RGBA", (180, 180), BG + (255,))
m = mark.resize((132, 132), Image.LANCZOS)
apple.alpha_composite(m, (24, 24))
apple.convert("RGB").save(APP / "apple-icon.png", optimize=True)

# --- Partner logos (monochrome sources -> reversed white for the dark site) ----
(PUBLIC / "partners").mkdir(parents=True, exist_ok=True)
juv = (ASSETS / "partners" / "juventus-source.svg").read_text()
# Same artwork and viewBox; only the single fill colour is reversed to white.
juv = juv.replace("<path ", '<path fill="#ffffff" ', 1)
(PUBLIC / "partners" / "juventus.svg").write_text(juv)
lal = np.asarray(Image.open(ASSETS / "partners" / "laliga-source.jpg").convert("L")).astype(float)
# Dark ink becomes opaque white; the white background becomes transparent.
ink = np.clip((255 - lal - 8) / (247 - 8), 0, 1)
lal_img = Image.fromarray(np.dstack([np.full(lal.shape, 255.0)] * 3 + [ink * 255]).round().astype(np.uint8), "RGBA")
lal_img = lal_img.crop(lal_img.getbbox())  # trims empty margin only
lal_h = 216
lal_img = lal_img.resize((round(lal_img.width * lal_h / lal_img.height), lal_h), Image.LANCZOS)
lal_img.save(PUBLIC / "partners" / "laliga.png", optimize=True)
lal_img.save(PUBLIC / "partners" / "laliga.webp", quality=90, method=6)
print("laliga", lal_img.size)

# --- Footballs --------------------------------------------------------------------
tmp = Path(tempfile.mkdtemp())
run(ROOT / "scripts" / "render_football.py", tmp / "hero.png", 1100, 7)
run(ROOT / "scripts" / "render_football.py", tmp / "alt.png", 800, 21)
hero = Image.open(tmp / "hero.png")
alt = Image.open(tmp / "alt.png")
for w in (1000, 560):
    hero.resize((w, w), Image.LANCZOS).save(PUBLIC / "images" / f"football-{w}.webp", quality=84, method=6)
for w in (640, 360):
    alt.resize((w, w), Image.LANCZOS).save(PUBLIC / "images" / f"football-alt-{w}.webp", quality=84, method=6)

# --- Scenes ------------------------------------------------------------------------------
run(ROOT / "scripts" / "render_football.py", tmp / "scene-ball.png", 1000, 11)
run(ROOT / "scripts" / "render_scenes.py", PUBLIC / "images", tmp / "scene-ball.png")

# --- Open Graph image -------------------------------------------------------------
W, H = 1200, 630
og = Image.new("RGB", (W, H), BG)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
glow = np.exp(-(((xx - 930) ** 2) + ((yy - 315) ** 2)) / (2 * 260 ** 2))
arr = np.asarray(og).astype(float) + glow[..., None] * np.array([90, 70, 0])
og = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")
ring = Image.new("RGBA", (W, H))
ImageDraw.Draw(ring).ellipse([930 - 270, 315 - 270, 930 + 270, 315 + 270], outline=(255, 212, 0, 60), width=3)
og.alpha_composite(ring)
ball = hero.resize((430, 430), Image.LANCZOS)
shadow = Image.new("L", (W, H), 0)
ImageDraw.Draw(shadow).ellipse([760, 520, 1100, 570], fill=170)
og = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), og, shadow.filter(ImageFilter.GaussianBlur(18)))
og.alpha_composite(ball, (715, 90))
lg = logo.resize((round(logo.width * 44 / logo.height), 44), Image.LANCZOS)
og.alpha_composite(lg, (72, 72))
font = ImageFont.truetype(str(ASSETS / "fonts" / "BarlowCondensed-ExtraBold.ttf"), 96)
d = ImageDraw.Draw(og)
d.text((70, 210), "BECOME A MELBET", font=font, fill=(255, 255, 255))
d.text((70, 310), "PAYMENT AGENT.", font=font, fill=(255, 212, 0))
small = ImageFont.truetype(str(ASSETS / "fonts" / "BarlowCondensed-ExtraBold.ttf"), 40)
d.text((72, 440), "APPLY AT MELBETAGENTS.ORG", font=small, fill=(184, 187, 194))
og.convert("RGB").save(APP / "opengraph-image.png", optimize=True)
print("assets built")
