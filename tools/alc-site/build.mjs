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
  { key: "iv", slug: "iv-drips", name: "IV therapy", fig: "2" },
  { key: "peptides", slug: "peptide-therapy", name: "Peptide programs", fig: "3" },
  { key: "testosterone", slug: "testosterone-therapy", name: "Testosterone therapy", fig: "4" },
  { key: "weight", slug: "weight-management", name: "Medical weight management", fig: "5" },
];

// --------------------------------------------------------------- assets
export const MARK = read(path.join(IMG, "mark.svg"));
const CORE = read(path.join(IMG, "core.svg"));
const TICKS = JSON.parse(read(path.join(IMG, "core-ticks.json")));
const PROGRESS = read(path.join(IMG, "progress-rings.svg"));
const META = JSON.parse(read(path.resolve(HERE, "../alc-assets/round-meta.json")));

// Geometry shared with home.js: where the bark sits on the round image, and
// how core units map to the core element.
const BARK = META.bark_r_mm;                    // mm, pith to bark along the core
const F_BARK = (BARK * META.scale) / META.size;   // bark radius as a fraction of the image width
const L = BARK * 10;                             // core.svg units, pith to bark
const VB0 = -4, VBW = L + 22;                    // core.svg viewBox x and width
const coreX = (frac) => (((frac * L) - VB0) / VBW) * 100; // % across the core element
const ringFrac = (year) => {
  const i = META.years.indexOf(year);
  const prev = i > 0 ? META.core_r_mm[i - 1] : 0;
  return ((prev + META.core_r_mm[i]) / 2) / BARK;
};
const MEASURED_MM = META.core_r_mm[META.core_r_mm.length - 1];

