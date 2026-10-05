# BRIEF.md: Australian Longevity Clinic, second scroll-craft build

**Self-authored under explicit creative delegation.** The user set the criteria in writing and asked for scroll-craft's approach to drive the design ("let its approach drive the design and don't fall back on template defaults", "Apply conversion-focused design judgment"). Their words are quoted verbatim below where they exist. Everything else is an authored decision, labelled as such. No user quotation is invented.

This build replaces the first one (row `alc-home` in `scrollcraft/FINGERPRINTS.md`, commit `c576fd4`). The user's verdict on that generation of work: "The current design looks far too Claude-generated. Nothing in the final result should read as an AI template."

---

## Step 0: the eight topics

1. **Vibe, plus references.**
   User, verbatim: "premium, trusted", "more editorial rather than a bunch of different AI-generated assets", "not like a world that we'd be flying through", "more premium". For the audience: "quality, science-backed credibility and exclusivity".
   Authored references (not websites): a botanical specimen sheet from a state herbarium; the plates in a dendrochronology monograph; a Swiss pharmaceutical package insert; a museum accession label.

2. **The journey, section by section.**
   Authored. A specimen first, read in full. Then the four programs as plates. Then the standards the clinic holds itself to. Then the assessment itself, as the ending.

3. **The energy curve.**
   Authored. Still and dark at the open. The one loud moment early: the core leaving the round. Cool and orderly through the programs. Low and steady through the standards. Quiet and focused at the form, which is the end.

4. **Feeling stage by stage, and the ONE moment.** See the feeling curve and the peak below.

5. **One thing no site they have seen does.**
   Authored. Show what "reading someone's history" means with a real record: pull a core out of a real thousand-year-old tree and lay every ring out as a timeline the visitor can read. Longevity clinics show smiling people and IV bags; this one shows a measured life.

6. **How far from premium-minimal.**
   User, verbatim: "more editorial", "premium". Family: **Editorial with a scientific register.** Plates, figure numbers, captions, scale bars, measured data. Not minimal-luxury dark-and-gold.

7. **One unbroken world, or distinct scenes?**
   User, verbatim: "not like a world that we'd be flying through". **Distinct scenes.** Worldflight is excluded.

8. **What assets do they already have?**
   None usable. Every image on the live site is AI-generated (a caduceus badge, product vials labelled for a different clinic, stock people in navy-and-gold rooms). The user asked for bespoke assets "using image generation and any other tools available". No diffusion image generator is available in this environment (no KIE key), and a diffusion model would reproduce the AI look the user is rejecting. **So every asset is generated from real data**: NOAA tree-ring measurements of Huon pine and OpenStreetMap streets, drawn with code. See the asset list.

## Step 1: journey first

- **What is this, and who is it for?** A doctor-led longevity clinic at 628 Ipswich Road, Annerley, Brisbane: IV infusion therapy, peptide programs, testosterone therapy and medical weight management. User, verbatim, on the audience: "Health-conscious people who are willing to invest significant money in their health."
- **What must the visitor believe by the end?** *These doctors will read my whole history and my pathology before they prescribe anything, and they will tell me if something is not for me.*
- **What does the visitor do next?** Begin the assessment: a health questionnaire, a $75 fee, a doctor's review and a phone consultation. One label everywhere: **Begin your assessment**.
- **Real facts used** (all from the live site, 2026-10-05): address; hours (Mon to Fri 8am to 6pm, Sat 9am to 2pm); email; ABN 85 618 922 848; MBBS and FRACGP; the $75 fee via Stripe; the doctor calls within 1 to 2 business days, Mon to Fri 9am to 5pm AEST; the phone consultation runs 15 to 25 minutes; not bulk billed; no referral for most services; iron infusion needs pathology within 3 months and a GP referral; infusion durations; TRT needs confirmed pathology. **Not available, so not invented:** doctor names, photographs, a phone number, prices of any treatment.

### Journey beats

```
1  Arrival      a real specimen, measured, and a clinic that reads before it treats     act 1 open
2  Turn         the core leaves the tree and becomes a thousand-year record             act 1 peak
3  Orientation  four programs, each with its own plate and the same label schema       act 2
4  Weight       the standards, as a protocol the visitor can check                    act 3
5  Commitment   the assessment itself, on the page, with everything it costs           act 4 (close)
```

## Step 2: grammar, signature move, gate, curve, score

### Grammar: specimen study (new)

A named new grammar, defined by structure, not by a label:

