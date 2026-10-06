"""Crop, grade and encode every photograph the site uses, from photos.json.

  python3 photos.py <source_dir> <img_dir>

<source_dir> holds the original files, named as in photos.json ("src"); the
"url" field says where each one came from. Writes
<img_dir>/photos/<key>-<crop>-<width>.avif and .webp.

A crop is [aspect, cx, cy, zoom]: width over height, the crop's centre as a
fraction of the source, and how much tighter than the largest crop of that
aspect that fits (1 is the largest).

Grades, so photos from different sources sit together on the navy:
  clinic   the clinic's own photos, left nearly as they are
  place    street photos: a little less saturated, shadows toward navy,
           highlights toward warm ivory
  archive  black and white: a navy-to-ivory duotone
"""
import json
import os
import sys

import numpy as np
from PIL import Image

NAVY = np.array([11, 21, 38]) / 255.0
IVORY = np.array([243, 233, 214]) / 255.0
WIDTHS = {"tall": (480, 960), "wide": (800, 1400, 1920), "card": (360, 720), "band": (960, 1920), "full": (1000, 1600)}


def crop(im, aspect, cx, cy, zoom):
    w, h = im.size
    cw = min(w, h * aspect) / zoom
    ch = cw / aspect
    x0 = min(max(cx * w - cw / 2, 0), w - cw)
    y0 = min(max(cy * h - ch / 2, 0), h - ch)
    return im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))


def grade(im, kind):
    a = np.asarray(im.convert("RGB"), dtype=np.float64) / 255.0
    lum = (a @ np.array([0.2126, 0.7152, 0.0722]))[..., None]
    if kind == "archive":
        t = np.clip((lum - 0.04) / 0.92, 0, 1) ** 0.95
        out = NAVY + (IVORY - NAVY) * t
    elif kind == "place":
        a = lum + (a - lum) * 0.8                      # a little less colour
        ws = (1 - lum) ** 2 * 0.32                      # shadows toward navy
        wh = lum ** 2 * 0.16                            # highlights toward ivory
        a = a * (1 - ws) + NAVY * ws
        a = a * (1 - wh) + IVORY * wh
        out = 0.035 + 0.965 * (0.5 + (a - 0.5) * 1.04)   # a touch of contrast, blacks lifted
    else:
        out = a * 0.985 + NAVY * 0.015 * (1 - lum)
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


def main(src_dir, img_dir):
    here = os.path.dirname(os.path.abspath(__file__))
    spec = json.load(open(os.path.join(here, "photos.json")))
    out_dir = os.path.join(img_dir, "photos")
    os.makedirs(out_dir, exist_ok=True)
    index = {}
    for p in spec["photos"]:
        im = Image.open(os.path.join(src_dir, p["src"])).convert("RGB")
        for name, (aspect, cx, cy, zoom) in p["crops"].items():
            c = grade(crop(im, aspect, cx, cy, zoom), p["grade"])
            widths = sorted({min(w, c.width) for w in WIDTHS[name]})
            for w in widths:
                r = c.resize((w, round(w / aspect)), Image.LANCZOS) if w != c.width else c
                base = os.path.join(out_dir, f"{p['key']}-{name}-{w}")
                r.save(base + ".avif", "AVIF", quality=52, speed=4)
                r.save(base + ".webp", "WEBP", quality=74, method=6)
                print(f"{p['key']}-{name}-{w}", r.size, os.path.getsize(base + ".avif") // 1024, "KB avif")
            index[f"{p['key']}-{name}"] = {"widths": widths, "aspect": aspect, "h": round(widths[-1] / aspect)}
    # the page builder reads this to write srcset and intrinsic sizes
    json.dump(index, open(os.path.join(out_dir, "index.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
