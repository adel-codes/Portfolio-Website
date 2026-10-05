"""Draw the Huon pine cross-section (the 'round') as SVG from measured ring widths."""
import math, sys, json
import numpy as np
from rings import parse_rwl, cross_section, catmull_rom_path

def build(widths, years, size=2600, ink="#d4b26a", ground=None, seed=7, theta0=0.0,
          annual_alpha=0.17, decade_alpha=0.92, decade_w=1.25, annual_w=0.55, checks=True, rays=True):
    th, R, i0 = cross_section(widths, seed=seed, theta0=theta0)
    n = len(widths)
    rng = np.random.default_rng(seed + 1)
    # bark: thin, irregular band outside the last ring
    rmax_ring = R[-1]
    bark = rmax_ring * (1 + 0.022 + 0.010 * np.sin(5 * th + 1.3) + 0.006 * rng.normal(0, 1, len(th)).cumsum() / 18)
    bark = np.convolve(np.r_[bark[-6:], bark, bark[:6]], np.ones(7) / 7, mode="same")[6:-6]
    scale = (size * 0.47) / bark.max()
    cx = cy = size / 2
    X = lambda r, t: cx + r * scale * np.cos(t)
    Y = lambda r, t: cy + r * scale * np.sin(t)
    step = 2  # use every 2nd angle sample for the paths; curves stay smooth
    idx = np.arange(0, len(th), step)
    parts = []
    # cracks (checks): drying cracks that open from the bark inward
    crack_defs = [(1.25, 0.58, 0.022), (2.55, 0.36, 0.015), (4.05, 0.48, 0.018), (5.35, 0.22, 0.010)]
    mask = ""
    if checks:
        polys = []
        for ang, depth, half in crack_defs:
            k_in = int(n * (1 - depth))
            ts = np.linspace(ang - half, ang + half, 9)
            outer = [(X(np.interp(t % (2 * math.pi), th, bark, period=2 * math.pi) * 1.004, t), Y(np.interp(t % (2 * math.pi), th, bark, period=2 * math.pi) * 1.004, t)) for t in ts]
            tip_r = R[k_in, int((ang % (2 * math.pi)) / (2 * math.pi) * len(th)) % len(th)]
            tip = (X(tip_r, ang + 0.004), Y(tip_r, ang + 0.004))
            # slightly jagged flanks
            left, right = [], []
            edge_r = float(np.interp(ang % (2 * math.pi), th, bark, period=2 * math.pi))
            for f in np.linspace(0, 1, 7)[1:-1]:
                rr = tip_r + (edge_r - tip_r) * f
                wob = rng.normal(0, half * 0.12)
                left.append((X(rr, ang - half * f * 0.95 + wob), Y(rr, ang - half * f * 0.95 + wob)))
                right.append((X(rr, ang + half * f * 0.95 + wob), Y(rr, ang + half * f * 0.95 + wob)))
            pts = [tip] + left + outer[:1] + outer + outer[-1:] + right[::-1]
            polys.append(pts)
        mask = "<mask id='m'><rect width='%d' height='%d' fill='white'/>%s</mask>" % (size, size, "".join(
            "<polygon fill='black' points='%s'/>" % " ".join(f"{x:.1f},{y:.1f}" for x, y in p) for p in polys))
        def flank(p):
            k = (len(p) - 1) // 2
            return p
        crack_lines = "".join(
            "<polyline fill='none' stroke='%s' stroke-opacity='0.5' stroke-width='0.9' points='%s'/>" % (ink, " ".join(f"{x:.1f},{y:.1f}" for x, y in seg))
            for p in polys for seg in (p[:6], [p[0]] + p[-5:]))
    # annual rings (faint) and decade rings (strong)
    ann, dec_strong, dec_soft = [], [], []
    dec_idx = [k for k in range(n) if years[k] % 10 == 9 or k == n - 1]
    dec_w = np.array([widths[max(0, k - 9):k + 1].mean() for k in dec_idx])
    narrow = dec_w < np.percentile(dec_w, 40)
    for k in range(n):
        xs, ys = X(R[k, idx], th[idx]), Y(R[k, idx], th[idx])
        path = catmull_rom_path(xs, ys)
        if k in dec_idx:
            (dec_strong if narrow[dec_idx.index(k)] else dec_soft).append(path)
        else:
            ann.append(path)
    # pith: a small dark core with an irregular edge
    pith_r = R[2, idx] * 1.1
    pith = catmull_rom_path(X(pith_r, th[idx]), Y(pith_r, th[idx]))
    # rays: very faint radial lines, slightly irregular
    ray_svg = ""
    if rays:
        segs = []
        for t in np.linspace(0, 2 * math.pi, 300, endpoint=False) + rng.normal(0, 0.004, 300):
            edge = float(np.interp(t % (2 * math.pi), th, rmax_ring, period=2 * math.pi))
            r0 = edge * rng.uniform(0.08, 0.6)
            r1 = edge * rng.uniform(0.75, 1.0)
            segs.append(f"M{X(r0, t):.1f} {Y(r0, t):.1f}L{X(r1, t):.1f} {Y(r1, t):.1f}")
        ray_svg = "<path d='%s' stroke='%s' stroke-opacity='0.07' stroke-width='0.6' fill='none'/>" % ("".join(segs), ink)
    # bark: outline plus short radial hatching
    bx, by = X(bark[idx], th[idx]), Y(bark[idx], th[idx])
    bark_path = catmull_rom_path(bx, by)
    hatch = []
    for t in np.linspace(0, 2 * math.pi, 900, endpoint=False):
        i = int(t / (2 * math.pi) * len(th)) % len(th)
        r0, r1 = R[-1, i], bark[i]
        f0, f1 = sorted(rng.uniform(0.05, 0.95, 2))
        hatch.append(f"M{X(r0 + (r1 - r0) * f0, t):.1f} {Y(r0 + (r1 - r0) * f0, t):.1f}L{X(r0 + (r1 - r0) * f1, t):.1f} {Y(r0 + (r1 - r0) * f1, t):.1f}")
    bg = f"<rect width='{size}' height='{size}' fill='{ground}'/>" if ground else ""
    svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='{size}' height='{size}' viewBox='0 0 {size} {size}'>
