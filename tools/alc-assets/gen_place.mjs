// The Annerley act's ground: the streets around 628 Ipswich Road, drawn from
// OpenStreetMap at night in the site's palette, plus the positions of what
// stands on it (the clinic, the photographs, Ipswich Road's line).
//
//   node gen_place.mjs <osm.json> <site_dir>
//
// osm.json is the Overpass result for data/overpass-query.txt. Writes
// <site_dir>/assets/img/place/_map.png, which export_place.py encodes as
// AVIF and WebP, and ../alc-site/place.mjs, which the page builder imports.
// Every position is a fraction of the map's side, so the page can draw it at
// any size.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = require("playwright");
const HERE = path.dirname(fileURLToPath(import.meta.url));

const [, , osmFile, site] = process.argv;
const osm = JSON.parse(fs.readFileSync(osmFile, "utf8"));

// The clinic, and the square of ground around it (metres from centre to edge).
const C = { lat: -27.51741, lon: 153.03014 };
const HALF = 1300;
const N = 4096;                                     // texture side, px
const mLat = 111320, mLon = 111320 * Math.cos((C.lat * Math.PI) / 180);
const fx = (lon) => 0.5 + ((lon - C.lon) * mLon) / (2 * HALF);
const fy = (lat) => 0.5 - ((lat - C.lat) * mLat) / (2 * HALF);
const px = (f) => +(f * N).toFixed(1);

