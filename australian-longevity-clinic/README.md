# Australian Longevity Clinic: website rebuild

A rebuild of [australianlongevityclinic.com.au](https://australianlongevityclinic.com.au/) as a static site: HTML, CSS and a little JavaScript. No framework, no tracking, no third-party requests.

Built with the **scroll-craft** skill as a *specimen study*. The home page opens on one real specimen, a Huon pine cross-section drawn ring by ring from NOAA tree-ring measurements. As you scroll, a core is drawn out of it and laid across the screen as a thousand-year record. That is the clinic's argument made visible: read the whole history before prescribing anything. Every drawn image on the site comes from real data, and none comes from an image generator. Two things are used as they came: the clinic's logo, from its live site, and its doctors' photographs, from the image supplied with the brief. The brief, the fingerprint gate and the verification results are in `BRIEF.md`.

## Revision 2 (5 October 2026)

Everything approved in the first build stays: the direction, the drawn assets, the assessment form and the structure of every page. Four things changed.

- **The clinic's own logo.** The medallion from the live site's header now appears wherever a logo does: the header, the phone menu, the footer, the favicons, the home-screen icons, the social card and the structured data. It is the original file, not a redrawing. The only change is that the white square around it was made transparent, so it sits cleanly on navy (`tools/alc-assets/logo_cutout.py`). The drawn ring mark it replaces is retired.
- **The doctors.** A dedicated section on the home page, between the four programs and the protocol, and a rebuilt doctors page. Each doctor has an entry in a ruled register: the photograph, the name and qualifications exactly as the supplied image shows them, the dated training entries, and a small calendar drawn like the site's tree cores. See *The doctors* below.
- **Humanised education copy.** The four program pages, the FAQs, the doctors page, the home page's explanations and all fourteen journal articles were edited with the humanscope method, so they read as written by a doctor rather than generated. Every number, test, caveat and disclaimer was kept, and claims the evidence doesn't support were softened and listed. See *Humanised copy* below.
- **Navy.** The dark ground is now the medallion's navy, where it was forest green. Nothing else about the palette or the art direction changed, and every colour pair still passes WCAG AA.

The measure-first introduction is unchanged, word for word, in the same place.

## Preview

```bash
cd australian-longevity-clinic
python3 -m http.server 8080          # then open http://localhost:8080
```

Opening `index.html` straight from disk also works. The browser will log harmless font-preload warnings that do not happen on a real server.

## Before launch: things only the clinic can do

| | What | Why |
|---|---|---|
| **Blocking** | Connect the assessment form. Set `data-endpoint` (where the answers are POSTed as JSON) and `data-checkout-url` (a Stripe Payment Link for the $75 fee) on `<form id="intake">` in `tools/alc-site/build.mjs`, then rebuild. | Until then the form runs as a preview. It validates and reviews, then says plainly that nothing was sent and nothing was charged. It never shows false success. |
| **Blocking** | The endpoint must store health information securely in Australia (for example a practice-management system's intake API, or a form backend with an Australian region and a signed agreement). | It is sensitive information under the Privacy Act. |
| **Blocking** | One of the doctors reads and approves every edited journal article, starting with the clinical points listed under *Humanised copy*. | The journal is attributed to the clinic's medical team, and its wording changed in this revision. |
| **Blocking** | The clinic's compliance adviser reviews the content listed under *Content changes*, especially the journal articles that name prescription medicines. | TGA advertising rules and AHPRA's advertising guidelines. |
| Recommended | The doctors confirm their records (see *The doctors*) and add their AHPRA registration numbers. | For this audience a named, checkable doctor is the strongest trust signal there is. |
| Recommended | Connect the journal sign-up (`data-endpoint` on `form.news`). | It says it is a preview until connected. |
| Recommended | Redirect `/blog/ozempic-vs-mounjaro-brisbane` and `/blog/bpc-157-gut-health-brisbane` to `/blog/`. | Those two articles are not carried over (see below). |
| Optional | The privacy policy (carried over word for word) mentions cookies, analytics and document uploads. This build has none of them. Leave the policy as is, or update it. | Accuracy. |

How the form hands over: on submit it POSTs the answers, expects `2xx` with an optional `{ "id": "...", "checkoutUrl": "..." }`, and then opens Stripe with `client_reference_id` and `prefilled_email` set so each payment matches its answers. Without JavaScript, the form still posts every step's fields (never by GET).

## Pages

| Path | What |
|---|---|
| `index.html` | Home: the specimen act (the signature move), four program plates on a sideways rail, the doctors' register, the protocol, and the assessment as the ending |
| `iv-drips/` `peptide-therapy/` `testosterone-therapy/` `weight-management/` | One page per program. Same URLs as the live site; weight management is new. |
| `our-team/` | The doctors: both records in full, including special interests, how they practise, and how to check a registration on the AHPRA register |
| `contact/` | Address, hours, the location plate, the full assessment and its FAQs |
| `blog/` and `blog/<slug>/` | The journal: 14 of the clinic's 16 articles, each filed with a different tree core |
| `privacy-policy/` | The clinic's policy, carried over word for word |
| `404.html` | Not-found page (root-relative links, so hosts can serve it at any depth) |

Every page is generated by `../tools/alc-site/build.mjs` from shared parts: the header, footer, doctors' register and assessment form are identical everywhere they appear. Edit the builder, not the HTML, then run `node tools/alc-site/build.mjs` from the repository root. The doctors' records live in one place, `DOCTORS` in `build.mjs`.

## The doctors

Source: the profile image supplied with the brief, kept at `tools/alc-assets/data/doctors-supplied.webp`. Every word of it is legible. The register shows:

| | Dr Raman Bohra | Dr Rekha Bohra |
|---|---|---|
| Qualifications, as shown | MRCGP, FRACGP | MB BS, DRCOG, MRCGP (U.K), FRACGP |
| Medical school | Jaipur, India. Graduated 2001. | Jaipur, India. Graduated 1999. |
| Fellowship | FRACGP, obtained in the United Kingdom, 2008 | FRACGP, obtained in the United Kingdom, 2013 |
| Also | | DFRSH, Royal College of Obstetricians and Gynaecologists, 2012 |
| Experience | 18 years | (not given) |
| Special interests | As written in the image (doctors page) | As written in the image (doctors page) |
| Languages | English, Hindi, Punjabi | English, Hindi |

Two sentences of the image are left out on purpose. "She is a very kind and caring General Practitioner" describes a personality, not a qualification. "Dr Raman Bohra has embarked on a new journey in the world of cosmetic injectables" announces a service this site doesn't offer, and cosmetic procedures have their own AHPRA advertising rules. Nothing was added. The abbreviations carry their standard expansions on hover and for screen readers; the visible text is exactly as shown.

The photographs are the ones in that image, cropped and given one light print grade so the two sit together (`tools/alc-assets/portraits.py`). Nothing in them was retouched or generated.

Worth confirming with the doctors. All of this is legible and shown as written; these are the lines a careful reader may query:

1. Both bios say the FRACGP was obtained "in the United Kingdom". The FRACGP is awarded by the Australian college. It may well be right, since the RACGP recognises UK-trained GPs, but it reads oddly.
2. Dr Rekha Bohra's bio gives a DFRSH (2012) that her post-nominals line doesn't include.
3. "18 years" of experience will date. Counted from the 2008 fellowship it is 18 in 2026; counted from graduation in 2001 it would be 25.
4. "Pap-Smear": the National Cervical Screening Program replaced the Pap smear with the Cervical Screening Test in December 2017.
5. "Adult gynecology" is the US spelling, kept as written.

## Humanised copy

Method: the humanscope skill in audit mode, scoped for explainers. Its premise is that machine-written text gives itself away through its shape more than its words, so the edits are structural. Cut the closing paragraph that restates the article. Break the run of identical sections (heading, two paragraphs, a bullet list, repeat). Name the specific thing where the text gestures vaguely, but only when the specific is already known. Say feelings plainly. Address the reader where it comes naturally. Language rules on top: no em dashes, Australian spelling, no stock phrases.

The rules for medical content were stricter than the style rules. Every number, dose, duration, threshold, test, timeframe and contraindication is kept exactly. No new benefit, mechanism, study, statistic or medicine was added, and no caveat, risk or disclaimer was removed. Claims the evidence doesn't support were softened, never strengthened, and each one is listed. The clinic's measure-first rule is consistent everywhere: nothing is prescribed from a questionnaire alone, and sometimes the answer is no.

**The site's own pages.** The four program pages and their FAQs, the contact FAQs, the doctors page and two lines on the home page. Ledes that read as compliance text now say plainly what happens. FAQ answers start with the answer. Generic closing lines are gone ("Every recommendation is individual"). One list of tips became two short paragraphs, and one claim was softened: "programs work best alongside sleep, nutrition and exercise" now says a program works alongside them. The hero, the measure-first passage and the assessment form are unchanged.

**The journal.** Each article was rewritten in its own pass, then checked against its original by script (every number, link and medicine name) and by reading. The edited versions are in `tools/alc-site/content/posts-human/`. Each file carries an `audit` block listing its structural changes, every softened claim as "original -> new", and editor's notes. The originals are untouched in `content/posts/`, so deleting an edited file reverts that article.

| Article (new title) | Words before | Words after | Leaning machine-written | Claims softened |
|---|---|---|---|---|
| [How Long Does an Iron Infusion Take? Planning Your Visit in Brisbane](blog/how-long-does-iron-infusion-take/index.html) | 676 | 548 | 3 -> 0 of 12 | 0 |
| [Iron Infusion in Brisbane: Who Needs One and What to Expect](blog/iron-infusion-brisbane/index.html) | 1,049 | 941 | 5 -> 0 of 12 | 2 |
| [Is Peptide Therapy Safe? What the Risks Are and Where They Come From](blog/is-peptide-therapy-safe-brisbane/index.html) | 1,560 | 1,289 | 7 -> 1 of 14 | 13 |
| [IV Drip Therapy in Brisbane: What We Offer and Who It Suits](blog/iv-drip-therapy-brisbane-guide/index.html) | 836 | 780 | 7 -> 1 of 12 | 6 |
| [IV Therapy for Women in Brisbane: Fatigue, Iron, Menopause and Skin](blog/iv-therapy-women-brisbane/index.html) | 664 | 671 | 7 -> 1 of 12 | 7 |
| [Low Testosterone in Women: Symptoms and Testing in Brisbane](blog/low-testosterone-symptoms-women-brisbane/index.html) | 917 | 784 | 6 -> 1 of 10 | 4 |
| [Menopause and Hormone Therapy in Brisbane: What Changed After 2002](blog/menopause-hormone-therapy-brisbane/index.html) | 955 | 887 | 4 -> 1 of 10 | 10 |
| [NAD+ Infusion in Brisbane: Benefits, Evidence and What a Session Is Like](blog/nad-plus-infusion-benefits-brisbane/index.html) | 688 | 691 | 7 -> 1 of 12 | 10 |
| [NAD+ and Longevity in Brisbane: Why Levels Fall and Where Infusions Fit](blog/nad-plus-longevity-brisbane/index.html) | 831 | 747 | 7 -> 1 of 12 | 7 |
| [NAD+ Therapy in Brisbane: What It Is, and What an Infusion Is Like](blog/nad-plus-therapy-brisbane/index.html) | 760 | 634 | 9 -> 1 of 14 | 8 |
| [Peptide Therapy in Brisbane: How It Works and the Peptides We Use](blog/peptide-therapy-brisbane-what-you-need-to-know/index.html) | 817 | 615 | 10 -> 4 of 14 | 4 |
| [Peptide Therapy for Weight Management in Brisbane: How a Doctor-Led Program Works](blog/peptide-therapy-weight-management-brisbane/index.html) | 712 | 522 | 12 -> 2 of 14 | 6 |
| [Peptide Therapy for Longevity: What Is Known So Far and What to Expect](blog/peptides-longevity-brisbane-guide/index.html) | 882 | 775 | 12 -> 3 of 14 | 11 |
| [Testosterone Replacement Therapy for Men in Brisbane: Who It Suits and What It Involves](blog/testosterone-replacement-therapy-brisbane-mens-health/index.html) | 818 | 789 | 7 -> 1 of 10 | 3 |
| **All fourteen** | **12,165** | **10,673** | | |

Feature counts are a reading by eye of the humanscope features that apply to an explainer (between 10 and 14, depending on the article). They are a diagnostic, not a detector score.

What changed most often: the closing "Book now" sections went, with the address and the 1 to 2 business day call-back kept as plain facts where useful. "Has been the subject of scientific research", repeated up to nine times in one article, became one plain statement of how strong the evidence is. Benefit claims stated as fact became aims or possibilities: "one of the most exciting frontiers in longevity medicine", "an excellent safety profile", and "cardiovascular benefits" for testosterone, which are not established. And every article now says that testing and a doctor's assessment come before treatment.

Additions come only from the clinic's own published facts: the pathology and GP referral an iron infusion needs, the online questionnaire and the call within 1 to 2 business days, and "most therapeutic peptides are Schedule 4 prescription medicines". A few softenings add a caution the original didn't have, such as "long-term safety data are still limited" and "the evidence for using them in weight management is still limited". Each is in that article's audit for the clinic to approve.

**For the doctors to check.** Clinical points where the original and the evidence may differ. Each is handled as described, and each is a one-line change if the doctors disagree.

1. *Low testosterone in women.* The original said testosterone "drops sharply" at natural menopause. Australian cohort studies (Burger and others, 2000; Davison and others, 2005) found no marked change across natural menopause, and a sharp fall after the ovaries are removed. The clause is removed; the gradual decline from the mid-twenties and the surgical-menopause drop remain.
2. *Low testosterone in women.* Low-dose injections are described as an option, while the Australasian Menopause Society endorsement the article cites is for cream or gel. Kept as written.
3. *Menopause.* A history of oestrogen-sensitive breast cancer is listed as needing "careful consideration". Systemic hormone therapy is usually treated as contraindicated there. Kept as written, because that wording is the doctors' decision.
4. *Menopause.* The North American Menopause Society has been called The Menopause Society since 2023. Kept as the original names it.
5. *NAD+ therapy.* "National Institute on Ageing" is corrected to the US institute's name, the National Institute on Aging. The line that DNA repair is "essential for cancer prevention" is removed, because in an article about a treatment it implied the treatment helps prevent cancer.
6. *NAD+ articles.* The figure that NAD+ falls by about 50% between 40 and 60 is kept as written. It is widely repeated, but it comes from small studies of human tissue.
7. *Peptides for weight management.* Blood tests are "typically required" before a program, as the original says. The clinic's own rule is that pathology comes first wherever a decision depends on it; the doctors should confirm which wording is right.
8. *Peptides for longevity.* Baseline blood tests "may" be recommended "depending on your goals", as the original says. Same question.
9. *Two NAD+ articles* presented benefits as what patients reported. That is testimonial framing, which AHPRA's guidelines restrict and the site avoids elsewhere, so they now describe the benefits people hope for and say the evidence for them is limited. Every item is still there.

## The assets, and what each one replaces

The live site's imagery is AI-generated: a caduceus badge, product vials labelled for a different clinic, and stock people in navy-and-gold rooms. Each was replaced with something drawn from real data, in one line style and one palette, or with the clinic's own material:

| Asset | File | Replaces | Source |
|---|---|---|---|
| Logo | `assets/img/logo/alc-medallion-*.webp`, `favicon.ico`, `touch-icon-*.png` | (revision 2) the drawn ring mark | The clinic's medallion from its live site, white square removed. The live site's own favicon is a site-builder placeholder, so the favicons are made from the medallion. |
| The doctors' portraits | `assets/img/doctors/*.webp` | (revision 2) none; the live site names nobody | The profile image supplied with the brief, cropped and lightly graded, not retouched |
| The round (hero) | `assets/img/round-1400.avif` and fallbacks | AI hero imagery | Every ring of Huon pine core **PEB07A**: 1,010 rings, AD 1003 to 2012, Teepookana, western Tasmania (NOAA ITRDB AUS123C, K. Allen). The ring widths along the core line are exact; the outline is modelled. |
| Far plane | `round-far.webp` | AI background gradients | A 2x macro crop of the same round, defocused |
| The core (signature move) | inline in `index.html` | none (new) | The same radius, with decade dots placed by the dendrochronology convention |
| The doctors' calendars | inline, built from `DOCTORS` | none (new) | A ruler of years from 1995 with each dated entry from the supplied image marked in gold, on one scale for both doctors |
| Plate: tracheids | `plate-tracheids.svg` | AI IV-bag images | The measured widths of 1664, 1665 and 1666. Cells are drawn for illustration, as the caption says. |
| Plate: branchlet | `plate-branchlet.svg` | AI peptide imagery | Pen-and-ink drawing of the species' weeping habit, illustrative |
| Plate: cross-dating | `plate-crossdate.svg` | AI hormone imagery | PEB07A against PEB07B, 1446 to 1505 (r = 0.78), with five narrow rings shared by both cores |
| Plate: century ledger | `plate-ledger.svg` | AI weight-loss imagery | PEB07A, 1003 to 2012, with a 30-year running mean |
| Progress rings | inline in the form | generic step indicators | Five rings of the same round, one closing per step |
| Location plate | `map-annerley*.svg` | an address with no map | OpenStreetMap streets around 628 Ipswich Road (© OpenStreetMap contributors, ODbL) |
| Journal cores | `assets/img/cores/*.svg` | AI blog thumbnails | 16 other measured series from AUS123C and AUS118 (Stanley River) |
| Social card | `og.jpg` | none | The round, the clinic's medallion and the name |
| Icons | none | generic icon sets | The decade-dot convention is the only iconography on the site |

The generators live in `../tools/alc-assets/` (see `../tools/README.md`). Ring data: NOAA NCEI World Data Service for Paleoclimatology, International Tree-Ring Data Bank, collections AUS123C and AUS118. Fonts: Schibsted Grotesk and Azeret Mono (SIL Open Font License), self-hosted.

## Content changes from the live site

Facts were taken from the live site on 5 October 2026: address, hours, email, ABN, the legal entity (Horizon Medical Pty Ltd), the $75 fee and process, call times, durations and pathology rules. The doctors' names and qualifications come from the image supplied with the brief; the live site named nobody and gave only "MBBS, FRACGP". Nothing was invented, and what the clinic has not published (a phone number, treatment prices) is left out. Deliberate changes:

- **No prescription medicine is named on the program pages.** The live pages name Ferrosig, Wegovy, Mounjaro, semaglutide, tirzepatide, BPC-157, TB-500, GHK-Cu, Epitalon, CJC-1295, Ipamorelin, AOD-9604, Selank and others, plus a peptide price list. The TGA does not allow prescription medicines to be advertised to the public, so the pages describe goals and process instead and say why.
- **Therapeutic claims were cut back** to what the clinic's own FAQs state (for example the long vitamin D benefits paragraph), and further in revision 2 (see *Humanised copy*).
- **Testimonials:** none, and the site explains why (AHPRA). The live site has none either.
- **Two articles were not carried over**, because each is built around a named prescription medicine: *Ozempic vs Mounjaro* and *BPC-157 for Gut Health*.
- **The other 14 articles are carried over and edited** (see *Humanised copy*). Nine of them still name prescription medicines or brands and need the compliance adviser's review before launch. The list is taken from the final text, and it is longer than the first build's because the old automatic check missed several names:

| Article | Named |
|---|---|
| how-long-does-iron-infusion-take | Ferinject, ferric carboxymaltose, iron polymaltose, Ferrum H, iron dextran |
| is-peptide-therapy-safe-brisbane | BPC-157, CJC-1295, Ipamorelin, GHK-Cu, Epitalon, epithalamin, PT-141, bremelanotide, Vyleesi, Thymosin Alpha-1 |
| iv-therapy-women-brisbane | ferric carboxymaltose, iron sucrose |
| low-testosterone-symptoms-women-brisbane | oestradiol, progesterone, DHEA |
| menopause-hormone-therapy-brisbane | BPC-157, GHK-Cu, Epitalon, oestradiol, progesterone, Prometrium, Utrogestan, conjugated equine oestrogen, medroxyprogesterone acetate |
| peptide-therapy-brisbane-what-you-need-to-know | BPC-157, TB-500, Thymosin Beta-4, CJC-1295, Ipamorelin, GHK-Cu, Epitalon, Selank, Thymosin Alpha-1, semaglutide, tirzepatide, Wegovy, Mounjaro |
| peptide-therapy-weight-management-brisbane | BPC-157, CJC-1295, Ipamorelin, Tesamorelin, AOD-9604 |
| peptides-longevity-brisbane-guide | BPC-157, GHK-Cu, Epitalon, epithalamin, PT-141, bremelanotide, Thymosin Alpha-1 |
| testosterone-replacement-therapy-brisbane-mens-health | oestradiol |

Testosterone itself is named throughout both testosterone articles and the testosterone program page, as the treatment the service provides; the adviser should confirm that framing too. The NAD+ articles name oral supplements (NMN, NR), not prescription medicines. One NAD+ article mentions people having infusions alongside an addiction recovery program, kept from the original, which is worth the adviser's attention.

- **Inconsistencies in the clinic's own content**, kept as written and worth fixing at the source:
  - Infusion times. The iron infusion articles say 15 to 60 minutes, while the IV page and FAQ say 1 to 4 hours (this build's pages use 1 to 4 hours). The IV guide gives 30 to 60 minutes for every infusion, while the IV page gives NAD+ 2 to 4 hours.
  - Ingredients. The IV guide's Myers cocktail includes calcium and its antioxidant drip has no alpha-lipoic acid; the IV page lists zinc for the first and adds alpha-lipoic acid to the second.
  - The consultation is described as 15 to 20 minutes in one FAQ and 15 to 25 minutes in another (this build uses 15 to 25).
  - The IV page describes an in-clinic consultation, while the contact page describes a phone consultation (this build says "consultation" on the IV page and "by phone" for the assessment).

## Verification (5 October 2026, revision 2)

- **scroll-craft harness**, final code: desktop 1440 x 900 (14.2 viewport heights), phone 390 x 844 (18.6), compact phone 360 x 640 (22.0), and reduced motion (11.9). No dead scroll, every cue clears 4.5:1 contrast at its worst frame, and no console errors or failed requests in any run. The added length is the doctors section, which is plain flow, not pinned scroll.
- **The assessment form**: 39 of 39 functional checks pass, unchanged by the revision. They cover required fields, formats, under-18 and impossible dates, conditional questions, the error summary and `aria-invalid`, keyboard order, Enter to advance, review and edit, persistence across a reload, preview mode, a wired success (POST, then Stripe with reference and email) and a server error (reported honestly, answers kept), plus no-JavaScript posting.
- **Every page** (24) at 320, 390 and 1440 px wide: no horizontal overflow, no console errors, no failed requests.
- **Links**: 1,430 internal references (pages, assets, image candidates and anchors), none broken.
- **Copy**: every page checked by script for em dashes and the banned stock phrases: none. Every edited article checked against its original by script for numbers, links and medicine names, and read side by side.
- **Found and fixed in this revision**: on phones of 380 px and narrower the clinic's name ran under the menu button once the medallion replaced the smaller drawn mark, so it now wraps to two lines there and is set slightly smaller on all phones. The rail's phone rule for its label rows leaked into the doctors' ledger; it is now scoped to the rail. On narrow phones the ledger's labels sit above their entries.
- **Not verified**: a real phone (headless Chromium is not Safari on an iPhone), screen-reader output beyond the automated checks above, the live endpoint and Stripe link, which do not exist yet, and the medical review of the edited copy, which needs the clinic's doctors.
