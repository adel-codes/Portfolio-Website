# Australian Longevity Clinic: website rebuild

A rebuild of [australianlongevityclinic.com.au](https://australianlongevityclinic.com.au/) as a static site: HTML, CSS and a little JavaScript. No framework, no tracking, no third-party requests.

Built with the **scroll-craft** skill. This is revision 4. The home page opens on what the clinic does and who does it: "Real peptide therapy, from real doctors.", the four goals people come in for, and the clinic's lead doctors. Pick a goal and the page shows the blood tests a doctor may order before prescribing anything, and when you'd be tested again. That choice is then already set in the assessment form. Before the form, the page travels down Ipswich Road to the clinic's door. The photographs are the clinic's own, from its live site, and documentary photographs of Annerley. The other images are drawn from real data: the clinic's published tests, and OpenStreetMap. No image was generated for this build, though the clinic's own images look AI-generated (see *Photographs*). The brief, the fingerprint gate and the verification results are in `BRIEF.md`.

## Revision 4 (6 October 2026)

The direction for this revision: take out the section on what the clinic won't do, bring in more photographs (the clinic's own, from its live site, and the Annerley area), replace the code-like typeface under the clinic's name with something more professional, and add scroll effects that hold attention. The messaging stays.

- **"What the clinic won't do" is gone.** The list, the small map and the address beside it are removed from the doctors section. The address and hours now sit at the end of the new Annerley act, and on the contact page as before.
- **Photographs, from two places.** Eight of the clinic's own images from its live site, used as lifestyle pictures for the four goals and on the inner pages. Four photographs of Annerley from Wikimedia Commons, two of them State Library of Queensland prints from the 1930s. *Photographs* below lists what was used and what was left out, with the licences.
- **A new act: Annerley.** Between the doctors and the assessment, the page pins on a print of Annerley from the air in about 1934. As you scroll, the print drops away onto today's streets, drawn at night from OpenStreetMap. Ipswich Road traces itself in gold, and the camera tilts to look down the road and travels it from Annerley Junction to the clinic. Two photographs stand on the map where they were taken: Queenslanders on Waterton Street, and Ipswich Road in about 1936, 150 m from the clinic. It settles on 628 Ipswich Road and the clinic's visiting details.
- **More movement as you scroll.** Each plate on the programs rail is now its goal's photograph, which drifts and settles as the plate comes in. On large screens the route act shows the chosen goal's photograph under the goal buttons, and a new one wipes in over the last. The doctors' photographs wipe in as their records arrive. Program pages and journal articles open on a wide photograph that drifts with the scroll. All of it moves with transform and opacity only, and under reduced motion it is still.
- **One typeface.** The monospaced face (Azeret Mono) is gone from every page. The line under the clinic's name is now "ANNERLEY · BRISBANE" in spaced capitals of the site's own face, Schibsted Grotesk, which also sets every label and table heading. Figures use tabular numerals, so columns still line up. The client named only the line under the clinic's name. The same face set every label on the site, so it went everywhere.
- **Smaller changes.** The contact page has three photographs of Annerley under its map. The journal index shows each article's photograph on wider screens. The location map's labels are in Schibsted Grotesk.

Everything else, the messaging included, is as it was in revision 3.

### Photographs

| Photograph | Where | Source | Licence |
|---|---|---|---|
| Eight lifestyle images: a woman with clear skin among amber bottles, a woman in activewear at a window, a smiling man outdoors, an arm with an IV line on a navy recliner, a man in a treatment chair, a woman asleep, a woman in a cream suit, a woman with her eyes closed | Programs rail, route act, program pages, journal | The clinic's live site | The clinic's own (to confirm, see *Before launch*) |
| Annerley from the air, about 1934 | Annerley act | State Library of Queensland, via Wikimedia Commons | Public domain |
| Ipswich Road just south of Cracknell Road, about 1936 | Annerley act, contact page | State Library of Queensland, via Wikimedia Commons | Public domain |
| Queenslanders on Waterton Street | Annerley act, contact page | John Robert McPherson, via Wikimedia Commons | CC0 |
| Jubilee Hall, Annerley | Contact page | Chris Olszewski, via Wikimedia Commons | CC BY-SA 4.0. The credit links the source and the licence, and says the photograph is cropped and toned. |