// ------------------------------------------------------------- the drawing
const ROAD = {
  motorway: [16, 0.62], trunk: [13, 0.72], primary: [10, 0.6], secondary: [7.5, 0.5], tertiary: [5.5, 0.4],
  motorway_link: [6, 0.4], trunk_link: [6, 0.4], primary_link: [5, 0.36], secondary_link: [4.5, 0.32], tertiary_link: [4, 0.3],
  residential: [3.2, 0.26], unclassified: [3.2, 0.24], living_street: [2.6, 0.22], pedestrian: [2.2, 0.2], busway: [4, 0.3],
};
const line = (g) => g.map((p, i) => `${i ? "L" : "M"}${px(fx(p.lon))} ${px(fy(p.lat))}`).join("");
const parks = [], water = [], rail = [], roads = {}, buildings = [];
for (const w of osm.elements) {
  const t = w.tags || {}, g = w.geometry;
  if (!g || g.length < 2) continue;
  if (t.leisure || t.natural === "water") parks.push(`<path d="${line(g)}Z"/>`);
  else if (t.waterway) water.push(`<path d="${line(g)}"/>`);
  else if (t.railway) rail.push(`<path d="${line(g)}"/>`);
  else if (t.building) buildings.push(`<path d="${line(g)}Z"/>`);
  else if (t.highway && ROAD[t.highway]) (roads[t.highway] ||= []).push(`<path d="${line(g)}"/>`);
}
const order = ["living_street", "pedestrian", "unclassified", "residential", "busway", "tertiary_link", "secondary_link", "primary_link", "trunk_link", "motorway_link", "tertiary", "secondary", "primary", "trunk", "motorway"];
const roadSvg = order.filter((k) => roads[k]).map((k) => `<g stroke="#e8e6dd" stroke-opacity="${ROAD[k][1]}" stroke-width="${ROAD[k][0]}">${roads[k].join("")}</g>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}" viewBox="0 0 ${N} ${N}">
<rect width="${N}" height="${N}" fill="#0b1526"/>
<g fill="#13253f">${parks.join("")}</g>
<g fill="none" stroke="#24476e" stroke-width="5" stroke-linecap="round">${water.join("")}</g>
<g fill="none" stroke="#4a5d7a" stroke-width="4" stroke-dasharray="18 12">${rail.join("")}</g>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">${roadSvg}</g>
<g fill="#1d3150" stroke="#e8e6dd" stroke-opacity="0.3" stroke-width="1.5">${buildings.join("")}</g>
</svg>`;

// --------------------------------------------- Ipswich Road as one line
// Both carriageways and every link, ordered along the road's own axis and
// smoothed into a centreline, from Annerley Junction to past the clinic.
const JUNCTION = { lat: -27.5101402, lon: 153.0325324 };
const ip = [];
for (const w of osm.elements) if ((w.tags || {}).name === "Ipswich Road" && w.geometry) for (const p of w.geometry) ip.push(p);
const ax = { x: fx(C.lon) - fx(JUNCTION.lon), y: fy(C.lat) - fy(JUNCTION.lat) };
const axLen = Math.hypot(ax.x, ax.y); ax.x /= axLen; ax.y /= axLen;
const along = (p) => (fx(p.lon) - fx(JUNCTION.lon)) * ax.x + (fy(p.lat) - fy(JUNCTION.lat)) * ax.y;
const across = (p) => -(fx(p.lon) - fx(JUNCTION.lon)) * ax.y + (fy(p.lat) - fy(JUNCTION.lat)) * ax.x;
const span = [-0.03, axLen + 0.09];                 // a little before the Junction to past the clinic
const pts = ip.map((p) => ({ s: along(p), d: across(p) })).filter((q) => q.s >= span[0] && q.s <= span[1] && Math.abs(q.d) < 0.03).sort((a, b) => a.s - b.s);
const bins = 48, centre = [];
for (let i = 0; i <= bins; i++) {
  const s = span[0] + ((span[1] - span[0]) * i) / bins, near = pts.filter((q) => Math.abs(q.s - s) < (span[1] - span[0]) / bins);
  if (near.length) centre.push({ s, d: near.reduce((a, q) => a + q.d, 0) / near.length });
}
const smooth = centre.map((q, i) => { const w = centre.slice(Math.max(0, i - 2), i + 3); return { s: q.s, d: w.reduce((a, r) => a + r.d, 0) / w.length }; });
const road = smooth.map((q) => [+(fx(JUNCTION.lon) + q.s * ax.x - q.d * ax.y).toFixed(5), +(fy(JUNCTION.lat) + q.s * ax.y + q.d * ax.x).toFixed(5)]);

// ------------------------------------------------------------- what stands
const at = (lat, lon) => [+fx(lon).toFixed(5), +fy(lat).toFixed(5)];
const PLACE = {
  side: HALF * 2,
  clinic: at(C.lat, C.lon),
  junction: at(JUNCTION.lat, JUNCTION.lon),
  queenslanders: at(-27.5144457, 153.034616),       // Waterton St at Bower St
  ipswich1936: at(-27.518286, 153.0291852),         // Ipswich Rd at Cracknell Rd and Villa St
  // bearing from the Junction to the clinic, degrees clockwise from north
  bearing: +(((Math.atan2(ax.x, -ax.y) * 180) / Math.PI + 360) % 360).toFixed(1),
  road,
};
fs.writeFileSync(path.join(HERE, "../alc-site/place.mjs"),
  `// Generated by tools/alc-assets/gen_place.mjs from OpenStreetMap data. Do not edit.\n// Positions are fractions of the map's side (${HALF * 2} m), clinic at the centre.\nexport const PLACE = ${JSON.stringify(PLACE)};\n`);

// ------------------------------------------------------------- rasterise
const out = path.join(site, "assets/img/place");
fs.mkdirSync(out, { recursive: true });
const tmpSvg = path.join(out, "_map.svg"), tmpPng = path.join(out, "_map.png");
fs.writeFileSync(tmpSvg, svg);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: N, height: N }, deviceScaleFactor: 1 });
await page.goto("file://" + path.resolve(tmpSvg));
await page.screenshot({ path: tmpPng });
await browser.close();
fs.unlinkSync(tmpSvg);
console.log("map", tmpPng, "bearing", PLACE.bearing, "road points", road.length);
