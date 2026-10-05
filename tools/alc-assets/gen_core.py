"""The increment core: every measured ring along the round's measured radius, pith to bark.

Marking follows the standard dendrochronology convention: one dot per decade,
two at each half-century, three per century and four per millennium.
"""
import json, sys, math
import numpy as np

def build(meta, ink="#d4b26a", unit=10.0, height=64):
    r = np.array(meta["core_r_mm"])            # outer edge of each ring along the core, mm from pith
    years = meta["years"]
    bark = meta["bark_r_mm"]
    L = bark * unit
    rng = np.random.default_rng(3)
    top, bot = 8, height - 8
    mid = height / 2
    lines_soft, lines_strong = [], []
    for k, (rr, y) in enumerate(zip(r, years)):
        x = rr * unit
        tilt = rng.normal(0, 0.9)               # ring boundaries cross a core at a slight angle
        seg = f"M{x + tilt:.1f} {top}L{x - tilt:.1f} {bot}"
        (lines_strong if y % 10 == 9 else lines_soft).append(seg)
    dots = []
    for rr, y, prev in zip(r, years, [0.0] + list(r[:-1])):
        if y % 10:
            continue
        n = 4 if y % 1000 == 0 else 3 if y % 100 == 0 else 2 if y % 50 == 0 else 1
        cx = (prev + rr) / 2 * unit             # the dot sits in the ring of that year
        for j in range(n):
            cy = mid + (j - (n - 1) / 2) * 5.2
            dots.append(f"<circle cx='{cx:.1f}' cy='{cy:.1f}' r='1.25'/>")
    bark_edge = "".join(f"L{L + rng.uniform(0, 14):.1f} {yy:.1f}" for yy in np.linspace(top, bot, 9))
    body = f"M0 {top + 3}Q0 {top} 3 {top}L{L} {top}{bark_edge}L3 {bot}Q0 {bot} 0 {bot - 3}Z"
    svg = (f"<svg class='core-svg' xmlns='http://www.w3.org/2000/svg' viewBox='-4 0 {L + 22:.0f} {height}' preserveAspectRatio='none' aria-hidden='true' focusable='false'>"
           f"<path class='core-body' d='{body}' fill='{ink}' fill-opacity='0.13' stroke='{ink}' stroke-opacity='0.65' stroke-width='1.2' vector-effect='non-scaling-stroke'/>"
           f"<path class='core-rings' d='{''.join(lines_soft)}' stroke='{ink}' stroke-opacity='0.42' stroke-width='0.6' vector-effect='non-scaling-stroke'/>"
           f"<path class='core-decades' d='{''.join(lines_strong)}' stroke='{ink}' stroke-opacity='0.9' stroke-width='1' vector-effect='non-scaling-stroke'/>"
           f"<g class='core-dots' fill='{ink}'>{''.join(dots)}</g>"
           f"<circle class='core-pith' cx='1.5' cy='{mid}' r='3' fill='{ink}'/>"
           "</svg>")
    # century positions as fractions of the core length, for labels set in HTML
    ticks = []
    for rr, y, prev in zip(r, years, [0.0] + list(r[:-1])):
        if y % 100 == 0:
            ticks.append({"year": y, "f": round(((prev + rr) / 2) / bark, 5)})
    return svg, ticks

if __name__ == "__main__":
    meta = json.load(open(sys.argv[1]))
    svg, ticks = build(meta)
    open(sys.argv[2], "w").write(svg)
    json.dump(ticks, open(sys.argv[2].replace(".svg", "-ticks.json"), "w"))
    print("core svg", len(svg) // 1024, "KB; centuries:", [t["year"] for t in ticks])
