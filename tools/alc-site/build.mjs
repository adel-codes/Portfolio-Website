// Build the Australian Longevity Clinic site from shared partials.
//
//   node tools/alc-site/build.mjs
//
// Writes static HTML into australian-longevity-clinic/. Every page links
// with relative paths and explicit index.html, so the folder works from any
// base URL and straight from disk. Assets are produced by tools/alc-assets.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { servicePages, teamPage, privacyPage, notFoundPage } from "./pages.mjs";
import { journalPages } from "./journal.mjs";
import { ROUTES } from "./routes.mjs";
export { ROUTES };

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SITE = path.resolve(HERE, "../../australian-longevity-clinic");
const IMG = path.join(SITE, "assets/img");
const read = (p) => fs.readFileSync(p, "utf8");

// ------------------------------------------------------------------ facts
// Everything here is from the clinic's live site (read 2026-10-05). Nothing
// is invented; what the clinic has not published is left out.
export const CLINIC = {
  name: "Australian Longevity Clinic",
  legal: "Australian Longevity Clinic Brisbane (trading as Australian Longevity Clinic)",
  abn: "85 618 922 848",
  street: "628 Ipswich Road",
  suburb: "Annerley",
  state: "QLD",
  postcode: "4103",
  email: "reception@australianlongevityclinic.com.au",
  fee: "$75",
  hours: [["Monday to Friday", "8:00am to 6:00pm"], ["Saturday", "9:00am to 2:00pm"], ["Sunday", "Closed"], ["Public holidays", "Closed"]],
  callWindow: "Monday to Friday, 9am to 5pm AEST",
  ahpra: "https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx",
};

export const PROGRAMS = [
  { key: "iv", slug: "iv-drips", name: "IV therapy", goal: "More energy" },
  { key: "peptides", slug: "peptide-therapy", name: "Peptide programs", goal: "Better skin and hair" },
  { key: "testosterone", slug: "testosterone-therapy", name: "Testosterone therapy", goal: "Feel strong again" },
  { key: "weight", slug: "weight-management", name: "Medical weight management", goal: "Lose weight" },
];

// The doctors, from the profile image supplied with the brief (2026-10-05).
// Names and post-nominals are set exactly as the image gives them, and the
// dated entries keep its wording. Nothing is added. Two of its sentences are
// left out on purpose, as README.md explains: one describes a personality,
// and one announces cosmetic injectables, which this site does not offer.
export const DOCTORS = [
  {
    slug: "dr-raman-bohra",
    name: "Dr Raman Bohra",
    post: "MRCGP, FRACGP",
    dated: [
      [2001, "Graduated from medical school in Jaipur, India."],
      [2008, "Fellowship with the Royal Australian College of General Practitioners (FRACGP), obtained in the United Kingdom."],
    ],
    rows: [["Experience", "18 years"]],
    interests: "Ear-nose-throat conditions, geriatric care, obesity, urinary incontinence, and occupational health care.",
    languages: "English, Hindi, Punjabi",
    photo: [328, 441],
  },
  {
    slug: "dr-rekha-bohra",
    name: "Dr Rekha Bohra",
    post: "MB BS, DRCOG, MRCGP (U.K), FRACGP",
    dated: [
      [1999, "Graduated from medical school in Jaipur, India."],
      [2012, "DFRSH from the Royal College of Obstetricians and Gynaecologists."],
      [2013, "Fellowship with the Royal Australian College of General Practitioners (FRACGP), obtained in the United Kingdom."],
    ],
    rows: [],
    interests: "Family planning, childhood immunisation, child health, adult gynecology, contraceptive implant insertion & removal, IUD Insertion & Removal and Pap-Smear.",
    languages: "English, Hindi",
    photo: [328, 442],
  },
];

// Standard expansions, shown on hover and read by screen readers. The
// visible text stays exactly as the doctors give it.
const ABBR = {
  "MB BS": "Bachelor of Medicine, Bachelor of Surgery",
  DRCOG: "Diploma of the Royal College of Obstetricians and Gynaecologists",
  MRCGP: "Member of the Royal College of General Practitioners",
  FRACGP: "Fellow of the Royal Australian College of General Practitioners",
  DFRSH: "Diploma of the Faculty of Sexual and Reproductive Healthcare",
};

// ------------------------------------------------------------- the glyph
// The assessment's progress: five steps, one segment each. The step names
// are announced by the form's own tabs, so this is hidden from readers.
const progressGlyph = () => `<ol class="progress-steps" aria-hidden="true">${[0, 1, 2, 3, 4].map(() => `<li class="pr"></li>`).join("")}</ol>`;

// ------------------------------------------------------------- partials
export const rel = (depth) => (depth ? "../".repeat(depth) : "");
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const link = (depth, target) => rel(depth) + (target === "" ? "index.html" : target.replace(/\/?$/, "/index.html").replace(/^\/index\.html$/, "index.html"));
// The clinic's own logo: the medallion from its live site, cut from its
// white square (tools/alc-assets/logo_cutout.py) and otherwise untouched.
export const logoImg = (depth, size = 52, cls = "brand__logo", alt = "") => {
  const r = rel(depth);
  const pick = size > 96 ? [256, 512] : [64, 128];
  return `<img class="${cls}" src="${r}assets/img/logo/alc-medallion-${pick[1]}.webp" srcset="${r}assets/img/logo/alc-medallion-${pick[0]}.webp 1x, ${r}assets/img/logo/alc-medallion-${pick[1]}.webp 2x" width="${size}" height="${size}" alt="${alt}" decoding="async">`;
};

