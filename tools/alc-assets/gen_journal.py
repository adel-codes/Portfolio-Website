"""One measured core per journal article, so no article needs a stock image.

Each strip is a different Huon pine series from the same two NOAA ITRDB
collections, drawn at a common length so they line up as a set. Ring lines
sit at the measured cumulative widths; dots follow the decade convention
(one per decade, two at fifty years, three per century, four per millennium).

  python3 gen_journal.py <rings_dir/> <out_dir/>   -> cores/<series>.svg + cores.json
"""
import json, os, sys
import numpy as np
from rings import parse_rwl

SERIES = [
    ("aus123c.rwl", "PEB30B"), ("aus118.rwl", "SRT554C"), ("aus123c.rwl", "PEB10A"), ("aus118.rwl", "ERC402A"),
    ("aus123c.rwl", "S407B"), ("aus118.rwl", "SRT114A"), ("aus123c.rwl", "PEB08A"), ("aus118.rwl", "SRT052A"),
    ("aus123c.rwl", "PEB21A"), ("aus118.rwl", "SRT026C"), ("aus123c.rwl", "S795A"), ("aus118.rwl", "SRT270B"),
    ("aus123c.rwl", "PEB11B"), ("aus123c.rwl", "S404A"), ("aus123c.rwl", "PEB517"), ("aus123c.rwl", "TPK02N"),
]
SITES = {"aus123c.rwl": ("Teepookana and Pearces Basin, Tasmania", "AUS123C"),
         "aus118.rwl": ("Stanley River, Tasmania", "AUS118")}


def strip(years, widths, L=1000.0, h=40.0, seed=1, ink="#0f1b2d", accent="#7d5f1f"):
    rng = np.random.default_rng(seed)
    cum = np.cumsum(widths)
    x = cum / cum[-1] * (L - 8) + 4
    top, bot = 6, h - 6
    soft, strong = [], []
    for xi, y in zip(x[:-1], years[:-1]):
        t = rng.normal(0, 0.5)
        (strong if y % 10 == 9 else soft).append(f"M{xi + t:.1f} {top + 1}L{xi - t:.1f} {bot - 1}")
    dots = []
    prev = np.r_[4, x[:-1]]
    for xa, xb, y in zip(prev, x, years):
        if y % 10:
            continue
        n = 4 if y % 1000 == 0 else 3 if y % 100 == 0 else 2 if y % 50 == 0 else 1
        cx = (xa + xb) / 2
        for j in range(n):
            dots.append(f"<circle cx='{cx:.1f}' cy='{h / 2 + (j - (n - 1) / 2) * 4.4:.1f}' r='1.05'/>")
    return (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {L:.0f} {h:.0f}' preserveAspectRatio='none' aria-hidden='true' focusable='false'>"
            f"<rect x='1' y='{top}' width='{L - 2:.0f}' height='{bot - top}' rx='3' fill='{ink}' fill-opacity='0.07' stroke='{ink}' stroke-opacity='0.55' stroke-width='1' vector-effect='non-scaling-stroke'/>"
            f"<path d='{''.join(soft)}' stroke='{ink}' stroke-opacity='0.34' stroke-width='0.6' vector-effect='non-scaling-stroke'/>"
            f"<path d='{''.join(strong)}' stroke='{ink}' stroke-opacity='0.85' stroke-width='1' vector-effect='non-scaling-stroke'/>"
            f"<g fill='{accent}'>{''.join(dots)}</g></svg>")


if __name__ == "__main__":
    rings_dir, out = sys.argv[1], sys.argv[2]
    os.makedirs(os.path.join(out, "cores"), exist_ok=True)
    cache, manifest = {}, []
    for k, (f, sid) in enumerate(SERIES):
        d = cache.setdefault(f, parse_rwl(rings_dir + f))
        years, w = d[sid]
        svg = strip(years, w, seed=k + 1)
        open(os.path.join(out, "cores", f"{sid}.svg"), "w").write(svg)
        site, coll = SITES[f]
        manifest.append({"series": sid, "first": int(years[0]), "last": int(years[-1]), "rings": int(len(w)),
                         "site": site, "collection": coll, "file": f"cores/{sid}.svg"})
    json.dump(manifest, open(os.path.join(out, "cores", "cores.json"), "w"), indent=1)
    print(len(manifest), "cores:", ", ".join(f"{m['series']} {m['first']}-{m['last']}" for m in manifest))
