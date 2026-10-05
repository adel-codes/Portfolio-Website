# Tools for the Australian Longevity Clinic site

Two folders. `alc-assets/` draws every image on the site from data. `alc-site/` writes every page from shared parts. The site itself is `../australian-longevity-clinic/`.

## Rebuild the pages

```bash
node tools/alc-site/build.mjs        # from the repository root
```

Edit `alc-site/build.mjs` (header, footer, form, home), `pages.mjs` (program pages, doctors, privacy, 404) or `journal.mjs`. Never edit the generated HTML. The journal articles live in `alc-site/content/posts/`, cleaned from the live site by `clean_posts.py`.

## Redraw the assets

Python 3 with numpy, scipy, Pillow (with AVIF) and fontTools, plus Node with Playwright and Chromium for rasterising.

```bash
cd tools/alc-assets
D=data/                      # NOAA ITRDB ring files: aus123c.rwl (Teepookana / Pearces Basin), aus118.rwl (Stanley River)
O=../../australian-longevity-clinic/assets/img
python3 gen_round.py $D round-dark.svg dark          # the round: every ring of core PEB07A (writes round-dark.json)
node raster.mjs round-dark.svg round-dark.png 2600   # rasterise (transparent)
python3 export_rasters.py round-dark.png $O/         # AVIF/WebP sizes and the defocused far plane
python3 gen_round.py $D round-light.svg light        # the pale round used on the doctors page
python3 gen_core.py round-dark.json $O/core.svg      # the core strip and its century ticks
python3 gen_plates.py $D $O/ light                   # the four program plates
python3 gen_mark.py $D $O/                           # mark, favicon, progress rings
python3 gen_journal.py $D $O/                        # one core per journal article
python3 gen_map.py osm.json $O/map-annerley.svg light   # osm.json: run data/overpass-query.txt against an Overpass API
python3 gen_map.py osm.json $O/map-annerley-dark.svg dark
node og.mjs ../../australian-longevity-clinic http://127.0.0.1:8080/   # social card, needs the site served locally
```

`round-meta.json` is the round's geometry (`round-dark.json`). The page builder reads it so the core lines up with the round's measured radius.

Sources: NOAA NCEI World Data Service for Paleoclimatology, International Tree-Ring Data Bank (AUS123C, K. Allen; AUS118, Allen, Palmer, Cook, Buckley, Francey, Peterson, Barbetti, Baker). Map data © OpenStreetMap contributors (ODbL).
