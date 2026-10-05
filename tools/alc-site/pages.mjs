// The four program pages, the doctors page, the privacy policy and the 404.
//
// Copy is drawn from the clinic's live pages (read 2026-10-05). Two kinds of
// change were made on purpose and are listed in README.md: no prescription
// medicine is named (Australian law does not allow them to be advertised to
// the public), and therapeutic claims were cut back to what the clinic's own
// FAQs state.

const faq = (items) => `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><div class="faq__a">${a.split("\n\n").map((p) => `<p>${p}</p>`).join("")}</div></details>`).join("")}</div>`;
const facts = (rows) => `<dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;
const ticks = (items) => `<ul class="ticks">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map(([t, d]) => `<li><div><b>${t}</b><p>${d}</p></div></li>`).join("")}</ol>`;

function servicePage(ctx, o) {
  const { head, strip, footer, scripts, link, rel, CLINIC } = ctx;
  const depth = 1, r = rel(depth);
  const start = link(depth, "contact") + `?program=${o.key}#assessment`;
  return head({ title: `${o.title} · Australian Longevity Clinic`, description: o.description, depth, canonical: o.slug }) + `
<body class="inner">
${strip(depth, o.slug, "light")}
<main id="main" class="page">
  <header class="page-head g-light" data-ground="light">
    <div class="wrap page-head__grid">
      <div>
        <p class="fig"><b>Fig. ${o.fig}</b> ${o.figLabel}</p>
        <h1 class="d-xl" style="margin-top:1rem">${o.h1}</h1>
        <p class="lede">${o.lede}</p>
        <div class="page-head__actions"><a class="btn" href="${start}" data-program="${o.key}">Begin your assessment</a><a class="textlink" href="#how">How it works</a></div>
      </div>
      ${facts(o.facts)}
    </div>
  </header>
  <section class="spec g-light" data-ground="light">
    <div class="wrap spec__grid">
      <figure class="plate spec__fig">
        <img src="${r}assets/img/${o.plate}" alt="${o.plateAlt}" width="800" height="1000" decoding="async">
        <figcaption><span class="fig"><b>Fig. ${o.fig}</b></span>${o.caption}</figcaption>
      </figure>
      <div class="spec__text">
        ${o.sections.map((s) => `<section${s.id ? ` id="${s.id}"` : ""}><h2 class="d-md">${s.h}</h2><div class="body">${s.html}</div></section>`).join("\n        ")}
      </div>
    </div>
  </section>
  <section class="band g-dark" data-ground="dark" aria-labelledby="faq-h">
    <div class="wrap band__grid">
      <div><h2 id="faq-h" class="d-md">Questions people ask first</h2><p class="soft" style="margin-top:1rem;max-width:30ch">General information only. Your doctor will answer for your situation.</p></div>
      ${faq(o.faq)}
    </div>
  </section>
  <section class="next g-light" data-ground="light">
    <div class="wrap next__in">
      <p class="d-sm">${o.close}</p>
      <a class="btn" href="${start}" data-program="${o.key}">Begin your assessment</a>
    </div>
  </section>
</main>
${footer(depth)}
${scripts(depth, ["assets/js/site.js"])}
</body>
</html>
`;
}

