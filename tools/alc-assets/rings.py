"""Ring-width data and cross-section geometry for the Australian Longevity Clinic assets.

Source data: NOAA NCEI World Data Service for Paleoclimatology, International
Tree-Ring Data Bank. Huon pine (Lagarostrobos franklinii, code LAFR), western
Tasmania. Collection AUS123C, Teepookana / Pearces Basin, investigator K. Allen.
Series PEB07A: 1,010 measured rings, AD 1003-2012, units 0.001 mm.
"""
import math, re
import numpy as np

def parse_rwl(path):
    """Parse a Tucson decadal .rwl file. Returns {series_id: (years, widths_mm)}."""
    raw, ends = {}, {}
    for line in open(path, encoding="latin-1"):
        line = line.rstrip("\n")
        if len(line) < 13:
            continue
        sid = line[:8].strip()
        try:
            year = int(line[8:12])
            vals = [int(v) for v in line[12:].split()]
        except ValueError:
            continue
        s = raw.setdefault(sid, {})
        for i, v in enumerate(vals):
            if v in (999, -9999):
                ends[sid] = v
                break
            s[year + i] = v
    out = {}
    for sid, d in raw.items():
        unit = 0.001 if ends.get(sid) == -9999 else 0.01
        yrs = np.array(sorted(d))
        out[sid] = (yrs, np.array([d[y] for y in yrs], dtype=float) * unit)
    return out


def smooth_walk(n, amp, corr, rng):
    """A slowly varying random series, used for gradual changes in ring shape."""
    x = np.zeros(n)
    v = 0.0
    for i in range(n):
        v = corr * v + (1 - corr) * rng.normal(0, 1)
        x[i] = v
    x = x / (np.std(x) + 1e-9) * amp
    return x


def cross_section(widths, n_theta=720, seed=7, theta0=math.pi):
    """Radii of every ring boundary at every angle.

    Ring widths along the core direction theta0 are exactly the measured ones;
    elsewhere they are modulated by slowly drifting low-order harmonics, so the
    round is eccentric and lobed the way real stems are, and no two rings cross.
    """
    rng = np.random.default_rng(seed)
    n = len(widths)
    th = np.linspace(0, 2 * math.pi, n_theta, endpoint=False)
    m = np.ones((n, n_theta))
    amps = [0.11, 0.035, 0.022, 0.014, 0.009, 0.006, 0.004]
    for j, a in enumerate(amps, start=1):
        coef = a + smooth_walk(n, a * 0.45, 0.995, rng)
        phase = rng.uniform(0, 2 * math.pi) + smooth_walk(n, 0.6 / j, 0.997, rng)
        m += coef[:, None] * np.cos(j * th[None, :] - phase[:, None])
    # fine, per-ring irregularity so lines read as drawn from wood, not a compass
    for j in range(8, 22):
        m += rng.normal(0, 0.006, (n, 1)) * np.cos(j * th[None, :] - rng.uniform(0, 6.28, (n, 1)))
    # a branch knot: a local bulge across a run of rings
    knot = np.exp(-((np.angle(np.exp(1j * (th - 0.9)))) / 0.30) ** 2)
    k0, k1 = int(n * 0.40), int(n * 0.62)
    m[k0:k1] += 0.32 * knot[None, :] * np.sin(np.linspace(0, math.pi, k1 - k0))[:, None]
    # near the pith the first rings are close to round; irregularity builds with age
    ramp = 0.35 + 0.65 * np.clip(np.arange(n) / (0.12 * n), 0, 1) ** 0.8
    m = 1 + (m - 1) * ramp[:, None]
    m = np.clip(m, 0.35, None)
    i0 = int(round(theta0 / (2 * math.pi) * n_theta)) % n_theta
    m = m / m[:, i0:i0 + 1]  # measured widths hold exactly along the core
    radii = np.cumsum(widths[:, None] * m, axis=0)
    return th, radii, i0


def catmull_rom_path(xs, ys, closed=True, prec=1):
    """Smooth SVG path through points (Catmull-Rom converted to cubic Bezier)."""
    n = len(xs)
    f = lambda v: f"{v:.{prec}f}"
    d = [f"M{f(xs[0])} {f(ys[0])}"]
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = (xs[i - 1], ys[i - 1]) if (closed or i > 0) else (xs[i], ys[i])
        p1 = (xs[i], ys[i])
        p2 = (xs[(i + 1) % n], ys[(i + 1) % n])
        p3 = (xs[(i + 2) % n], ys[(i + 2) % n]) if (closed or i + 2 < n) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    if closed:
        d.append("Z")
    return "".join(d)