// The doctors' register: one ruled entry per doctor, never a card grid.
// Each entry carries a small calendar, a ruler of years with the doctor's
// dated entries marked on it. Both use the same scale, so the records line up
// and the years behind each doctor read at a glance.
const CAL0 = 1995, CAL1 = new Date().getFullYear();
const calX = (y) => (((y - CAL0) / (CAL1 - CAL0)) * 100).toFixed(2);
const withAbbr = (s) => esc(s).replace(/MB BS|DRCOG|MRCGP|FRACGP|DFRSH/g, (m) => `<abbr title="${ABBR[m]}">${m}</abbr>`);
function calendar(d) {
  const ticks = [];
  for (let y = CAL0; y <= CAL1; y++) ticks.push(`<i class="career__tick${y % 10 ? "" : " career__tick--dec"}" style="left:${calX(y)}%">${y % 10 ? "" : `<b>${y}</b>`}</i>`);
  return `<div class="career" aria-hidden="true"><span class="career__line" style="left:${calX(d.dated[0][0])}%"></span>${ticks.join("")}${d.dated.map(([y]) => `<span class="career__ev" style="left:${calX(y)}%"></span>`).join("")}</div>`;
}
// The line under a doctor's name: the experience figure the clinic supplied,
// as given, or, where none was supplied, the year they qualified. Never a
// sum of the two: the supplied figure and the graduation year don't agree
// (see the README), and a reader who does the arithmetic should not have to.
const experience = (d) => {
  const given = d.rows.find(([k]) => k === "Experience");
  return given ? `${given[1]}' experience` : `Qualified ${d.dated[0][0]}`;
};
export function register(depth, { full = false, level = 3 } = {}) {
  const r = rel(depth), h = `h${level}`;
  return `<ul class="register${full ? " register--full" : ""}">
    ${DOCTORS.map((d) => {
      // experience is in the line under the name, so it is not repeated here
      const rows = [...d.dated.map(([y, t]) => [String(y), withAbbr(t)]), ...d.rows.filter(([k]) => k !== "Experience"), ...(full ? [["Special interests", esc(d.interests)]] : []), ["Languages", d.languages]];
      const src = (n) => `${r}assets/img/doctors/${d.slug}-${n}x.webp`;
      return `<li class="record" id="${d.slug}">
      <div class="record__photo"><img src="${src(1)}" srcset="${src(1)} 328w, ${src(2)} 524w" sizes="(max-width: 700px) 8.5rem, ${full ? "20rem" : "16rem"}" width="${d.photo[0]}" height="${d.photo[1]}" alt="Portrait of ${d.name}" loading="lazy" decoding="async"></div>
      <div class="record__head">
        <${h} class="record__name">${d.name}</${h}>
        <p class="record__post">${withAbbr(d.post)}</p>
        <p class="record__since">${experience(d)}</p>
      </div>
      <div class="record__body">
        ${calendar(d)}
        <dl class="schema ledger">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      </div>
    </li>`;
    }).join("\n    ")}
  </ul>`;
}

// One goal's route: what a doctor checks, the rule before anything is
// prescribed, and when it is checked again. Used on the home page and on each
// program page, so the two can never disagree.
export function routePanel(r, { depth = 0, level = 3, cta = true, head = true } = {}) {
  const p = PROGRAMS.find((x) => x.key === r.key);
  const h = `h${level}`;
  const toForm = depth === 0 ? "#assessment" : link(depth, "contact").replace(/index\.html$/, "") + `index.html?program=${r.key}#assessment`;
  const note = r.ranges ? `<p class="route__note">Typical adult ranges, from the clinic's <a href="${link(depth, r.ranges)}">guide to iron infusions</a>. Labs vary slightly.</p>` : "";
  // As the aside on a program page there is no goal head: the checks' own
  // title is the heading, so "Before anything is prescribed" stays a label.
  const top = head
    ? `<header class="route__head">
              <${h} id="route-${r.key}-h" class="route__goal">${r.goal}</${h}>
              <p class="route__line">${r.line}</p>
            </header>`
    : "";
  const checkTitle = head ? `<p class="route__label">${r.checkTitle}</p>` : `<${h} id="route-${r.key}-h" class="route__label">${r.checkTitle}</${h}>`;
  return `<article class="route" id="route-${r.key}" data-goal="${r.key}" aria-labelledby="route-${r.key}-h">
            ${top}
            <div class="route__block route__block--check">
              ${checkTitle}
              <ol class="route__tests">${r.tests.map(([t, d, range], i) => `<li style="--i:${i}"><b>${t}</b><span>${d}</span>${range ? `<em>${range}</em>` : ""}</li>`).join("")}</ol>
              ${note}
            </div>
            <div class="route__after">
              <div class="route__block route__block--rule"><p class="route__label">Before anything is prescribed</p><p>${r.rule}</p></div>
              <div class="route__block route__block--again"><p class="route__label">Then</p><p>${r.recheck}</p></div>
              ${cta ? `<p class="route__go"><a class="btn" href="${toForm}" data-program="${r.key}">Begin your assessment</a><a class="textlink" href="${link(depth, p.slug)}">${p.name} in detail</a></p>` : ""}
            </div>
          </article>`;
}

