"""The doctors' portraits, from the image supplied with the brief.

Source: data/doctors-supplied.webp (two profile cards, 1052 x 927). Each
photo is cropped just inside its card edge and given one shared, light
print grade so the two read as a pair on the site: a touch less saturation,
a slightly cooler white point to sit with the navy, and fine grain so the
modest source resolution reads as print rather than blur. Faces, framing
and colour are otherwise left as photographed. Nothing is generated.

  python3 portraits.py data/doctors-supplied.webp <out_dir>
"""
import os, sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
im = Image.open(src).convert("RGB")
# card photo areas measured on the supplied image: x 19..359, y 10..463 and 466..920;
# cropped 6 px inside each edge to clear the card's rounded corners and borders
crops = {"dr-raman-bohra": (25, 16, 353, 457), "dr-rekha-bohra": (25, 472, 353, 914)}
rng = np.random.default_rng(4)
for name, box in crops.items():
    p = im.crop(box)
    p = ImageEnhance.Color(p).enhance(0.88)
    p = ImageEnhance.Contrast(p).enhance(1.04)
    a = np.asarray(p).astype(np.float32)
    a[..., 0] *= 0.985; a[..., 2] *= 1.012                     # a slightly cooler white point
    for w, tag in ((p.size[0], "1x"), (int(p.size[0] * 1.6), "2x")):
        h = int(round(w * p.size[1] / p.size[0]))
        r = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((w, h), Image.LANCZOS)
        if tag == "2x":
            r = r.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
        g = np.asarray(r).astype(np.float32)
        g += rng.normal(0, 3.2, g.shape[:2])[..., None]          # fine monochrome grain
        r = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8))
        f = os.path.join(out, f"{name}-{tag}.webp")
        r.save(f, "WEBP", quality=84, method=6)
        r.save(f.replace(".webp", ".jpg"), "JPEG", quality=86, optimize=True, progressive=True)
        print(os.path.basename(f), r.size, os.path.getsize(f) // 1024, "KB")
