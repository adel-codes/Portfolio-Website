// Rasterise an SVG file to PNG with a transparent background, using Chromium.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = require("playwright");
const [, , svgPath, pngPath, wArg, hArg] = process.argv;
const svg = readFileSync(svgPath, "utf8");
const w = parseInt(wArg, 10), h = parseInt(hArg || wArg, 10);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/<svg /, `<svg style="display:block;width:${w}px;height:${h}px" `)}</body></html>`);
await page.screenshot({ path: pngPath, omitBackground: true });
await browser.close();
console.log("raster", pngPath, w + "x" + h);