The clinic's images look AI-generated, like most of the live site's imagery. Here they are lifestyle pictures only. None is captioned or placed as the clinic's rooms, staff or patients. 36 of the live site's 45 images are left out:

- 28 show medicines or products: peptide vials, pens, capsules and creams with names on the label, Wegovy and Mounjaro pens, and drip bags labelled "Vitamin C" or with another business's name. Prescription medicines cannot be advertised to the public.
- 4 would pass as the clinic's own premises or staff: two interiors, one with another business's name on its reception wall, and two consultations with a doctor who is not one of the clinic's.
- 2 are illustrations of a glowing cell and a glowing gut, the metaphor imagery the brief rules out.
- 2 frame treatment in ways the site avoids: athletic performance, and sexual health.

The 45th is the logo, in since revision 2. Three Annerley photographs were tried and dropped: Annerley Junction in 2009 (other businesses' signs fill the frame), a café corner that could be anywhere, and a first view of Waterton Street that was mostly road.

`tools/alc-assets/photos.py` crops and grades every photograph from `photos.json`, which records each one's source, licence, alt text and caption. The clinic's images are left close to how they were. The street photographs are a little desaturated, with shadows toward the navy and highlights toward ivory. The 1930s prints become a navy-to-ivory duotone. Each is served as AVIF and WebP at two or three widths.

No image generator was used. The image service the scroll-craft skill can call needs an API key this environment does not have, so the new artwork is drawn in code from real data, as the hero's data field already was.

## How the home page behaves on different screens

The route act measures its panels before it pins, then picks one of three modes. Nothing is ever cut off at the bottom of the screen.

| Mode | When | What the reader sees |
|---|---|---|
| Whole | A full goal panel fits the screen: most desktops and tablets | Pinned. Scrolling walks the four goals. In each, the tests rise one by one before the rule and the re-test interval appear. |
| Split | Half a panel fits: most Android phones, and 1366 x 768 or 1280 x 720 laptops | Pinned. Each goal shows its tests first, then the rule and the re-test take their place. |
| Static | Neither fits, or the reader has reduced motion turned on. iPhones in Safari load at about 390 x 664 with the toolbars showing, so they land here. | Nothing pins. The panels sit one after another. On a phone the four goals ride in a row under the header and light up as you pass each one. |

Every goal link on the page sets that goal in the assessment form and lands on its panel. If the fonts load late or the screen turns, the page measures again and keeps the reader's place.

The Annerley act has two forms.

| Form | When | What the reader sees |
|---|---|---|
| Moving | Motion allowed, and a screen more than 600 px tall | Pinned. The print drops, the road draws and the camera travels to the clinic. On shorter laptops and phones the camera's mark sits lower, and on laptops the standing photographs are a little smaller, so they always clear the header. On phones up to 780 px tall the visit card keeps the address and the links and leaves the hours to the footer, so the clinic stays in view. |
| Still | Reduced motion, or a screen 600 px tall or less, such as a phone on its side | Nothing pins. It holds one frame near the end: the clinic, the 1936 photograph and the visit card. On phones and short screens it stacks as heading, map, then visit card. |

Turning a phone switches between the two and keeps the reader's place. Without JavaScript the act shows the heading, the 1934 print and the visit card over the street map.

## Revision 3 (5 October 2026)

The direction for this revision: take out the tree, lead with what the clinic does, read as data-driven, sell real peptide therapy from real doctors, present the doctors as the clinic's lead doctors with their experience, keep the list of services, and speak to what people come in for.

- **The tree is gone.** The Huon pine round, the core drawn out of it, the four plates, the journal cores, the ring-shaped form progress and the ring mark are deleted, along with their generators and the ring-width data. No page, stylesheet or script refers to it any more.
- **It opens on the offer.** The headline, one line on the programs and the measure-first rule, then four goals: Better skin and hair, Lose weight, Feel strong again, More energy. The assessment button is on the first screen of a laptop and of a phone.
- **Real doctors, as the lead doctors.** Dr Raman Bohra and Dr Rekha Bohra are in the hero under "Our lead doctors". The doctors section is now "The doctors who lead the clinic.", with each doctor's dated training and the experience the clinic supplied. Nothing on the site counts them.
- **Data you can see.** The middle of the home page, "What a doctor checks before prescribing.", walks through the four goals as you scroll. Each lists the tests a doctor may order first, with reference ranges where the clinic publishes them. Below the tests sit the rule before anything is prescribed and the re-test schedule. The hero's far plane is the same data, typeset and defocused. Each program page carries the same panel beside its text.
- **Goals in people's words.** The testosterone goal is "Feel strong again". The direction asked for TRT pitched at men who want to feel big and strong; the site talks about energy and strength, and only for men whose symptoms and blood tests both show low testosterone. Testosterone is a Schedule 4 medicine, and promoting it for muscle would cross the TGA's line.
- **Kept.** The four programs on the sideways rail (each plate is now its goal set in type, with its tests along the top), the measure-first passage word for word, the assessment form, the doctors' records, and the edited journal.
- **Smaller changes.** The form's progress is a five-step bar. The journal index puts the date and topic in a column on the left. The menus show each program's goal under its name. The 404 page no longer talks about rings. The social card has the new headline and both doctors. The solid header is fully opaque, so text no longer shows through it as it scrolls underneath.

The copy for this revision follows the humanscope structure sheet in `BRIEF.md` and the house language rules: no em dashes, Australian spelling, no stock phrases, and no run of three-part lists.

## Earlier revisions

**Revision 2** brought in the clinic's own logo (the medallion from the live site, with only its white square made transparent), the doctors' section and doctors page built from the supplied profile image, the humanscope edit of the program pages, FAQs and all fourteen journal articles, and the move from forest green to the medallion's navy. All of that stays.

**Revision 1** was the first scroll-craft build and set up what the later revisions kept: the page structure, the assessment form and its handover, the program pages and the content rules below.

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
| **Blocking** | The compliance adviser reviews this revision's framing: the goal names (above all "Feel strong again" for testosterone therapy) and the testosterone panel on the home page. | Testosterone and most therapeutic peptides are Schedule 4 medicines. TGA advertising rules and AHPRA's advertising guidelines. |
| **Blocking** | The compliance adviser reviews the content listed under *Content changes*, especially the journal articles that name prescription medicines. | The same rules. |
| **Blocking** | One of the doctors reads and approves every edited journal article, starting with the clinical points listed under *Humanised copy*. | The journal is attributed to the clinic's medical team. |
| Recommended | The doctors confirm the two lines on the skin and hair route listed under *Where the tests come from*, and the experience figure (see *The doctors*). | Both are on the home page. |
| Recommended | The doctors add their AHPRA registration numbers. | For this audience a named, checkable doctor is the strongest trust signal there is. |
| Recommended | Connect the journal sign-up (`data-endpoint` on `form.news`). | It says it is a preview until connected. |
| Recommended | Redirect `/blog/ozempic-vs-mounjaro-brisbane` and `/blog/bpc-157-gut-health-brisbane` to `/blog/`. | Those two articles are not carried over (see below). |
| Recommended | Confirm the clinic holds the rights to the eight images taken from its live site, and is happy to use them as lifestyle pictures (see *Photographs*). | They appear to be AI-generated. Whoever made them for the live site should confirm the licence covers this use. |
| Recommended | If the pages are restyled, keep each Annerley photograph's credit with it. | The Jubilee Hall photograph's licence (CC BY-SA 4.0) requires the credit, the licence link and the note that it was changed. The others ask for nothing, but the credit is right. |
| Optional | The privacy policy (carried over word for word) mentions cookies, analytics and document uploads. This build has none of them. Leave the policy as is, or update it. | Accuracy. |

How the form hands over: on submit it POSTs the answers, expects `2xx` with an optional `{ "id": "...", "checkoutUrl": "..." }`, and then opens Stripe with `client_reference_id` and `prefilled_email` set so each payment matches its answers. Without JavaScript, the form still posts every step's fields (never by GET).

## Pages

| Path | What |
|---|---|
| `index.html` | Home: the offer and the lead doctors, the four programs on a sideways rail, what a doctor checks for each goal (the signature move), the doctors who lead the clinic, Annerley, and the assessment as the ending |
| `iv-drips/` `peptide-therapy/` `testosterone-therapy/` `weight-management/` | One page per program, each opening on its goal's photograph, with the goal's tests beside the text. Same URLs as the live site; weight management is new. |
| `our-team/` | The lead doctors: both records in full, including special interests and how to check a registration on the AHPRA register |
| `contact/` | Address, hours, the location map with three photographs of Annerley, the full assessment and its FAQs |
| `blog/` and `blog/<slug>/` | The journal: 14 of the clinic's 16 articles, each with a photograph |
| `privacy-policy/` | The clinic's policy, carried over word for word |
| `404.html` | Not-found page (root-relative links, so hosts can serve it at any depth) |

Every page is generated by `../tools/alc-site/build.mjs` from shared parts: the header, footer, doctors' register and assessment form are identical everywhere they appear. Edit the builder, not the HTML, then run `node tools/alc-site/build.mjs` from the repository root. The doctors' records live in one place, `DOCTORS` in `build.mjs`. The goals, tests, rules and re-test intervals live in one place, `ROUTES` in `routes.mjs`; the hero slip, the rail, the route act, the program pages and the hero's far plane are all built from it. Each photograph's alt text, caption and credit come from `tools/alc-assets/photos.json`, and the Annerley act's positions from `place.mjs`, which `gen_place.mjs` writes.

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

The line under each name shows experience as supplied: "18 years' experience" for Dr Raman Bohra, and "Qualified 1999" for Dr Rekha Bohra, because the image gives no figure for her. The graduation year is not printed beside the 18 years, because a reader who does the sum gets 25.

Two sentences of the image are left out on purpose. "She is a very kind and caring General Practitioner" describes a personality, not a qualification. "Dr Raman Bohra has embarked on a new journey in the world of cosmetic injectables" announces a service this site doesn't offer, and cosmetic procedures have their own AHPRA advertising rules. Nothing was added. The abbreviations carry their standard expansions on hover and for screen readers; the visible text is exactly as shown.

The photographs are the ones in that image, cropped and given one light print grade so the two sit together (`tools/alc-assets/portraits.py`). Nothing in them was retouched or generated.

Worth confirming with the doctors. All of this is legible and shown as written; these are the lines a careful reader may query:

1. Both bios say the FRACGP was obtained "in the United Kingdom". The FRACGP is awarded by the Australian college. It may well be right, since the RACGP recognises UK-trained GPs, but it reads oddly.
2. Dr Rekha Bohra's bio gives a DFRSH (2012) that her post-nominals line doesn't include.
3. "18 years" of experience will date. Counted from the 2008 fellowship it is 18 in 2026; counted from graduation in 2001 it would be 25. The home page now leads with this figure, so it is worth settling.
4. "Pap-Smear": the National Cervical Screening Program replaced the Pap smear with the Cervical Screening Test in December 2017.
5. "Adult gynecology" is the US spelling, kept as written.

## Where the tests come from

Each goal's panel is built from the clinic's own published material. The plain-English descriptions say what each test measures and nothing more.

| Goal | Tests and timing | Source |
|---|---|---|
| Feel strong again | Total and free testosterone, SHBG, LH and FSH, oestradiol, full blood count and metabolic panel. Bloods again 6 to 12 weeks after starting, then every 3 to 6 months: testosterone, haematocrit, PSA and oestradiol. | The clinic's testosterone guide for men (the re-test schedule is quoted from it) |
| Lose weight | Fasting glucose, insulin, HbA1c, lipid panel, thyroid function | The clinic's weight management and peptide articles |
| More energy | Serum ferritin, transferrin saturation, full blood count, C-reactive protein, vitamin D. The ranges (ferritin 30 to 300 µg/L in women and 30 to 400 in men, transferrin saturation 20 to 50%, haemoglobin 120 to 160 g/L in women and 130 to 170 in men) and the follow-up test 6 to 8 weeks after an infusion. | The IV page's pre-infusion tests, and the reference table in the clinic's iron infusion guide |
| Better skin and hair | Your history and medicines, baseline bloods, iron studies | The peptide articles' history and baseline bloods. **Two lines are this build's wording and need a doctor's yes:** "Iron studies", the standard Australian name for the iron tests, added because the clinic's iron guide lists hair loss as a sign of low iron; and the description of baseline bloods ("hormone levels, inflammation and metabolic health, when your goal calls for them"). |

## Humanised copy

Method: the humanscope skill in audit mode, scoped for explainers. Its premise is that machine-written text gives itself away through its shape more than its words, so the edits are structural. Cut the closing paragraph that restates the article. Break the run of identical sections (heading, two paragraphs, a bullet list, repeat). Name the specific thing where the text gestures vaguely, but only when the specific is already known. Say feelings plainly. Address the reader where it comes naturally. Language rules on top: no em dashes, Australian spelling, no stock phrases.

The rules for medical content were stricter than the style rules. Every number, dose, duration, threshold, test, timeframe and contraindication is kept exactly. No new benefit, mechanism, study, statistic or medicine was added, and no caveat, risk or disclaimer was removed. Claims the evidence doesn't support were softened, never strengthened, and each one is listed. The clinic's measure-first rule is consistent everywhere: nothing is prescribed from a questionnaire alone, and sometimes the answer is no.

**Revision 3.** The new home page and program heads were written from a humanscope structure sheet (in `BRIEF.md`) before any line was drafted. The deliberate choices: no line explains what the page means, feelings are said plainly ("if low testosterone is why you feel flat"), references are named (HbA1c, SHBG, Schedule 4, the RACGP, AHPRA, 628 Ipswich Road), and the clinic says what it won't do (that list was removed in revision 4, at the client's request). A final pass rewrote the three-part lists that had crept into the route copy. The measure-first sentence keeps its three steps, because they are the process.

