"""Clean the clinic's live journal articles into plain semantic HTML.

Keeps the doctors' text as written. Mechanical changes only: classes and
inline styles removed, empty paragraphs dropped, stray text wrapped in <p>,
in-article calls to action removed (the page has its own), em dashes set as
spaced en dashes to match the site's typography, and headings demoted so the
article title is the only h1. Also reports every named prescription medicine,
for the clinic's compliance review.

  python3 clean_posts.py <fetched_dir/> <out_dir/>
"""
import json, os, re, sys
from bs4 import BeautifulSoup, NavigableString

KEEP = {"p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "a", "table", "thead", "tbody", "tr", "th", "td", "blockquote", "br"}
FLAG = r"\b(Ozempic|Wegovy|Mounjaro|Saxenda|semaglutide|tirzepatide|liraglutide|BPC-?157|TB-?500|thymosin|GHK-?Cu|epitalon|ipamorelin|CJC-?1295|AOD-?9604|selank|sermorelin|tesamorelin|PT-?141|Ferinject|Ferrosig|Monofer|carboxymaltose|polymaltose|derisomaltose|Reandron|Testogel|Androforte|undecanoate|cypionate|enanthate|estradiol|oestradiol|progesterone|DHEA|metformin|rapamycin|naltrexone)\b"
CTA = re.compile(r"(book (a|your) (consultation|appointment)|ready to|get in touch|contact us today|call us|complete our (online )?health questionnaire)", re.I)

def clean(html):
    soup = BeautifulSoup(html, "html.parser")
    for t in soup.find_all(["script", "style", "img", "svg", "button", "form", "figure", "iframe"]):
        t.decompose()
    # unwrap everything we don't keep
    for t in soup.find_all(True):
        if t.name not in KEEP:
            t.unwrap()
    for t in soup.find_all(True):
        href = t.get("href") if t.name == "a" else None
        t.attrs = {}
        if href:
            if href.startswith("/"):
                href = "https://www.australianlongevityclinic.com.au" + href
            t["href"] = href
            if not href.startswith("https://www.australianlongevityclinic.com.au"):
                t["rel"] = "noopener"
    # wrap loose text at the top level into paragraphs
    out, buf = [], []
    def flush():
        txt = "".join(str(x) for x in buf).strip()
        if txt:
            out.append("<p>" + txt + "</p>")
        buf.clear()
    for node in list(soup.contents):
        if isinstance(node, NavigableString) or node.name in ("strong", "b", "em", "i", "a", "br"):
            buf.append(node)
        else:
            flush()
            out.append(str(node))
    flush()
    soup = BeautifulSoup("".join(out), "html.parser")
    for p in soup.find_all("p"):
        if not p.get_text(strip=True):
            p.decompose()
    # drop a trailing call to action written into the article
    blocks = soup.find_all(["p", "h2", "h3"], recursive=False)
    for b in blocks[-3:]:
        if CTA.search(b.get_text()) and len(b.get_text()) < 260:
            b.decompose()
    # headings: the article title is the page's h1, so content starts at h2
    for h in soup.find_all("h4"):
        h.name = "h3"
    html = str(soup)
    html = html.replace("—", " – ").replace("  – ", " – ").replace(" –  ", " – ")
    html = re.sub(r"\s+–\s+", " – ", html)
    html = re.sub(r"\n{2,}", "\n", html)
    return html

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    report = {}
    for f in sorted(os.listdir(src)):
        if not f.endswith(".json"):
            continue
        d = json.load(open(os.path.join(src, f)))
        slug = f[:-5]
        body = clean(d["html"])
        meta = " ".join(d.get("meta", []))
        mins = re.search(r"(\d+)\s*min read", meta)
        date = re.search(r"(\d{1,2} \w+ 20\d\d)", meta)
        cat = re.match(r"([A-Za-z'+ ]+?)\d+\s*min read", d.get("meta", [""])[0] or "")
        hits = sorted(set(m.group(0) for m in re.finditer(FLAG, BeautifulSoup(body, "html.parser").get_text(), re.I)), key=str.lower)
        report[slug] = hits
        json.dump({"slug": slug, "title": d["title"], "minutes": int(mins.group(1)) if mins else None,
                   "date": date.group(1) if date else None, "category": cat.group(1).strip() if cat else None,
                   "html": body, "flags": hits}, open(os.path.join(dst, slug + ".json"), "w"), indent=1)
        print(f"{slug:58s} {len(body):6d}  {', '.join(hits) or '-'}")
