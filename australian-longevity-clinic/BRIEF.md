# BRIEF.md — Australian Longevity Clinic, home page

**Self-authored where not interviewed.** The user set the direction in two messages and asked for the scroll-craft skill to be used. Topics 1, 6, 7 and 8 below carry their words verbatim. Every other decision is authored in the brand's voice and labelled as such. Nothing below is an invented user quotation.

Build folder: `australian-longevity-clinic/` (the site). Registry: `scrollcraft/FINGERPRINTS.md` (empty at the time of this build: first build, nothing to clear).

---

## Step 0: the eight topics

1. **Vibe in three to five words, plus references.**
   User, verbatim: "premium, trusted", "more editorial rather than a bunch of different AI-generated assets", "more premium".
   Authored references (medium, not sites): a clinical journal's front section; a Penguin paperback with one spot colour; a well-set observation chart.

2. **The scroll journey, section by section.**
   Authored. Title page, then five chapters and a colophon: what this is; the four programs; how care works here; standards you can check; the doctors; where and when, and the one action.

3. **The energy curve.**
   Authored. Quiet open, quieter ledger, the one loud chapter in the middle (the pathway drawing), a hard dark cut that is heavy rather than loud, then a slow settle to small type.

4. **Feeling stage by stage, and the ONE moment.**
   Authored. See the feeling curve and the peak below.

5. **One thing this site should do that no site they have seen does.**
   Authored. Draw the patient's whole pathway in front of them, including the exit. Longevity sites sell forward motion; this one draws the line back to review and a square that means stop.

6. **How far from premium-minimal.**
   User, verbatim: "more editorial". Family: **Editorial** (paper, folios, measure, restraint).

7. **One unbroken world, or distinct scenes?**
   User, verbatim: "not like a world that we'd be flying through". **Distinct chapters.** Worldflight is excluded by the brief.

8. **What assets do they already have?**
   User, verbatim: "not a bunch of different AI-generated assets". No photography, footage or brand kit was supplied, and the live site could not be fetched from this environment (host blocked by network policy). **No assets are generated.** Photo positions are typographic plates with captions, to be replaced by the clinic's own photography. The chart in chapter III is drawn in SVG from the page's own code.

## Step 1: journey first

