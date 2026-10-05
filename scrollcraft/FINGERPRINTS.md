# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| alc-home (Australian Longevity Clinic, 2026-10-04) | Chaptered editorial | Margin folio: every chapter listed with numeral and title, current one in ink, clickable; a small fixed tag on phones; no bar | Title page: type alone on paper, lead-anchored, present on landing, no media | Title + 5 chapters + colophon = 7 acts, one pinned (chapter III, span 2.4); about 8.9vh desktop, 11.1vh phone | Colophon plate: small type, address and hours, the CTA as a line of running text, holds | The pathway that draws its own exit: an SVG care-pathway chart drawn from the act's --sc-p, four stations landing in turn, then a dashed return line and a square stop mark | Paper and ink with one cobalt spot colour; no photography (captioned plates await the clinic's own) | static files, no server |
| alc-specimen (Australian Longevity Clinic rebuild, 2026-10-05; revision 2 same day) | Specimen study (new): the plate is the unit, one specimen anchors the page, the peak is an operation on it, the page ends in an instrument | Fixed accession strip: the clinic's own medallion, name and place, a Programs disclosure, three page links and the one action; takes the ground of the section beneath it; a menu sheet on phones | Layered data-drawn specimen on navy (forest before revision 2): defocused far plane, sharp round, a paper specimen label as the near plane, lead-anchored headline, pointer depth on fine pointers | pin (span 4.8, peak) > pan (3.6) > flow (the doctors' register) > flow + in > reveal holding the form; 5 acts, 14.2vh desktop, 18.6vh phone (4 acts, 12.7vh and 16.7vh before revision 2) | The assessment form is the ending: five steps, a fee block, and a ring glyph that closes one ring per step; the footer follows as chrome | A core drawn out of the round along its measured radius and laid out as a thousand-year timeline | Navy (from the clinic's medallion), quartzite and Huon gold; every drawn image from NOAA ring data or OpenStreetMap; the only photographs are the clinic's two doctors, in a ruled register | static files, no server |


---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **alc-specimen** takes: the specimen-study grammar; the accession strip that takes its ground from the section beneath; the layered data-drawn specimen hero with a paper label as near plane; the form-as-ending close; the core-extraction move; and the 5-act, about-14vh band. Revision 2 added a plain flow act for the doctors and moved the ground from forest to navy. Shares with alc-home only the clinic's facts and the refusal of stock imagery.
- **alc-home** takes: the chaptered editorial grammar; the margin folio as chrome; the title-page hero; the colophon close with a running-text CTA; the self-drawing chart as a signature move; and the 7-act, about-9vh band. The next build must differ from this row on at least four of the six dimensions.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