**Revision 4.** The new copy is the Annerley act ("On Ipswich Road, Annerley." and "About 5.5 km south of the city centre, on the main road in."), the photographs' captions and alt text, and two distances on the map cards. It follows the same sheet: places are named (Ipswich Road, Cracknell Road, Waterton Street, Jubilee Hall), and no line says what the act means. Distances are straight lines between OpenStreetMap coordinates: 5.5 km to the city centre, about 550 m to the Waterton Street houses and about 150 m to where the 1936 photograph was taken.

**The site's own pages (revision 2).** The four program pages and their FAQs, the contact FAQs and the doctors page. Ledes that read as compliance text now say plainly what happens. FAQ answers start with the answer. Generic closing lines are gone ("Every recommendation is individual"). One claim was softened: "programs work best alongside sleep, nutrition and exercise" now says a program works alongside them.

**The journal (revision 2).** Each article was rewritten in its own pass, then checked against its original by script (every number, link and medicine name) and by reading. The edited versions are in `tools/alc-site/content/posts-human/`. Each file carries an `audit` block listing its structural changes, every softened claim as "original -> new", and editor's notes. The originals are untouched in `content/posts/`, so deleting an edited file reverts that article.

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

## The assets

The live site's imagery is AI-generated: a caduceus badge, product vials labelled for a different clinic, and stock people in navy-and-gold rooms. Revision 4 brings eight of the people pictures back as lifestyle images (see *Photographs*). Everything else is the clinic's own material, a documentary photograph, or drawn from data:

