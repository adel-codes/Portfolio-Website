# Tools for the Australian Longevity Clinic site

Two folders. `alc-site/` writes every page from shared parts. `alc-assets/` makes the site's images: the hero's data field and the social card, set in type from the clinic's own test data, plus the two images that came from outside (the clinic's logo and its doctors' photographs) and the location map. The site itself is `../australian-longevity-clinic/`.

## Rebuild the pages

```bash
node tools/alc-site/build.mjs        # from the repository root
```

Edit `alc-site/build.mjs` (header, footer, form, home, and the doctors' records in `DOCTORS`), `routes.mjs` (each goal's tests, ranges, prescribing rule and re-test schedule), `pages.mjs` (program pages, doctors, privacy, 404) or `journal.mjs`. Never edit the generated HTML. The journal articles live in `alc-site/content/posts/`, cleaned from the live site by `clean_posts.py`. Edited versions in `alc-site/content/posts-human/` replace them when present; each carries an `audit` block listing what changed and which claims were softened.

`ROUTES` in `routes.mjs` feeds the hero slip, the programs rail, the route act, the program pages and the data field. After changing a test or a range there, rebuild the pages and redraw the data field.

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
```

The logo is the clinic's own, from its live site (URL in `logo_cutout.py`); only its white background is removed. The portraits come from the profile image supplied with the brief (`data/doctors-supplied.webp`); nothing in them is generated or retouched.

The tree generators of the second build (the round, the core, the plates, the journal cores, the ring mark and the progress rings) and their NOAA ring data were removed in revision 3. They are in the repository's history before that commit.

Map data © OpenStreetMap contributors (ODbL).
