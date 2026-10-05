"""A location plate for 628 Ipswich Road, Annerley, drawn from OpenStreetMap.

Data: (c) OpenStreetMap contributors, ODbL 1.0. The attribution is drawn on
the plate and repeated in the page caption.

  python3 gen_map.py <osm.json> <out.svg> [light|dark]

osm.json is an Overpass `out geom` export of highways, rail, waterways and
parks within about 1.7 km of the clinic (see the query in the README).
"""
import json, math, sys
import numpy as np
from svgfont import face

LAT0, LON0 = -27.51741, 153.03014          # 628 Ipswich Road (OSM way 37894700)
W, H = 1200, 900                            # px
SPAN_X = 2200.0                             # metres across the plate
M_PER_PX = SPAN_X / W
CX, CY = W * 0.46, H * 0.54                 # where the clinic sits on the plate

PAL = {
    "light": dict(ink="#0f1b2d", accent="#7d5f1f", ground="#e8eaee"),
    "dark": dict(ink="#e8e6dd", accent="#d4b26a", ground="#0b1526"),
}


def proj(lat, lon):
    x = (lon - LON0) * math.cos(math.radians(LAT0)) * 111320.0
    y = -(lat - LAT0) * 110574.0
    return CX + x / M_PER_PX, CY + y / M_PER_PX


def pts(el):
    return [proj(p["lat"], p["lon"]) for p in el.get("geometry", []) if p]


def poly(ps, close=False):
    if len(ps) < 2:
        return ""
    s = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in ps)
    return s + ("Z" if close else "")


