# BRIEF.md: Australian Longevity Clinic, third scroll-craft build

**Directed by the client.** Revision notes received 5 October 2026, after review of the second build. The client's words are quoted verbatim below. Anything the notes did not cover is an authored decision and is labelled as one. No quotation is invented.

The second build (row `alc-specimen` in `scrollcraft/FINGERPRINTS.md`) is replaced, not re-skinned. What the client kept and what went:

| Kept | Gone |
|---|---|
| The navy, quartz and gold system, the type, the header with the clinic's medallion | The tree: the Huon pine round, the core, the four drawn plates, the journal cores |
| The list of services ("the list of services, that's a really good part") | "Every ring is measured before anything is said about the tree" and every figure caption about wood |
| The doctors' photographs and records | "Two doctors run the clinic." ("don't kind of show it off as like, oh, it's only two doctors because that's a weakness") |
| The assessment form, unchanged | |
| The humanised journal and program copy | |

---

## Step 0: the eight topics

1. **Vibe, plus references.**
   Client, verbatim: "real peptide therapy done by real doctors", "a more like a data-driven approach".
   Authored references (not websites): a pathology report that a patient can actually read; the label on a pharmacy dispensing bag; a strength coach's training card.

2. **The journey, section by section.**
   Client, verbatim: "I would simply first skip to what the clinic does and kind of read it as a more like a data-driven approach." "You can include the faces and kind of profiles of the two doctors ... These are our head doctors and this is how much experience they have." Authored order: what the clinic does and for whom, the programs, what gets checked before anything is prescribed, the lead doctors, the assessment.

3. **The energy curve.**
   Authored. Direct and confident at the top. Lighter while browsing the programs. Loudest at the moment the tests assemble. Calm with the doctors. Decisive at the form.

4. **Feeling stage by stage, and the ONE moment.** See the feeling curve and the peak below.

5. **One thing no site they have seen does.**
   Authored from the client's notes. You say what you want ("better skin", "lose weight", "feel big and strong"), and the page shows the exact tests a doctor would run first, what has to be true before anything is prescribed, and when you would be re-tested. The choice then carries into the assessment.

6. **How far from premium-minimal.**
   Authored. **Dense, pulled toward premium.** Information-forward panels and real test names on the approved navy and quartz system. No luxury-minimal emptiness; no decoration that is not data.

7. **One unbroken world, or distinct scenes?**
   Distinct scenes. Worldflight stays excluded (the client ruled it out in the first brief).

8. **What assets do they already have?**
   The clinic's medallion (from its live site), the two doctors' photographs (from the profile image supplied with the brief), and the clinic's own published facts, which this build treats as data: test names, reference ranges, re-test intervals, timeframes. No image generation. The client's direction is "data-driven", and every visual on this page is either a photograph of a real doctor or typeset from real data.

## Step 1: journey first

- **What is this, and who is it for?** A doctor-led clinic at 628 Ipswich Road, Annerley, Brisbane: peptide programs, testosterone therapy, medical weight management and IV therapy. Client, verbatim, on what the audience wants: "What people want is like better skin. They want to lose weight. They want to get TRT so they feel big and strong. These are kind of the things that we should be catering to."
- **What must the visitor believe by the end?** *Real doctors will check the right things before prescribing what I'm after, and they'll tell me if it isn't right for me.*
- **What does the visitor do next?** Begin the assessment. One label everywhere: **Begin your assessment**.

### Journey beats

```
1  Recognition  what you want, said plainly, and the real doctors who prescribe it     act 1
2  Choice       the four programs, each led by the goal it serves                       act 2
3  Proof        pick a goal: the tests, the prescribing rule, the re-test dates         act 3 (peak)
4  Trust        the lead doctors: faces, qualifications, the years behind them          act 4
5  Commitment   the assessment, already set to the goal you picked                      act 5 (close)
```

## Step 2: grammar, signature move, gate, curve, score

### Grammar: goal route (new)

Defined by structure, not by a label:

