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
  const { head, strip, footer, scripts, link, rel, CLINIC, ROUTES, routePanel } = ctx;
  const depth = 1;
  const start = link(depth, "contact") + `?program=${o.key}#assessment`;
  const route = ROUTES.find((x) => x.key === o.key);
  return head({ title: `${o.title} · Australian Longevity Clinic`, description: o.description, depth, canonical: o.slug }) + `
<body class="inner">
${strip(depth, o.slug, "light")}
<main id="main" class="page">
  <header class="page-head g-light" data-ground="light">
    <div class="wrap page-head__grid">
      <div>
        <h1 class="d-xl">${o.h1}</h1>
        <p class="lede">${o.lede}</p>
        <div class="page-head__actions"><a class="btn" href="${start}" data-program="${o.key}">Begin your assessment</a><a class="textlink" href="#how">How it works</a></div>
      </div>
      ${facts(o.facts)}
    </div>
  </header>
  <section class="spec g-light" data-ground="light">
    <div class="wrap spec__grid">
      <aside class="spec__fig route-aside" aria-label="What a doctor checks">
        ${routePanel(route, { depth, level: 2, cta: false, head: false })}
      </aside>
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
    key: "iv", slug: "iv-drips",
    title: "IV therapy in Annerley, Brisbane",
    description: "Doctor-supervised IV infusions at 628 Ipswich Road, Annerley: hydration, vitamin C, Myers cocktail, iron, vitamin D and NAD+. Every infusion starts with a consultation and an individual assessment.",
    h1: "IV therapy for energy, recovery and low iron.",
    lede: "Fluids, vitamins, iron or NAD+, given by drip in the clinic at Annerley. IV therapy here is a health service, run under the direct supervision of the clinic's doctors, and every infusion starts with a consultation and an individual assessment.",
    facts: [["In the chair", "15 minutes to 4 hours, by infusion"], ["Iron", "Pathology from the last 3 months and a GP referral"], ["Vitamin D", "Pathology from the last 3 months"], ["Where", `${CLINIC.street}, ${CLINIC.suburb}`], ["Medicare", "Most infusions are not covered"]],
    sections: [
      { h: "The infusions", html: `<p>Which infusion, and how much of it, is the doctor's call once you've been assessed. If you can't tell which of these applies to you, that's what the consultation is for.</p>
        <ul class="menu-list">
          <li><b>Hydration</b><span class="mono">30 to 45 min</span><p>Saline with electrolytes and magnesium, to support fluid and electrolyte balance if the doctor thinks it suits you.</p></li>
          <li><b>Vitamin C</b><span class="mono">45 to 60 min</span><p>Only after an individual medical assessment, at a dose the doctor sets. It isn't suitable for everyone.</p></li>
          <li><b>Myers cocktail</b><span class="mono">45 to 60 min</span><p>Vitamin C, B-complex vitamins, magnesium and zinc, with the doses set from your assessment.</p></li>
          <li><b>Iron infusion</b><span class="mono">1 to 4 hours</span><p>For iron deficiency or iron deficiency anaemia that pathology has confirmed. Your vital signs are watched throughout, and you may be given a small test dose first.</p></li>
          <li><b>Vitamin D injection</b><span class="mono">15 to 20 min</span><p>An injection into muscle for vitamin D deficiency that a blood test has confirmed, dosed from your results.</p></li>
          <li><b>NAD+ infusion</b><span class="mono">2 to 4 hours</span><p>Given slowly. The medical team adjusts the rate as the session goes.</p></li>
          <li><b>Antioxidant</b><span class="mono">45 to 60 min</span><p>Alpha-lipoic acid, vitamin C, glutathione and selenium together, given under medical supervision.</p></li>
        </ul>
        <p class="notice">IV infusions are health services delivered under the supervision of registered medical practitioners. They are not intended to diagnose, treat, cure or prevent any disease, and results vary between individuals.</p>` },
      { h: "Before an iron infusion", html: `<p>Iron is only given when pathology shows a deficiency, so you'll need results from the last 3 months that include:</p>
        ${ticks(["Serum ferritin", "Transferrin saturation", "Full blood count", "C-reactive protein (CRP)"])}
        <p>You'll also need a GP referral. No recent results? The clinic can give you a pathology referral before your consultation.</p>
        <p>An iron infusion isn't suitable if you have iron overload or haemochromatosis, or a known sensitivity to iron preparations. About 6 to 8 weeks afterwards, a follow-up blood test shows how you've responded.</p>` },
      { h: "How it works", id: "how", html: steps([
        ["Questionnaire", "Your history, medicines, allergies and goals, online. The $75 fee covers the doctor's review and your consultation."],
        ["Assessment", "A doctor reads your answers, then talks with you about whether an infusion makes sense, and which one."],
        ["Pathology, where needed", "Iron and vitamin D need recent results. Others may too, depending on your history."],
        ["The infusion", "In the clinic, seated, with a cannula in your arm. Trained clinical staff give it, under a doctor's supervision."],
        ["Review", "Follow-up and repeat pathology, where the infusion calls for them."]]) },
      { h: "On the day", html: `<p>Drink plenty of water in the hours before and eat something light. Wear sleeves that push up easily. Bring a list of your medicines, supplements and allergies, and any recent blood results.</p>
        <p>Plan to stay in the clinic for 10 to 15 minutes afterwards before you drive.</p>` },
      { h: "Safety and cost", html: `<p>Most people tolerate a supervised infusion well. Like any drip, it can leave a bruise or some soreness where the cannula went in, and some people feel flushed or slightly sick during it. Allergic reactions are rare. The full medical assessment comes first, and the clinical team is trained to manage a reaction if one happens.</p>
        <p>Medicare doesn't cover most IV infusions. Some private health funds pay a partial rebate under extras cover, so ask yours. The clinic gives you a receipt.</p>` },
    ],
    faq: [
      ["Do I need a referral?", "Not for most infusions, though every one needs a consultation with one of the clinic's doctors first. Iron needs a GP referral and recent pathology. A vitamin D injection needs recent pathology."],
      ["How long does a session take?", "Hydration and vitamin infusions usually take 30 to 60 minutes. Iron takes 1 to 4 hours, depending on the dose, and NAD+ 2 to 4 hours."],
      ["How often can I have an infusion?", "That depends on the infusion and on your health. Some people have one session; others follow a schedule. The doctor suggests how often after your assessment."],
      ["I have a chronic condition. Can I still have IV therapy?", "Ask. The doctor looks at it case by case: some conditions need extra clearance, and some rule out particular infusions. Put your full history, medicines and allergies in the questionnaire so nothing is missed."],
      ["What's the difference from oral supplements?", "Nutrients you swallow go through the gut, and how much gets absorbed varies. An infusion goes straight into the bloodstream. Whether that difference matters for you is a question for your doctor."],
    ],
    close: "Start with the questionnaire. The doctor will say which infusion, if any, suits you.",
  })]);

  pages.push(["peptide-therapy/index.html", servicePage(ctx, {
    key: "peptides", slug: "peptide-therapy",
    title: "Peptide programs in Annerley, Brisbane",
    description: "Doctor-prescribed peptide programs at Australian Longevity Clinic, Annerley. Every program starts with a consultation, a review of your history and medicines, and a prescription only if suitable.",
    h1: "Peptide therapy, prescribed by real doctors.",
    lede: "Peptides are short chains of amino acids that the body uses as signals. A program here is built around one goal of yours, and only after a doctor has been through your history and the medicines you take.",
    facts: [["Prescription", "Most therapeutic peptides are Schedule 4 medicines"], ["Program", "Weeks to months, reviewed as you go"], ["Given as", "Usually a small injection under the skin, taught by the clinic"], ["Not for", "Pregnancy or breastfeeding"], ["Medicare", "Not covered"]],
    sections: [
      { h: "Goals a program can be built around", html: `${ticks(["Repair and recovery", "Sleep", "Weight and metabolic health", "Skin and hair", "Support through menopause", "Gut health", "Focus and cognitive vitality", "Athletic performance and recovery"])}
        <p>Whether a peptide suits your goal, and which one, is something you and the doctor decide together after your assessment.</p>
        <p>You won't find peptides named on this site. Australian law doesn't allow prescription medicines to be advertised to the public, and the right one depends on you anyway.</p>` },
      { h: "How a program runs", id: "how", html: steps([
        ["Consultation", "With one of the clinic's doctors: your goals, your history, the medicines you take, and anything that would rule a peptide out."],
        ["Prescription and plan", "If a peptide suits you, the doctor prescribes it and sets the dose, the schedule and how long the program runs."],
        ["Administration", "Most programs use a small injection under the skin. The clinic shows you how and gives you written instructions to take home."],
        ["Monitoring and review", "Regular reviews of how you're responding. The program is adjusted, or stopped, from there."]]) },
      { h: "Suitability and safety", html: `<p>Peptide programs aren't for everyone. They aren't recommended in pregnancy or while breastfeeding. If you have active cancer, an autoimmune disorder or significant organ impairment, the doctor needs to look at your situation carefully before anything is decided.</p>
        <p>Side effects depend on the peptide. The common ones are mild: redness or soreness where the injection goes in, some tiredness, or fluid retention. Tell the doctor about every medicine and supplement you take, because each combination is assessed on its own.</p>
        <p>People respond very differently. Some notice a change within weeks; for others it takes months. A program works alongside your sleep, nutrition and exercise.</p>` },
    ],
    faq: [
      ["Do I need a prescription?", "Yes. Most therapeutic peptides are Schedule 4 prescription medicines in Australia, so you'll have a consultation before anything is prescribed."],
      ["How are peptides given?", "It depends on the peptide and the program. Usually it's an injection under the skin; sometimes it's an injection into muscle, a nasal spray or something taken by mouth. The doctor tells you which, and shows you how."],
      ["Can a peptide program be combined with other treatments?", "Often, for example with IV therapy or hormone treatment. Each combination is checked individually for interactions."],
      ["Is it covered by Medicare or private health insurance?", "Generally not by Medicare. Ask your health fund about extras cover; the clinic gives you an itemised receipt."],
    ],
    close: "Start with the questionnaire. Tell the doctor your goal; they'll tell you whether a program fits it.",
  })]);

  pages.push(["testosterone-therapy/index.html", servicePage(ctx, {
    key: "testosterone", slug: "testosterone-therapy",
    title: "Testosterone therapy in Annerley, Brisbane",
    description: "Doctor-led testosterone replacement therapy for men with pathology-confirmed testosterone deficiency, at Australian Longevity Clinic, Annerley. Consultation, pathology, prescription and ongoing monitoring.",
    h1: "Feel strong again, if low testosterone is the reason.",
    lede: "For men whose testosterone deficiency is confirmed by blood tests and whose symptoms affect their quality of life. Testosterone is a Schedule 4 prescription medicine, and nothing is prescribed on symptoms alone.",
    facts: [["Requires", "A confirmed diagnosis on pathology"], ["Program", "Ongoing, with repeat pathology and review"], ["Referral", "Not needed to book"], ["Form", "Injection, gel or other, as prescribed"], ["First step", "A consultation, then blood tests"]],
    sections: [
      { h: "What it is", html: `<p>Testosterone plays a part in muscle mass, bone density, energy, mood and libido. Levels fall with age. When they drop below the clinically normal range and cause significant symptoms, the doctor may consider testosterone replacement therapy.</p>
        <p>At the clinic it is only ever a prescription medical service. That means an assessment first, pathology that confirms the deficiency, and a treatment plan made for you.</p>` },
      { h: "Symptoms that can go with low testosterone", html: `${ticks(["Tiredness that doesn't lift, and low energy", "Less muscle and more body fat", "Lower libido, or reduced sexual function", "Feeling low or irritable, or finding it hard to concentrate", "Reduced bone density", "Poor sleep", "Less motivation and drive"])}
        <p class="notice"><b>These symptoms have many possible causes.</b> They can't diagnose low testosterone on their own. A blood test and a medical assessment can.</p>` },
      { h: "How it works", id: "how", html: steps([
        ["Consultation", "Your symptoms, history, medicines and general health, with one of the clinic's doctors. Everyone starts here."],
        ["Pathology and diagnosis", "The doctor orders blood tests and reads them against your symptoms. Treatment needs a confirmed diagnosis."],
        ["Prescription", "If it's clinically appropriate, a program for you. Whether that's an injection, a gel or another form depends on your needs and what you prefer."],
        ["Monitoring and review", "Follow-up consultations and repeat pathology are how treatment stays safe, so they're built into the program."]]) },
      { h: "Who it isn't for", html: `<p>It isn't for men whose testosterone is normal, it isn't for performance enhancement, and some medical conditions rule it out. Before anything is prescribed, the doctor goes through the options with you, along with the risks and benefits.</p>` },
    ],
    faq: [
      ["Is it suitable for everyone?", "No. Only for men whose testosterone deficiency has been confirmed clinically, through pathology and a medical assessment."],
      ["How long does treatment last?", "Usually it's ongoing rather than a short course. How long, and how often, depends on how you respond, your pathology results and your goals."],
      ["Are there risks or side effects?", "Yes, as with any prescription medicine, and they vary from person to person. The doctor goes through them in detail at your consultation, and regular monitoring is how they're managed."],
      ["Do I need a referral?", "Not to book the first consultation. Treatment itself needs a medical assessment and confirmed pathology."],
    ],
    close: "Start with the questionnaire. The first step is finding out whether there is a deficiency at all.",
  })]);

  pages.push(["weight-management/index.html", servicePage(ctx, {
    key: "weight", slug: "weight-management",
    title: "Medical weight management in Annerley, Brisbane",
    description: "Doctor-led medical weight management at Australian Longevity Clinic, Annerley: an assessment, a plan, prescription treatment only where clinically appropriate, and regular monitoring.",
    h1: "Lose weight, with a doctor's help.",
    lede: "For adults whose weight has become a medical question. A doctor looks at your history, your metabolic health and your medicines first, and prescribes only where it's clinically appropriate.",
    facts: [["First step", "A consultation, with pathology where needed"], ["Treatment", "Prescription only where appropriate"], ["Program", "Months, with regular monitoring"], ["Alongside", "Nutrition and lifestyle guidance"], ["Medicare", "Not bulk billed"]],
    sections: [
      { h: "What the assessment covers", html: `${ticks(["Your weight history, and what has and hasn't worked", "The medicines you take and any medical conditions", "Your metabolic health, with pathology where it would change the decision", "What you want, and what a realistic program looks like"])}` },
      { h: "Treatment", html: `<p>If it's clinically appropriate and you're eligible, a prescription medicine may be part of your plan, prescribed and monitored by the clinic's doctors. At the consultation the doctor goes through the options with you: what the evidence shows, the risks, and the cost.</p>
        <p class="notice">This site doesn't name prescription medicines. Australian law doesn't allow them to be advertised to the public, and whether one suits you depends on your assessment.</p>` },
      { h: "How it works", id: "how", html: steps([
        ["Questionnaire", "Your history, medicines, height and weight, and what you're aiming for."],
        ["Assessment", "A doctor reads your answers, talks through your history with you, and orders pathology if it's needed."],
        ["A plan", "Prescription treatment only where appropriate, alongside advice on food and activity."],
        ["Monitoring", "Regular reviews to track progress, manage side effects and adjust the plan. Progress is read over months, not week to week."]]) },
    ],
    faq: [
      ["Do I need a referral?", "No. You can start with the questionnaire and a consultation."],
      ["Is it covered by Medicare?", "Consultations aren't bulk billed. Some may attract a Medicare rebate, depending on their clinical nature, and the cost of any medicine depends on what's prescribed."],
      ["How long does a program last?", "Months rather than weeks, with regular reviews. The doctor will tell you what to expect at the first consultation."],
    ],
    close: "Start with the questionnaire. Include your height and weight; the doctor will take it from there.",
  })]);

  return pages;
}

