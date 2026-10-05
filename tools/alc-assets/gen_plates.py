"""The four program plates, drawn from the same Huon pine as the hero round.

  tracheids   Fig. IV-a  transverse section across three measured rings (IV therapy)
  branchlet   Fig. P-a   a pendulous branchlet with appressed scale leaves (peptides)
  crossdate   Fig. T-a   two cores from tree PEB07 matched ring by ring (testosterone)
  ledger      Fig. W-a   1,010 years of PEB07A set a century to a line (weight)

Each plate is an 800 x 1000 SVG with a transparent ground. Labels inside the
SVG use an embedded subset of Azeret Mono, so they match the page when the
plate is loaded through <img>.

  python3 gen_plates.py <rings_dir/> <out_dir/> [light|dark]
"""
import math, sys, os
import numpy as np
from rings import parse_rwl, catmull_rom_path
from svgfont import face

W, H = 800, 1000
INKS = {
    "light": dict(ink="#17201b", accent="#7d5f1f", wall=0.20, line=0.78),
    "dark": dict(ink="#e8e6dd", accent="#d4b26a", wall=0.16, line=0.72),
}


def svg_open(labels_text, extra_defs=""):
    style = "<style>%s text{font-family:ALCMono,monospace;font-variant-numeric:tabular-nums}</style>" % face(labels_text)
    return (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}'>"
            f"<defs>{style}{extra_defs}</defs>")


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# --------------------------------------------------------------------------
# Fig. IV-a: tracheids in transverse section
# --------------------------------------------------------------------------
def tracheids(widths, years, ink, accent, wall_a, line_a, seed=11):
    """Radial files of tracheids, pith to the left, bark to the right.

    Ring widths are the measured ones for the three years shown; cell counts
    and cell shapes are illustrative (earlywood large and thin-walled,
    latewood flattened and thick-walled). File boundaries wander, so the
    section reads as tissue rather than as a grid.
    """
    rng = np.random.default_rng(seed)
    x0, x1, y0, y1 = 24, 776, 100, 880
    lead, tail = 0.07, 0.09                      # partial rings either side, mm
    total = lead + sum(widths) + tail
    s = (x1 - x0) / total                        # px per mm
    mean_tan = 0.0262                            # tangential width of a file, mm (illustrative)
    xs = np.linspace(x0, x1, 189)

    def wave(amp):
        out = np.zeros_like(xs)
        for lam in (rng.uniform(180, 320), rng.uniform(70, 130)):
            out += amp * rng.uniform(0.5, 1.0) * np.sin(2 * math.pi * xs / lam + rng.uniform(0, 6.3))
        return out

    def ring_cells(w, n_mean, jitter):
        n = max(6, int(round(w / n_mean + rng.normal(0, 0.7))))
        f = (np.arange(n) + 0.5) / n
        radial = 1.0 - 0.70 * smoothstep(0.55, 1.0, f)          # latewood flattens
        radial *= 1 + rng.normal(0, jitter, n)
        radial = radial / radial.sum() * w
        wall = 0.075 + 0.21 * smoothstep(0.52, 1.0, f)          # walls thicken
        return list(zip(radial, wall))

    def file_cells(is_ray):
        cells = []
        if is_ray:
            x_mm = 0.0
            while x_mm < total:
                L = rng.uniform(0.05, 0.085)
                cells.append((min(L, total - x_mm), 0.05))
                x_mm += L
            return cells
        lw = ring_cells(lead * 2.2, 0.021, 0.07)
        part = lw[-max(1, len(lw) // 2):]
        sc = lead / sum(c[0] for c in part)
        cells += [(c[0] * sc, c[1]) for c in part]
        for w in widths:
            cells += ring_cells(w, 0.0238, 0.09)
        acc = 0.0
        for c in ring_cells(tail * 3.0, 0.0238, 0.09):
            if acc + c[0] > tail:
                cells.append((tail - acc, c[1]))
                break
            cells.append(c)
            acc += c[0]
        return cells

    # file boundaries: cumulative mean positions, each with its own small wander
    widths_px, rays = [], []
    next_ray = int(rng.integers(3, 7))
    acc = y0 - 6
    j = 0
    while acc < y1 + 6:
        is_ray = j == next_ray
        if is_ray:
            next_ray = j + int(rng.integers(5, 10))
        wpx = mean_tan * s * (rng.uniform(0.32, 0.40) if is_ray else rng.uniform(0.86, 1.14))
        widths_px.append(wpx)
        rays.append(is_ray)
        acc += wpx
        j += 1
    base = np.r_[y0 - 6, y0 - 6 + np.cumsum(widths_px)]
    bnd = [b + wave(2.2) for b in base]
    for k in range(1, len(bnd)):
        bnd[k] = np.maximum(bnd[k], bnd[k - 1] + widths_px[k - 1] * 0.6)
    fills, lumens = [], []
    for j, is_ray in enumerate(rays):
        top, bot = bnd[j], bnd[j + 1]
        fills.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in zip(xs, top)) + "L" +
                     "L".join(f"{x:.1f} {y:.1f}" for x, y in zip(xs[::-1], bot[::-1])) + "Z")
        T = lambda x, top=top: float(np.interp(x, xs, top))
        B = lambda x, bot=bot: float(np.interp(x, xs, bot))
        fx = x0
        for radial, wall in file_cells(is_ray):
            cw = radial * s
            xa, xb = fx, min(x1, fx + cw)
            fx += cw
            if xb - xa < 1.4:
                continue
            th = (B(xa) + B(xb) - T(xa) - T(xb)) / 2
            t = 0.9 if is_ray else wall * min(th, (xb - xa) * 2.0)
            t = max(0.85, min(t, (xb - xa) * 0.34, th * 0.34))
            q = [(xa + t, T(xa) + t), (xb - t, T(xb) + t), (xb - t, B(xb) - t), (xa + t, B(xa) - t)]
            wl, hl = q[1][0] - q[0][0], q[3][1] - q[0][1]
            if wl < 0.9 or hl < 0.9:
                continue
            jit = 0.06 if not is_ray else 0.02
            q = [(x + wl * rng.normal(0, jit), y + hl * rng.normal(0, jit)) for x, y in q]
            r = min(wl, hl) * (0.38 if wall < 0.12 else 0.26)
            d = []
            for k in range(4):
                p_prev, p, p_next = q[k - 1], q[k], q[(k + 1) % 4]
                def toward(a, b, dist):
                    L = math.hypot(b[0] - a[0], b[1] - a[1]) or 1
                    return (a[0] + (b[0] - a[0]) * dist / L, a[1] + (b[1] - a[1]) * dist / L)
                a = toward(p, p_prev, r)
                b = toward(p, p_next, r)
                d.append(("M" if k == 0 else "L") + f"{a[0]:.1f} {a[1]:.1f}Q{p[0]:.1f} {p[1]:.1f} {b[0]:.1f} {b[1]:.1f}")
            d.append("Z")
            lumens.append("".join(d))
    bounds = [x0 + lead * s]
    for w in widths:
        bounds.append(bounds[-1] + w * s)
    labels = []
    for k, yr in enumerate(years):
        cx = (bounds[k] + bounds[k + 1]) / 2
        labels.append(f"<text x='{cx:.1f}' y='58' font-size='21' text-anchor='middle' fill='{ink}' fill-opacity='0.86'>{yr}</text>")
    ticks = "".join(f"M{b:.1f} 72V90" for b in bounds)
    sb = 0.1 * s
    scale = (f"<path d='M{x0:.1f} 934H{x0 + sb:.1f}M{x0:.1f} 926V942M{x0 + sb:.1f} 926V942' stroke='{ink}' stroke-width='2' fill='none'/>"
             f"<text x='{x0 + sb + 14:.1f}' y='941' font-size='20' fill='{ink}' fill-opacity='0.86'>0.1 mm</text>")
    # the lumen outlines are stored once: used as the stroke, and as a mask that cuts them out of the walls
    defs = (f"<clipPath id='f'><rect x='{x0}' y='{y0}' width='{x1 - x0}' height='{y1 - y0}'/></clipPath>"
            f"<path id='lum' d='{''.join(lumens)}'/>"
            f"<mask id='cut'><rect width='{W}' height='{H}' fill='white'/><use href='#lum' fill='black'/></mask>")
    clip = defs
    body = (f"<g clip-path='url(#f)'><path d='{''.join(fills)}' fill='{ink}' fill-opacity='{wall_a}' mask='url(#cut)'/>"
            f"<use href='#lum' stroke='{ink}' stroke-opacity='{line_a}' stroke-width='1.2' fill='none' stroke-linejoin='round'/></g>"
            f"<path d='{ticks}' stroke='{accent}' stroke-width='2.2'/>")
    txt = "".join(str(y) for y in years) + "0.1 mm"
    return svg_open(txt, clip) + body + "".join(labels) + scale + "</svg>"