- **The unit is the visitor's goal.** Every section is organised by what someone wants (lose weight, feel strong again, better skin and hair, more energy), not by the clinic's departments. A program appears as the answer to a goal.
- **Sequence is the order of a consultation:** what you want, what can help, what we check, who decides, how you start. Each act answers the next question a patient would ask.
- **Navigation:** the approved header, plus the goals themselves as an index. Every goal on the page is a control that routes to the same goal everywhere else: the hero, the programs, the route and the form.
- **Hero:** the goals and the real doctors, on the first screen, with the call to action visible.
- **Close:** an actual input. The assessment, opened on the goal the visitor chose.
- **Leans on:** `pin` for the one place evidence assembles, `pan` for the range, `flow` + `in` for reading, `reveal` for the change from reading to doing, pointer response where it is useful.
- **Bans:** metaphor imagery standing in for medicine (no trees, no molecules, no glowing DNA); stock or generated photography; invented numbers of any kind, so no counters; outcome promises; testimonials; `scrub`; kinetic headline stacks; a split header (giant heading left, small paragraph right).

Why the eight defined grammars lost:

| Grammar | Why not |
|---|---|
| Filmic one-shot | Carries the burden of proof, and the client asked for "data", not a film |
| Chaptered editorial | The first build (`alc-home`) used it; editorial distance is what the client is moving away from |
| Live surface | Forbids marketing chrome and display headlines, and this page has to sell to consumers |
| Continuous world | Ruled out by the client in the first brief |
| Typographic poster | Bans the `pan` rail, which the client wants to keep |
| Gallery / catalog | Forbids persuasion in the labels; the client wants copy that caters to what people want |
| Split stage | Bans `pan`; and "what you want" against "what we check" is a route, not a contest |
| Rhythmic cutlist | Bans `pin`, and the proof needs a held frame |

### Signature move: your goal, routed

Tap a goal anywhere on the page and the page routes to it. In the pinned route act, the tests a doctor would order for that goal rise into a panel one row at a time, each with what it measures (and its reference range where the clinic publishes one), then the rule that has to be true before anything is prescribed, then when you would be re-tested. Scrolling through the act walks all four goals in turn. Choosing one sets the program in the assessment form, so the close opens on the visitor's own goal. Coded in the page from one data object that also builds the program pages' panels; the engine is untouched.

The act measures its panels before it pins. A whole panel that fits is shown whole. One that doesn't is split: its tests first, then the rule and the re-test in their place. Where even half won't fit, or motion is reduced, nothing pins, the panels stack, and on phones the goals ride in a sticky row that lights the goal in view. The peak sentence holds in all three: a tapped goal always lands on its full list of tests.

### Fingerprint gate

| Dimension | `alc-home` | `alc-specimen` | This build | Differs from home | Differs from specimen |
|---|---|---|---|---|---|
| Grammar | Chaptered editorial | Specimen study | Goal route | yes | yes |
| Nav treatment | Margin folio, no bar | Fixed strip that takes the ground beneath it | The same fixed strip | yes | **no** |
| Hero device | Title page, type alone | Layered data-drawn specimen with a paper label | Goals as controls over layered real portraits and a defocused field of real test data | yes | yes |
| Act-sequence shape | 7 acts, one pinned, about 9vh | pin (peak first) > pan > flow > flow > reveal, 5 acts, 14.2vh | flow > pan > pin (peak third) > flow > reveal, 5 acts, 13.5vh | yes | yes |
| Close pattern | Colophon plate | The assessment form | The same form, now opened on the chosen goal | yes | **no** |
| Signature move | A care pathway that draws its own exit | The core leaves the round | Your goal, routed | yes | yes |
| **Total** | | | | **6 of 6** | **4 of 6** |

Passes. The nav and the form are shared with `alc-specimen` on purpose: the client approved both and asked for them to stay.

### The feeling curve

| Act | Feeling | What on screen causes it |
|---|---|---|
| 1 Hero | Recognition: that's what I'm after | Their own goals as the first controls; the faces of the doctors who prescribe |
| 2 Programs | Choice | Four programs, each led by the goal it serves, side by side |
| 3 Route | Confidence | The exact tests, the prescribing rule and the re-test dates assemble for the goal they picked |
| 4 Doctors | Reassurance | The lead doctors' faces, their qualifications exactly as they hold them, and their experience as the clinic gives it |
| 5 Form | Resolve | The questionnaire opens on the goal they already chose |