<defs>{mask}</defs>{bg}
<g mask='url(#m)' fill='none' stroke='{ink}' stroke-linejoin='round'>
{ray_svg}
<path d='{"".join(ann)}' stroke-opacity='{annual_alpha}' stroke-width='{annual_w}'/>
<path d='{"".join(dec_soft)}' stroke-opacity='{decade_alpha * 0.72}' stroke-width='{decade_w * 0.9}'/>
<path d='{"".join(dec_strong)}' stroke-opacity='{decade_alpha}' stroke-width='{decade_w * 1.15}'/>
<path d='{"".join(hatch)}' stroke-opacity='0.35' stroke-width='0.7'/>
<path d='{bark_path}' stroke-opacity='0.9' stroke-width='1.4'/>
<path d='{pith}' fill='{ink}' fill-opacity='0.55' stroke='none'/>
</g>
{crack_lines if checks else ''}
</svg>"""
    meta = {"size": size, "scale": scale, "cx": cx, "cy": cy, "theta0": theta0, "i0": int(i0),
            "core_r_mm": R[:, i0].tolist(), "bark_r_mm": float(bark[i0]), "years": [int(v) for v in years]}
    return svg, meta

if __name__ == "__main__":
    S = sys.argv[1]
    out = sys.argv[2]
    d = parse_rwl(S + "aus123c.rwl")
    years, w = d["PEB07A"]
    variant = sys.argv[3] if len(sys.argv) > 3 else "dark"
    ink = "#d4b26a" if variant == "dark" else "#17201b"
    svg, meta = build(w, years, ink=ink, annual_alpha=0.17 if variant == "dark" else 0.13)
    open(out, "w").write(svg)
    json.dump(meta, open(out.replace(".svg", ".json"), "w"))
    print("wrote", out, len(svg) // 1024, "KB")