# --------------------------------------------------------------------------
# Fig. P-a: a pendulous branchlet with appressed scale leaves
# --------------------------------------------------------------------------
def branchlet(ink, accent, line_a, seed=5):
    """One sprig: an arching stem with alternate side shoots that hang as whips.

    Illustrative, not to scale. Each shoot is drawn the pen-and-ink way for
    scale-leaved conifers: a clean outline, with short alternating diagonal
    marks for the small scale leaves pressed close along it.
    """
    rng = np.random.default_rng(seed)
    paths = []

    def grow(p, ang, length, thick, depth, droop, kids_every):
        pts, ths = [np.array(p, float)], [thick]
        a = ang
        step = 2.0
        n = int(length / step)
        kids = []
        next_kid = kids_every * rng.uniform(0.6, 0.9)
        side = 1
        run = 0.0
        for i in range(n):
            t = i / max(1, n - 1)
            a += (math.pi / 2 - a) * droop * (0.2 + 1.8 * t) + rng.normal(0, 0.006)
            pts.append(pts[-1] + step * np.array([math.cos(a), math.sin(a)]))
            ths.append(thick * (1 - 0.66 * t ** 1.15))
            run += step
            if depth < 2 and run >= next_kid and 0.05 < t < 0.78:
                upper = side < 0          # the side of the stem facing up
                spread = rng.uniform(0.28, 0.42) if upper else rng.uniform(0.62, 0.9)
                L = length * (0.56 if depth == 0 else 0.40) * (1 - 0.5 * t) * rng.uniform(0.85, 1.1)
                kids.append((pts[-1].copy(), a + side * spread, L, ths[-1] * 0.7, depth + 1))
                side = -side
                run = 0.0
                next_kid = kids_every * rng.uniform(0.85, 1.2)
        paths.append((np.array(pts), np.array(ths)))
        for (q, a2, L, th2, d2) in kids:
            grow(q, a2, L, th2, d2, droop * (3.2 if d2 == 1 else 1.7), kids_every * 0.55)

    grow((0, 0), 0.05, 1150, 15.0, 0, droop=0.0042, kids_every=104)
    allp = np.vstack([p for p, _ in paths])
    mn, mx = allp.min(0), allp.max(0)
    k = min((W - 100) / (mx[0] - mn[0]), (H - 100) / (mx[1] - mn[1]))
    off = np.array([(W - (mx[0] - mn[0]) * k) / 2, (H - (mx[1] - mn[1]) * k) / 2]) - mn * k
    paths[:] = [(p * k + off, t * k) for p, t in paths]
    edges, marks = [], []
    for pts, ths in paths:
        d = np.gradient(pts, axis=0)
        tng = d / (np.hypot(d[:, 0], d[:, 1])[:, None] + 1e-9)
        nrm = np.stack([-tng[:, 1], tng[:, 0]], axis=1)
        for sgn in (1, -1):
            e = pts + sgn * nrm * (ths[:, None] * 0.5)
            edges.append(catmull_rom_path(list(e[::3, 0]) + [e[-1, 0]], list(e[::3, 1]) + [e[-1, 1]], closed=False))
        # close the tip
        tip = pts[-1] + tng[-1] * ths[-1] * 0.8
        a_, b_ = pts[-1] + nrm[-1] * ths[-1] * 0.5, pts[-1] - nrm[-1] * ths[-1] * 0.5
        edges.append(f"M{a_[0]:.1f} {a_[1]:.1f}Q{tip[0]:.1f} {tip[1]:.1f} {b_[0]:.1f} {b_[1]:.1f}")
        # scale marks: short diagonals from alternate edges, leaning toward the tip
        arc = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]
        pos, side = 0.0, 1
        while pos < arc[-1] - 2:
            i = int(np.searchsorted(arc, pos))
            th = ths[i]
            if th < 2.2:
                break
            c = pts[i]
            p0 = c + side * nrm[i] * th * 0.5
            p1 = c - side * nrm[i] * th * (0.02 + 0.08 * rng.random()) + tng[i] * th * 0.62
            marks.append(f"M{p0[0]:.1f} {p0[1]:.1f}L{p1[0]:.1f} {p1[1]:.1f}")
            pos += max(1.6, th * 0.42)
            side = -side
    body = (f"<path d='{''.join(edges)}' stroke='{ink}' stroke-opacity='{line_a}' stroke-width='1.25' fill='none' stroke-linecap='round'/>"
            f"<path d='{''.join(marks)}' stroke='{ink}' stroke-opacity='{line_a * 0.75:.2f}' stroke-width='0.95' fill='none' stroke-linecap='round'/>")
    return svg_open("") + body + "</svg>"


