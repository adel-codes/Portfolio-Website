# Tools for the Australian Longevity Clinic site

Two folders. `alc-site/` writes every page from shared parts. `alc-assets/` makes the site's images: the hero's data field and the social card, set in type from the clinic's own test data; the Annerley act's night map, drawn from OpenStreetMap; every photograph, cropped and graded; plus the clinic's logo, its doctors' photographs and the location map. The site itself is `../australian-longevity-clinic/`.

## Rebuild the pages

```bash
node tools/alc-site/build.mjs        # from the repository root
```

Edit `alc-site/build.mjs` (header, footer, form, home, and the doctors' records in `DOCTORS`), `routes.mjs` (each goal's tests, ranges, prescribing rule and re-test schedule), `pages.mjs` (program pages, doctors, privacy, 404) or `journal.mjs`. Never edit the generated HTML. The journal articles live in `alc-site/content/posts/`, cleaned from the live site by `clean_posts.py`. Edited versions in `alc-site/content/posts-human/` replace them when present; each carries an `audit` block listing what changed and which claims were softened.

`ROUTES` in `routes.mjs` feeds the hero slip, the programs rail, the route act, the program pages and the data field. After changing a test or a range there, rebuild the pages and redraw the data field.

The builder also reads `alc-assets/photos.json` (each photograph's alt text, caption and credit), `assets/img/photos/index.json` (the widths `photos.py` wrote) and `alc-site/place.mjs` (the Annerley act's road and positions, written by `gen_place.mjs`). After redoing the photographs or the map, rebuild the pages.

## Redraw the assets

Python 3 with numpy, Pillow (with AVIF) and fontTools, plus Node with Playwright and Chromium.

```bash
cd tools/alc-assets
O=../../australian-longevity-clinic/assets/img
node gen_datafield.mjs ../../australian-longevity-clinic data-field.png   # the hero's far plane: every route's tests, typeset and defocused
python3 export_datafield.py data-field.png $O/                            # AVIF and WebP at 2400 and 1600
python3 logo_cutout.py data/alc-logo-original.webp $O/logo/   # the clinic's own logo: medallion cut from its white square, favicons
python3 portraits.py data/doctors-supplied.webp $O/doctors/   # the doctors' photographs: cropped, one light print grade
python3 gen_map.py osm.json $O/map-annerley.svg light         # osm.json: run data/overpass-query.txt against an Overpass API
node og.mjs ../../australian-longevity-clinic http://127.0.0.1:8080/   # social card (og.jpg), needs the site served locally
python3 photos.py data/photos $O/                             # every photograph: crop, grade, AVIF and WebP, from photos.json
node gen_place.mjs osm.json ../../australian-longevity-clinic # the Annerley act's night map, and ../alc-site/place.mjs
python3 export_place.py ../../australian-longevity-clinic     # that map as AVIF and WebP at 4096 and 2048
```

The logo is the clinic's own, from its live site (URL in `logo_cutout.py`); only its white background is removed. The portraits come from the profile image supplied with the brief (`data/doctors-supplied.webp`); nothing in them is generated or retouched.

`photos.json` lists every photograph on the site: where it came from, its licence and credit, its alt text and caption, its crops and its grade. The originals are in `data/photos/`. Eight are the clinic's own, from its live site. They look AI-generated and are used only as lifestyle pictures. Four are of Annerley, from Wikimedia Commons: two State Library of Queensland prints in the public domain, one CC0 photograph, and one under CC BY-SA 4.0, whose page credit links its source and the licence and says it was cropped and toned. Grades: `clinic` leaves a photograph nearly as it is, `place` takes a little colour out and pulls shadows toward the navy and highlights toward ivory, `archive` turns a black-and-white print into a navy-to-ivory duotone.

`gen_place.mjs` draws the streets, parks, rail and water within 1.3 km of the clinic at night in the site's palette, and works out Ipswich Road's centre line from Annerley Junction to the clinic. Every position it writes to `place.mjs` is a fraction of the map's side, so the page can draw the map at any size. Its `osm.json` is the same Overpass query as the location map's (`data/overpass-query.txt`).

`svgfont.py` embeds a small subset of Schibsted Grotesk in an SVG, so the location map's labels match the site even inside an `<img>`. The monospaced face (Azeret Mono) was removed in revision 4.

The tree generators of the second build (the round, the core, the plates, the journal cores, the ring mark and the progress rings) and their NOAA ring data were removed in revision 3. They are in the repository's history before that commit.

Map data © OpenStreetMap contributors (ODbL).