export function teamPage(ctx) {
  const { head, strip, footer, scripts, link, rel, CLINIC, DOCTORS, register } = ctx;
  const depth = 1;
  const areas = ["IV infusion therapy", "Peptide therapy", "Testosterone replacement therapy", "Women's health", "Men's health", "Menopausal medicine", "Integrative wellness", "Preventive medicine", "Hormonal health", "Metabolic health", "Healthy ageing", "Sports and athletic performance", "Gut health", "Sleep medicine"];
  const people = {
    "@context": "https://schema.org",
    "@graph": DOCTORS.map((d) => ({
      "@type": "Person", name: d.name.replace(/^Dr /, ""), honorificPrefix: "Dr", honorificSuffix: d.post,
      knowsLanguage: d.languages.split(", "),
      image: `https://australianlongevityclinic.com.au/assets/img/doctors/${d.slug}-2x.jpg`,
      worksFor: { "@type": "MedicalClinic", name: CLINIC.name, url: "https://australianlongevityclinic.com.au/" },
    })),
  };
  return head({
    title: "Our lead doctors · Australian Longevity Clinic",
    description: "Australian Longevity Clinic is led by Dr Raman Bohra (MRCGP, FRACGP) and Dr Rekha Bohra (MB BS, DRCOG, MRCGP (U.K), FRACGP). Every consultation is one to one with a doctor.",
    depth, canonical: "our-team",
    extraHead: `<script type="application/ld+json">${JSON.stringify(people)}</script>\n`,
  }) + `
<body class="inner">
${strip(depth, "our-team", "light")}
<main id="main" class="page">
  <header class="page-head g-light" data-ground="light">
    <div class="wrap page-head__grid">
      <div>
        <h1 class="d-xl">The doctors who lead the clinic.</h1>
        <p class="lede">Dr Raman Bohra and Dr Rekha Bohra are Fellows of the Royal Australian College of General Practitioners. Every consultation is one to one with a doctor, and nothing is prescribed until a doctor has read your history and, where a decision depends on it, your pathology.</p>
        <div class="page-head__actions"><a class="btn" href="${link(depth, "contact")}#assessment">Begin your assessment</a></div>
      </div>
      ${facts([["Doctors", "Dr Raman Bohra<br>Dr Rekha Bohra"], ["Registration", "Current medical registration with AHPRA"], ["Consultations", "One to one with a doctor"], ["Languages", "English and Hindi. Dr Raman Bohra also speaks Punjabi."]])}
    </div>
  </header>
  <section class="team-register g-light" data-ground="light" aria-label="The doctors' records">
    <div class="wrap">
      ${register(depth, { full: true, level: 2 })}
    </div>
  </section>
  <section class="spec g-light" data-ground="light">
    <div class="wrap spec__grid">
      <aside class="spec__fig spec__check">
        <h2 class="d-md">Check a registration yourself</h2>
        <div class="body">
          <p>Every doctor practising in Australia is on a public register kept by the Australian Health Practitioner Regulation Agency (AHPRA). Search for either doctor by name to see their registration, including any conditions on it.</p>
          <p><a class="textlink" href="${CLINIC.ahpra}" rel="noopener" target="_blank">Search the AHPRA register<span class="visually-hidden"> (opens in a new tab)</span></a></p>
        </div>
      </aside>
      <div class="spec__text">
        <section><h2 class="d-md">How they practise</h2><div class="body">
          <p>The doctor reads your questionnaire before the call. On the call they go through your history and your goals, and check for anything that would make a treatment unsafe for you.</p>
          <p>Whatever they recommend comes out of that assessment. If a program can't do what you want it to, the doctor will say so, and will tell you what the evidence does and doesn't show.</p>
          <p>The doctors keep up with the evidence on IV therapy, peptides and integrative medicine through ongoing professional development.</p>
        </div></section>
        <section><h2 class="d-md">Areas the clinic works in</h2><div class="body">${ticks(areas)}</div></section>
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
      <h1 class="d-xl" style="margin-top:1rem;max-width:14ch">That page isn't here.</h1>
      <p class="lede">The page may have moved when the site was rebuilt. These are the places most people are looking for.</p>
      <ul class="menu-list" style="margin-top:2.5rem">
        <li><a href="${link(depth, "")}"><b>Home</b></a><span class="mono"></span></li>
        <li><a href="${link(depth, "iv-drips")}"><b>IV therapy</b></a><span class="mono">More energy</span></li>
        <li><a href="${link(depth, "peptide-therapy")}"><b>Peptide programs</b></a><span class="mono">Better skin and hair</span></li>
        <li><a href="${link(depth, "testosterone-therapy")}"><b>Testosterone therapy</b></a><span class="mono">Feel strong again</span></li>
        <li><a href="${link(depth, "weight-management")}"><b>Medical weight management</b></a><span class="mono">Lose weight</span></li>
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
