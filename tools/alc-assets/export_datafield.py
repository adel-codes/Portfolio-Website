"""Encode the hero's data field for the page: AVIF and WebP at 2400 and 1600.

  python3 export_datafield.py <data-field.png> <img_dir>

The PNG from gen_datafield.mjs has a transparent ground, so the navy of the
hero shows through and the field can move as its own plane.
"""
import os
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
for w in (2400, 1600):
    h = round(im.height * w / im.width)
    r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
    r.save(os.path.join(out, f"data-field-{w}.avif"), "AVIF", quality=50, speed=4)
    r.save(os.path.join(out, f"data-field-{w}.webp"), "WEBP", quality=72, method=6, alpha_quality=80)
    print(w, os.path.getsize(os.path.join(out, f"data-field-{w}.avif")) // 1024, "KB avif,",
          os.path.getsize(os.path.join(out, f"data-field-{w}.webp")) // 1024, "KB webp")