No two adjacent acts share a feeling.

### The peak

> I tapped "feel strong again" and it listed every blood test they'd run before prescribing anything, and when they'd test me again.

Act 3. It gets the largest span on the page, the only pinned frame, and the quietest act before it (the end of the programs rail, "Not sure which?").

### Tell-someone sentence

> It's the site where you tap what you want and it shows you the exact blood tests a doctor runs first, then fills that choice into your sign-up.

### Authored silence

None. The rail's last panel ("Not sure which?") is the quiet beat before the peak, and it carries content.

### Score

| Beat | Device | Why this one |
|---|---|---|
| Recognition | `flow` + `parallax` planes + pointer depth | A first screen that is complete before any scroll, with depth that answers the pointer |
| Choice | `pan` | Lateral travel reads as options. Kept at the client's request |
| Proof | `pin` + the route panel | The frame holds while the evidence assembles. Largest span on the page |
| Trust | `flow` + `in` | Faces and credentials at reading pace |
| Commitment | `reveal` | The paper arrives over the dark: a change of state from reading to doing |

Five acts, five device families, none repeated in a row.

### Layer contract (hero)

| Plane | Content | Motion | Notes |
|---|---|---|---|
| Far | A field of the clinic's real test names, reference ranges and re-test intervals, typeset and defocused | parallax -1.3, pointer 14px | Decorative, hidden from assistive tech |
| Subject | The lead doctors' photographs, mounted, with their post-nominals exactly as they hold them | parallax -0.5, pointer 8px | Real photographs, not retouched |
| Near | A paper slip listing the tests for whichever goal is under the pointer or focus | parallax +0.45, pointer -6px | Overlaps the photographs' lower edge; updates live |
| Copy | Heading, one line of subtext, the goal chooser, the call to action | 1x | Never on a moving plane |

Phones: copy first, then the photographs with the slip below them. The far field sits behind the photographs only. No pointer response. Reduced motion: the same composition, still.

## Copy: humanscope structure sheet

Mode A (structure first), scoped for marketing and explainer copy. For copy at this length the decisions that transfer are the moral, emotion, references, reader address and how clean the clinic is allowed to look. Timeline, subplots and resolution are read as the page's order and ending.

| # | Decision | Choice | Why |
|---|---|---|---|
| 1 | Timeline | Open on the result the visitor wants, then step back to how it's reached | The client: "first skip to what the clinic does" |
| 2 | Subplots | One parallel thread: the doctors, alongside the programs | They are the proof of "real doctors" |
| 3 | What causes the ending | Mixed: the visitor chooses, the bloods decide | It's true, and it's the measure-first rule |
| 4 | How it ends | An action: the form | Not a realisation, not a slogan |
| 5 | The moral | **Never stated.** No closing line explains why testing matters; the test lists make the case | Breaks the AI default hard |
| 6 | Emotion | **Plain words**: tired, flat, fed up, strong. No body metaphors | Breaks the AI default hard |
| 7 | How the lead enters | The visitor enters mid-want ("Lose weight"); the clinic enters through named doctors, not a description of itself | Avoids "a doctor-led clinic committed to..." |
| 8 | References | **Named, everywhere**: HbA1c, SHBG, ferritin, Schedule 4, the RACGP, AHPRA, 628 Ipswich Road, 6 to 12 weeks | Breaks the AI default hard. Nothing vague like "cutting-edge science" |
| 9 | Reader address | "You" in the hero and the route, not in every sentence | Natural for consumer copy |
| 10 | Is the lead morally clean? | **No.** The clinic admits limits: "if low testosterone is the reason", "sometimes the answer is no", "the evidence is limited" | Breaks the AI default hard. For this audience, limits read as credibility |

Budget: four hard breaks (5, 6, 8, 10). The rest sit where the page naturally wants them.

