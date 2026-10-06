"""Embed a tiny subset of the site's face (Schibsted Grotesk) in an SVG, so map
labels match the site even when the SVG is loaded through <img>, which cannot
see the page's web fonts."""
import base64, io, os
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "..", "australian-longevity-clinic", "assets", "fonts")

def face(text, weight=500, family="ALCSans", file="schibsted-grotesk-latin.woff2"):
    f = TTFont(os.path.join(FONTS, file))
    f = instancer.instantiateVariableFont(f, {"wght": weight})
    opts = subset.Options()
    opts.layout_features = ["tnum", "kern"]
    opts.flavor = "woff2"
    s = subset.Subsetter(opts)
    s.populate(text="".join(sorted(set(text + " "))))
    s.subset(f)
    f.flavor = "woff2"
    buf = io.BytesIO()
    f.save(buf)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return "@font-face{font-family:%s;src:url(data:font/woff2;base64,%s) format('woff2')}" % (family, b64)