- **The unit is the plate, not the chapter or the act.** Every visual is a numbered figure with a caption that states what it is, where the data came from and what is illustrative. Copy is annotation keyed to the figure.
- **One specimen anchors the page.** The page opens on it, and the peak is an operation performed on it (extraction), not a camera move around it.
- **Sequence:** specimen, operation, plates, protocol, input. Magnification and order change between acts; the subject does not.
- **Navigation:** a slim fixed label strip, the clinic's accession line, which carries the site's real page links and the one action. No margin folio, no chapter index, no progress readout.
- **Ending:** an instrument. The page ends in the assessment form, not a CTA island and not a colophon.
- **Forbids:** decorative imagery (an image that is not a measured or drawn specimen); generic iconography (the decade-dot convention is the only icon system); cards; testimonials; any visual that does not carry a figure number and a source; worldflight; `scrub` (there is no footage, and inventing footage would be decoration); `spotlight` and `magnet`.

Why the other eight lost:

- **Filmic one-shot**: the brief rejects being carried ("not a world we'd be flying through"), and its pinned close with a magnetic CTA is the template default the user is reacting against.
- **Chaptered editorial**: taken by `alc-home`, the build being replaced. Re-using it would be the re-skin the gate exists to stop.
- **Live surface**: there is no product surface. The form is real, but a clinic is not software.
- **Continuous world**: excluded by the brief in so many words.
- **Typographic poster**: a medical service has to show process, eligibility and standards. One sentence at 40vw cannot carry them.
- **Gallery / catalog**: the visitor's question is "should I trust you", which a collection does not answer. The programs do borrow its label schema inside one act.
- **Split stage**: there is no two-sided argument here.
- **Rhythmic cutlist**: pulse and speed are the opposite of what this audience is buying.

### Signature move: the core leaves the round

Act 1 pins. The round is a real Huon pine cross-section, every ring drawn from core PEB07A (1,010 rings, AD 1003 to 2012). As the visitor scrolls, a borer line runs in from the bark to the pith along the measured radius. The core then slides out of the round, the round falls away, and the core grows to the full width of the screen. Decade dots arrive in the standard dendrochronology convention, the centuries are labelled, and three rings are called out. Because the round's radius along that line is the measured cumulative width, the core's rings line up exactly with the round's rings at the moment of extraction. Page-local JS reads the act's `--sc-p` and publishes `data-sc-verify-state`. The engine is untouched. Under reduced motion the core is shown laid out, with no pin.

### Fingerprint gate against every existing row

| Dimension | `alc-home` | This build | Differs |
|---|---|---|---|
| Grammar | Chaptered editorial | Specimen study (new, defined above) | yes |
| Nav treatment | Margin folio listing every chapter, no bar | Fixed accession strip with site links and the one action; switches ground with the section | yes |
| Hero device | Title page, type alone on paper, no media | Layered specimen on a dark ground: defocused far plane, sharp round, near label; pointer parallax | yes |
| Act-sequence shape | Title + 5 chapters + colophon = 7 acts, one pinned (span 2.4), about 8.9vh | pin (peak, span 4.8) > pan (3.6) > flow > reveal holding the form, then a footer: 4 acts, about 12.5vh | yes |
| Close pattern | Colophon plate, CTA as running text | The assessment form is the ending; the page resolves into an input | yes |
| Signature move | Self-drawing care-pathway chart | A core extracted from a real round and laid out as a timeline | yes |

**6 of 6. Passes.** Shared with `alc-home`: the clinic's facts and the refusal to use stock imagery.

### The feeling curve

```
1  Stillness, then awe   a dark ground and one specimen in sharp focus, a real label beside it; then the borer goes in and the core comes out
2  Clarity               the core across the full screen, a thousand years readable at a glance, and the line that says this is what they do with you
3  Orientation           a hard cut to a pale ground; four plates travel sideways, each a different magnification of the same tree
4  Assurance             a protocol set as a table: what happens, who does it, what they will not do
5  Resolve               the form, the fee, the timeline and the privacy terms in one place; the page stops at an input
```

Act 1 holds two feelings because the peak needs a still open in front of it. The first fifth of the act is that authored stillness: the specimen holds while the headline reads, and nothing moves except under the pointer.

### The peak

> "You scroll and a core slides out of this huge tree cross-section and turns into a timeline of a thousand years. Then it says that's how they read you."

Lives in act 1, from 0.22 to 0.78 of its span. It has the largest span on the page (4.8, against 3.6 for the pan) and the only bespoke animation.

### Tell-someone sentence

**It's the site where you pull a core out of a thousand-year-old tree and read its whole life, ring by ring.**

### Authored silence

Act 1, `p` 0 to 0.2: the hero holds still under scroll on purpose (the specimen settles, the headline stays). The harness may report the first slice of act 1 as low-change; that is the silence before the borer.

### Score

