// The journal: an index and one page per article.
//
// Articles are the clinic's own, carried over from the live site with
// mechanical cleanup only (see clean_posts.py). Each is filed with a
// different measured Huon pine core in place of a stock image. Two live
// articles are not carried over because their subject is a named prescription
// medicine; see README.md.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(HERE, "content/posts");
const STANDFIRSTS = JSON.parse(fs.readFileSync(path.join(HERE, "content/standfirsts.json"), "utf8"));

// newest first, by the date each article carries
const MONTHS = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 };
const when = (d) => { if (!d) return 0; const [day, mon, yr] = d.split(" "); return new Date(+yr, MONTHS[mon] ?? 0, +day).getTime(); };

function load() {
  const posts = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf8")));
  for (const p of posts) {
    const s = STANDFIRSTS.find((x) => x.title.trim() === p.title.trim());
    // the same typographic cleanup as the article bodies: em dashes set as spaced en dashes
    p.standfirst = (s ? s.standfirst : firstSentences(p.html)).replace(/\s*\u2014\s*/g, " \u2013 ");
    p.title = p.title.replace(/\s*\u2014\s*/g, " \u2013 ");
    p.category = p.category || (s && s.category) || "Journal";
    p.minutes = p.minutes || (s && s.minutes) || null;
  }
  posts.sort((a, b) => when(b.date) - when(a.date) || a.slug.localeCompare(b.slug));
  return posts;
}
function firstSentences(html) {
  const text = html.replace(/<h[23][^>]*>.*?<\/h[23]>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const m = text.match(/^(.{60,260}?[.?!])\s/);
  return m ? m[1] : text.slice(0, 220);
}

export function journalPages(ctx) {
  const { head, strip, footer, scripts, link, rel, esc, SITE } = ctx;
  const cores = JSON.parse(fs.readFileSync(path.join(SITE, "assets/img/cores/cores.json"), "utf8"));
  const posts = load();
  posts.forEach((p, i) => { p.core = cores[i % cores.length]; });
  const coreLabel = (c) => `Core ${c.series} · AD ${c.first}–${c.last} · ${c.rings.toLocaleString("en-AU")} rings · ${c.site}`;
  const out = [];

  // ---------------------------------------------------------------- index
  {
    const depth = 1;
    const r = rel(depth);
    const items = posts.map((p) => `
      <li>
        <a href="${link(depth, "blog/" + p.slug)}">
          <div>
            <span class="meta">${esc(p.category)}${p.minutes ? ` · ${p.minutes} min read` : ""}${p.date ? ` · ${p.date}` : ""}</span>
            <h2>${esc(p.title)}</h2>
            <p>${esc(p.standfirst)}</p>
          </div>
          <div class="core" aria-hidden="true"><img src="${r}assets/img/${p.core.file}" alt="" width="1000" height="40" loading="lazy" decoding="async"><span>${coreLabel(p.core)}</span></div>
        </a>
      </li>`).join("");
    out.push(["blog/index.html", head({ title: "Journal · Australian Longevity Clinic", description: "Educational notes on IV therapy, peptides, hormonal health and longevity medicine from the medical team at Australian Longevity Clinic, Brisbane.", depth, canonical: "blog" }) + `
<body class="inner">
${strip(depth, "blog", "light")}
<main id="main" class="page g-light" data-ground="light">
  <header class="page-head">
    <div class="wrap page-head__grid">
      <div>
        <h1 class="d-xl">Journal</h1>
        <p class="lede">Notes from the clinic's medical team on IV therapy, peptides, hormonal health and longevity medicine. General information only, not advice for your situation.</p>
      </div>
      <p class="soft" style="font-size:.92rem;max-width:36ch">Each article is filed with a different tree core from the same Tasmanian collections as the home page: real measurements, one ring a year.</p>
    </div>
  </header>
  <div class="wrap" style="padding-bottom:clamp(4rem,8vw,7rem)">
    <ul class="journal">${items}
    </ul>
  </div>
</main>
${footer(depth)}
${scripts(depth, ["assets/js/site.js"])}
</body>
</html>
`]);
  }

  // ------------------------------------------------------------- articles
  posts.forEach((p, i) => {
    const depth = 2;
    const r = rel(depth);
    const more = [posts[(i + 1) % posts.length], posts[(i + 2) % posts.length]];
    out.push([`blog/${p.slug}/index.html`, head({ title: `${p.title} · Australian Longevity Clinic`, description: p.standfirst, depth, canonical: `blog/${p.slug}` }) + `
<body class="inner">
${strip(depth, "blog", "light")}
<main id="main" class="page g-light" data-ground="light">
  <article>
    <header class="article-head">
      <div class="wrap">
        <p class="meta"><a href="${link(depth, "blog")}">Journal</a><span>${esc(p.category)}</span>${p.minutes ? `<span>${p.minutes} min read</span>` : ""}${p.date ? `<span>${p.date}</span>` : ""}</p>
        <h1 class="d-lg">${esc(p.title)}</h1>
        <p class="lede" style="margin-top:1.3rem;max-width:52ch">${esc(p.standfirst)}</p>
        <figure class="article-core"><img src="${r}assets/img/${p.core.file}" alt="" width="1000" height="40" decoding="async"><figcaption>${coreLabel(p.core)}. NOAA ITRDB ${p.core.collection}.</figcaption></figure>
      </div>
    </header>
    <div class="wrap" style="padding-bottom:clamp(3rem,6vw,5rem)">
      <div class="prose">
        ${p.html}
        <p class="notice">Written by the clinic's medical team. This article is general information only and does not replace individual medical advice. A consultation does not guarantee that any particular investigation, medicine or service will be appropriate for you.</p>
      </div>
    </div>
  </article>
  <section class="next">
    <div class="wrap">
      <div class="next__in">
        <p class="d-sm">Questions about your own situation belong with a doctor.</p>
        <a class="btn" href="${link(depth, "contact")}#assessment">Begin your assessment</a>
      </div>
      <ul class="journal" style="margin-top:3rem">${more.map((m) => `
        <li><a href="${link(depth, "blog/" + m.slug)}"><div><span class="meta">${esc(m.category)}${m.minutes ? ` · ${m.minutes} min read` : ""}</span><h2>${esc(m.title)}</h2></div><div class="core" aria-hidden="true"><img src="${r}assets/img/${m.core.file}" alt="" width="1000" height="40" loading="lazy"><span>${coreLabel(m.core)}</span></div></a></li>`).join("")}
      </ul>
    </div>
  </section>
</main>
${footer(depth)}
${scripts(depth, ["assets/js/site.js"])}
</body>
</html>
`]);
  });
  return out;
}