export function servicePages(ctx) {
  const { CLINIC } = ctx;
  const pages = [];

  pages.push(["iv-drips/index.html", servicePage(ctx, {
    key: "iv", slug: "iv-drips", fig: "2", figLabel: "IV therapy",
    title: "IV therapy in Annerley, Brisbane",
    description: "Doctor-supervised IV infusions at 628 Ipswich Road, Annerley: hydration, vitamin C, Myers cocktail, iron, vitamin D and NAD+. Every infusion starts with a consultation and an individual assessment.",
    h1: "IV therapy, given in the clinic.",
    lede: "Infusions of fluids, vitamins, iron or NAD+, delivered as a health service under the direct supervision of the clinic's doctors. Every infusion starts with a consultation and an individual assessment.",
    facts: [["In the chair", "15 minutes to 4 hours, by infusion"], ["Iron", "Pathology from the last 3 months and a GP referral"], ["Vitamin D", "Pathology from the last 3 months"], ["Where", `${CLINIC.street}, ${CLINIC.suburb}`], ["Medicare", "Most infusions are not covered"]],
    plate: "plate-tracheids.svg",
    plateAlt: "A drawing of wood cells in cross-section: rows of rounded cells, large in each year's early growth and small and thick-walled at the end of it, across three yearly rings.",
    caption: "Tracheids, the cells that carry water up the stem, across three measured rings of Huon pine, 1664 to 1666. Ring widths from core PEB07A; cells drawn for illustration.",
    sections: [
      { h: "The infusions", html: `<p>The doctor recommends an infusion, and its dose, after your assessment. Not sure which applies to you? That is what the consultation is for.</p>
        <ul class="menu-list">
          <li><b>Hydration</b><span class="mono">30 to 45 min</span><p>Saline with electrolytes and magnesium, to support fluid and electrolyte balance where a doctor finds it suitable.</p></li>
          <li><b>Vitamin C</b><span class="mono">45 to 60 min</span><p>Considered only after an individual medical assessment, with the dose set by the doctor. Not suitable in all circumstances.</p></li>
          <li><b>Myers cocktail</b><span class="mono">45 to 60 min</span><p>Vitamin C, B-complex vitamins, magnesium and zinc, with doses tailored to your assessment.</p></li>
          <li><b>Iron infusion</b><span class="mono">1 to 4 hours</span><p>For confirmed iron deficiency or iron deficiency anaemia. Vital signs are monitored throughout, and a small test dose may be given first.</p></li>
          <li><b>Vitamin D injection</b><span class="mono">15 to 20 min</span><p>An intramuscular injection for confirmed vitamin D deficiency, dosed from your blood test results.</p></li>
          <li><b>NAD+ infusion</b><span class="mono">2 to 4 hours</span><p>Given slowly, with the rate adjusted by the medical team throughout the session.</p></li>
          <li><b>Antioxidant</b><span class="mono">45 to 60 min</span><p>A formulation of alpha-lipoic acid, vitamin C, glutathione and selenium, given under medical supervision.</p></li>
        </ul>
        <p class="notice">IV infusions are health services delivered under the supervision of registered medical practitioners. They are not intended to diagnose, treat, cure or prevent any disease, and results vary between individuals.</p>` },
      { h: "Before an iron infusion", html: `<p>Iron is given only when pathology confirms a deficiency. You will need results from the last 3 months that include:</p>
        ${ticks(["Serum ferritin", "Transferrin saturation", "Full blood count", "C-reactive protein (CRP)"])}
        <p>A GP referral is also required. If you don't have recent results, the clinic can provide a pathology referral before your consultation. People with iron overload, haemochromatosis or a known sensitivity to iron preparations are not suitable. A follow-up blood test 6 to 8 weeks after the infusion confirms the response.</p>` },
      { h: "How it works", id: "how", html: steps([
        ["Questionnaire", "Your history, medicines, allergies and goals, completed online. The $75 fee covers the doctor's review and your consultation."],
        ["Assessment", "A doctor reviews your answers and talks with you about whether an infusion is suitable, and which."],
        ["Pathology, where needed", "Iron and vitamin D need recent results. Others may, depending on your history."],
        ["The infusion", "In the clinic, seated, with a cannula in your arm. Trained clinical staff, under a doctor's supervision."],
        ["Review", "Follow-up and repeat pathology where the infusion calls for it."]]) },
      { h: "On the day", html: `${ticks(["Drink plenty of water in the hours before, and eat a light meal.", "Wear clothing that leaves your arm easy to reach.", "Bring a list of your medicines, supplements and allergies, and any recent blood results.", "Allow 10 to 15 minutes in the clinic afterwards before you drive."])}` },
      { h: "Safety and cost", html: `<p>Infusions given under medical supervision are generally well tolerated. As with any intravenous procedure, there can be bruising or discomfort where the cannula goes in, mild flushing or nausea, and rarely an allergic reaction. A full medical assessment comes first, and the clinical team is trained to manage reactions.</p>
        <p>Most IV infusions are not covered by Medicare. Some private health insurers offer partial rebates under extras cover, so check with yours. The clinic provides receipts.</p>` },
    ],
    faq: [
      ["Do I need a referral?", "Not for most infusions. All of them need a consultation with one of the clinic's doctors first. Iron infusions need a GP referral and recent pathology, and vitamin D injections need recent pathology."],
      ["How long does a session take?", "Hydration and vitamin infusions usually take 30 to 60 minutes. Iron infusions take 1 to 4 hours depending on the dose, and NAD+ infusions 2 to 4 hours."],
      ["How often can I have an infusion?", "It depends on the infusion and on your health. Some people have a single session; others follow a schedule. Your doctor recommends a frequency after your assessment."],
      ["I have a chronic condition. Can I still have IV therapy?", "You're welcome to ask. Your doctor assesses suitability individually, and some conditions need extra clearance or rule out certain infusions. Disclose your full history, medicines and allergies in the questionnaire."],
      ["What's the difference from oral supplements?", "Oral nutrients pass through the digestive system, where absorption varies. An infusion goes straight into the bloodstream. Whether that difference matters for you is a question for your doctor."],
    ],
    close: "Start with the questionnaire. The doctor will say which infusion, if any, suits you.",
  })]);

  pages.push(["peptide-therapy/index.html", servicePage(ctx, {
    key: "peptides", slug: "peptide-therapy", fig: "3", figLabel: "Peptide programs",
    title: "Peptide programs in Annerley, Brisbane",
    description: "Doctor-prescribed peptide programs at Australian Longevity Clinic, Annerley. Every program starts with a consultation, a review of your history and medicines, and a prescription only if suitable.",
    h1: "Peptide programs, prescribed around one goal.",
    lede: "Peptides are short chains of amino acids that act as signalling molecules in the body. The clinic's doctors design programs around a single goal, after a consultation and a review of your history and medicines.",
    facts: [["Prescription", "Most therapeutic peptides are Schedule 4 medicines"], ["Program", "Weeks to months, reviewed as you go"], ["Given as", "Usually a small injection under the skin, taught by the clinic"], ["Not for", "Pregnancy or breastfeeding"], ["Medicare", "Not covered"]],
    plate: "plate-branchlet.svg",
    plateAlt: "A pen drawing of a weeping Huon pine branchlet: slender hanging shoots covered in small overlapping scale leaves.",
    caption: "A branchlet of <i>Lagarostrobos franklinii</i>, Huon pine: small scale leaves pressed close along each hanging shoot. Drawn for illustration.",
    sections: [
      { h: "Goals programs are built around", html: `${ticks(["Repair and recovery", "Sleep", "Weight and metabolic health", "Skin and hair", "Support through menopause", "Gut health", "Focus and cognitive vitality", "Athletic performance and recovery"])}
        <p>Whether a peptide is appropriate for your goal, and which one, is a decision your doctor makes with you after an assessment. This site doesn't name peptides: Australian law doesn't allow prescription medicines to be advertised to the public, and the right choice depends on you.</p>` },
      { h: "How a program runs", id: "how", html: steps([
        ["Consultation", "Your goals, history, current medicines and any contraindications, with one of the clinic's doctors."],
        ["Prescription and program design", "If a peptide is suitable, the doctor prescribes it and sets the program: dose, schedule and length."],
        ["Administration", "Most programs use a small injection under the skin. The clinic shows you how, and gives full written instructions."],
        ["Monitoring and review", "Regular reviews to check your response and adjust the program, or stop it."]]) },
      { h: "Suitability and safety", html: `<p>Peptide programs are not suitable for everyone. They are not recommended during pregnancy or breastfeeding, and active cancer, autoimmune disorders or significant organ impairment need careful individual assessment.</p>
        <p>Side effects depend on the peptide. Common mild ones include redness or discomfort where the injection goes in, mild fatigue, or water retention. Combinations with other treatments are assessed individually, so disclose every medicine and supplement you take.</p>
        <p>Responses vary widely. Some people notice changes within weeks; others need months. Programs work best alongside sleep, nutrition and exercise.</p>` },
    ],
    faq: [
      ["Do I need a prescription?", "Yes. Most therapeutic peptides are Schedule 4 prescription medicines in Australia. A consultation is required before anything is prescribed."],
      ["How are peptides given?", "Depending on the peptide and the program: an injection under the skin, an injection into muscle, or in some cases a nasal spray or oral preparation. Your doctor advises the route and teaches you how."],
      ["Can a peptide program be combined with other treatments?", "Often, with IV therapy or hormone treatment for example, but combinations are assessed individually to avoid interactions."],
      ["Is it covered by Medicare or private health insurance?", "Peptide programs are generally not covered by Medicare. Check with your insurer about extras cover; the clinic provides itemised receipts."],
    ],
    close: "Start with the questionnaire. Tell the doctor your goal; they'll tell you whether a program fits it.",
  })]);

  pages.push(["testosterone-therapy/index.html", servicePage(ctx, {
    key: "testosterone", slug: "testosterone-therapy", fig: "4", figLabel: "Testosterone therapy",
    title: "Testosterone therapy in Annerley, Brisbane",
    description: "Doctor-led testosterone replacement therapy for men with pathology-confirmed testosterone deficiency, at Australian Longevity Clinic, Annerley. Consultation, pathology, prescription and ongoing monitoring.",
    h1: "Testosterone therapy, on confirmed pathology.",
    lede: "For men whose testosterone deficiency is confirmed by blood tests and whose symptoms affect their quality of life. Testosterone is a Schedule 4 prescription medicine, and nothing is prescribed on symptoms alone.",
    facts: [["Requires", "A confirmed diagnosis on pathology"], ["Program", "Ongoing, with repeat pathology and review"], ["Referral", "Not needed to book"], ["Form", "Injection, gel or other, as prescribed"], ["First step", "A consultation, then blood tests"]],
    plate: "plate-crossdate.svg",
    plateAlt: "A cross-dating chart: two tree cores at top and bottom, with vertical bars marking narrow rings in each, and five years where both cores agree highlighted in gold.",
    caption: "Two cores from one Huon pine, PEB07A and PEB07B, cross-dated 1446 to 1505. A year is trusted only when both agree; five narrow rings in both are marked in gold.",
    sections: [
      { h: "What it is", html: `<p>Testosterone plays a part in muscle mass, bone density, energy, mood and libido. Levels decline with age, and when they fall below the clinically normal range and cause significant symptoms, testosterone replacement therapy may be considered.</p>
        <p>At the clinic it is provided only as a prescription medical service: after a thorough assessment, confirmed pathology, and an individual treatment plan.</p>` },
      { h: "Symptoms that can be associated with low testosterone", html: `${ticks(["Persistent fatigue and low energy", "Reduced muscle mass and increased body fat", "Lower libido and sexual function", "Low mood, irritability or poor concentration", "Reduced bone density", "Disturbed sleep", "Reduced motivation and drive"])}
        <p class="notice"><b>These symptoms have many possible causes.</b> They can't diagnose low testosterone on their own. A blood test and a medical assessment can.</p>` },
      { h: "How it works", id: "how", html: steps([
        ["Consultation", "Your symptoms, history, medicines and overall health, with one of the clinic's doctors. A mandatory first step."],
        ["Pathology and diagnosis", "The doctor arranges blood tests and reads them against your symptoms. Treatment needs a confirmed diagnosis."],
        ["Prescription", "If it's clinically appropriate, an individual program. The form, such as injection or gel, depends on your needs and preferences."],
        ["Monitoring and review", "Follow-up consultations and repeat pathology are part of safe treatment, not optional extras."]]) },
      { h: "Who it isn't for", html: `<p>Testosterone therapy isn't appropriate for men with normal testosterone levels, for performance enhancement, or with certain medical conditions. The doctor will discuss the options, risks and benefits before anything is prescribed.</p>` },
    ],
    faq: [
      ["Is it suitable for everyone?", "No. It is only appropriate for men with a clinically confirmed diagnosis of testosterone deficiency, established through pathology and medical assessment."],
      ["How long does treatment last?", "It is usually an ongoing program rather than a short course. Duration and frequency depend on your response, your pathology results and your goals."],
      ["Are there risks or side effects?", "Like all prescription medicines, yes, and they vary between individuals. They're discussed in detail at your consultation, and regular monitoring is part of managing them."],
      ["Do I need a referral?", "No referral is needed to book an initial consultation. Treatment needs a medical assessment and confirmed pathology."],
    ],
    close: "Start with the questionnaire. The first step is finding out whether there is a deficiency at all.",
  })]);

  pages.push(["weight-management/index.html", servicePage(ctx, {
    key: "weight", slug: "weight-management", fig: "5", figLabel: "Medical weight management",
    title: "Medical weight management in Annerley, Brisbane",
    description: "Doctor-led medical weight management at Australian Longevity Clinic, Annerley: an assessment, a plan, prescription treatment only where clinically appropriate, and regular monitoring.",
    h1: "Medical weight management, read as a trend.",
    lede: "For adults for whom weight has become a medical question. The clinic's doctors assess your history, metabolic health and medicines first, and prescribe only where it is clinically appropriate.",
    facts: [["First step", "A consultation, with pathology where needed"], ["Treatment", "Prescription only where appropriate"], ["Program", "Months, with regular monitoring"], ["Alongside", "Nutrition and lifestyle guidance"], ["Medicare", "Not bulk billed"]],
    plate: "plate-ledger.svg",
    plateAlt: "A chart of a thousand years of ring widths set out a century to a row, fine bars for single years under a smooth gold trend line.",
    caption: "Core PEB07A from 1003 to 2012, a century to a row. Bars are single years; the gold line is a 30-year running mean. A single year says little; the trend says a lot.",
    sections: [
      { h: "What the assessment covers", html: `${ticks(["Your weight history and what has and hasn't worked", "Current medicines and medical conditions", "A metabolic health review, with pathology where it would change the decision", "Your goals, and what a realistic program looks like"])}` },
      { h: "Treatment", html: `<p>Where it's clinically appropriate, a prescription medicine may be part of your plan, prescribed and monitored by the clinic's doctors for eligible patients. Your doctor will explain the options, the evidence, the risks and the costs at your consultation.</p>
        <p class="notice">This site doesn't name prescription medicines. Australian law doesn't allow them to be advertised to the public, and whether one suits you depends on your assessment.</p>` },
      { h: "How it works", id: "how", html: steps([
        ["Questionnaire", "Your history, medicines, height and weight, and goals."],
        ["Assessment", "A doctor reviews your answers, talks through your history, and orders pathology where it's needed."],
        ["A plan", "Prescription treatment only where appropriate, alongside nutrition and activity guidance."],
        ["Monitoring", "Regular reviews to track progress, manage side effects and adjust the plan. Progress is read over months, not week to week."]]) },
    ],
    faq: [
      ["Do I need a referral?", "No referral is needed to start with the questionnaire and a consultation."],
      ["Is it covered by Medicare?", "Consultations are not bulk billed. Some consultations may attract a Medicare rebate depending on their clinical nature, and the cost of any medicine depends on what is prescribed."],
      ["How long does a program last?", "Months rather than weeks, with regular reviews. Your doctor will set expectations at the first consultation."],
    ],
    close: "Start with the questionnaire. Include your height and weight; the doctor will take it from there.",
  })]);

  return pages;
}