| Beat | Device | Why this one |
|---|---|---|
| Arrival and Turn | `pin` + `parallax` planes + bespoke extraction from `--sc-p` | One held frame lets the operation happen in place; the planes give the specimen depth before it moves |
| Orientation | `pan` | Four programs read as breadth, not hierarchy; sideways travel through plates like turning a folio |
| Weight | `flow` + `in` | Credentials and process are information; compress them (feel.md §5) |
| Commitment | `reveal`: the paper ground wipes up over the dark, holding a real form | A change of state from reading to doing; the form itself is the close |

Four device families, none twice in a row, no `scrub`.

### Layer contract (hero)

| Plane | Asset | Movement | Rule |
|---|---|---|---|
| Far | `round-far.webp`: a 2x macro crop of the outer rings and a check, defocused | Smallest scroll and pointer displacement | Never overlaps the headline at more than 25% opacity |
| Mid | `round-1400.avif`: the sharp round | Moderate; recentres for the extraction | The core line is aligned to its measured radius |
| Near | The specimen label, HTML | Strongest restrained pointer displacement | Occludes the round's lower edge; never the headline |
| Type | `h1`, lede, the one action | Stable, greets | Fully readable on landing |

## Assets (all generated in this repository; generators in `tools/alc-assets/`)

| Asset | Replaces on the live site | Source |
|---|---|---|
| The round (hero), far plane | AI hero imagery | NOAA ITRDB AUS123C, series PEB07A, every ring |
| The core strip (signature) | none (new) | The same radius, the same rings |
| Plate: tracheids | AI IV-bag and vial images | Measured widths of 1664 to 1666; cells illustrative |
| Plate: branchlet | AI peptide imagery | Drawn from the species' habit; illustrative |
| Plate: cross-dating | AI hormone imagery | PEB07A against PEB07B, 1446 to 1505, five matched narrow rings |
| Plate: century ledger | AI weight-loss imagery | PEB07A, 1003 to 2012, 30-year running mean |
| Mark and favicon | AI caduceus badge | Four rings of the same round, and its core line |
| Location plate | none (address only) | OpenStreetMap, ODbL |
| Journal cores (16) | AI blog thumbnails | Sixteen other series from AUS123C and AUS118 |
| Decade-dot notation | generic icon set | The dendrochronology marking convention |
| Social card | none | The round and the wordmark |

---

## Step 5: verification (2026-10-05)

Harness (`shoot.mjs`, engine untouched), final code:

| Run | Length | Acts | Dead scroll | Contrast at worst frame |
|---|---|---|---|---|
| Desktop 1440 x 900 | 12.7vh | pin > pan > flow > flow (reveal) | none | all cues clear 4.5:1 |
| Phone 390 x 844 | 16.7vh | same | none | all clear |
| Compact 360 x 640 | 19.3vh | same | none | all clear |
| Reduced motion, 1440 x 900 | 10.4vh | same | none | all clear |

Phone lengths run long because the protocol table and the form are long in one column. That is content, not pinned scroll. The pan's span drops to 4.4 on phones, and the specimen act to 2.6 under reduced motion.

Findings fixed during verification, in order: the strip computed its ground before the engine pinned act 1, so it rendered dark on dark. The far plane showed hard rectangular edges, now feathered with a radial mask. The 1003 note collided with the figure line. Decade dots squashed to nothing inside the non-uniformly scaled SVG, so they are now an HTML layer. The engine's tabular figures opened gaps before commas in table text. On phones, the rail figure kept its desktop aspect ratio, and the hero round sat below the fold. The `hidden` attribute lost to author `display` rules, which left conditional questions, an empty result box and a step-one Back button showing. The harness flagged one contrast failure: the hero copy box overlapped the paper label, though the text itself never did. It was fixed by narrowing the box, and it reads clean now.

Form: 39 of 39 functional checks pass (see README). Every page at 390px: no horizontal overflow, no console errors, no failed requests.

Not verified: a real phone, a screen reader end to end, and the live endpoint and Stripe link (neither exists yet).

## Feel check

Not cold: the checker built the page. Read from the final contact sheets, one word per act, then diffed:

| Act | Intended | Felt | Change made |
|---|---|---|---|
| 1 open | Stillness | Composed | none |
| 1 peak | Awe | Intrigue, at first: the drawn core was a hairline and the moment read as delicate | The core was thickened during extraction, and the round dims to 38% as the core slides out. The drawn core now reads as an object, and the lay-out across the full width is the largest change on the sheet. |
| 1 close | Clarity | Clarity | none |
| 2 | Orientation | Browsing | none (same intent) |
| 3 | Assurance | Steadiness | none |
| 4 | Resolve | Readiness | none |

Peak checks: the largest visual change on the sheet is the core laid out (act 1, 0.54 to 0.68). Act 1 has the most scroll room (span 4.8). The authored stillness of 0 to 0.12 comes before it. The page resolves into the form: its last content screen is an input with the fee beside it.