export function head({ title, description, depth, canonical, extraHead = "" }) {
  const r = rel(depth);
  const url = "https://australianlongevityclinic.com.au/" + (canonical || "");
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${CLINIC.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://australianlongevityclinic.com.au/assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b1526">
<link rel="icon" href="${r}assets/img/logo/favicon.ico" sizes="any">
<link rel="icon" href="${r}assets/img/logo/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${r}assets/img/logo/touch-icon-180.png">
<link rel="preload" href="${r}assets/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}assets/fonts/azeret-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/scrollcraft/scrollcraft.css">
<link rel="stylesheet" href="${r}assets/css/site.css">
${extraHead}<script>document.documentElement.classList.add("js")</script>
</head>`;
}

export function strip(depth, current = "", startGround = "light") {
  const r = rel(depth);
  const L_ = (t) => link(depth, t);
  const cur = (k) => (k === current ? ' aria-current="page"' : "");
  const progs = PROGRAMS.map((p) => `<a href="${L_(p.slug)}"${cur(p.slug)}><span>${p.name}</span><span class="fig">${p.goal}</span></a>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="strip" data-ground="${startGround}">
  <div class="strip__in">
    <a class="brand" href="${L_("")}" aria-label="${CLINIC.name}, home">
      ${logoImg(depth, 52)}
      <span class="brand__name" aria-hidden="true"><b>${CLINIC.name}</b><span>Annerley, Brisbane</span></span>
    </a>
    <nav class="nav" aria-label="Main">
      <div class="nav__group">
        <button class="nav__more" type="button" aria-expanded="false" aria-controls="nav-programs">Programs</button>
        <div class="nav__menu" id="nav-programs" hidden>${progs}</div>
      </div>
      <a href="${L_("our-team")}"${cur("our-team")}>Doctors</a>
      <a href="${L_("blog")}"${cur("blog")}>Journal</a>
      <a href="${L_("contact")}"${cur("contact")}>Visit</a>
    </nav>
    <a class="btn" href="${current === "" || current === "contact" ? "#assessment" : L_("contact") + "#assessment"}">Begin your assessment</a>
    <button class="strip__menu" type="button" aria-expanded="false" aria-controls="sheet-menu"><i aria-hidden="true"></i>Menu</button>
  </div>
</header>
<div class="sheet-menu" id="sheet-menu" hidden role="dialog" aria-modal="true" aria-label="Menu">
  <div class="sheet-menu__top">
    <a class="brand" href="${L_("")}" aria-label="${CLINIC.name}, home">${logoImg(depth, 48)}<span class="brand__name" aria-hidden="true"><b>${CLINIC.name}</b><span>Annerley, Brisbane</span></span></a>
    <button class="sheet-menu__close" type="button">Close</button>
  </div>
  <nav aria-label="Menu">
    ${PROGRAMS.map((p) => `<a href="${L_(p.slug)}"><span>${p.name}</span><span class="fig">${p.goal}</span></a>`).join("\n    ")}
    <a href="${L_("our-team")}"><span>Doctors</span></a>
    <a href="${L_("blog")}"><span>Journal</span></a>
    <a href="${L_("contact")}"><span>Visit and contact</span></a>
  </nav>
  <a class="btn" href="${current === "" || current === "contact" ? "#assessment" : L_("contact") + "#assessment"}">Begin your assessment</a>
  <p class="sheet-menu__foot">${CLINIC.street}, ${CLINIC.suburb} ${CLINIC.state} ${CLINIC.postcode}<br><a href="mailto:${CLINIC.email}">${CLINIC.email}</a></p>
</div>`;
}

export function footer(depth, current = "") {
  // only the home page and the contact page carry the form itself
  const toForm = (depth === 0 && current === "") || current === "contact" ? "#assessment" : link(depth, "contact") + "#assessment";
  const L_ = (t) => link(depth, t);
  return `<footer class="foot g-dark" data-ground="dark">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <a class="foot__logo" href="${L_("")}" aria-label="${CLINIC.name}, home">${logoImg(depth, 120, "foot__medallion", CLINIC.name + " logo")}</a>
        <address>${CLINIC.street}<br>${CLINIC.suburb} ${CLINIC.state} ${CLINIC.postcode}<br><a href="mailto:${CLINIC.email}">${CLINIC.email}</a></address>
      </div>
      <div>
        <h2>Programs</h2>
        <ul>${PROGRAMS.map((p) => `<li><a href="${L_(p.slug)}">${p.name}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2>Clinic</h2>
        <ul>
          <li><a href="${L_("our-team")}">Doctors</a></li>
          <li><a href="${L_("contact")}#assessment">Begin your assessment</a></li>
          <li><a href="${L_("contact")}">Visit and contact</a></li>
          <li><a href="${L_("blog")}">Journal</a></li>
          <li><a href="${L_("privacy-policy")}">Privacy policy</a></li>
        </ul>
        <h2 style="margin-top:1.6rem">Hours</h2>
        <dl class="foot__hours">${CLINIC.hours.slice(0, 3).map(([d, h]) => `<dt>${d.replace("Monday to Friday", "Mon to Fri")}</dt><dd>${h}</dd>`).join("")}</dl>
      </div>
      <div class="foot__news">
        <h2>The journal, fortnightly</h2>
        <p>Educational notes on IV therapy, peptides, hormonal health and longevity medicine, written by the clinic's doctors.</p>
        <form class="news" method="post" action="" data-endpoint="" novalidate>
          <label class="visually-hidden" for="news-email-${depth}">Email address</label>
          <input class="input" id="news-email-${depth}" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
          <button class="btn" type="submit">Subscribe</button>
          <p class="note">Unsubscribe at any time.</p>
          <p role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
    <div class="foot__base">
      <div>
        <p>Website information is general only and does not replace individual medical advice. A consultation does not guarantee that a particular investigation, medicine, procedure or other clinical service will be appropriate. <b>For medical emergencies, call 000.</b></p>
        <p>We acknowledge the Traditional Custodians of the land on which the clinic stands, and pay our respects to Elders past and present.</p>
      </div>
      <div>
        <p>&copy; 2026 ${CLINIC.legal}, a registered business name of Horizon Medical Pty Ltd. ABN ${CLINIC.abn}. <a href="${L_("privacy-policy")}">Privacy policy</a>.</p>
        <p>Map data &copy; OpenStreetMap contributors.</p>
      </div>
    </div>
  </div>
</footer>
<div class="cta-bar" aria-hidden="true">
  <p>${CLINIC.fee}, reviewed<br>by a doctor</p>
  <a class="btn" href="${toForm}" tabindex="-1">Begin your assessment</a>
</div>`;
}

export function scripts(depth, list) {
  const r = rel(depth);
  return list.map((s) => `<script src="${r}${s}" defer></script>`).join("\n");
}

// ------------------------------------------------------------ the form --
const STATES = ["QLD", "NSW", "VIC", "ACT", "SA", "WA", "TAS", "NT"];
const choice = (type, name, value, label, extra = "", small = "") =>
  `<label class="choice"><input type="${type}" name="${name}" value="${value}"${extra}><span>${label}${small ? `<small>${small}</small>` : ""}</span></label>`;
const field = (id, label, input, { req = false, hint = "" } = {}) =>
  `<div class="field" data-field="${id}">
          <label for="${id}">${label}${req ? '<span class="req">required</span>' : ""}</label>
          ${hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ""}
          ${input}
          <p class="err" id="${id}-err" hidden></p>
        </div>`;

export function assessment(depth, { headingLevel = 2, act = false } = {}) {
  const L_ = (t) => link(depth, t);
  const h = `h${headingLevel}`, hs = `h${headingLevel + 1}`;
  const goals = [["energy", "Energy and recovery"], ["sleep", "Sleep"], ["composition", "Body composition"], ["hormones", "Hormone health"],
    ["menopause", "Menopause"], ["skin", "Skin and hair"], ["gut", "Gut health"], ["performance", "Athletic performance"],
    ["deficiency", "A known deficiency, such as iron"], ["planning", "Long-term health planning"]];
  const conditions = [["bp", "High blood pressure"], ["diabetes", "Diabetes"], ["heart", "Heart condition"], ["kidney_liver", "Kidney or liver condition"],
    ["cancer", "Cancer, current or past"], ["autoimmune", "Autoimmune condition"], ["mental", "Mental health condition"], ["none", "None of these"]];
  const open = act
    ? `<section class="assess g-light" id="assessment" data-ground="light" data-sc-act="flow" aria-labelledby="assess-h">
  <div class="assess__sheet" data-sc-reveal="up" data-sc-reveal-at="0 0.16">
  <div class="assess__in wrap">`
    : `<section class="assess g-light" id="assessment" data-ground="light" aria-labelledby="assess-h">
  <div class="assess__in wrap">`;
  return `${open}
    <header class="assess__head">
      <${h} id="assess-h" class="d-lg">Begin your assessment.</${h}>
      <p class="lede">A health questionnaire, a ${CLINIC.fee} fee, and a doctor's phone call within 1 to 2 business days.</p>
    </header>

    <aside class="assess__aside" aria-label="What the assessment involves">
      <div class="assess__progress">
        ${progressGlyph()}
        <p class="mono assess__step" aria-hidden="true"><span data-step-num>1</span> of 5<br><span data-step-name>Your goals</span></p>
      </div>
      <dl class="facts">
        <dt>Fee</dt><dd>${CLINIC.fee}, paid once through Stripe. It covers the doctor's review and your phone consultation. Not bulk billed.</dd>
        <dt>The call</dt><dd>Within 1 to 2 business days, ${CLINIC.callWindow}, on the number you give.</dd>
        <dt>Length</dt><dd>15 to 25 minutes with a doctor.</dd>
        <dt>Referral</dt><dd>Not needed for most programs. Iron infusions need a GP referral and pathology from the last 3 months.</dd>
        <dt>Privacy</dt><dd>Seen only by the clinic's medical team and used for your care, under the Australian Privacy Principles. <a href="${L_("privacy-policy")}">Privacy policy</a>.</dd>
      </dl>
      <p class="assess__note">You won't find patient testimonials on this site. Health advertising law in Australia doesn't allow them, and a consultation is the better test.</p>
    </aside>

    <form class="intake" id="intake" method="post" action="" data-endpoint="" data-checkout-url="" novalidate aria-labelledby="assess-h">
      <ol class="intake__tabs" aria-label="Assessment steps">
        <li><button type="button" data-goto="0" aria-current="step"><span class="mono">1</span>Goals</button></li>
        <li><button type="button" data-goto="1" disabled><span class="mono">2</span>About you</button></li>
        <li><button type="button" data-goto="2" disabled><span class="mono">3</span>Health</button></li>
        <li><button type="button" data-goto="3" disabled><span class="mono">4</span>Contact</button></li>
        <li><button type="button" data-goto="4" disabled><span class="mono">5</span>Review</button></li>
      </ol>
      <div class="intake__alert" role="alert" tabindex="-1" hidden></div>

      <section class="intake__step" data-step="0" data-name="Your goals" aria-labelledby="st0">
        <${hs} id="st0" class="d-sm" tabindex="-1">What would you like help with?</${hs}>
        <fieldset class="group" data-field="program">
          <legend>Program<span class="req">required</span></legend>
          <p class="hint">If you're not sure, choose the last option and the doctor will advise.</p>
          <div class="choices">
            ${PROGRAMS.map((p) => choice("radio", "program", p.key, p.name, ' required', p.goal)).join("\n            ")}
            ${choice("radio", "program", "unsure", "Not sure yet", " required", "the doctor will advise")}
          </div>
          <p class="err" id="program-err" hidden></p>
        </fieldset>
        <fieldset class="group">
          <legend>What matters most to you right now?</legend>
          <p class="hint">Choose any that apply.</p>
          <div class="chips">${goals.map(([v, l]) => choice("checkbox", "goals", v, l)).join("")}</div>
        </fieldset>
        ${field("reason", "In your own words, what's prompting this now?", `<textarea class="textarea" id="reason" name="reason" rows="3" aria-describedby="reason-hint"></textarea>`, { hint: "Optional. The doctor reads this before the call." })}
      </section>

      <section class="intake__step" data-step="1" data-name="About you" aria-labelledby="st1">
        <${hs} id="st1" class="d-sm" tabindex="-1">About you</${hs}>
        <div class="row2">
          ${field("first_name", "First name", `<input class="input" id="first_name" name="first_name" autocomplete="given-name" required>`, { req: true })}
          ${field("last_name", "Last name", `<input class="input" id="last_name" name="last_name" autocomplete="family-name" required>`, { req: true })}
        </div>
        <div class="row2">
          ${field("dob", "Date of birth", `<input class="input" id="dob" name="dob" inputmode="numeric" autocomplete="bday" placeholder="DD/MM/YYYY" maxlength="10" required aria-describedby="dob-hint">`, { req: true, hint: "You need to be 18 or over." })}
          <fieldset class="group" data-field="sex">
            <legend>Sex<span class="req">required</span></legend>
            <p class="hint">Some programs depend on it clinically.</p>
            <div class="inline-choices">
              ${choice("radio", "sex", "female", "Female", " required")}${choice("radio", "sex", "male", "Male", " required")}${choice("radio", "sex", "intersex", "Intersex", " required")}${choice("radio", "sex", "discuss", "Discuss with the doctor", " required")}
            </div>
            <p class="err" id="sex-err" hidden></p>
          </fieldset>
        </div>
        <div class="row2">
          ${field("height_cm", "Height in cm", `<input class="input" id="height_cm" name="height_cm" inputmode="numeric" maxlength="3" aria-describedby="height_cm-hint">`, { hint: "Optional." })}
          ${field("weight_kg", "Weight in kg", `<input class="input" id="weight_kg" name="weight_kg" inputmode="decimal" maxlength="5" aria-describedby="weight_kg-hint">`, { hint: "Optional, and useful for weight management." })}
        </div>
        <div class="row3">
          ${field("suburb", "Suburb", `<input class="input" id="suburb" name="suburb" autocomplete="address-level2" required>`, { req: true })}
          ${field("state", "State", `<select class="select" id="state" name="state" autocomplete="address-level1" required><option value="">Choose</option>${STATES.map((s) => `<option${s === "QLD" ? "" : ""}>${s}</option>`).join("")}</select>`, { req: true })}
          ${field("postcode", "Postcode", `<input class="input" id="postcode" name="postcode" inputmode="numeric" autocomplete="postal-code" maxlength="4" required>`, { req: true })}
        </div>
      </section>

      <section class="intake__step" data-step="2" data-name="Your health" aria-labelledby="st2">
        <${hs} id="st2" class="d-sm" tabindex="-1">Your health</${hs}>
        <fieldset class="group" data-field="conditions">
          <legend>Do any of these apply to you?</legend>
          <div class="chips">${conditions.map(([v, l]) => choice("checkbox", "conditions", v, l)).join("")}</div>
          <p class="err" id="conditions-err" hidden></p>
        </fieldset>
        ${field("conditions_other", "Any other conditions, operations or diagnoses", `<input class="input" id="conditions_other" name="conditions_other" aria-describedby="conditions_other-hint">`, { hint: "Optional." })}
        ${field("medications", "Medicines and supplements you take", `<textarea class="textarea" id="medications" name="medications" rows="3" required aria-describedby="medications-hint"></textarea>`, { req: true, hint: "Include doses if you know them. Write “None” if there are none." })}
        ${field("allergies", "Allergies", `<input class="input" id="allergies" name="allergies" required aria-describedby="allergies-hint">`, { req: true, hint: "Write “None known” if there are none." })}
        <fieldset class="group" data-field="pregnancy" data-when="sex:female,intersex" hidden>
          <legend>Are you pregnant, breastfeeding or planning a pregnancy?<span class="req">required</span></legend>
          <div class="inline-choices">${choice("radio", "pregnancy", "no", "No")}${choice("radio", "pregnancy", "yes", "Yes")}${choice("radio", "pregnancy", "planning", "Planning")}</div>
          <p class="err" id="pregnancy-err" hidden></p>
        </fieldset>
        <fieldset class="group" data-field="pathology">
          <legend>Have you had blood tests in the last 3 months?<span class="req">required</span></legend>
          <p class="hint">If you have, keep the results handy for the call.</p>
          <div class="inline-choices">${choice("radio", "pathology", "yes", "Yes", " required")}${choice("radio", "pathology", "no", "No", " required")}${choice("radio", "pathology", "unsure", "Not sure", " required")}</div>
          <p class="err" id="pathology-err" hidden></p>
        </fieldset>
        <div class="row2">
          <fieldset class="group">
            <legend>Smoking</legend>
            <div class="inline-choices">${choice("radio", "smoking", "never", "Never")}${choice("radio", "smoking", "former", "Former")}${choice("radio", "smoking", "current", "Current")}</div>
          </fieldset>
          ${field("alcohol", "Alcohol in a typical week", `<select class="select" id="alcohol" name="alcohol"><option value="">Choose</option><option>None</option><option>1 to 7 drinks</option><option>8 to 14 drinks</option><option>15 or more drinks</option></select>`)}
        </div>
        <fieldset class="group">
          <legend>Do you have a regular GP?</legend>
          <div class="inline-choices">${choice("radio", "gp", "yes", "Yes")}${choice("radio", "gp", "no", "No")}</div>
        </fieldset>
        <fieldset class="group" data-when="gp:yes" hidden>
          <legend>May the doctor send your GP a summary?</legend>
          <div class="inline-choices">${choice("radio", "gp_share", "yes", "Yes")}${choice("radio", "gp_share", "no", "No")}</div>
        </fieldset>
      </section>

      <section class="intake__step" data-step="3" data-name="Contact and consent" aria-labelledby="st3">
        <${hs} id="st3" class="d-sm" tabindex="-1">Contact and consent</${hs}>
        <div class="row2">
          ${field("phone", "Phone number", `<input class="input" id="phone" name="phone" type="tel" autocomplete="tel" required aria-describedby="phone-hint">`, { req: true, hint: "The doctor calls this number." })}
          ${field("email", "Email", `<input class="input" id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-hint">`, { req: true, hint: "For your receipt and appointment details." })}
        </div>
        <fieldset class="group">
          <legend>Best time for the doctor's call</legend>
          <p class="hint">${CLINIC.callWindow}.</p>
          <div class="inline-choices">${choice("radio", "call_time", "morning", "Morning")}${choice("radio", "call_time", "midday", "Midday")}${choice("radio", "call_time", "afternoon", "Afternoon")}${choice("radio", "call_time", "any", "Any time")}</div>
        </fieldset>
        <div class="row2 row2--medicare">
          ${field("medicare_number", "Medicare card number", `<input class="input" id="medicare_number" name="medicare_number" inputmode="numeric" maxlength="12" aria-describedby="medicare_number-hint">`, { hint: "Optional. Some consultations may attract a rebate." })}
          ${field("medicare_irn", "Number beside your name", `<input class="input" id="medicare_irn" name="medicare_irn" inputmode="numeric" maxlength="1" aria-describedby="medicare_irn-hint">`, { hint: "Optional. 1 to 9." })}
        </div>
        <fieldset class="group consents" data-field="consent">
          <legend class="visually-hidden">Consent</legend>
          <label class="consent"><input type="checkbox" name="consent_accurate" value="yes" required><span>The information I've given is accurate to the best of my knowledge.</span></label>
          <label class="consent"><input type="checkbox" name="consent_privacy" value="yes" required><span>I agree to the clinic collecting and using my health information to provide my care, as set out in the <a href="${L_("privacy-policy")}">privacy policy</a>.</span></label>
          <label class="consent"><input type="checkbox" name="consent_emergency" value="yes" required><span>I understand this is not an emergency service. In an emergency I will call 000.</span></label>
          <label class="consent consent--opt"><input type="checkbox" name="newsletter" value="yes"><span>Send me the clinic's fortnightly journal by email. Optional.</span></label>
          <p class="err" id="consent-err" hidden></p>
        </fieldset>
      </section>

      <section class="intake__step" data-step="4" data-name="Review and fee" aria-labelledby="st4">
        <${hs} id="st4" class="d-sm" tabindex="-1">Review and fee</${hs}>
        <div class="review" data-review></div>
        <div class="fee">
          <p class="fee__amt"><span class="mono">Consultation fee</span><b>${CLINIC.fee}</b><span class="mono">AUD, paid once</span></p>
          <ol class="fee__next">
            <li><b>Now.</b> You pay through Stripe's secure checkout. Your card details go to Stripe, not to the clinic.</li>
            <li><b>Within 1 to 2 business days.</b> A doctor reads your answers, then calls you on <span data-echo="phone">the number you gave</span>, ${CLINIC.callWindow}.</li>
            <li><b>On the call.</b> 15 to 25 minutes on your history, goals and options. If a program isn't right for you, the doctor will say so.</li>
          </ol>
        </div>
      </section>

      <div class="intake__nav">
        <button type="button" class="btn btn--quiet" data-back hidden>Back</button>
        <button type="button" class="btn" data-next>Continue</button>
        <button type="submit" class="btn" data-submit>Pay ${CLINIC.fee} and send to the doctor</button>
      </div>
      <div class="intake__result" data-result role="status" aria-live="polite" tabindex="-1" hidden></div>
      <p class="intake__keep">Answers stay in this browser tab until you send them or close it. <button type="button" class="linkish" data-clear>Clear my answers</button></p>
    </form>
  </div>${act ? "\n  </div>" : ""}
</section>`;
}

// --------------------------------------------------------------- home ---
// The goal route. Five acts in the order a consultation answers questions:
// what you want (hero), what can help (the programs rail), what a doctor
// checks before prescribing (the route, the peak), who decides (the lead
// doctors), and how you start (the assessment). Every goal on the page is a
// control that routes to the same goal everywhere else; home.js wires it.
function home() {
  const depth = 0;
  const L_ = (t) => link(depth, t);
  const P = Object.fromEntries(PROGRAMS.map((p) => [p.key, p]));
  const R = Object.fromEntries(ROUTES.map((r) => [r.key, r]));
  const goals = (cls, label) => `<nav class="goals ${cls}" aria-label="${label}">
          <ul>${ROUTES.map((r) => `<li><a class="goal" href="#route-${r.key}" data-goal="${r.key}">${r.goal}</a></li>`).join("")}</ul>
        </nav>`;
  const print = (d) => `<figure class="print">
            <img src="assets/img/doctors/${d.slug}-1x.webp" srcset="assets/img/doctors/${d.slug}-1x.webp 328w, assets/img/doctors/${d.slug}-2x.webp 524w" sizes="(max-width: 860px) 42vw, 15rem" width="${d.photo[0]}" height="${d.photo[1]}" alt="Portrait of ${d.name}" decoding="async">
            <figcaption><b>${d.name}</b><span>${withAbbr(d.post)}</span></figcaption>
          </figure>`;
  const card = (r) => {
    const p = P[r.key];
    return `
        <article class="pl" id="program-${p.key}" aria-labelledby="pl-${p.key}">
          <div class="pl__plate">
            <p class="pl__checks" aria-hidden="true">${r.tests.map(([t]) => t).join(" · ")}</p>
            <p class="pl__goal">${r.goal}</p>
          </div>
          <div class="pl__text">
            <h3 id="pl-${p.key}" class="d-md">${p.name}</h3>
            <p class="pl__intro">${r.card.intro}</p>
            <dl class="schema">${r.card.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
            <p class="pl__links"><a class="textlink" href="${L_(p.slug)}">${p.name} in detail</a> <a class="textlink" href="#route-${r.key}" data-goal="${r.key}">What a doctor checks</a></p>
          </div>
        </article>`;
  };

  const body = `
<main id="main">
  <section class="hero g-dark" id="top" data-ground="dark" data-sc-act="flow" aria-labelledby="hero-h">
    <div class="hero__far" data-sc-parallax="-1.3" aria-hidden="true">
      <picture>
        <source type="image/avif" srcset="assets/img/data-field-1600.avif 1600w, assets/img/data-field-2400.avif 2400w" sizes="100vw">
        <img src="assets/img/data-field-1600.webp" srcset="assets/img/data-field-1600.webp 1600w, assets/img/data-field-2400.webp 2400w" sizes="100vw" alt="" width="2400" height="1500" decoding="async">
      </picture>
    </div>
    <div class="wrap hero__grid">
      <h1 id="hero-h" class="hero__h1">Real peptide therapy, from real doctors.</h1>
      <div class="hero__copy">
        <p class="lede">Testosterone, weight loss, skin and energy programs. A doctor checks your history and, where it matters, your bloods first.</p>
        <div class="hero__goals">
          <p class="goals__label" id="goals-l">What do you want to change?</p>
          ${goals("goals--hero", "What do you want to change?")}
        </div>
        <p class="hero__act"><a class="btn" href="#assessment">Begin your assessment</a></p>
      </div>
      <div class="hero__scene">
        <div class="hero__prints" data-depth="8" data-sc-parallax="-0.5">
          <p class="hero__label">Our lead doctors</p>
          ${print(DOCTORS[0])}
          ${print(DOCTORS[1])}
        </div>
        <aside class="slip" data-depth="-6" data-sc-parallax="0.45" aria-label="Tests for the goal you point at">
          <p class="slip__label">Checked before anything is prescribed</p>
          <p class="slip__goal" data-slip-goal>${R.testosterone.goal}</p>
          <ul class="slip__tests" data-slip-tests>${R.testosterone.tests.map(([t]) => `<li>${t}</li>`).join("")}</ul>
        </aside>
      </div>
    </div>
  </section>

  <section class="programs g-light" id="programs" data-ground="light" data-sc-act="pan" data-sc-span="3.2" aria-labelledby="programs-h">
    <div class="programs__stage" data-sc-stage>
      <div class="rail" data-sc-pan="0.04">
        <header class="rail__head">
          <h2 id="programs-h" class="d-lg">Four programs. One way in.</h2>
          <p>Each starts the same way: your questionnaire, a doctor's review and a phone consultation, with pathology wherever a decision depends on it.</p>
        </header>
        ${ROUTES.map(card).join("")}
        <footer class="rail__end">
          <p class="d-sm">Not sure which?</p>
          <p>Choose &ldquo;Not sure yet&rdquo; in the assessment. The doctor will tell you what, if anything, makes sense.</p>
          <a class="btn" href="#assessment" data-program="unsure">Begin your assessment</a>
        </footer>
      </div>
    </div>
  </section>

  <section class="route-act g-dark" id="route" data-ground="dark" data-sc-act="pin" data-sc-span="4.6" aria-labelledby="route-h">
    <div class="route-act__stage" data-sc-stage data-sc-verify-state="route">
      <div class="wrap route-act__grid">
        <header class="route-act__head">
          <h2 id="route-h" class="d-lg">What a doctor checks before prescribing.</h2>
          <p class="route-act__lede">Pick what you're after. Here's what a doctor may order first, and when you'd be tested again.</p>
          ${goals("goals--route", "Goals")}
          <p class="route-act__chosen" data-chosen aria-live="polite"></p>
        </header>
        <div class="route-act__panels">
          ${ROUTES.map((r) => routePanel(r, { depth, level: 3 })).join("\n          ")}
        </div>
      </div>
    </div>
  </section>

  <section class="lead g-light" id="doctors" data-ground="light" data-sc-act="flow" aria-labelledby="lead-h">
    <div class="wrap">
      <header class="lead__head" data-sc-in>
        <h2 id="lead-h" class="d-lg">The doctors who lead the clinic.</h2>
        <p class="lede">Dr Raman Bohra and Dr Rekha Bohra are Fellows of the Royal Australian College of General Practitioners. Every consultation is one to one with a doctor.</p>
        <p class="lead__links"><a class="textlink" href="${L_("our-team")}">Full records and special interests</a><a class="textlink" href="${CLINIC.ahpra}" rel="noopener" target="_blank">Check a registration on the AHPRA register<span class="visually-hidden"> (opens in a new tab)</span></a></p>
      </header>
      <div data-sc-in>
      ${register(depth)}
      </div>
      <div class="lead__visit" data-sc-in>
        <figure class="plate lead__map">
          <img src="assets/img/map-annerley.svg" alt="A street map of Annerley with the clinic marked at 628 Ipswich Road, between Venner Road and School Road, with Brisbane's CBD to the north." width="1200" height="900" loading="lazy" decoding="async">
          <figcaption>${CLINIC.street}, ${CLINIC.suburb}, on the main road south from the city. Map data &copy; OpenStreetMap contributors.</figcaption>
        </figure>
        <div class="lead__rules">
          <h3 class="d-sm">What the clinic won't do</h3>
          <ul class="dashes">
            <li>Prescribe from a questionnaire alone.</li>
            <li>Promise outcomes. Responses vary, and the doctor will tell you what the evidence does and doesn't show.</li>
            <li>Publish testimonials. Australian health advertising law doesn't allow them.</li>
          </ul>
          <address>${CLINIC.street}<br>${CLINIC.suburb} ${CLINIC.state} ${CLINIC.postcode}<br><a href="mailto:${CLINIC.email}">${CLINIC.email}</a></address>
          <dl class="facts">${CLINIC.hours.slice(0, 3).map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join("")}</dl>
          <p><a class="textlink" href="${L_("contact")}">Visit and contact</a></p>
        </div>
      </div>
    </div>
  </section>

  ${assessment(depth, { act: true })}
</main>`;

  return head({
    title: "Australian Longevity Clinic · Peptide therapy, testosterone and weight loss in Annerley, Brisbane",
    description: "Real peptide therapy from real doctors in Annerley, Brisbane. Testosterone, medical weight loss, skin and IV programs, prescribed only after a doctor has checked your history and, where it matters, your bloods.",
    depth, canonical: "",
    extraHead: `<link rel="stylesheet" href="assets/css/home.css">
<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "MedicalClinic", name: CLINIC.name, url: "https://australianlongevityclinic.com.au/",
      email: CLINIC.email, image: "https://australianlongevityclinic.com.au/assets/img/og.jpg",
      logo: "https://australianlongevityclinic.com.au/assets/img/logo/alc-medallion-512.png",
      address: { "@type": "PostalAddress", streetAddress: CLINIC.street, addressLocality: CLINIC.suburb, addressRegion: CLINIC.state, postalCode: CLINIC.postcode, addressCountry: "AU" },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" }],
    })}</script>
`,
  }) + `
<body class="home">
${strip(depth, "", "dark")}
${body}
${footer(depth)}
${scripts(depth, ["assets/scrollcraft/scrollcraft.js", "assets/js/site.js", "assets/js/intake.js", "assets/js/home.js"])}
</body>
</html>
`;
}

// ------------------------------------------------------------ contact ---
function contact() {
  const depth = 1;
  const L_ = (t) => link(depth, t);
  const faqs = [
    ["What happens during the consultation?", "It's a phone call with one of the clinic's doctors, usually 15 to 25 minutes. The doctor will already have read your questionnaire, so the call goes on your symptoms, your goals and your questions before anything is recommended."],
    ["Why is there a $75 fee?", "It pays for the doctor's time reading your questionnaire before the call, the medical assessment on the call, and ongoing support from your treating doctor."],
    ["When will the doctor call?", `Within 1 to 2 business days of your form and payment arriving, ${CLINIC.callWindow}, on the number you give.`],
    ["Do I need to prepare anything?", "No. If you have recent blood tests or medical reports, keep them nearby for the call, but you don't need them."],
    ["Is the consultation bulk billed?", "No. The $75 is a private consultation fee, paid when you send the questionnaire. Some consultations may attract a Medicare rebate, depending on their clinical nature."],
    ["What can happen after the consultation?", "Depending on your assessment, the doctor may recommend IV therapy, a peptide program, testosterone therapy, medical weight management or a combination. They may also recommend pathology first, or nothing at all."],
    ["Is my health information confidential?", `Yes. It is handled under Australian privacy law and the clinic's <a href="${L_("privacy-policy")}">privacy policy</a>, and used for your care.`],
    ["Do I need a referral?", "Not for most programs. Iron infusions need a GP referral and pathology from the last 3 months; the clinic can arrange a pathology referral if you don't have recent results."],
  ];
  const body = `
<main id="main" class="page">
  <header class="page-head g-light" data-ground="light">
    <div class="wrap page-head__grid">
      <div>
        <h1 class="d-xl">Visit, call, or begin online.</h1>
        <p class="lede">Most programs start with the online assessment and a doctor's phone call. Infusions happen in the clinic at Annerley.</p>
        <div class="page-head__actions"><a class="btn" href="#assessment">Begin your assessment</a><a class="textlink" href="mailto:${CLINIC.email}">${CLINIC.email}</a></div>
      </div>
      <dl class="facts">
        <dt>Address</dt><dd>${CLINIC.street}, ${CLINIC.suburb} ${CLINIC.state} ${CLINIC.postcode}</dd>
        ${CLINIC.hours.map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join("")}
        <dt>Doctor's calls</dt><dd>${CLINIC.callWindow}</dd>
      </dl>
    </div>
  </header>
  <section class="g-light visit-band" data-ground="light">
    <div class="wrap">
      <figure class="plate visit-band__map">
        <img src="${rel(depth)}assets/img/map-annerley.svg" alt="A street map of Annerley with the clinic marked at 628 Ipswich Road, between Venner Road and School Road, with Brisbane's CBD to the north." width="1200" height="900" loading="lazy" decoding="async">
        <figcaption>${CLINIC.street}, ${CLINIC.suburb}, on the main road south from the city. Map data &copy; OpenStreetMap contributors.</figcaption>
      </figure>
    </div>
  </section>
  ${assessment(depth)}
  <section class="g-light band" data-ground="light" aria-labelledby="faq-h">
    <div class="wrap band__grid">
      <h2 id="faq-h" class="d-md">Before you begin</h2>
      <div class="faq">${faqs.map(([q, a]) => `<details><summary>${q}</summary><div class="faq__a"><p>${a}</p></div></details>`).join("")}</div>
    </div>
  </section>
</main>`;
  return head({ title: "Visit and begin your assessment · Australian Longevity Clinic", description: `The clinic is at ${CLINIC.street}, ${CLINIC.suburb}. Begin with an online health questionnaire and a doctor's phone consultation: ${CLINIC.fee}, with a call within 1 to 2 business days.`, depth, canonical: "contact" }) + `
<body class="inner">
${strip(depth, "contact", "light")}
${body}
${footer(depth, "contact")}
${scripts(depth, ["assets/js/site.js", "assets/js/intake.js"])}
</body>
</html>
`;
}

// ----------------------------------------------------------------- write
function write(rp, html) {
  const out = path.join(SITE, rp);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return rp;
}

const ctx = { CLINIC, PROGRAMS, DOCTORS, ROUTES, head, strip, footer, scripts, assessment, register, routePanel, link, rel, esc, logoImg, SITE };
const written = [
  write("index.html", home()),
  write("contact/index.html", contact()),
  ...servicePages(ctx).map(([p, h]) => write(p, h)),
  write("our-team/index.html", teamPage(ctx)),
  write("privacy-policy/index.html", privacyPage(ctx)),
  write("404.html", notFoundPage(ctx)),
  ...journalPages(ctx).map(([p, h]) => write(p, h)),
];
console.log("wrote", written.length, "pages:\n  " + written.join("\n  "));