| Asset | File | Source |
|---|---|---|
| Logo | `assets/img/logo/alc-medallion-*.webp`, `favicon.ico`, `touch-icon-*.png` | The clinic's medallion from its live site, white square removed. The live site's own favicon is a site-builder placeholder, so the favicons are made from the medallion. |
| The doctors' portraits | `assets/img/doctors/*.webp` | The profile image supplied with the brief, cropped and lightly graded, not retouched |
| The data field (hero far plane) | `assets/img/data-field-*.avif` and `.webp` | Every route's tests, ranges and re-test intervals from `ROUTES`, typeset in the site's face and defocused (`tools/alc-assets/gen_datafield.mjs`) |
| Lifestyle photographs | `assets/img/photos/{skin,weight,strong,energy,rest,sleep,calm,still}-*` | The clinic's live site, cropped and barely graded (`tools/alc-assets/photos.py`) |
| Annerley photographs | `assets/img/photos/{aerial-1934,ipswich-1936,queenslanders,jubilee}-*` | Wikimedia Commons, credited where they appear (see *Photographs*) |
| The Annerley act's map | `assets/img/place/annerley-{4096,2048}.avif` and `.webp` | Streets, parks, rail and water around the clinic from OpenStreetMap, drawn at night in the site's palette, 2.6 km square (`tools/alc-assets/gen_place.mjs`). Ipswich Road's line and the positions of the clinic and the photographs go to `tools/alc-site/place.mjs`. |
| The hero slip | inline | The tests for the goal under the pointer, read from the route panels |
| Goal plates (programs rail) | inline, with a photograph | The goal's photograph with the goal set over it, and that goal's tests along the top |
| Route panels | inline, from `ROUTES` | See *Where the tests come from* |
| The doctors' calendars | inline, from `DOCTORS` | A ruler of years from 1995 with each dated entry from the supplied image marked in gold, on one scale for both doctors |
| Form progress | inline | Five segments, one per step |
| Location map | `map-annerley.svg` | OpenStreetMap streets around 628 Ipswich Road, on the contact page (© OpenStreetMap contributors, ODbL) |
| Social card | `og.jpg` | The headline, the medallion, both doctors' photographs and the Lose weight tests (`tools/alc-assets/og.html`) |
| Icons | none | Type and the gold dot on a chosen goal do the work |