export function teamPage(ctx) {
  const { head, strip, footer, scripts, link, rel, CLINIC } = ctx;
  const depth = 1, r = rel(depth);
  const expertise = ["IV infusion therapy", "Peptide therapy", "Testosterone replacement therapy", "Women's health", "Men's health", "Menopausal medicine", "Integrative wellness", "Preventive medicine", "Hormonal health", "Metabolic health", "Healthy ageing", "Sports and athletic performance", "Gut health", "Sleep medicine"];
  return head({ title: "The doctors · Australian Longevity Clinic", description: "Australian Longevity Clinic is led by registered medical practitioners with MBBS and FRACGP qualifications. Every consultation is one to one with a doctor.", depth, canonical: "our-team" }) + `
<body class="inner">
${strip(depth, "our-team", "light")}
<main id="main" class="page">
  <header class="page-head g-light" data-ground="light">
    <div class="wrap page-head__grid">
      <div>
        <h1 class="d-xl">Doctors who read first.</h1>
        <p class="lede">The clinic is led by registered medical practitioners committed to personalised, evidence-informed care. Every consultation is one to one with a doctor, and nothing is prescribed without an individual assessment.</p>
        <div class="page-head__actions"><a class="btn" href="${link(depth, "contact")}#assessment">Begin your assessment</a></div>
      </div>
      ${facts([["Qualifications", "MBBS, FRACGP"], ["Registration", "Current medical registration with AHPRA"], ["Consultations", "One to one with a doctor"], ["Prescribing", "Through appropriate prescription channels"]])}
    </div>
  </header>
  <section class="spec g-light" data-ground="light">
    <div class="wrap spec__grid">
      <figure class="plate spec__fig">
        <picture><source type="image/avif" srcset="${r}assets/img/round-light-900.avif"><img src="${r}assets/img/round-light-900.webp" alt="The Huon pine cross-section from the home page, drawn in dark ink on pale stone: about a thousand rings." width="900" height="900" decoding="async"></picture>
        <figcaption><span class="fig"><b>Fig. 1</b></span>The same round as the home page. Every ring is drawn from the measured widths of core PEB07A, AD 1003 to 2012. The outline is modelled.</figcaption>
      </figure>
      <div class="spec__text">
        <section><h2 class="d-md">How they practise</h2><div class="body">
          <p>The clinic's doctors bring experience across general medicine, integrative wellness, women's health, men's health and preventive care. They take the time to understand your history, goals and any contraindications before recommending anything.</p>
          <p>Wellness and medicine are not separate disciplines here. Every recommendation is grounded in a clinical assessment and individual need, and the doctors say clearly what a service can and can't do.</p>
          <p>The team keeps up with the evidence in integrative medicine, IV therapy and peptide science through ongoing professional development.</p>
        </div></section>
        <section><h2 class="d-md">Areas of clinical experience</h2><div class="body">${ticks(expertise)}</div></section>
        <section><h2 class="d-md">Check a registration yourself</h2><div class="body">
          <p>Every doctor practising in Australia is listed on the public register kept by the Australian Health Practitioner Regulation Agency. You can search it by name to see a practitioner's registration, qualifications and any conditions.</p>
          <p><a class="textlink" href="${CLINIC.ahpra}" rel="noopener" target="_blank">Search the AHPRA register<span class="visually-hidden"> (opens in a new tab)</span></a></p>
        </div></section>
      </div>
    </div>
  </section>
  <section class="next g-light" data-ground="light">
    <div class="wrap next__in">
      <p class="d-sm">The first conversation is with a doctor, by phone, within 1 to 2 business days.</p>
      <a class="btn" href="${link(depth, "contact")}#assessment">Begin your assessment</a>
    </div>
  </section>
</main>
${footer(depth)}
${scripts(depth, ["assets/js/site.js"])}
</body>
</html>
`;
}