- **What is this, and who is it for?** A doctor-led clinic in Annerley, Brisbane, for IV infusion therapy, peptide programs, testosterone therapy and medical weight management, for adults who want these things handled as medicine rather than as a menu. (From public listings.)
- **What must the visitor believe by the end?** *This clinic will assess me before it treats me, and it will tell me if it should not.*
- **What does the visitor do next?** Book a consultation. One label, used everywhere: **Book a consultation**.
- **What do you already have?** Verified public facts only: name, address (628 Ipswich Road, Annerley QLD 4103), hours (Mon–Fri 8:00am–6:00pm, Sat 9:00am–2:00pm), email, services, team qualifications (MBBS, FRACGP, MRCGP, DRCOG; AHPRA registered), suburbs served. No phone, no doctor names, no prices. Placeholders are explicit where facts are missing.
- **Art direction.** Paper and ink with a single cobalt spot colour. The world is typographic; where a photograph will sit, a captioned plate holds the place. No generated imagery (user's instruction).

### The journey (beats)

```
1  Recognition   a field full of promises; a person who wants a doctor          title page + chapter I
2  Orientation   the four programs, set as a ledger, facts not pitch           chapter II
3  Clarity       how care works here, drawn in front of them, exit included    chapter III  (PEAK)
4  Weight        standards they can check, on an ink ground                    chapter IV
5  Trust         the people and how they practise                              chapter V
6  Resolve       where, when, and the one action as a line of running text     colophon
```

## Step 2: grammar, signature move, gate, curve, score

### Grammar: chaptered editorial

The page is a printed feature. Hard cuts between chapter grounds, intertitles, dense asymmetric spreads, media in its own column with a caption, a folio in the margin instead of a fixed bar, a title page instead of a media hero, a colophon instead of a CTA island.

Why the other seven lost:

- **Filmic one-shot**: the brief rejects being carried through a film ("not a world we'd be flying through"); a clinic needs to be read, not watched.
- **Live surface**: there is no product surface; the clinic is people and process.
- **Continuous world**: excluded by the brief in so many words.
- **Typographic poster**: one claim at extreme scale cannot hold the substance a medical service must show (process, standards, eligibility), and it forbids the ledger and the chart.
- **Gallery / catalog**: the visitor's question is "should I trust you", which that grammar explicitly does not answer; four programs are not a walkable collection.
- **Split stage**: there is no two-sided argument to resolve.
- **Rhythmic cutlist**: pulse and speed are the opposite of the calm a clinic has to project.

### Signature move: the pathway that draws its own exit

In chapter III the stage pins and a clinical pathway chart draws itself under the reader's hand. Page-local JS reads the act's `--sc-p`, drives the main stroke's `stroke-dashoffset`, lands four stations in sequence (Consultation, Assessment, Program, Review) with their dimension-line callouts cueing in, then draws the two things no longevity page draws: a dashed return line from Review back to Program, and a short terminal to a square end-mark labelled **or stop**. The stage publishes `data-sc-verify-state` (rounded draw progress and stations landed) so the harness can see the motion. Under reduced motion the chart is shown complete. The engine is untouched.

### Fingerprint gate

Registry is empty. First build: nothing to clear. Row appended after shipping.

### The feeling curve

```
0  Title page    Calm         type alone on paper, present on landing; the thesis in one line
1  Chapter I     Recognition  the visitor's situation, named plainly; the numeral wipes in like a page turn
2  Chapter II    Orientation  four programs as a ledger; the quietest spread on the page (authored silence before the peak)
3  Chapter III   Clarity      the pathway draws under the hand; the last strokes are the return line and the stop mark   PEAK
4  Chapter IV    Weight       hard cut to ink; six standards, one of them a public register you can open
5  Chapter V     Trust        the people: qualifications, how they practise; one portrait column moving at its own rate
6  Colophon      Resolve      small type, address, hours, the one action as running text; the page stops and holds
```

**The peak**, as the visitor would say it: *"the care pathway drew itself across the page as I scrolled, and the last thing it drew was the line back to review and a small square that said stop."* Lives in chapter III, the largest span on the page.

**Tell-someone sentence:** It's the site where the clinic draws your whole pathway, including the exit, before it asks you to book.

**Authored silence:** chapter II is deliberately still (a ledger that rises once and then holds) so chapter III has something to arrive from. It is a flow act and is excluded from dead-scroll detection by design.

### Score

| Beat | Act | Device | Why this one |
|---|---|---|---|
| Recognition | 0 title page | `flow`, greet | A title page is present the instant the page lands; nothing competes with the sentence |
| Recognition | 1 chapter I | `reveal` (left) on the intertitle numeral, `flow` + `in` on the spread | A page turn is a wipe; the spread rises once and stays |
| Orientation | 2 chapter II | `flow` + `in` with stagger, no other device | Reading, not watching. The authored quiet before the peak |
| Clarity | 3 chapter III | `pin` (span 2.4) + bespoke stroke draw + cues | Scroll is the pencil; the largest span on the page by a visible margin |
| Weight | 4 chapter IV | hard ground cut to ink, `reveal` (left) on the numeral, `flow` + `in` | A cut is a change of state; the ground changes under the reader |
| Trust | 5 chapter V | `flow` + `parallax` inside the media column | Depth without spectacle; the prose stays still |
| Resolve | 6 colophon | `flow`, holds | The last screen stands still with content on it |

Checks: four device families (`flow`+`in`, `reveal`, `pin` with the bespoke draw, `parallax`); no principal device repeated back to back; no `scrub`, `spotlight`, `magnet`, `drift` or kinetic crossfade type, per the grammar's bans; one peak with the largest span; planned length about 9 to 10 viewport-heights, which is short for a reason (editorial grammar, complete journey).

## Step 3: assets

None generated, by instruction. Plates are typographic frames with a caption naming the photograph to be supplied. The chart is inline SVG.

## Step 4: build notes

- Engine files copied verbatim to `assets/scrollcraft/`; themed by tokens only.
- Type: Newsreader (display and prose; the grammar is a printed feature, which is the one case the taste floor allows a serif without argument) and Geist (labels, folio, tables). Two families.
- Colour: bone paper, near-black ink, tinted secondary ink, one cobalt accent. Chapter IV hard-cuts to an ink ground with `color` restated and the accent re-stopped to a lighter cobalt of the same hue, the licensed two-stop case for pages that cut between grounds. No cream-and-brass.
- Chrome: no fixed bar. A folio in the left margin (chapter numeral and title, all chapters listed, current one in ink, clickable). On phones the folio is a small fixed tag at the top left that opens the same list.
- No eyebrows, no scroll cue, no counters (no verified figures), no testimonials (National Law), no prescription-medicine names (TGA advertising code), no em dashes.
- Mobile composition is authored separately: the title page steps down two type rungs, the chart turns vertical, the media column stacks under the prose.

## Step 5: verification plan

- Serve locally, run the harness at 1440×900, 390×844 and under reduced motion; read the contact sheets; walk focus order; run the feel check cold and diff it against the curve above.
- What a green run will not cover here: a real phone (no device available), and the harness is running Playwright's Chromium rather than installed Chrome. That matters only for h264 clips, and this page has none.

---

## Step 5: what was verified, and the feel check

**Harness.** Served locally with the web fonts served from disk (the sandbox's TLS proxy blocks Google Fonts in headless Chromium; the published page loads them normally). `shoot.mjs` at 1440×900, 390×844 and under reduced motion, six samples per act plus the page ends: **no dead scroll, every cue reaches full opacity, every graded line clears 4.5:1 at its worst frame, no console errors, no failed requests.** Contact sheets and per-frame screenshots are in `scrollcraft/lab/` (not committed). Links and chapter anchors across all eight pages resolve. No horizontal overflow at 390px on any page.

**Feel check, run cold on the contact sheets before rereading the curve above.**

| Act | Intended | Felt, first pass | Change made |
|---|---|---|---|
| Title | Calm | Calm | none |
| I | Recognition | Settled | none; the lede names the field's noise, which is the recognition |
| II | Orientation | Orderly | none |
| III | Clarity | Waiting, then clarity | the empty opening was the finding: the line now begins at the first station, which is present with its label the moment the pin starts, and the dotted grid that ran behind the labels became a ruler of ticks under the line |
| IV | Weight | Weight | the ink ground now cuts full-bleed under the folio instead of leaving a paper strip |
| V | Trust | Credentialed, unfinished | none possible here: the portrait plate reads as the placeholder it is until the clinic's photography goes in |
| Colophon | Resolve | Resolve | the email address no longer breaks mid-word |

**Peak.** Chapter III has the most scroll room by a clear margin and is the only moment the page answers the hand. On a static sheet the hard cut to ink in chapter IV is the loudest single frame; in scroll it reads as weight, not spectacle, and it arrives after the peak rather than competing with it. Noted honestly rather than softened.

**Two authored departures from the device notes.** The station labels, caption and closing line in chapter III hold once they arrive (one-value cues) instead of closing by the end of the pin. The rule exists to stop a held line travelling over the section that follows; these cues live inside the sticky stage and leave with it, so nothing can stray, and the chart stays complete through its exit slide. And the page carries a `<noscript>` style so that the engine's hidden-until-revealed content is visible when JavaScript is off: a clinic page should never be blank.

**Not verified.** A real phone (none available here); Playwright's Chromium rather than installed Chrome, which only matters for h264 clips and this page has none; and the fonts in the harness came from disk rather than Google's CDN.
