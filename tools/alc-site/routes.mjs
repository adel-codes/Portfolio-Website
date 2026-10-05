// The goal routes: what a doctor checks for each goal before anything is
// prescribed, and when it is checked again. Imported by build.mjs (pages) and
// tools/alc-assets/gen_datafield.mjs (the hero's far plane), so the picture
// and the panels are drawn from the same facts.
//
// The tests, ranges and intervals come from the clinic's own pages and
// articles: the iron ranges from its iron infusion guide, the testosterone
// panel and re-test schedule from its testosterone guide, the weight panel
// from its weight management and peptide articles, the energy panel from its
// IV page. Two lines on the skin and hair route are this build's wording, for
// the doctors to confirm (see the README): "Iron studies", the standard name
// for the iron tests its guide lists hair loss under, and the description of
// "Baseline bloods". The plain descriptions say what each test measures and
// nothing more. One object builds the hero slip, the programs rail, the route
// act and the program pages.
export const ROUTES = [
  {
    key: "peptides", goal: "Better skin and hair",
    line: "Skin and hair is one goal a peptide program can be built around. Recovery and sleep are others.",
    checkTitle: "What a doctor may look at first",
    tests: [
      ["Your history and medicines", "Anything that would rule a peptide out"],
      ["Baseline bloods", "Hormone levels, inflammation and metabolic health, when your goal calls for them"],
      ["Iron studies", "If your hair is thinning, because low iron can be the cause"],
    ],
    rule: "Most therapeutic peptides are Schedule 4 medicines. One is prescribed only if it suits you.",
    recheck: "Regular reviews of how you're responding. The program is adjusted, or stopped, from there.",
    card: {
      intro: "Prescribed only after a doctor's consultation, and only if a peptide suits you.",
      rows: [["What it is", "Prescription peptide programs built around one goal, such as healthier skin and hair."], ["First step", "A consultation. Most therapeutic peptides are Schedule 4 medicines, prescribed only if suitable."], ["Time", "Weeks to months, reviewed as you go."], ["Where", "Prescribed by the clinic's doctors, with administration taught."]],
    },
  },
  {
    key: "weight", goal: "Lose weight",
    line: "Before recommending anything, a doctor goes through your weight history and the medicines you take, then the bloods below.",
    checkTitle: "What a doctor may check",
    tests: [
      ["Fasting glucose", "Your blood sugar after an overnight fast"],
      ["Insulin", "How hard your body is working to keep that sugar in range"],
      ["HbA1c", "Your average blood sugar over the last two to three months"],
      ["Lipid panel", "Cholesterol and triglycerides"],
      ["Thyroid function", "How your thyroid is working"],
    ],
    rule: "Prescription treatment only where it's clinically appropriate, alongside advice on food and activity.",
    recheck: "Regular reviews. Progress is read over months, not week to week.",
    card: {
      intro: "For adults who want a doctor's help with their weight.",
      rows: [["What it is", "Medical weight management: a doctor's assessment and plan, with prescription medicines only where appropriate."], ["First step", "A consultation and pathology."], ["Time", "Months, read as a trend rather than a weigh-in."], ["Where", "Prescribed and monitored by the clinic's doctors."]],
    },
  },
  {
    key: "testosterone", goal: "Feel strong again",
    line: "If low testosterone is why you feel flat, treatment aims to bring your energy and strength back.",
    checkTitle: "What a doctor checks first",
    tests: [
      ["Total testosterone", "How much is in your blood"],
      ["Free testosterone", "The part your body can use"],
      ["SHBG", "A protein that affects how much is free"],
      ["LH and FSH", "The pituitary hormones that regulate production"],
      ["Oestradiol", "Your balance of testosterone and oestrogen"],
      ["Full blood count and metabolic panel", "Overall health, and anything that rules treatment out"],
    ],
    rule: "Only for men whose symptoms and blood tests both show low testosterone. Testosterone is a Schedule 4 medicine.",
    recheck: "Bloods again 6 to 12 weeks after starting, then every 3 to 6 months: testosterone, haematocrit, PSA and oestradiol.",
    card: {
      intro: "For men with symptoms whose low testosterone is confirmed on a blood test.",
      rows: [["What it is", "Testosterone replacement for men with confirmed deficiency."], ["First step", "A consultation, then pathology to confirm. Symptoms alone are not enough."], ["Time", "Ongoing, with repeat pathology and regular review."], ["Where", "Prescribed and monitored by the clinic's doctors."]],
    },
  },
  {
    key: "iv", goal: "More energy",
    line: "Tiredness has plenty of causes. Low iron is one a blood test can find, and an infusion can replace.",
    checkTitle: "What a doctor checks first",
    tests: [
      ["Serum ferritin", "Your iron stores", "30–300 µg/L in women, 30–400 µg/L in men"],
      ["Transferrin saturation", "How much iron is bound for transport", "20–50%"],
      ["Full blood count", "Including haemoglobin", "Haemoglobin 120–160 g/L in women, 130–170 g/L in men"],
      ["C-reactive protein", "A marker of inflammation"],
      ["Vitamin D", "Needed before a vitamin D injection"],
    ],
    ranges: "blog/iron-infusion-brisbane",
    rule: "Iron is given only for a deficiency your bloods confirm, with results from the last 3 months and a GP referral.",
    recheck: "A follow-up blood test 6 to 8 weeks after an iron infusion.",
    card: {
      intro: "Infusions given in the clinic under a doctor's supervision. Iron only when your bloods confirm a deficiency.",
      rows: [["What it is", "Infusions of fluids, vitamins, iron or NAD+, given in the clinic."], ["First step", "A consultation. Iron also needs pathology from the last 3 months and a GP referral."], ["Time", "30 minutes to 4 hours, by infusion."], ["Where", "In the chair at Annerley, under a doctor's supervision."]],
    },
  },
];