export function privacyPage(ctx) {
  const { head, strip, footer, scripts, CLINIC } = ctx;
  const depth = 1;
  const rows = [["Identity information", "Full name, date of birth, gender"], ["Contact information", "Email address, phone number, residential address"],
    ["Health information", "Medical history, current medications, allergies, adverse reactions, family medical history, surgical history, pregnancy or breastfeeding status"],
    ["Lifestyle information", "Exercise habits, dietary preferences, sleep patterns, stress levels, alcohol and tobacco use"],
    ["Treatment information", "Records of consultations, treatments received, clinical notes, and outcomes"],
    ["Payment information", "Billing details processed securely through Stripe (we do not store card numbers)"],
    ["Technical information", "IP address, browser type, pages visited, and other website usage data collected via cookies"],
    ["Uploaded documents", "Blood test results or other medical documents you choose to upload"]];
  return head({ title: "Privacy policy · Australian Longevity Clinic", description: "How Australian Longevity Clinic collects, uses, discloses, stores and protects your personal and health information under the Privacy Act 1988 and the Australian Privacy Principles.", depth, canonical: "privacy-policy" }) + `
<body class="inner">
${strip(depth, "privacy-policy", "light")}
<main id="main" class="page g-light" data-ground="light">
  <header class="article-head">
    <div class="wrap">
      <p class="meta"><span>Legal</span><span>Last updated: April 2025</span></p>
      <h1 class="d-lg">Privacy policy</h1>
    </div>
  </header>
  <div class="wrap" style="padding-bottom:clamp(4rem,8vw,7rem)">
    <div class="prose">
      <h2>1. Introduction</h2>
      <p>Australian Longevity Clinic Brisbane (trading as Australian Longevity Clinic) is a registered business name of Horizon Medical Pty Ltd (ABN ${CLINIC.abn}) ("we", "us", "our"). We are committed to protecting the privacy and confidentiality of your personal information. This Privacy Policy explains how we collect, use, disclose, store, and protect your personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</p>
      <p>This policy applies to all personal information we collect through our website at www.australianlongevityclinic.com.au, through our consultation booking forms, and through the provision of our medical and wellness services.</p>
      <p>By using our website or engaging our services, you consent to the collection, use, and disclosure of your personal information as described in this policy. If you do not agree with this policy, please do not use our website or services.</p>
      <h2>2. What personal information we collect</h2>
      <p>We collect personal information that is reasonably necessary for us to provide our medical and wellness services. The types of information we may collect include:</p>
      <table><thead><tr><th scope="col">Category</th><th scope="col">Examples</th></tr></thead><tbody>${rows.map(([a, b]) => `<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join("")}</tbody></table>
      <p>Health information is classified as sensitive information under the Privacy Act and is afforded a higher level of protection. We will only collect sensitive information with your explicit consent or where otherwise permitted by law.</p>
      <h2>3. How we collect your information</h2>
      <p>We collect personal information directly from you in the following ways: When you complete our online consultation booking form, you voluntarily provide personal and health information. When you attend our clinic, our medical staff may collect additional clinical information during your consultation. When you make a payment, your billing details are processed by our secure payment provider, Stripe. When you browse our website, certain technical information is collected automatically through cookies and analytics tools.</p>
      <p>We collect information only by lawful and fair means and not in an unreasonably intrusive way. Where it is reasonable and practicable to do so, we collect personal information directly from you rather than from third parties.</p>
      <h2>4. Why we collect and use your information</h2>
      <p>We collect and use your personal information for the following primary purposes:</p>
      <ul><li>To provide you with medical consultations, IV infusion therapy, peptide wellness programs, and related health services.</li><li>To assess your suitability for specific treatments and to develop a personalised treatment plan.</li><li>To process your consultation fee payment and maintain billing records.</li><li>To communicate with you regarding your appointments, treatment plans, and follow-up care.</li><li>To comply with our legal and regulatory obligations as a registered medical practice, including obligations under the Health Records Act and applicable professional requirements.</li><li>To improve our services and website based on aggregated, de-identified usage data.</li></ul>
      <p>We will not use your personal information for any purpose other than those described above without your consent, unless required or permitted by law.</p>
      <h2>5. Disclosure of your information</h2>
      <p>We do not sell, rent, or trade your personal information to third parties. We may disclose your personal information in the following limited circumstances:</p>
      <p><strong>Service providers:</strong> We engage trusted third-party service providers to assist us in operating our business, including Stripe for payment processing and cloud infrastructure providers for secure data storage. These providers are contractually bound to protect your information and may only use it for the purposes we specify.</p>
      <p><strong>Medical referrals:</strong> With your consent, we may share relevant health information with other healthcare providers involved in your care, such as your general practitioner or specialist.</p>
      <p><strong>Legal obligations:</strong> We may disclose your information where required by law, court order, or government authority, or where we reasonably believe disclosure is necessary to prevent a serious threat to health or safety.</p>
      <p>We will not disclose your health information to your family members, employer, or other third parties without your explicit consent, except as required by law.</p>
      <h2>6. Storage and security of your information</h2>
      <p>We take the security of your personal information seriously. Your information is stored on secure, encrypted servers hosted in Australia or in jurisdictions with equivalent privacy protections. Access to personal information is restricted to authorised clinic staff and medical practitioners who require it to perform their duties.</p>
      <p>We implement a range of technical and organisational security measures including encrypted data transmission (SSL/TLS), access controls and authentication, regular security reviews, and staff training on privacy obligations.</p>
      <p>While we take all reasonable steps to protect your information, no method of electronic transmission or storage is completely secure. In the event of a data breach that is likely to result in serious harm, we will notify affected individuals and the Office of the Australian Information Commissioner (OAIC) in accordance with the Notifiable Data Breaches (NDB) scheme.</p>
      <h2>7. Retention of your information</h2>
      <p>We retain personal information for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Medical records are retained in accordance with applicable state and territory health records legislation, which generally requires retention for a minimum of seven years from the date of the last service (or until the patient turns 25 years of age if they were a minor at the time of treatment).</p>
      <p>When your information is no longer required, we will take reasonable steps to destroy or de-identify it securely.</p>
      <h2>8. Access to and correction of your information</h2>
      <p>You have the right to request access to the personal information we hold about you and to request corrections if you believe any information is inaccurate, incomplete, or out of date. To make an access or correction request, please contact us using the details in Section 11 below.</p>
      <p>We will respond to access requests within 30 days. In some circumstances, we may be unable to provide access to certain information, for example where providing access would pose a serious threat to health or safety, or where the information relates to existing or anticipated legal proceedings. If we decline your request, we will provide written reasons.</p>
      <p>There is no charge for making an access request, though we may charge a reasonable fee to cover the cost of providing access (for example, photocopying costs for printed records).</p>
      <h2>9. Cookies and website analytics</h2>
      <p>Our website uses cookies (small text files stored on your device) to improve your browsing experience and to collect anonymous usage statistics. We use analytics tools to understand how visitors use our website so that we can improve its content and functionality.</p>
      <p>You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain parts of our website. We do not use cookies to collect personally identifiable information without your consent.</p>
      <h2>10. Third-party links</h2>
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies before providing any personal information. This Privacy Policy applies only to information collected by Australian Longevity Clinic.</p>
      <h2>11. Contact us and complaints</h2>
      <p>If you have any questions about this Privacy Policy, wish to make an access or correction request, or wish to make a complaint about how we have handled your personal information, please contact us at:</p>
      <p>Australian Longevity Clinic Brisbane<br>(trading as Australian Longevity Clinic)<br>Horizon Medical Pty Ltd, ABN ${CLINIC.abn}<br>${CLINIC.street}, ${CLINIC.suburb} ${CLINIC.state} ${CLINIC.postcode}<br>Email: <a href="mailto:${CLINIC.email}">${CLINIC.email}</a></p>
      <p>We will acknowledge your complaint within five business days and aim to resolve it within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" rel="noopener">www.oaic.gov.au</a> or by calling 1300 363 992.</p>
      <h2>12. Updates to this policy</h2>
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. The updated policy will be posted on this page with a revised "Last updated" date. We encourage you to review this policy periodically. Continued use of our website or services after any changes constitutes your acceptance of the updated policy.</p>
    </div>
  </div>
