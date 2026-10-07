"""
Renders an original, photoreal-style football (soccer ball) as a transparent PNG.

The ball is a truncated icosahedron projected onto a sphere: 12 dark pentagons
and 20 white hexagons, with recessed seams, puffed panels, a glossy synthetic
leather finish, a soft white key light from the upper left and a warm yellow
rim light. Everything is computed here, so the asset is fully original.

Usage: python3 scripts/render_football.py OUT.png SIZE [SEED] [RIM_SIDE]
"""
import sys
import numpy as np
from PIL import Image

out = sys.argv[1]
size = int(sys.argv[2]) if len(sys.argv) > 2 else 1200
seed = int(sys.argv[3]) if len(sys.argv) > 3 else 7
rim_side = sys.argv[4] if len(sys.argv) > 4 else "right"
SS = 2  # supersampling factor
N = size * SS
rng = np.random.default_rng(seed)

# ---- Geometry: face normals of a truncated icosahedron --------------------
phi = (1 + 5 ** 0.5) / 2
ico = []
for a in (-1, 1):
    for b in (-phi, phi):
        ico += [(0, a, b), (a, b, 0), (b, 0, a)]
ico = np.array(ico, float)
ico /= np.linalg.norm(ico, axis=1, keepdims=True)
# Hexagon centres = icosahedron face centres (triples of mutually adjacent vertices).
dod = []
for i in range(12):
    for j in range(i + 1, 12):
        for k in range(j + 1, 12):
            if min(ico[i] @ ico[j], ico[j] @ ico[k], ico[i] @ ico[k]) > 0.4:
                dod.append(ico[i] + ico[j] + ico[k])
dod = np.array(dod, float)
assert len(dod) == 20, len(dod)
dod /= np.linalg.norm(dod, axis=1, keepdims=True)
# Face-plane distances for a truncated icosahedron (edge 1).
D_PENT, D_HEX = 2.32743, 2.26728
normals = np.vstack([ico, dod])
dist = np.array([D_PENT] * 12 + [D_HEX] * 20)
is_pent = np.array([True] * 12 + [False] * 20)