def build(osm, variant="light"):
    P = PAL[variant]
    ink, accent = P["ink"], P["accent"]
    groups = {k: [] for k in ("major", "mid", "minor", "local", "busway", "rail", "water", "park", "bldg", "clinic")}
    named = {}
    for el in osm["elements"]:
        t = el.get("tags", {})
        ps = pts(el)
        if not ps:
            continue
        hw = t.get("highway")
        if hw in ("motorway", "trunk", "motorway_link", "trunk_link"):
            groups["major"].append(poly(ps))
        elif hw in ("primary", "secondary", "primary_link", "secondary_link"):
            groups["mid"].append(poly(ps))
        elif hw in ("tertiary", "tertiary_link"):
            groups["minor"].append(poly(ps))
        elif hw in ("residential", "unclassified", "living_street", "pedestrian"):
            groups["local"].append(poly(ps))
        elif hw == "busway":
            groups["busway"].append(poly(ps))
        elif t.get("railway") in ("rail", "light_rail"):
            groups["rail"].append(ps)
        elif t.get("waterway") in ("river", "stream", "creek", "canal"):
            groups["water"].append(poly(ps))
        elif t.get("leisure") in ("park", "pitch", "sports_centre", "golf_course") or t.get("natural") == "water":
            groups["park"].append(poly(ps, close=True))
        elif "building" in t:
            (groups["clinic"] if el.get("id") == 37894700 else groups["bldg"]).append(poly(ps, close=True))
        if hw and t.get("name"):
            named.setdefault(t["name"], []).append(ps)
    # rail as the cartographic tick line
    rail_line, rail_ticks = [], []
    for ps in groups["rail"]:
        rail_line.append(poly(ps))
        a = np.array(ps)
        seg = np.hypot(*np.diff(a, axis=0).T)
        arc = np.r_[0, np.cumsum(seg)]
        for s in np.arange(6, arc[-1], 16):
            i = min(int(np.searchsorted(arc, s)), len(a) - 1)
            j = max(i - 1, 0)
            dx, dy = a[i] - a[j] if i != j else (1, 0)
            L = math.hypot(dx, dy) or 1
            nx, ny = -dy / L * 3.2, dx / L * 3.2
            x, y = a[i]
            rail_ticks.append(f"M{x - nx:.1f} {y - ny:.1f}L{x + nx:.1f} {y + ny:.1f}")
    # street labels along the longest straight-ish piece of each chosen road
    labels, label_paths = [], []
    choose = ["Ipswich Road", "Annerley Road", "Cracknell Road", "Fairfield Road", "Ekibin Road", "Venner Road", "Waldheim Street", "School Road"]
    lid = 0
    placed = []
    def chains(pieces):
        """Join a street's OSM ways end to end into the longest runs."""
        key = lambda p: (round(p[0], 1), round(p[1], 1))
        pieces = [list(p) for p in pieces if len(p) > 1]
        out = []
        while pieces:
            cur = pieces.pop(0)
            grown = True
            while grown:
                grown = False
                for i, p in enumerate(pieces):
                    if key(p[0]) == key(cur[-1]):
                        cur += p[1:]
                    elif key(p[-1]) == key(cur[-1]):
                        cur += p[::-1][1:]
                    elif key(p[-1]) == key(cur[0]):
                        cur = p[:-1] + cur
                    elif key(p[0]) == key(cur[0]):
                        cur = p[::-1][:-1] + cur
                    else:
                        continue
                    pieces.pop(i)
                    grown = True
                    break
            out.append(cur)
        return out

    def straightest(a, need):
        """The window of the run, at least `need` px long, that bends least."""
        seg = np.hypot(*np.diff(a, axis=0).T)
        arc = np.r_[0, np.cumsum(seg)]
        best, bi, bj = None, 0, len(a) - 1
        for i in range(len(a)):
            j = int(np.searchsorted(arc, arc[i] + need))
            if j >= len(a):
                break
            chord = math.hypot(*(a[j] - a[i]))
            bend = (arc[j] - arc[i]) / max(chord, 1e-6)
            if best is None or bend < best:
                best, bi, bj = bend, i, j
        return a[bi:bj + 1] if best is not None and best < 1.04 else None

    for name in choose:
        if name not in named:
            continue
        need = len(name) * 10.5 + 40
        best = None
        for run in chains(named[name]):
            inside = np.array([(x, y) for x, y in run if 50 < x < W - 50 and 50 < y < H - 80])
            if len(inside) < 2:
                continue
            piece = straightest(inside, need)
            if piece is None:
                continue
            # keep labels clear of the clinic marker
            if np.min(np.hypot(piece[:, 0] - CX, piece[:, 1] - CY)) < 70:
                continue
            L = float(np.hypot(*np.diff(piece, axis=0).T).sum())
            if best is None or L > best[0]:
                best = (L, piece)
        if not best:
            continue
        a = best[1]
        if a[-1, 0] < a[0, 0]:
            a = a[::-1]
        pid = f"s{lid}"
        lid += 1
        label_paths.append(f"<path id='{pid}' d='{poly([tuple(a[0]), tuple(a[-1])])}'/>")  # a straight baseline: the run bends < 4%
        labels.append(f"<text font-size='15' fill='{ink}' fill-opacity='0.86' dy='-7'><textPath href='#{pid}' startOffset='50%' text-anchor='middle'>{name}</textPath></text>")
        placed.append(name)
    # the clinic: a ring glyph and the street number
    ring = (f"<circle cx='{CX:.1f}' cy='{CY:.1f}' r='16' fill='none' stroke='{accent}' stroke-width='2.4'/>"
            f"<circle cx='{CX:.1f}' cy='{CY:.1f}' r='26' fill='none' stroke='{accent}' stroke-width='1.2' stroke-opacity='0.7'/>"
            f"<circle cx='{CX:.1f}' cy='{CY:.1f}' r='4' fill='{accent}'/>"
            f"<path d='M{CX + 26:.1f} {CY:.1f}H{CX + 70:.1f}' stroke='{accent}' stroke-width='2'/>"
            f"<text x='{CX + 78:.1f}' y='{CY + 6:.1f}' font-size='17' fill='{ink}'>628</text>")
    # scale bar (200 m) and north
    sb = 200 / M_PER_PX
    furn = (f"<path d='M40 {H - 44}H{40 + sb:.1f}M40 {H - 52}V{H - 36}M{40 + sb:.1f} {H - 52}V{H - 36}M{40 + sb / 2:.1f} {H - 48}V{H - 40}' stroke='{ink}' stroke-width='1.8' fill='none'/>"
            f"<text x='{48 + sb:.1f}' y='{H - 38}' font-size='15' fill='{ink}' fill-opacity='0.86'>200 m</text>"
            f"<path d='M{W - 48} {H - 40}V{H - 86}M{W - 56} {H - 74}L{W - 48} {H - 88}L{W - 40} {H - 74}' stroke='{ink}' stroke-width='1.8' fill='none'/>"
            f"<text x='{W - 48}' y='{H - 98}' font-size='15' text-anchor='middle' fill='{ink}' fill-opacity='0.86'>N</text>"
            f"<text x='{W - 76}' y='{H - 38}' font-size='12' text-anchor='end' fill='{ink}' fill-opacity='0.7'>(c) OpenStreetMap contributors</text>")
    furn += (f"<path d='M{W * 0.612:.1f} 70V30M{W * 0.612 - 7:.1f} 42L{W * 0.612:.1f} 28L{W * 0.612 + 7:.1f} 42' stroke='{ink}' stroke-width='1.6' fill='none'/>"
             f"<text x='{W * 0.612 + 14:.1f}' y='44' font-size='15' fill='{ink}' fill-opacity='0.86'>Brisbane CBD</text>")
    txt = "".join(choose) + "628200 mN(c) OpenStreetMap contributorsBrisbane CBD"
    # labels carry a halo in the page ground so they stay legible where they cross streets
    style = "<style>%s text{font-family:ALCMono,monospace;paint-order:stroke;stroke:%s;stroke-width:5px;stroke-linejoin:round}</style>" % (face(txt), P["ground"])
    clip = f"<clipPath id='frame'><rect x='0' y='0' width='{W}' height='{H}'/></clipPath>"
    body = (
        f"<g clip-path='url(#frame)' fill='none' stroke-linejoin='round' stroke-linecap='round'>"
        f"<path d='{''.join(groups['park'])}' fill='{ink}' fill-opacity='0.06' stroke='{ink}' stroke-opacity='0.18' stroke-width='0.8'/>"
        f"<path d='{''.join(groups['bldg'])}' fill='{ink}' fill-opacity='0.10' stroke='none'/>"
        f"<path d='{''.join(groups['water'])}' stroke='{ink}' stroke-opacity='0.5' stroke-width='1.3' stroke-dasharray='1 4'/>"
        f"<path d='{''.join(groups['local'])}' stroke='{ink}' stroke-opacity='0.42' stroke-width='1'/>"
        f"<path d='{''.join(groups['minor'])}' stroke='{ink}' stroke-opacity='0.62' stroke-width='1.7'/>"
        f"<path d='{''.join(groups['mid'])}' stroke='{ink}' stroke-opacity='0.78' stroke-width='2.4'/>"
        f"<path d='{''.join(groups['major'])}' stroke='{ink}' stroke-opacity='0.92' stroke-width='3.4'/>"
        f"<path d='{''.join(groups['busway'])}' stroke='{ink}' stroke-opacity='0.55' stroke-width='1.6' stroke-dasharray='6 4'/>"
        f"<path d='{''.join(rail_line)}' stroke='{ink}' stroke-opacity='0.75' stroke-width='1.3'/>"
        f"<path d='{''.join(rail_ticks)}' stroke='{ink}' stroke-opacity='0.75' stroke-width='1.1'/>"
        f"<path d='{''.join(groups['clinic'])}' fill='{accent}' fill-opacity='0.55' stroke='{accent}' stroke-width='1.2'/>"
        f"</g>")
    svg = (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}'>"
           f"<defs>{style}{clip}{''.join(label_paths)}</defs>{body}{''.join(labels)}{ring}{furn}</svg>")
    return svg, placed


if __name__ == "__main__":
    osm = json.load(open(sys.argv[1]))
    variant = sys.argv[3] if len(sys.argv) > 3 else "light"
    svg, names = build(osm, variant)
    open(sys.argv[2], "w").write(svg)
    print("map", len(svg) // 1024, "KB; labelled:", names)
