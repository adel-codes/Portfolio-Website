"""The clinic mark: four rings of the PEB07A round with the core line drawn
pith to bark along the measured radius, the same line the home page extracts.

  mark.svg     64 x 64, rings in currentColor, core in var(--accent)
  favicon.svg  32 x 32, two rings and the core, with a dark-mode variant

  python3 gen_mark.py <rings_dir/> <out_dir/>
"""
import math, sys, os
import numpy as np
from rings import parse_rwl, cross_section, catmull_rom_path


def rings_at(widths, fracs, n_theta=720):
    th, R, i0 = cross_section(widths, n_theta=n_theta, seed=7, theta0=0.0)
    cum = R[:, i0] / R[-1, i0]
    picks = [int(np.searchsorted(cum, f)) for f in fracs]
    picks = [min(p, len(widths) - 1) for p in picks]
    return th, R, i0, picks


def ring_path(th, r, cx, cy, k, step=8, prec=2):
    idx = np.arange(0, len(th), step)
    xs = cx + r[idx] * k * np.cos(th[idx])
    ys = cy + r[idx] * k * np.sin(th[idx])
    return catmull_rom_path(xs, ys, closed=True, prec=prec)


def build(widths):
    th, R, i0, picks = rings_at(widths, [0.30, 0.56, 0.80, 1.0])
    rmax = R[-1].max()
    # mark, 64 x 64
    k = 27.5 / rmax
    cx, cy = 32 - (R[-1, i0] - rmax) * k * 0.0, 32
    widths_ = [1.5, 1.5, 1.6, 2.1]
    rings = "".join(
        f"<path d='{ring_path(th, R[p], cx, cy, k, step=20, prec=1)}' stroke-width='{w}'/>" for p, w in zip(picks, widths_))
    bark_x = cx + R[-1, i0] * k
    mark = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none' stroke='currentColor' "
            "stroke-linejoin='round' aria-hidden='true' focusable='false'>"
            f"{rings}"
            f"<path class='mark-core' d='M{cx:.2f} {cy:.2f}H{bark_x + 2.2:.2f}' stroke='var(--accent, #d4b26a)' stroke-width='2.6' stroke-linecap='square'/>"
            f"<circle cx='{cx:.2f}' cy='{cy:.2f}' r='2.4' fill='currentColor' stroke='none'/>"
            "</svg>")
    # favicon, 32 x 32
    th2, R2, i02, picks2 = rings_at(widths, [0.5, 1.0])
    k2 = 13.4 / R2[-1].max()
    c = 16
    fav_rings = "".join(f"<path class='r' d='{ring_path(th2, R2[p], c, c, k2, step=24, prec=1)}' stroke-width='{w}'/>"
                        for p, w in zip(picks2, (2.0, 2.4)))
    bx = c + R2[-1, i02] * k2
    favicon = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'>"
               "<style>.r{stroke:#17201b}.c{stroke:#8a6a22}.p{fill:#17201b}"
               "@media (prefers-color-scheme:dark){.r{stroke:#e8e6dd}.c{stroke:#d4b26a}.p{fill:#e8e6dd}}</style>"
               f"{fav_rings}"
               f"<path class='c' d='M{c} {c}H{bx + 1.6:.2f}' stroke-width='2.8' stroke-linecap='square'/>"
               f"<circle class='p' cx='{c}' cy='{c}' r='2.2'/>"
               "</svg>")
    # the assessment's progress glyph: five rings of the same round, one per
    # step, drawn as each step is completed (pathLength=1 so CSS can draw them)
    th3, R3, i03, picks3 = rings_at(widths, [0.2, 0.4, 0.6, 0.8, 1.0])
    k3 = 54 / R3[-1].max()
    rings3 = "".join(
        f"<path class='pr pr-{n}' pathLength='1' d='{ring_path(th3, R3[p], 60, 60, k3, step=12, prec=1)}'/>" for n, p in enumerate(picks3))
    bx3 = 60 + R3[-1, i03] * k3
    progress = ("<svg class='progress-rings' viewBox='0 0 120 120' fill='none' aria-hidden='true' focusable='false'>"
                f"{rings3}<path class='pr-core' pathLength='1' d='M60 60H{bx3 + 3:.2f}'/><circle class='pr-pith' cx='60' cy='60' r='2.6'/></svg>")
    return mark, favicon, progress


if __name__ == "__main__":
    d = parse_rwl(sys.argv[1] + "aus123c.rwl")
    years, w = d["PEB07A"]
    mark, fav, progress = build(w)
    out = sys.argv[2]
    open(os.path.join(out, "mark.svg"), "w").write(mark)
    open(os.path.join(out, "favicon.svg"), "w").write(fav)
    open(os.path.join(out, "progress-rings.svg"), "w").write(progress)
    print("mark", len(mark), "bytes; favicon", len(fav), "bytes")
