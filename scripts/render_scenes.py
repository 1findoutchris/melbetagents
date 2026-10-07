"""
Renders original atmospheric football scenes for the sports section:
  stadium: a floodlit pitch at night with a ball in the foreground
  net:     a ball resting in a goal net under a single light
Usage: python3 scripts/render_scenes.py OUT_DIR BALL_PNG
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

out_dir, ball_path = sys.argv[1], sys.argv[2]
rng = np.random.default_rng(3)
W, H = 1600, 1000
YEL = np.array([255, 212, 0]) / 255


def to_img(a):
    return Image.fromarray((np.clip(a, 0, 1) ** (1 / 1.05) * 255).astype(np.uint8), "RGB")


def grain(img, amt=0.035):
    a = np.asarray(img).astype(float) / 255
    a += rng.normal(0, amt, a.shape[:2])[..., None]
    return to_img(a)


def paste_ball(img, ball, cx, cy, d, shadow=True, angle=0):
    b = ball.resize((d, d), Image.LANCZOS).rotate(angle, resample=Image.BICUBIC)
    if shadow:
        sh = Image.new("L", img.size, 0)
        ImageDraw.Draw(sh).ellipse([cx - d * 0.55, cy + d * 0.42, cx + d * 0.55, cy + d * 0.58], fill=200)
        sh = sh.filter(ImageFilter.GaussianBlur(d * 0.08))
        img = Image.composite(Image.new("RGB", img.size, (0, 0, 0)), img, sh)
    img = img.convert("RGBA")
    img.alpha_composite(b, (int(cx - d / 2), int(cy - d / 2)))
    return img.convert("RGB")


ball = Image.open(ball_path).convert("RGBA")

# ---------------------------------------------------------------- stadium
yy, xx = np.mgrid[0:H, 0:W].astype(float)
img = np.zeros((H, W, 3))
horizon = H * 0.50
# sky: near black with a warm haze around the lights
img += np.array([0.03, 0.032, 0.04])
lights = [(W * 0.12, H * 0.10), (W * 0.36, H * 0.05), (W * 0.64, H * 0.05), (W * 0.88, H * 0.10)]
for lx, ly in lights:
    d2 = (xx - lx) ** 2 + (yy - ly) ** 2
    img += np.exp(-d2 / (2 * 160 ** 2))[..., None] * np.array([0.11, 0.10, 0.06])
    img += np.exp(-d2 / (2 * 14 ** 2))[..., None] * 1.6
    img += np.exp(-d2 / (2 * 40 ** 2))[..., None] * np.array([0.6, 0.55, 0.3])
# stands: dark band with tiny crowd lights
stand = (yy > horizon - H * 0.13) & (yy < horizon)
img[stand] = img[stand] * 0.18 + np.array([0.012, 0.013, 0.016])
dots = np.zeros((H, W))
n = 900
px = rng.uniform(0, W, n).astype(int)
py = rng.uniform(horizon - H * 0.12, horizon - 4, n).astype(int)
dots[py, px] = rng.uniform(0.3, 1.0, n)
dots = np.asarray(Image.fromarray((dots * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(float) / 255
img += dots[..., None] * np.array([1.0, 0.85, 0.4]) * 1.4
# pitch in perspective
below = yy > horizon
z = 900.0 / np.maximum(yy - horizon, 1)  # depth
wx = (xx - W / 2) * z / 900.0
stripes = (np.floor(z * 1.6) % 2 == 0)
grass = np.where(stripes, 0.085, 0.065)
pitch = np.stack([grass * 0.55, grass * 1.05, grass * 0.6], -1)
# floodlight pools on the grass
pool = np.exp(-((wx - 0.2) ** 2) / 2.5 - ((z - 2.2) ** 2) / 1.5) * 1.6 + 0.35 * np.exp(-((wx + 1.4) ** 2) / 3 - ((z - 4) ** 2) / 4)
pitch *= (0.45 + pool)[..., None]
# white pitch lines: halfway line (constant z) and centre circle
line = np.exp(-(((z - 3.0) * (yy - horizon) / 6.0) ** 2))
circle_r = np.sqrt((wx * 1.0) ** 2 + ((z - 3.0) * 1.0) ** 2)
line += np.exp(-(((circle_r - 0.9) * (yy - horizon) / 5.0) ** 2))
line += np.exp(-(((wx + 2.9) * (yy - horizon) / 7.0) ** 2)) * (z > 1.0)
pitch += np.clip(line, 0, 1)[..., None] * np.array([0.55, 0.57, 0.52]) * (0.35 + pool[..., None] * 0.5)
img = np.where(below[..., None], pitch, img)
# haze near the horizon and light beams
img += np.exp(-((yy - horizon) ** 2) / (2 * 60 ** 2))[..., None] * np.array([0.05, 0.045, 0.03])
for lx, ly in lights[1:3]:
    ang = np.arctan2(xx - lx, yy - ly)
    beam = np.exp(-(ang / 0.22) ** 2) * np.clip((yy - ly) / H, 0, 1) * (yy < horizon + 80)
    img += beam[..., None] * np.array([0.10, 0.09, 0.05])
# vignette
vig = 1 - 0.55 * (((xx - W / 2) / (W * 0.7)) ** 2 + ((yy - H * 0.55) / (H * 0.8)) ** 2)
img *= np.clip(vig, 0.2, 1)[..., None]
stadium = to_img(img)
stadium = paste_ball(stadium, ball, int(W * 0.66), int(H * 0.73), int(H * 0.30))
stadium = grain(stadium, 0.02)
for w in (1600, 900):
    stadium.resize((w, int(w * H / W)), Image.LANCZOS).save(f"{out_dir}/scene-stadium-{w}.webp", quality=78, method=6)

# ---------------------------------------------------------------- net
W2, H2 = 1200, 1200
S = 2
net = Image.new("RGB", (W2 * S, H2 * S), (6, 7, 9))
d = ImageDraw.Draw(net)
cx, cy = W2 * S * 0.5, H2 * S * 0.42
# perspective diamond mesh converging toward a vanishing point
for i in range(-40, 41):
    x0 = cx + i * 70 * S
    d.line([(x0 - 900 * S, H2 * S), (cx + i * 14 * S, -200 * S)], fill=(70, 72, 78), width=2 * S)
    d.line([(x0 + 900 * S, H2 * S), (cx + i * 14 * S, -200 * S)], fill=(70, 72, 78), width=2 * S)
net = net.resize((W2, H2), Image.LANCZOS)
a = np.asarray(net).astype(float) / 255
yy2, xx2 = np.mgrid[0:H2, 0:W2].astype(float)
spot = np.exp(-(((xx2 - W2 * 0.55) ** 2) + ((yy2 - H2 * 0.55) ** 2)) / (2 * 380 ** 2))
a = a * (0.25 + 1.6 * spot)[..., None] + spot[..., None] * np.array([0.10, 0.085, 0.02])
a *= np.clip(1 - 0.6 * (((xx2 - W2 / 2) / W2) ** 2 + ((yy2 - H2 / 2) / H2) ** 2) * 2, 0.15, 1)[..., None]
netimg = to_img(a)
netimg = paste_ball(netimg, ball, int(W2 * 0.55), int(H2 * 0.58), int(W2 * 0.42), shadow=False, angle=25)
netimg = grain(netimg, 0.02)
for w in (1200, 700):
    netimg.resize((w, w), Image.LANCZOS).save(f"{out_dir}/scene-net-{w}.webp", quality=78, method=6)
print("scenes written")