</main>
${footer(depth)}
${scripts(depth, ["assets/js/site.js"])}
</body>
</html>
`;
}

export function notFoundPage(ctx) {
  const { head, strip, footer, scripts, link } = ctx;
  // Hosts serve this page at whatever URL was missed, so every link and asset
  // is made root-relative after it is built.
  const depth = 0;
  return rootRelative(head({ title: "Page not found · Australian Longevity Clinic", description: "This page isn't here. It may have moved when the site was rebuilt.", depth, canonical: "404" }).replace("<meta name=\"description\"", "<meta name=\"robots\" content=\"noindex\">\n<meta name=\"description\"") + `
<body class="inner">
${strip(depth, "404", "light")}
<main id="main" class="page g-light" data-ground="light">
  <header class="page-head">
    <div class="wrap">
      <p class="fig"><b>404</b> Not found</p>
      <h1 class="d-xl" style="margin-top:1rem;max-width:14ch">This ring isn't in the record.</h1>
      <p class="lede">The page may have moved when the site was rebuilt. These are the places most people are looking for.</p>
      <ul class="menu-list" style="margin-top:2.5rem">
        <li><a href="${link(depth, "")}"><b>Home</b></a><span class="mono"></span></li>
        <li><a href="${link(depth, "iv-drips")}"><b>IV therapy</b></a><span class="mono">Fig. 2</span></li>
        <li><a href="${link(depth, "peptide-therapy")}"><b>Peptide programs</b></a><span class="mono">Fig. 3</span></li>
        <li><a href="${link(depth, "testosterone-therapy")}"><b>Testosterone therapy</b></a><span class="mono">Fig. 4</span></li>
        <li><a href="${link(depth, "weight-management")}"><b>Medical weight management</b></a><span class="mono">Fig. 5</span></li>
        <li><a href="${link(depth, "contact")}#assessment"><b>Begin your assessment</b></a><span class="mono"></span></li>
      </ul>
    </div>
  </header>
</main>
${footer(depth, "404")}
${scripts(depth, ["assets/js/site.js"])}
</body>
</html>
`);
}
function rootRelative(html) {
  return html.replace(/\b(href|src)="(?!https?:|mailto:|#|\/|data:)([^"]*)"/g, (m, a, u) => `${a}="/${u.replace(/(^|\/)index\.html(?=$|#)/, "$1")}"`);
}