# --------------------------------------------------------------------------
# Fig. T-a: cross-dating two cores from the same tree
# --------------------------------------------------------------------------
def rel_width(w, k=11):
    pad = np.pad(w, (k // 2, k // 2), mode="edge")
    return np.array([w[i] / ((pad[i:i + k].sum() - w[i]) / (k - 1)) for i in range(len(w))])


def crossdate(sa, sb, a0, a1, ink, accent, line_a, label_a, label_b):
    (ya, wa), (yb, wb) = sa, sb
    ra, rb = dict(zip(ya, rel_width(wa))), dict(zip(yb, rel_width(wb)))
    WA, WB = dict(zip(ya, wa)), dict(zip(yb, wb))
    yrs = list(range(a0, a1 + 1))
    n = len(yrs)
    x0, x1 = 60, 740
    step = (x1 - x0) / (n - 1)
    X = {y: x0 + i * step for i, y in enumerate(yrs)}
    # skeleton plot: a line for each ring narrower than its neighbourhood,
    # longer the narrower it is (the usual 1 to 10 scale)
    def skel(R):
        q = np.percentile(list(R.values()), 30)
        lo = np.percentile(list(R.values()), 1)
        out = {}
        for y in yrs:
            if R[y] < q:
                out[y] = 1 + 9 * float(np.clip((q - R[y]) / (q - lo), 0, 1))
        return out
    ka, kb = skel(ra), skel(rb)
    both = sorted(y for y in ka if y in kb and ka[y] >= 3.5 and kb[y] >= 3.5)
    base_a, base_b, hmax = 452, 548, 26.0           # 10 units = 260 px
    els = []
    # graph-paper ticks under each plot
    tick = "".join(f"M{X[y]:.1f} {base_a:.1f}V{base_a + (9 if y % 10 == 0 else 4):.1f}" for y in yrs)
    tick += "".join(f"M{X[y]:.1f} {base_b:.1f}V{base_b - (9 if y % 10 == 0 else 4):.1f}" for y in yrs)
    els.append(f"<path d='M{x0 - 8} {base_a}H{x1 + 8}M{x0 - 8} {base_b}H{x1 + 8}{tick}' stroke='{ink}' stroke-opacity='0.55' stroke-width='1.2' fill='none'/>")
    # decade guides from the cores down to the baselines
    guides = "".join(f"M{X[y]:.1f} {base_a - 10 * hmax - 14:.1f}V{base_a:.1f}M{X[y]:.1f} {base_b:.1f}V{base_b + 10 * hmax + 14:.1f}" for y in yrs if y % 10 == 0)
    els.append(f"<path d='{guides}' stroke='{ink}' stroke-opacity='0.12' stroke-width='1' fill='none'/>")
    plain = "".join(f"M{X[y]:.1f} {base_a:.1f}V{base_a - v * hmax:.1f}" for y, v in ka.items() if y not in both)
    plain += "".join(f"M{X[y]:.1f} {base_b:.1f}V{base_b + v * hmax:.1f}" for y, v in kb.items() if y not in both)
    els.append(f"<path d='{plain}' stroke='{ink}' stroke-opacity='0.88' stroke-width='3.2' fill='none'/>")
    # matched years: both bars in the accent, joined across the axis below the dates
    hit = "".join(f"M{X[y]:.1f} {base_a:.1f}V{base_a - ka[y] * hmax:.1f}M{X[y]:.1f} {base_b:.1f}V{base_b + kb[y] * hmax:.1f}" for y in both)
    els.append(f"<path d='{hit}' stroke='{accent}' stroke-width='3.6' fill='none'/>")
    join = "".join(f"M{X[y]:.1f} 507V{base_b:.1f}" for y in both)
    els.append(f"<path d='{join}' stroke='{accent}' stroke-width='1.6' fill='none'/>")
    els.append("".join(f"<circle cx='{X[y]:.1f}' cy='516' r='4.4' fill='{accent}'/>" for y in both))
    # decade labels on the shared axis, above the joins
    for y in yrs:
        if y % 10 == 0:
            els.append(f"<text x='{X[y]:.1f}' y='488' font-size='19' text-anchor='middle' fill='{ink}' fill-opacity='0.8'>{y}</text>")
    # the two cores, with ring boundaries placed by measured width, and fan lines to the calendar
    def core(Wd, ytop, label, fan_to, up):
        ws = np.array([Wd[y] for y in yrs])
        cum = np.r_[0, np.cumsum(ws)]
        px = x0 - step / 2 + cum / cum[-1] * (x1 - x0 + step)
        hgt = 46
        out = [f"<rect x='{px[0]:.1f}' y='{ytop}' width='{px[-1] - px[0]:.1f}' height='{hgt}' rx='4' fill='{ink}' fill-opacity='0.07' stroke='{ink}' stroke-opacity='0.6' stroke-width='1.2'/>"]
        rings = "".join(f"M{px[i + 1]:.1f} {ytop + 4}L{px[i + 1] + 1.2:.1f} {ytop + hgt - 4}" for i in range(n - 1))
        out.append(f"<path d='{rings}' stroke='{ink}' stroke-opacity='0.55' stroke-width='1.1' fill='none'/>")
        # decade rings darker
        dec = "".join(f"M{px[i]:.1f} {ytop + 2}L{px[i] + 1.2:.1f} {ytop + hgt - 2}" for i, y in enumerate(yrs) if y % 10 == 0)
        out.append(f"<path d='{dec}' stroke='{ink}' stroke-opacity='0.95' stroke-width='1.8' fill='none'/>")
        # fan lines: from the start of each decade ring in the core to that year on the plot
        fan = []
        for i, y in enumerate(yrs):
            if y % 10 == 0:
                cx = (px[i] + px[i + 1]) / 2
                ey = ytop + (hgt if up else 0)
                fan.append(f"M{cx:.1f} {ey:.1f}L{X[y]:.1f} {fan_to:.1f}")
        out.append(f"<path d='{''.join(fan)}' stroke='{ink}' stroke-opacity='0.35' stroke-width='1' fill='none'/>")
        ly = ytop - 16 if up else ytop + hgt + 32
        out.append(f"<text x='{px[0]:.1f}' y='{ly}' font-size='19' fill='{ink}' fill-opacity='0.86'>{label}</text>")
        return "".join(out)
    els.append(core(WA, 96, label_a, base_a - 10 * hmax - 14, True))
    els.append(core(WB, 858, label_b, base_b + 10 * hmax + 14, False))
    txt = label_a + label_b + "".join(str(y) for y in yrs)
    return svg_open(txt) + "".join(els) + "</svg>", both, ka, kb


# --------------------------------------------------------------------------
# Fig. W-a: a thousand years set a century to a line
# --------------------------------------------------------------------------
def ledger(years, widths, ink, accent, line_a, span=30):
    W_ = dict(zip(years, widths))
    # smoothing: a centred running mean of `span` years, shrunk at the ends
    sm = {}
    for i, y in enumerate(years):
        lo, hi = max(0, i - span // 2), min(len(widths), i + span // 2 + 1)
        sm[y] = widths[lo:hi].mean()
    lo_w, hi_w = np.percentile(widths, 0.5), np.percentile(widths, 99.5)
    c0, c1 = years[0] // 100, years[-1] // 100
    rows = list(range(c0, c1 + 1))
    top, bot = 64, 960
    rh = (bot - top) / len(rows)
    x0, x1 = 128, 776
    step = (x1 - x0) / 100
    bars, trend, labels, bases = [], [], [], []
    for r, c in enumerate(rows):
        base = top + (r + 1) * rh - 12
        hmax = rh - 26
        bases.append(f"M{x0 - 4:.1f} {base:.1f}H{x1:.1f}")
        labels.append(f"<text x='{x0 - 22:.1f}' y='{base:.1f}' font-size='19' text-anchor='end' fill='{ink}' fill-opacity='0.82'>{c * 100}</text>")
        pts = []
        for k in range(100):
            y = c * 100 + k
            if y not in W_:
                continue
            x = x0 + k * step + step / 2
            v = (np.clip(W_[y], lo_w, hi_w) - lo_w) / (hi_w - lo_w)
            bars.append(f"M{x:.1f} {base:.1f}V{base - (0.12 + 0.88 * v) * hmax:.1f}")
            sv = (np.clip(sm[y], lo_w, hi_w) - lo_w) / (hi_w - lo_w)
            pts.append((x, base - (0.12 + 0.88 * sv) * hmax))
        if len(pts) > 2:
            xs, ys = zip(*pts)
            trend.append(catmull_rom_path(list(xs), list(ys), closed=False))
    body = (f"<path d='{''.join(bases)}' stroke='{ink}' stroke-opacity='0.4' stroke-width='1' fill='none'/>"
            f"<path d='{''.join(bars)}' stroke='{ink}' stroke-opacity='{line_a * 0.8:.2f}' stroke-width='2.4' fill='none'/>"
            f"<path d='{''.join(trend)}' stroke='{accent}' stroke-width='3' fill='none' stroke-linejoin='round' stroke-linecap='round'/>")
    txt = "".join(str(c * 100) for c in rows)
    return svg_open(txt) + body + "".join(labels) + "</svg>"


if __name__ == "__main__":
    rings_dir, out_dir = sys.argv[1], sys.argv[2]
    variant = sys.argv[3] if len(sys.argv) > 3 else "light"
    P = INKS[variant]
    os.makedirs(out_dir, exist_ok=True)
    d = parse_rwl(rings_dir + "aus123c.rwl")
    ya, wa = d["PEB07A"]
    yb, wb = d["PEB07B"]
    W_ = dict(zip(ya, wa))
    yrs3 = [1664, 1665, 1666]
    sfx = "" if variant == "light" else "-dark"
    open(f"{out_dir}/plate-tracheids{sfx}.svg", "w").write(
        tracheids([W_[y] for y in yrs3], yrs3, P["ink"], P["accent"], P["wall"], P["line"]))
    open(f"{out_dir}/plate-branchlet{sfx}.svg", "w").write(branchlet(P["ink"], P["accent"], P["line"]))
    svg, both, ka, kb = crossdate((ya, wa), (yb, wb), 1446, 1505, P["ink"], P["accent"], P["line"], "PEB07A", "PEB07B")
    open(f"{out_dir}/plate-crossdate{sfx}.svg", "w").write(svg)
    open(f"{out_dir}/plate-ledger{sfx}.svg", "w").write(ledger(ya, wa, P["ink"], P["accent"], P["line"]))
    print("widths", [round(W_[y], 3) for y in yrs3], "| matched narrow years", both,
          "| marks A", len(ka), "B", len(kb))
    for f in sorted(os.listdir(out_dir)):
        if f.startswith("plate-"):
            print(f, os.path.getsize(os.path.join(out_dir, f)) // 1024, "KB")