Retired in revision 3, with their generators: the Huon pine round and its defocused far plane, the core, the four plates, the sixteen journal cores, the progress rings, the dark location map and the ring mark. Retired in revision 4: the Azeret Mono font. They remain in the repository's history.

The generators live in `../tools/alc-assets/` (see `../tools/README.md`). Font: Schibsted Grotesk (SIL Open Font License), self-hosted.

## Content changes from the live site

Facts were taken from the live site on 5 October 2026: address, hours, email, ABN, the legal entity (Horizon Medical Pty Ltd), the $75 fee and process, call times, durations and pathology rules. The doctors' names and qualifications come from the image supplied with the brief; the live site named nobody and gave only "MBBS, FRACGP". Nothing was invented, and what the clinic has not published (a phone number, treatment prices) is left out. Deliberate changes:

- **No prescription medicine is named on the program pages.** The live pages name Ferrosig, Wegovy, Mounjaro, semaglutide, tirzepatide, BPC-157, TB-500, GHK-Cu, Epitalon, CJC-1295, Ipamorelin, AOD-9604, Selank and others, plus a peptide price list. The TGA does not allow prescription medicines to be advertised to the public, so the pages describe goals and process instead and say why.
- **Therapeutic claims were cut back** to what the clinic's own FAQs state (for example the long vitamin D benefits paragraph), and further in revision 2 (see *Humanised copy*).
- **Testimonials:** none, and the site explains why (AHPRA). The live site has none either.
- **Two articles were not carried over**, because each is built around a named prescription medicine: *Ozempic vs Mounjaro* and *BPC-157 for Gut Health*.
- **The other 14 articles are carried over and edited** (see *Humanised copy*). Nine of them still name prescription medicines or brands and need the compliance adviser's review before launch:

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

