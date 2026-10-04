# Australian Longevity Clinic — website redesign

A premium, editorial redesign of [australianlongevityclinic.com.au](https://australianlongevityclinic.com.au/).
Plain HTML, CSS and a small amount of JavaScript. No framework, no build step, no tracking.

Open `index.html` in a browser, or serve the folder:

```bash
cd australian-longevity-clinic
python3 -m http.server 8080
# http://localhost:8080
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: positioning, trust strip, services index, how care works, standards, doctors, FAQ, visit, booking call to action |
| `iv-therapy.html` | IV infusion therapy |
| `peptide-programs.html` | Peptide programs |
| `trt.html` | Testosterone replacement therapy |
| `weight-management.html` | Medical weight management |
| `our-doctors.html` | The medical team (placeholder cards, see below) |
| `contact.html` | Address, hours, enquiry form, map |
| `policies.html` | Privacy, appointments, fees, consent, feedback and complaints |
| `assets/css/site.css` | The whole design system, commented by section |
| `assets/js/site.js` | Masthead, mobile menu, reveal on scroll, form handling |
| `assets/img/` | Logo mark and favicon (SVG) |

## Design intent

The brief was premium, trusted and editorial rather than a scroll-through "world" or a wall of generated imagery.
So the site is carried by typography, structure and copy:

- **Type.** Newsreader (a text serif with optical sizes) for display and ledes, Inter for interface text and small-caps labels. Loaded from Google Fonts; the stack falls back to Iowan Old Style, Palatino and Georgia.
- **Colour.** Warm bone paper, near-black ink, a single deep eucalyptus green for emphasis and buttons, bronze for figure numbers. Colours are tokens at the top of `site.css`.
- **Structure.** Numbered sections, hairline rules, figure captions, an "On this page" contents rail on long pages, and a dark standards section on the home page. The services index reads like a table of contents rather than a card grid.
- **Motion.** A single gentle fade on reveal, a masthead that condenses on scroll. Nothing scroll-jacked. All motion is disabled under `prefers-reduced-motion`.
- **Imagery.** None generated. Photo positions are "plates": tonal fields with a grain texture, a small label naming the intended subject, and a numbered caption. They are designed to look deliberate until the clinic's own photography is dropped in.

## Content: what is verified and what is not

The live site could not be fetched from this environment (its host was blocked by the network policy), so facts were taken from what search engines have indexed about it. Please check everything before publishing.

| Item | Status | Where it appears |
| --- | --- | --- |
| Clinic name, positioning as a doctor-led IV therapy and peptide clinic | From public listings | Everywhere |
| Address: 628 Ipswich Road, Annerley QLD 4103 | From public listings | Masthead menu, home, contact, footer, structured data |
| Hours: Mon–Fri 8:00am–6:00pm, Sat 9:00am–2:00pm, Sun closed | From public listings | Home, contact, footer, structured data |
| Email: reception@australianlongevityclinic.com.au | From public listings | Contact, footer, form fallback |
| Services: IV infusions, peptide programs, TRT, weight management | From public listings | Home index, service pages |
| Team qualifications: MBBS, FRACGP, MRCGP, DRCOG; AHPRA registered | From public listings | Home, doctors page |
| Suburbs served (Yeronga, Moorooka, Fairfield, Greenslopes, CBD) | From public listings | Home visit section |
| **Phone number** | **Placeholder** | `contact.html` ("[Phone number to be supplied]") |
| **Doctor names, bios, portraits, AHPRA numbers** | **Placeholder** | `our-doctors.html` |
| **ABN** | **Placeholder** | Footer |
| Infusion duration "30 to 90 minutes" | Typical, confirm | IV page, home FAQ |
| 24 hours' cancellation notice | Assumed, confirm | `policies.html` |
| "Reception aims to respond within one business day" | Assumed, confirm | Contact page |
| All service copy, FAQs, safety text, policies | Written for this redesign | Service pages, policies |

The clinical and legal copy was written carefully and conservatively, but it must be reviewed by the clinic's doctors and whoever advises on compliance before it goes live.

## Compliance choices built into the copy

These were deliberate and are worth keeping:

1. **No prescription medicines are named.** The Therapeutic Goods Advertising Code prohibits advertising prescription-only (Schedule 4) medicines to the public. The current live site names specific peptides and other S4 products; this redesign describes service categories and says that specific medicines are discussed in consultation. That is both safer and, on the page, more credible.
2. **No testimonials or before-and-after images.** Section 133 of the Health Practitioner Regulation National Law prohibits testimonials in advertising a regulated health service. The standards section says so explicitly.
3. **Consultation before treatment** is stated on every page, and the footer carries a general-information disclaimer.
4. **Compounded medicines** are described honestly as not evaluated by the TGA in the way approved products are.
5. **PBS and specialist criteria** for subsidised testosterone are mentioned rather than glossed over.

## Replacing the plates with photography

Each plate is a `<div class="plate …">`. Put an `<img>` inside it and the CSS will cover-fit the image to the frame:

```html
<div class="plate plate--wide">
  <img src="assets/img/consulting-rooms.jpg" alt="The consulting rooms at 628 Ipswich Road" width="1600" height="686">
</div>
```

Remove the `<span class="plate__hint">` once a real image is in place. Suggested photography, all in natural light, no stock:

| Page | Plate | Aspect | Subject |
| --- | --- | --- | --- |
| Home | Fig. 01 | 21:9 | Consulting rooms or reception, wide, quiet |
| Home | Fig. 02 | 4:5 | The medical team, together, environmental portrait |
| Home | Fig. 03 | 16:9 | Street frontage on Ipswich Road |
| IV therapy | Fig. 01 | 21:9 | Infusion suite, a chair and the view, no needles |
| Peptide programs | Fig. 02 | 21:9 | A consulting room, two chairs, conversation implied |
| TRT | Fig. 03 | 21:9 | Pathology collection area or paperwork detail |
| Weight management | Fig. 04 | 21:9 | Consultation in progress, from behind or in profile |
| Our doctors | Portraits | 3:4 | One per doctor, same light, same background |

Export JPEGs around 1600px wide at quality 80. Add `loading="lazy"` to everything except the home hero.

## Wiring up bookings and the enquiry form

- **Book a consultation** buttons all point to `contact.html`. If the clinic uses an online booking system (HotDoc, HealthEngine, Halaxy, Cliniko and similar are common in Brisbane), change those links to the booking URL. Search `contact.html"` across the HTML files.
- **The enquiry form** has no backend by design. Without one, submitting it opens the visitor's email app with the enquiry drafted to reception. To send enquiries to a server instead, add a `data-endpoint` attribute to the `<form>` with a URL that accepts a JSON POST (a form service such as Formspree or Basin, or the clinic's own handler) and the script will use it.
- **The map** is a standard Google Maps embed with no API key. It is styled in muted tones to sit with the page. A "Get directions" link is provided as a fallback.

## Deploying

The folder is self-contained and relative-linked, so it can be served from any static host or from a subfolder.

- On GitHub Pages for this repository it will be available under `/australian-longevity-clinic/`.
- To move it to the clinic's own domain, copy the folder's contents to the web root.
- Consider adding `robots.txt` and `sitemap.xml` at the root of the final domain, and an `og:image` once photography exists.

## Known gaps

- No analytics, consent banner or cookie notice. Add according to the clinic's privacy policy if tracking is introduced.
- Policies are a sensible baseline, not legal advice.
- The doctors page is structurally complete but contains placeholder people. Do not publish it until real names, bios and AHPRA numbers are in.
