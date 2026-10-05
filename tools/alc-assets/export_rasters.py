"""Export web rasters of the round from the 2600 px renders.

  round-1400.avif / round-1000.avif   the sharp mid plane (gold ink, alpha)
  round-1000.webp                     fallback for browsers without AVIF
  round-far.webp                      the far plane: a macro crop of the outer
                                      rings and a check, defocused and dimmed

  python3 export_rasters.py <round-dark.png> <out_dir/>
"""
import sys, os
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
for px, q in ((1400, 55), (1000, 50)):
    im.resize((px, px), Image.LANCZOS).save(os.path.join(out, f"round-{px}.avif"), "AVIF", quality=q, speed=4)
im.resize((1000, 1000), Image.LANCZOS).save(os.path.join(out, "round-1000.webp"), "WEBP", quality=74, method=6, alpha_quality=85)

# far plane: lower-left quadrant around the second check, 2x magnified then defocused
S = im.size[0]
box = (int(S * 0.04), int(S * 0.50), int(S * 0.54), int(S * 1.00))
far = im.crop(box).resize((1300, 1300), Image.LANCZOS).filter(ImageFilter.GaussianBlur(5.5))
r, g, b, a = far.split()
a = a.point(lambda v: int(v * 0.55))
Image.merge("RGBA", (r, g, b, a)).resize((1000, 1000), Image.LANCZOS).save(os.path.join(out, "round-far.webp"), "WEBP", quality=70, method=6, alpha_quality=70)
for f in sorted(os.listdir(out)):
    if f.startswith("round-"):
        print(f, os.path.getsize(os.path.join(out, f)) // 1024, "KB")