Testosterone itself is named throughout both testosterone articles, the testosterone program page and, from this revision, the home page's "Feel strong again" panel, as the treatment the service provides; the adviser should confirm that framing too. The NAD+ articles name oral supplements (NMN, NR), not prescription medicines. One NAD+ article mentions people having infusions alongside an addiction recovery program, kept from the original, which is worth the adviser's attention.

- **Inconsistencies in the clinic's own content**, kept as written and worth fixing at the source:
  - Infusion times. The iron infusion articles say 15 to 60 minutes, while the IV page and FAQ say 1 to 4 hours (this build's pages use 1 to 4 hours). The IV guide gives 30 to 60 minutes for every infusion, while the IV page gives NAD+ 2 to 4 hours.
  - Ingredients. The IV guide's Myers cocktail includes calcium and its antioxidant drip has no alpha-lipoic acid; the IV page lists zinc for the first and adds alpha-lipoic acid to the second.
  - The consultation is described as 15 to 20 minutes in one FAQ and 15 to 25 minutes in another (this build uses 15 to 25).
  - The IV page describes an in-clinic consultation, while the contact page describes a phone consultation (this build says "consultation" on the IV page and "by phone" for the assessment).

## Verification (6 October 2026, revision 4)

- **scroll-craft harness**, final code: desktop 1440 x 900 (16.6 viewport heights; route whole, Annerley moving), phone 390 x 844 (21.9; route split, Annerley moving), compact phone 360 x 640 (24.9; route static, Annerley moving), and reduced motion at 1440 x 900 (13.0; route static, Annerley still). No dead scroll in any run. Every line of text that sits over an image or the map clears 4.5:1 contrast in its worst frame. No console errors or failed requests.
- **The Annerley act at 21 screen sizes**, from 360 x 640 to 2560 x 1440, sampled every 2.5% of the act: no standing photograph is ever under the header at full strength, and the clinic is never under the visit card. The 1934 print never meets the heading at 16 sizes, including a phone on its side. The still and no-JavaScript layouts were checked at phone, phone-on-its-side, short laptop and desktop sizes, and turning a phone switches between moving and still and back.
- **The route at 14 screen sizes**, from 320 x 568 to 1920 x 1080, including 390 x 664 (an iPhone in Safari with its toolbars showing), stepped through every goal: no line of a panel ever runs below the bottom of the screen, and no page scrolls sideways.
- **The assessment form and the goal routing**: 49 of 49 functional checks pass. They cover required fields, formats, under-18 and impossible dates, conditional questions, the error summary and `aria-invalid`, keyboard order, Enter to advance, review and edit, persistence across a reload, preview mode, a wired success (POST, then Stripe with reference and email), a server error (reported honestly, answers kept), no-JavaScript posting, and the goal routing with and without motion.
- **Every page** (24) at 320, 390 and 1440 px wide: no horizontal overflow, no console errors, no failed requests. The program pages, the contact page's photographs and the journal were also checked by eye on a phone and a desktop.
- **Links**: 1,669 internal references (pages, assets, image candidates and anchors), none broken.
- **Copy**: every page checked by script for em dashes and the banned stock phrases: none. No page names a prescription medicine outside the journal articles already listed above.
- **Found and fixed while verifying**:
  - On laptops 657 to 768 px tall, the most common sizes, the 1936 photograph rose under the header at the end of the Annerley act, and the Waterton Street photograph did the same mid-way. The same happened on phones up to 667 px tall. The camera's mark now sits lower on shorter screens, and the photographs stand a little smaller on laptops.
  - On phones the Waterton Street photograph was cut by the left edge while it was up. The camera now steps sideways while it shows, then steps back.
  - On a 360 x 640 phone the 1934 print covered the heading's second line, and on a 768 x 1024 tablet it touched it. The print now sizes itself to the screen's height.
  - On a 1024 x 768 screen the visit card covered the clinic's marker. The card is narrower there.
  - A phone could load the act with desktop sizes, because while a page loads the browser can report a zoomed-out width. Sizes now come from the layout viewport, the same width the stylesheets use.
  - A phone on its side had no room for photographs standing on the map, so short screens now get the still form.
  - With JavaScript off, the Annerley heading was painted under the map, and on a phone the print covered the visit card. The heading now comes first in the markup, which is also the better reading order, and the act stacks.
  - Under reduced motion on a phone, the 1936 photograph covered the heading's second line and the visit card ran under the phone's assessment bar. The still frame now stacks.
  - The harness flagged the Annerley heading at 1.4:1 contrast. It was measuring a box as wide as the page, which took in the 1934 print beside the heading. The heading's box now fits its text, and the real contrast clears 4.5:1.
- **Not verified**: a real phone (headless Chromium is not Safari on an iPhone), screen-reader output beyond the automated checks above, the live endpoint and Stripe link, which do not exist yet, the medical review of the copy, which needs the clinic's doctors, and the rights to the clinic's own images, which only the clinic can confirm.
