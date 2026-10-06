"""Encode the Annerley act's map for the page: AVIF and WebP at 4096 and 2048.

  python3 export_place.py <site_dir>

Reads the PNG that gen_place.mjs leaves in assets/img/place/ and removes it.
"""
import os
import sys
from PIL import Image

out = os.path.join(sys.argv[1], "assets", "img", "place")
src = os.path.join(out, "_map.png")
im = Image.open(src).convert("RGB")
for w in (4096, 2048):
    r = im if w == im.width else im.resize((w, w), Image.LANCZOS)
    base = os.path.join(out, f"annerley-{w}")
    r.save(base + ".avif", "AVIF", quality=55, speed=4)
    r.save(base + ".webp", "WEBP", quality=80, method=6)
    print(w, os.path.getsize(base + ".avif") // 1024, "KB avif,", os.path.getsize(base + ".webp") // 1024, "KB webp")
os.remove(src)