def rot(axis, ang):
    axis = np.asarray(axis, float)
    axis /= np.linalg.norm(axis)
    x, y, z = axis
    c, s = np.cos(ang), np.sin(ang)
    C = 1 - c
    return np.array(
        [
            [c + x * x * C, x * y * C - z * s, x * z * C + y * s],
            [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
            [z * x * C - y * s, z * y * C + x * s, c + z * z * C],
        ]
    )


R = rot(rng.normal(size=3), rng.uniform(0, 2 * np.pi)) @ rot([0, 0, 1], 0.35)
normals_w = normals @ R.T

# ---- Rays: orthographic view of the unit sphere ----------------------------
coords = (np.arange(N) + 0.5) / N * 2 - 1
X, Y = np.meshgrid(coords, -coords)
r2 = X ** 2 + Y ** 2
inside = r2 <= 1.0
Z = np.sqrt(np.clip(1 - r2, 0, 1))
P = np.stack([X, Y, Z], axis=-1)  # sphere normal == position

# Face membership: largest dot(p, n)/d  (central projection onto the polyhedron)
scores = P @ normals_w.T / dist  # (N, N, 32)
order = np.argsort(scores, axis=-1)
best = order[..., -1]
second = order[..., -2]
s1 = np.take_along_axis(scores, best[..., None], -1)[..., 0]
s2 = np.take_along_axis(scores, second[..., None], -1)[..., 0]
edge = (s1 - s2)  # ~0 on seams
pent = is_pent[best]

# ---- Surface normal: puffed panels and recessed seams -----------------------
fn = normals_w[best]
# Panels bulge slightly: tilt normal away from the face centre near edges.
tilt = P - fn * np.sum(P * fn, axis=-1, keepdims=True)
seam_w = 0.0045
seam = np.exp(-((edge / seam_w) ** 2))  # 1 at the seam
groove = np.clip(1 - edge / 0.03, 0, 1) ** 2  # wider soft falloff into the seam
Nrm = P + tilt * (0.22 * groove + 0.10)[..., None]
# fine leather grain (value noise)
g = rng.normal(size=(N // 4 + 2, N // 4 + 2))
g = np.array(Image.fromarray(((g - g.min()) / np.ptp(g) * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC), float) / 255 - 0.5
g2 = rng.normal(size=(N // 24 + 2, N // 24 + 2))
g2 = np.array(Image.fromarray(((g2 - g2.min()) / np.ptp(g2) * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC), float) / 255 - 0.5
Nrm = Nrm + np.stack([g * 0.05, g[::-1] * 0.05, np.zeros_like(g)], -1)
Nrm /= np.linalg.norm(Nrm, axis=-1, keepdims=True)

# ---- Lighting ----------------------------------------------------------------
V = np.array([0, 0, 1.0])
key = np.array([-0.55, 0.62, 0.56]); key /= np.linalg.norm(key)
fill = np.array([0.5, -0.3, 0.8]); fill /= np.linalg.norm(fill)
rim = np.array([0.85 if rim_side == "right" else -0.85, -0.15, -0.5]); rim /= np.linalg.norm(rim)

ndl = np.clip(Nrm @ key, 0, 1)
ndf = np.clip(Nrm @ fill, 0, 1)
ndv = np.clip(Nrm @ V, 0, 1)
H = key + V; H /= np.linalg.norm(H)
spec_sharp = np.clip(Nrm @ H, 0, 1) ** 160
spec_soft = np.clip(Nrm @ H, 0, 1) ** 18
# Reflection of a large softbox at the key light: a crisp, broad window highlight.
Rv = 2 * ndv[..., None] * Nrm - V
win = np.clip(((Rv @ key) - 0.945) / 0.04, 0, 1) ** 2
# Rim light: grazing angles on the side facing the rim light.
lateral = np.clip((Nrm[..., 0] * rim[0] + Nrm[..., 1] * rim[1]) / np.hypot(rim[0], rim[1]), 0, 1)
rim_term = (1 - ndv) ** 2.6 * lateral ** 1.5
bounce = (1 - ndv) ** 3 * np.clip(-Nrm[..., 1], 0, 1)

white = np.array([0.95, 0.95, 0.96])
dark = np.array([0.045, 0.048, 0.055])
base = np.where(pent[..., None], dark, white)
base = base * (1 + 0.05 * g2[..., None] + 0.03 * g[..., None])

ao = 1 - 0.25 * groove[..., None] - 0.75 * seam[..., None]
light = 0.025 + 1.05 * ndl ** 1.25 + 0.07 * ndf
# Dramatic falloff into shadow on the side away from the key light.
light *= 0.25 + 0.75 * np.clip(P @ key * 0.75 + 0.55, 0, 1) ** 1.6
light *= 0.62 + 0.38 * ndv ** 0.6  # limb darkening
col = base * light[..., None] * ao
gloss = np.where(pent[..., None], 0.75, 1.0)
col += (spec_sharp * 0.8 + spec_soft * 0.08 + win * 0.4)[..., None] * gloss * (1 - seam[..., None])
yellow = np.array([1.0, 0.83, 0.0])
amber = np.array([1.0, 0.62, 0.05])
col += rim_term[..., None] * (yellow * 1.25 + amber * 0.25) * np.where(pent[..., None], 0.65, 1.0)
col += bounce[..., None] * yellow * 0.12
# subtle seam stitching texture
col *= 1 - 0.05 * seam[..., None] * (np.sin((X + Y) * 900) > 0)[..., None]

col = np.clip(col, 0, 1) ** (1 / 1.1)

alpha = inside.astype(float)
rgba = np.dstack([col * alpha[..., None], alpha])
img = Image.fromarray((rgba * 255).round().astype(np.uint8), "RGBA")
# downsample in premultiplied space, then un-premultiply
img = img.resize((size, size), Image.LANCZOS)
a = np.asarray(img).astype(float)
al = a[..., 3:4] / 255
a[..., :3] = np.where(al > 0, a[..., :3] / np.maximum(al, 1e-6), 0)
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA").save(out)
print("wrote", out)
