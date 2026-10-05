// Render og.html to assets/img/og.jpg through a local server rooted at the site.
//   node og.mjs <site_dir> <base_url>
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = require("playwright");
const HERE = path.dirname(fileURLToPath(import.meta.url));
const [, , site, base] = process.argv;
const tmp = path.join(site, "_og.html");
fs.writeFileSync(tmp, fs.readFileSync(path.join(HERE, "og.html"), "utf8"));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(base + "_og.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(site, "assets/img/og.png") });
await browser.close();
fs.unlinkSync(tmp);
console.log("og.png written");
