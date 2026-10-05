"""Prepare the clinic's own logo for the site, without redrawing it.

Source: the logo the live site serves in its header (retrieved 2026-10-05),
https://d2xsxph8kpxj0f.cloudfront.net/310519663420495530/KCARSnqs6fkFJBLH482Y6i/alc-logo-ibYxeY3djea26he23Yuvgs.webp
saved as data/alc-logo-original.webp (1920 x 1920, a round medallion on a
white square).

The only change is the background: the white square outside the medallion's
gold rim is made transparent with a circular mask set a few pixels inside
the rim's outer edge, so no white fringe shows on the navy header. The
medallion's pixels are untouched. Outputs are resizes of that one cutout.

  python3 logo_cutout.py data/alc-logo-original.webp <out_dir>
"""
import os, sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32)
H, W, _ = a.shape

# find the medallion: everything that is not near-white
ink = (255 - a.min(axis=2)) > 18
ys, xs = np.nonzero(ink)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
# outer edge of the rim at 720 angles, then sit the mask just inside the smallest
ang = np.linspace(0, 2 * np.pi, 720, endpoint=False)
edge = []
for t in ang:
    for r in np.arange(min(W, H) / 2, min(W, H) / 2 - 140, -0.25):
        x, y = int(round(cx + r * np.cos(t))), int(round(cy + r * np.sin(t)))
        if 0 <= x < W and 0 <= y < H and ink[y, x]:
            edge.append(r)
            break
R = min(edge) - 2.5
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
alpha = np.clip((R - d) / 1.5 + 0.5, 0, 1)            # 1.5 px anti-aliased edge
rgba = np.dstack([a, alpha * 255]).astype(np.uint8)
cut = Image.fromarray(rgba, "RGBA")
half = int(np.ceil(R + 2))
box = (int(round(cx - half)), int(round(cy - half)), int(round(cx + half)), int(round(cy + half)))
cut = cut.crop(box)
print(f"centre ({cx:.1f}, {cy:.1f}), rim edge min {min(edge):.2f} median {np.median(edge):.2f}, mask radius {R:.2f}, crop {cut.size}")

for px in (64, 128, 256, 512, 1024):
    r = cut.resize((px, px), Image.LANCZOS)
    r.save(os.path.join(out, f"alc-medallion-{px}.png"), optimize=True)
    r.save(os.path.join(out, f"alc-medallion-{px}.webp"), "WEBP", quality=90, method=6, alpha_quality=100)

# favicons and touch icons are the same medallion, resized; the touch icon
# sits on the site's navy because iOS fills transparency with black
for px in (16, 32, 48):
    cut.resize((px, px), Image.LANCZOS).save(os.path.join(out, f"favicon-{px}.png"), optimize=True)
cut.resize((48, 48), Image.LANCZOS).save(os.path.join(out, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
for px in (180, 192, 512):
    bg = Image.new("RGBA", (px, px), (11, 21, 38, 255))
    m = cut.resize((int(px * 0.86), int(px * 0.86)), Image.LANCZOS)
    o = (px - m.size[0]) // 2
    bg.alpha_composite(m, (o, o))
    bg.convert("RGB").save(os.path.join(out, f"touch-icon-{px}.png"), optimize=True)
for f in sorted(os.listdir(out)):
    print(f, os.path.getsize(os.path.join(out, f)) // 1024, "KB")
