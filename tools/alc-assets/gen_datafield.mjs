// The hero's far plane: a field of the clinic's real tests, reference ranges
// and re-test intervals, typeset in the site's own faces and defocused.
// Nothing on it is decoration that isn't data: every line comes from ROUTES,
// the same object that builds the route panels.
//
//   node gen_datafield.mjs <site_dir> <out_png>
//
// Writes a 2400 x 1500 PNG with a transparent ground. export_datafield.py
// then makes the AVIF and WebP sizes the page uses.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "../alc-site/routes.mjs";
const require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = require("playwright");

const [, , site, out] = process.argv;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Four columns, staggered vertically, so the field reads as a sheet of
// results rather than a grid of cards. Sizes vary so the defocus has depth.
const cols = ROUTES.map((r, i) => {
  const top = [70, 470, 10, 330][i];
  const lines = r.tests.map(([t, d, range]) => `
      <p class="t">${esc(t)}</p>
      <p class="d">${esc(range || d)}</p>`).join("");
  const again = r.recheck.match(/\d[^.:]*(?:weeks|months)[^.:]*/);
  return `
    <section style="top:${top}px">
      <p class="g">${esc(r.goal)}</p>${lines}
      ${again ? `<p class="a">${esc(again[0])}</p>` : ""}
    </section>`;
}).join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Azeret Mono"; src: url("assets/fonts/azeret-mono-latin.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Schibsted Grotesk"; src: url("assets/fonts/schibsted-grotesk-latin.woff2") format("woff2"); font-weight: 400 900; }
html, body { margin: 0; background: transparent; }
body { width: 2400px; height: 1500px; position: relative; overflow: hidden; color: #e8e6dd; }
.field { position: absolute; inset: 0; filter: blur(4.6px); }
section { position: absolute; width: 560px; }
section:nth-child(1) { left: 40px; }
section:nth-child(2) { left: 640px; }
section:nth-child(3) { left: 1240px; }
section:nth-child(4) { left: 1840px; }
p { margin: 0; }
.g { font: 600 78px/1.02 "Schibsted Grotesk"; letter-spacing: -0.025em; opacity: 0.6; margin-bottom: 40px; }
.t { font: 500 42px/1.15 "Azeret Mono"; opacity: 0.55; margin-top: 34px; }
.d { font: 400 27px/1.3 "Azeret Mono"; opacity: 0.34; margin-top: 8px; }
.a { font: 500 31px/1.3 "Azeret Mono"; color: #d4b26a; opacity: 0.62; margin-top: 46px; max-width: 520px; }
</style></head><body><div class="field">${cols}</div></body></html>`;

const tmp = path.join(site, "_datafield.html");
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2400, height: 1500 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.resolve(tmp), { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);
await page.screenshot({ path: out, omitBackground: true });
await browser.close();
fs.unlinkSync(tmp);
console.log("data field", out);