Guardrails the copy keeps, because the law and the clinic's own pages require them: no prescription medicine named on the site's own pages; no promise of an outcome; testosterone only for men whose bloods confirm a deficiency, and never framed as bodybuilding (the clinic's testosterone page rules out performance enhancement); no testimonials; experience shown as the doctors' profile gives it, never summed across the doctors into a headline figure.

## Assets

| Asset | File | Source |
|---|---|---|
| Data field (hero, far plane) | `assets/img/data-field-*.webp` | Typeset by `tools/alc-assets/gen_datafield.mjs` from the same data that builds the route panels, in the site's own mono face, then defocused |
| Route panels | inline, built from `ROUTES` in `tools/alc-site/routes.mjs` | The clinic's published tests, ranges and re-test intervals; the two lines that are this build's wording are listed in the README |
| Goal plates (programs rail) | inline type | The four goals, set as the image |
| The doctors' portraits | `assets/img/doctors/` | The supplied profile image, cropped, one light grade |
| Logo, favicons, touch icons | `assets/img/logo/` | The clinic's medallion |
| Location map | `map-annerley.svg` | OpenStreetMap |
| Social card | `og.jpg` | The headline, the medallion, both doctors' photographs, the Lose weight tests and the data field |
| Form progress | inline | Five segments, one per step |
| Retired | the round, its far plane, the core, the four drawn plates, the journal cores, the light round, the progress rings, the ring mark, the dark map | Removed with their generators and the ring-width data |

## Step 5: verification

Run on the final code, 5 October 2026. Full results are in the README.

| Run | Page length | Route mode | Result |
|---|---|---|---|
| Desktop 1440 x 900 | 13.5 viewport heights | whole | No dead scroll, no contrast flags, no console errors, no failed requests |
| Phone 390 x 844 | 19.2 | split | The same |
| Compact phone 360 x 640 | 22.5 | static | The same |
| Reduced motion, 1440 x 900 | 12.7 | static | The same |

Also: the route stepped through at 14 screen sizes with no panel ever running off the screen; 49 of 49 form and routing checks, including the goal routing with and without motion, a tap test after the whole route has been walked, and both halves of a split panel; 24 pages at 320, 390 and 1440 px with no overflow or errors; 1,386 internal references with none broken; no em dashes, stock phrases or tree vocabulary anywhere.

Found and fixed before sign-off: the test rows appeared a third of a second late (a specificity slip between the hidden and shown states); rows from a goal already passed stayed live behind the current one and took its taps, and in split mode the faded tests took the taps meant for the button that replaced them (both found while recording the walkthroughs; panels now reset when left, and only what is showing takes a tap); the tests slip covered a doctor's photograph on phones; and the tallest panels ran off a phone screen, which is what the measured modes now prevent.

## Feel check

Read act by act from the final contact sheets, against the curve above.

| Act | Intended | On the sheet | Verdict |
|---|---|---|---|
| 1 Hero | Recognition | Desktop: the headline, the four goals, the button and both doctors' faces on the first screen. Phone: the headline, goals and button first, the doctors one scroll down. | Holds. On a phone the faces come second, by design: the client asked to lead with what the clinic does. |
| 2 Programs | Choice | One goal plate at a time, each with its tests along the top and its four-row label | Holds |
| 3 Route | Confidence | Every panel assembles: tests rise, then the rule and the re-test. "Feel strong again" lists six tests and the schedule. | Holds where it pins. On iPhones in Safari it stacks instead, and the moment of assembly is lost there; the routing and the full list are not. |
| 4 Doctors | Reassurance | The head, then each record: face, post-nominals, experience, dated training, and what the clinic won't do | Holds |
| 5 Form | Resolve | The paper arrives over the dark, already set to the goal the visitor picked | Holds (checked by test, not only by eye) |

The peak sentence is true as written: tapping "Feel strong again" lands on every blood test a doctor checks first and the dates they test again. What a reviewer may still question: the defocused data behind the hero is legible in places by design, and some will read it as busy; the slip overlaps the lower half of the doctors' photographs on desktop, never their faces.

---

## History

- **First build** (`alc-home`, chaptered editorial) was replaced in full.
- **Second build** (`alc-specimen`, specimen study): a Huon pine cross-section drawn from NOAA ring data, a core drawn out of it as the signature move. Revision 2 added the clinic's own logo, the doctors' register, the navy ground and humanised copy. The client kept the logo, the doctors, the services list and the form, and asked for the tree to go. Its brief, assets and generators remain in the git history (commit `60a21d1`).
- **Third build** (`alc-route`, goal route): this brief.