// ------------------------------------------------------------- partials
export const rel = (depth) => (depth ? "../".repeat(depth) : "");
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const link = (depth, target) => rel(depth) + (target === "" ? "index.html" : target.replace(/\/?$/, "/index.html").replace(/^\/index\.html$/, "index.html"));
export const markSvg = (cls = "") => MARK.replace("<svg ", `<svg class="${cls}" `);

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
<meta name="theme-color" content="#0d1611">
<link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
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
  const progs = PROGRAMS.map((p) => `<a href="${L_(p.slug)}"${cur(p.slug)}><span class="fig">Fig. ${p.fig}</span><span>${p.name}</span></a>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="strip" data-ground="${startGround}">
  <div class="strip__in">
    <a class="brand" href="${L_("")}" aria-label="${CLINIC.name}, home">
      ${markSvg()}
      <span class="brand__name"><b>${CLINIC.name}</b><span>Annerley, Brisbane</span></span>
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
    <a class="brand" href="${L_("")}">${markSvg()}<span class="brand__name"><b>${CLINIC.name}</b><span>Annerley, Brisbane</span></span></a>
    <button class="sheet-menu__close" type="button">Close</button>
  </div>
  <nav aria-label="Menu">
    ${PROGRAMS.map((p) => `<a href="${L_(p.slug)}"><span class="fig">Fig. ${p.fig}</span>${p.name}</a>`).join("\n    ")}
    <a href="${L_("our-team")}"><span class="fig">&nbsp;</span>Doctors</a>
    <a href="${L_("blog")}"><span class="fig">&nbsp;</span>Journal</a>
    <a href="${L_("contact")}"><span class="fig">&nbsp;</span>Visit and contact</a>
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
        <a class="brand" href="${L_("")}">${markSvg()}<span class="brand__name"><b>${CLINIC.name}</b><span>Annerley, Brisbane</span></span></a>
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
        <p>Figures drawn from tree-ring measurements by K. Allen and colleagues, NOAA NCEI International Tree-Ring Data Bank (AUS123C, AUS118). Map data &copy; OpenStreetMap contributors.</p>
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
      <div class="assess__rings">
        ${PROGRESS}
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
            ${PROGRAMS.map((p) => choice("radio", "program", p.key, p.name, ' required', `Fig. ${p.fig}`)).join("\n            ")}
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
function home() {
  const depth = 0;
  const L_ = (t) => link(depth, t);
  const ticks = TICKS.map((t) => `<span class="cr-tick${t.year % 200 ? " cr-tick--odd" : ""}" style="left:${coreX(t.f).toFixed(3)}%">${t.year}</span>`).join("");
  const callout = (year, cls, html) => `<p class="cr-note ${cls}" style="--x:${coreX(ringFrac(year)).toFixed(3)}%">${html}</p>`;
  // decade dots by the standard convention, as HTML so they stay round when the strip stretches
  const dots = META.years.filter((y) => y % 10 === 0).map((y) => {
    const n = y % 1000 === 0 ? 4 : y % 100 === 0 ? 3 : y % 50 === 0 ? 2 : 1;
    return `<i style="left:${coreX(ringFrac(y)).toFixed(3)}%;--n:${n}"></i>`;
  }).join("");
  const span = (a, b) => `style="--x0:${coreX(ringFrac(a)).toFixed(3)}%;--x1:${coreX(ringFrac(b)).toFixed(3)}%"`;
  const plate = (p, file, alt, caption, rows, intro) => `
        <article class="pl" id="program-${p.key}" aria-labelledby="pl-${p.key}">
          <figure class="plate pl__fig">
            <img src="assets/img/${file}" alt="${esc(alt)}" width="800" height="1000" loading="lazy" decoding="async">
            <figcaption><span class="fig"><b>Fig. ${p.fig}</b></span>${caption}</figcaption>
          </figure>
          <div class="pl__text">
            <h3 id="pl-${p.key}" class="d-md">${p.name}</h3>
            <p class="pl__intro">${intro}</p>
            <dl class="schema">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
            <p class="pl__links"><a class="textlink" href="${L_(p.slug)}">${p.name} in detail</a> <a class="textlink" href="#assessment" data-program="${p.key}">Begin with this program</a></p>
          </div>
        </article>`;
  const P = Object.fromEntries(PROGRAMS.map((p) => [p.key, p]));

  const body = `
<main id="main">
  <section class="specimen g-dark" id="top" data-ground="dark" data-sc-act="pin" data-sc-span="4.8" aria-label="Introduction">
    <div class="specimen__stage" data-sc-stage data-bark="${F_BARK.toFixed(5)}" data-sc-verify-state="p=0">
      <div class="sp-far" aria-hidden="true"><img src="assets/img/round-far.webp" alt="" width="1000" height="1000" decoding="async"></div>
      <figure class="sp-round" aria-labelledby="fig1">
        <picture>
          <source type="image/avif" srcset="assets/img/round-1000.avif 1000w, assets/img/round-1400.avif 1400w" sizes="(max-width: 860px) 100vw, 56vw">
          <img src="assets/img/round-1000.webp" alt="A Huon pine cross-section drawn in fine gold lines: about a thousand growth rings, with drying cracks and a thin band of bark." width="1000" height="1000" fetchpriority="high" decoding="async">
        </picture>
        <span class="sp-borer" aria-hidden="true"></span>
        <p class="sp-borer-note mono" aria-hidden="true">An increment borer draws a pencil-thin core from bark to pith. It does the tree little harm.</p>
      </figure>

      <div class="sp-label" id="fig1">
        <p class="fig"><b>Fig. 1</b></p>
        <p class="sp-label__name"><i>Lagarostrobos franklinii</i>, Huon pine</p>
        <p>Every ring drawn from the measured widths of core PEB07A: 1,010 rings, AD 1003 to 2012, from Teepookana in western Tasmania. The outline is modelled.</p>
        <p class="mono">Data: K. Allen, NOAA ITRDB AUS123C</p>
      </div>

      <div class="sp-hero" data-sc-cue="0 0.19 0 0.34">
        <h1 class="d-xl">Longevity medicine that reads before it treats.</h1>
        <p class="lede">A doctor-led clinic at ${CLINIC.street}, ${CLINIC.suburb}. IV therapy, peptide programs, testosterone therapy and medical weight management, each prescribed only after a doctor has read your history and your pathology.</p>
        <div class="sp-hero__act">
          <a class="btn" href="#assessment">Begin your assessment</a>
          <a class="textlink" href="#protocol">How it works</a>
        </div>
        <p class="sp-hero__fine mono">${CLINIC.fee} · reviewed by a doctor · a call within 1 to 2 business days</p>
      </div>

      <div class="sp-core" aria-hidden="true">
        <p class="sp-core__head mono"><b>Fig. 1a</b> Core PEB07A, pith to bark · 1,010 rings · ${MEASURED_MM.toFixed(1)} mm of measured wood</p>
        <div class="sp-core__body">
          <div class="sp-core__strip">${CORE}</div>
          <div class="sp-core__dots">${dots}</div>
          <div class="sp-core__ticks">${ticks}</div>
          <div class="sp-core__span" ${span(1446, 1505)}></div>
          ${callout(1003, "cr-note--first", "<b>1003</b> The first measured ring.")}
          ${callout(1475, "cr-note--match", "<b>1446 to 1505</b> Matched ring for ring against a second core from the same tree. Fig. 4.")}
          ${callout(1665, "cr-note--lean", "<b>1665</b> A narrow year between two ordinary ones. Fig. 2.")}
          ${callout(2012, "cr-note--last", "<b>2012</b> The ring under the bark.")}
        </div>
      </div>

      <div class="sp-read" data-sc-cue="0.76 1 0.22 0.02">
        <h2 class="d-lg">Every ring is measured before anything is said about the tree.</h2>
        <div class="sp-read__body">
          <p>In dendrochronology nothing is dated from a single reading. Every ring is measured, and each core is checked against others before a year is trusted.</p>
          <p>Your first consultation works the same way: your history, your medicines, your pathology, then a doctor's call. A plan comes after that. Sometimes the plan is no.</p>
        </div>
      </div>

      <div class="sp-static" aria-hidden="true"></div>
    </div>
  </section>

  <section class="programs g-light" id="programs" data-ground="light" data-sc-act="pan" data-sc-span="3.6" aria-labelledby="programs-h">
    <div class="programs__stage" data-sc-stage>
      <div class="rail" data-sc-pan="0.04">
        <header class="rail__head">
          <h2 id="programs-h" class="d-lg">Four programs. One way in.</h2>
          <p>Each starts the same way: your questionnaire, a doctor's review and a phone consultation, with pathology wherever a decision depends on it.</p>
          <p class="soft">The plates are drawn from the same tree as the core.</p>
        </header>
        ${plate(P.iv, "plate-tracheids.svg",
          "A drawing of wood cells in cross-section: rows of rounded cells, large in each year's early growth and small and thick-walled at the end of it, across three yearly rings.",
          "Tracheids, the cells that carry water up the stem, across three measured rings: 1664 to 1666. Cells drawn for illustration.",
          [["What it is", "Infusions of fluids, vitamins, iron or NAD+, given in the clinic."], ["First step", "A consultation. Iron also needs pathology from the last 3 months and a GP referral."], ["Time", "30 minutes to 4 hours, by infusion."], ["Where", "In the chair at Annerley, under a doctor's supervision."]],
          "Delivered as a health service under the direct supervision of the clinic's doctors.")}
        ${plate(P.peptides, "plate-branchlet.svg",
          "A pen drawing of a weeping Huon pine branchlet: slender hanging shoots covered in small overlapping scale leaves.",
          "A branchlet of <i>Lagarostrobos franklinii</i>: small scale leaves pressed close along each hanging shoot. Drawn for illustration.",
          [["What it is", "Prescription peptide programs built around one goal, such as recovery, sleep or body composition."], ["First step", "A consultation. Most therapeutic peptides are Schedule 4 medicines, prescribed only if suitable."], ["Time", "Weeks to months, reviewed as you go."], ["Where", "Prescribed by the clinic's doctors, with administration taught."]],
          "Peptides are short chains of amino acids that act as signals in the body.")}
        ${plate(P.testosterone, "plate-crossdate.svg",
          "A cross-dating chart: two tree cores at top and bottom, with vertical bars marking narrow rings in each, and five years where both cores agree highlighted in gold.",
          "Two cores from one tree, PEB07A and PEB07B, cross-dated 1446 to 1505. Five narrow rings in both, in gold, fix the calendar.",
          [["What it is", "Testosterone replacement for men with confirmed deficiency."], ["First step", "A consultation, then pathology to confirm. Symptoms alone are not enough."], ["Time", "Ongoing, with repeat pathology and regular review."], ["Where", "Prescribed and monitored by the clinic's doctors."]],
          "For men with symptoms whose low testosterone is confirmed by pathology.")}
        ${plate(P.weight, "plate-ledger.svg",
          "A chart of a thousand years of ring widths set out a century to a row, fine bars for single years under a smooth gold trend line.",
          "PEB07A from 1003 to 2012, a century to a row. Bars are single years; the gold line is a 30-year running mean.",
          [["What it is", "Medical weight management: an assessment, a plan, and prescription medicines only where appropriate."], ["First step", "A consultation and pathology."], ["Time", "Months, read as a trend rather than a weigh-in."], ["Where", "Prescribed and monitored by the clinic's doctors."]],
          "For adults for whom weight has become a medical question.")}
        <footer class="rail__end">
          <p class="d-sm">Not sure which?</p>
          <p>Choose &ldquo;Not sure yet&rdquo; in the assessment. The doctor will tell you what, if anything, makes sense.</p>
          <a class="btn" href="#assessment" data-program="unsure">Begin your assessment</a>
        </footer>
      </div>
    </div>
  </section>

  <section class="protocol-act g-dark" id="protocol" data-ground="dark" data-sc-act="flow" aria-labelledby="protocol-h">
    <div class="wrap protocol-act__grid">
      <div class="protocol-act__side" data-sc-in>
        <h2 id="protocol-h" class="d-lg">How a program begins, and when it doesn't.</h2>
        <p class="lede">Five steps, in the same order for everyone. Nothing is prescribed from a questionnaire alone.</p>
        <div class="creds">
          <p class="fig">The doctors</p>
          <p>Registered medical practitioners with MBBS and FRACGP qualifications, experienced across general practice, men's and women's health and preventive care. Every consultation is one to one with a doctor.</p>
          <p><a class="textlink" href="${CLINIC.ahpra}" rel="noopener" target="_blank">Check any Australian doctor on the AHPRA register<span class="visually-hidden"> (opens in a new tab)</span></a></p>
        </div>
      </div>
      <div class="protocol-act__table" data-sc-in>
        <table class="protocol">
          <caption class="visually-hidden">The five steps of every program</caption>
          <thead><tr><th scope="col">Step</th><th scope="col">What happens</th><th scope="col">Who</th><th scope="col">When</th></tr></thead>
          <tbody>
            <tr><th scope="row">Questionnaire</th><td class="desc">Your history, medicines, allergies and goals, in your own words. The ${CLINIC.fee} fee is paid at the end.</td><td class="who">You</td><td class="when">Today</td></tr>
            <tr><th scope="row">Doctor's review</th><td class="desc">A doctor reads everything before calling you, and notes what needs pathology.</td><td class="who">A registered doctor</td><td class="when">Within 1 to 2 business days</td></tr>
            <tr><th scope="row">Consultation</th><td class="desc">By phone. Your symptoms, goals and questions. If a program isn't suitable, the doctor says so.</td><td class="who">Doctor and you</td><td class="when">15 to 25 minutes</td></tr>
            <tr><th scope="row">Pathology</th><td class="desc">Ordered wherever a decision depends on it: iron studies before an iron infusion, confirmed low testosterone before testosterone therapy.</td><td class="who">Your doctor, a collection centre</td><td class="when">Before treatment</td></tr>
            <tr><th scope="row">Program and review</th><td class="desc">Prescription medicines only on prescription, through proper channels. Follow-up and repeat pathology are part of the program, not extras.</td><td class="who">Your doctor</td><td class="when">Ongoing</td></tr>
          </tbody>
        </table>
        <div class="wont">
          <p class="fig">What the clinic won't do</p>
          <ul>
            <li>Prescribe from a questionnaire alone.</li>
            <li>Publish testimonials. Australian health advertising law doesn't allow them.</li>
            <li>Promise outcomes. Responses vary, and the doctor will tell you what the evidence does and doesn't show.</li>
          </ul>
        </div>
      </div>
      <figure class="plate visit" data-sc-in>
        <img src="assets/img/map-annerley-dark.svg" alt="A street map of Annerley with the clinic marked at 628 Ipswich Road, between Venner Road and School Road." width="1200" height="900" loading="lazy" decoding="async">
        <figcaption><span class="fig"><b>Fig. 6</b></span>${CLINIC.street}, ${CLINIC.suburb}, on the main road south from the city. Map data &copy; OpenStreetMap contributors.</figcaption>
      </figure>
      <div class="visit__text" data-sc-in>
        <h3 class="d-sm">The clinic</h3>
        <address>${CLINIC.street}<br>${CLINIC.suburb} ${CLINIC.state} ${CLINIC.postcode}<br><a href="mailto:${CLINIC.email}">${CLINIC.email}</a></address>
        <dl class="facts">${CLINIC.hours.slice(0, 3).map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join("")}</dl>
        <p><a class="textlink" href="${L_("contact")}">Visit and contact</a></p>
      </div>
    </div>
  </section>

  ${assessment(depth, { act: true })}
</main>`;

  return head({
    title: "Australian Longevity Clinic · Doctor-led longevity medicine in Annerley, Brisbane",
    description: "A doctor-led longevity clinic at 628 Ipswich Road, Annerley. IV therapy, peptide programs, testosterone therapy and medical weight management, each prescribed only after a doctor has read your history and pathology.",
    depth, canonical: "",
    extraHead: `<link rel="stylesheet" href="assets/css/home.css">
<link rel="preload" as="image" type="image/avif" imagesrcset="assets/img/round-1000.avif 1000w, assets/img/round-1400.avif 1400w" imagesizes="(max-width: 860px) 100vw, 56vw">
<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "MedicalClinic", name: CLINIC.name, url: "https://australianlongevityclinic.com.au/",
      email: CLINIC.email, image: "https://australianlongevityclinic.com.au/assets/img/og.jpg",
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
    ["What happens during the consultation?", "It's a phone call with one of the clinic's doctors, usually 15 to 25 minutes. The doctor has already read your questionnaire, and talks through your symptoms, goals and questions before recommending anything. You can ask questions before deciding on next steps."],
    ["Why is there a $75 fee?", "It covers the doctor's time to read your questionnaire before calling, the medical assessment on the call, and ongoing support from your treating doctor."],
    ["When will the doctor call?", `Within 1 to 2 business days of your form and payment arriving, ${CLINIC.callWindow}, on the number you give.`],
    ["Do I need to prepare anything?", "No. If you have recent blood test results or medical reports, it helps to have them handy for the call, but it isn't essential."],
    ["Is the consultation bulk billed?", "No. The $75 fee is a private consultation fee, paid when you send the questionnaire. Some consultations may attract a Medicare rebate depending on their clinical nature."],
    ["What can happen after the consultation?", "Depending on your assessment, the doctor may recommend IV therapy, a peptide program, testosterone therapy, medical weight management, a combination, pathology first, or nothing at all. Every recommendation is individual."],
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
        <figcaption><span class="fig"><b>Fig. 6</b></span>${CLINIC.street}, ${CLINIC.suburb}, on the main road south from the city. Map data &copy; OpenStreetMap contributors.</figcaption>
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

const ctx = { CLINIC, PROGRAMS, head, strip, footer, scripts, assessment, link, rel, esc, markSvg, SITE };
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
