/* The assessment: five steps, one at a time.

   Wiring (set on the <form>):
     data-endpoint       POST target for the answers, as JSON. Must return 2xx,
                         optionally { id, checkoutUrl }.
     data-checkout-url   Stripe Payment Link (or Checkout URL) for the $75 fee.
                         The answer id is passed as client_reference_id and
                         the email as prefilled_email.

   With no endpoint set, the form runs as a preview: it validates, reviews,
   and then says plainly that nothing was sent and nothing was charged.

   Answers are kept in sessionStorage (this tab only) so a reload does not
   lose them, and are cleared on send, on "Clear my answers", or when the tab
   closes. Health information is never written to localStorage. */
(function () {
  "use strict";
  var form = document.getElementById("intake");
  if (!form) return;

  var KEY = "alc-assessment-v1";
  var steps = [].slice.call(form.querySelectorAll(".intake__step"));
  var tabs = [].slice.call(form.querySelectorAll(".intake__tabs [data-goto]"));
  var alertBox = form.querySelector(".intake__alert");
  var btnNext = form.querySelector("[data-next]");
  var btnBack = form.querySelector("[data-back]");
  var btnSubmit = form.querySelector("[data-submit]");
  var result = form.querySelector("[data-result]");
  var reviewEl = form.querySelector("[data-review]");
  var section = form.closest(".assess") || document;
  var segs = [].slice.call(section.querySelectorAll(".progress-steps .pr"));
  var stepNum = section.querySelector("[data-step-num]");
  var stepName = section.querySelector("[data-step-name]");
  var submitLabel = btnSubmit.textContent;
  var cur = 0, reached = 0;
  var MULTI = { goals: 1, conditions: 1 };

  // ------------------------------------------------------------ values --
  function serialize() {
    var out = {};
    [].forEach.call(form.elements, function (el) {
      if (!el.name || el.disabled || el.type === "submit" || el.type === "button") return;
      if (el.type === "checkbox") {
        if (MULTI[el.name]) { out[el.name] = out[el.name] || []; if (el.checked) out[el.name].push(el.value); }
        else out[el.name] = el.checked ? el.value : "";
      } else if (el.type === "radio") {
        if (el.checked) out[el.name] = el.value;
        else if (!(el.name in out)) out[el.name] = "";
      } else out[el.name] = el.value.trim();
    });
    return out;
  }
  function fill(d) {
    if (!d) return;
    [].forEach.call(form.elements, function (el) {
      if (!el.name || !(el.name in d)) return;
      var v = d[el.name];
      if (el.type === "checkbox") el.checked = Array.isArray(v) ? v.indexOf(el.value) > -1 : v === el.value;
      else if (el.type === "radio") el.checked = v === el.value;
      else if (el.tagName !== "BUTTON") el.value = v;
    });
  }
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify({ data: serialize(), cur: cur, reached: reached })); } catch (e) {}
  }
  function restore() {
    try {
      var s = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (s && s.data) { fill(s.data); reached = Math.min(s.reached || 0, steps.length - 1); return Math.min(s.cur || 0, reached); }
    } catch (e) {}
    return 0;
  }
  function labelFor(input) {
    var span = input.parentNode.querySelector("span");
    if (!span) return input.value;
    var t = span.cloneNode(true);
    var sm = t.querySelector("small");
    if (sm) sm.remove();
    return t.textContent.trim();
  }

  // ------------------------------------------------- conditional fields --
  function applyWhen() {
    [].forEach.call(form.querySelectorAll("[data-when]"), function (box) {
      var parts = box.getAttribute("data-when").split(":");
      var on = form.querySelector('[name="' + parts[0] + '"]:checked');
      var show = !!on && parts[1].split(",").indexOf(on.value) > -1;
      box.hidden = !show;
      [].forEach.call(box.querySelectorAll("input, select, textarea"), function (i) {
        i.disabled = !show;
        if (box.getAttribute("data-field") === "pregnancy") i.required = show;
      });
    });
  }

  // ---------------------------------------------------------- validation --
  var digits = function (s) { return String(s || "").replace(/\D+/g, ""); };
  function dobError(v) {
    if (!v) return "Enter your date of birth.";
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v.replace(/\s+/g, ""));
    if (!m) return "Enter your date of birth as DD/MM/YYYY.";
    var d = +m[1], mo = +m[2], y = +m[3];
    var dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return "That date doesn't exist. Check the day and month.";
    var now = new Date();
    var age = now.getFullYear() - y - ((now.getMonth() < mo - 1 || (now.getMonth() === mo - 1 && now.getDate() < d)) ? 1 : 0);
    if (dt > now) return "That date is in the future.";
    if (age > 110) return "Check the year.";
    if (age < 18) return "This form is for adults. If you're under 18, please email the clinic.";
    return "";
  }
  var RULES = {
    program: function (d) { return d.program ? "" : "Choose a program, or “Not sure yet”."; },
    first_name: function (d) { return d.first_name ? "" : "Enter your first name."; },
    last_name: function (d) { return d.last_name ? "" : "Enter your last name."; },
    dob: function (d) { return dobError(d.dob); },
    sex: function (d) { return d.sex ? "" : "Choose one. If you'd rather talk it through, choose “Discuss with the doctor”."; },
    height_cm: function (d) { var n = +d.height_cm; return !d.height_cm || (n >= 90 && n <= 250) ? "" : "Enter your height in centimetres, like 172."; },
    weight_kg: function (d) { var n = +d.weight_kg; return !d.weight_kg || (n >= 25 && n <= 350) ? "" : "Enter your weight in kilograms, like 78."; },
    suburb: function (d) { return d.suburb ? "" : "Enter your suburb."; },
    state: function (d) { return d.state ? "" : "Choose your state or territory."; },
    postcode: function (d) { return /^\d{4}$/.test(d.postcode) ? "" : "Enter a 4-digit postcode."; },
    medications: function (d) { return d.medications ? "" : "List your medicines and supplements, or write “None”."; },
    allergies: function (d) { return d.allergies ? "" : "List any allergies, or write “None known”."; },
    pregnancy: function (d) { return form.querySelector('[data-field="pregnancy"]').hidden || d.pregnancy ? "" : "Choose one."; },
    pathology: function (d) { return d.pathology ? "" : "Choose one."; },
    phone: function (d) {
      var p = digits(d.phone).replace(/^61/, "0");
      return /^0[2-478]\d{8}$/.test(p) ? "" : "Enter an Australian phone number the doctor can call, like 0412 345 678.";
    },
    email: function (d) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) ? "" : "Enter an email address, like name@example.com."; },
    medicare_number: function (d) { return !d.medicare_number || digits(d.medicare_number).length === 10 ? "" : "A Medicare card number has 10 digits."; },
    medicare_irn: function (d) { return !d.medicare_irn || /^[1-9]$/.test(d.medicare_irn) ? "" : "Use the single number, 1 to 9, beside your name on the card."; },
    consent: function (d) { return d.consent_accurate && d.consent_privacy && d.consent_emergency ? "" : "Tick the three confirmations to continue."; },
  };
  var STEP_FIELDS = [
    ["program"],
    ["first_name", "last_name", "dob", "sex", "height_cm", "weight_kg", "suburb", "state", "postcode"],
    ["medications", "allergies", "pregnancy", "pathology"],
    ["phone", "email", "medicare_number", "medicare_irn", "consent"],
    []
  ];

  function fieldBox(name) { return form.querySelector('[data-field="' + name + '"]'); }
  function focusTarget(name) {
    var box = fieldBox(name);
    if (!box) return null;
    return box.querySelector("input:not([type=hidden]):not([disabled]), select, textarea");
  }
  function setError(name, msg) {
    var box = fieldBox(name);
    if (!box) return;
    var err = box.querySelector(".err") || document.getElementById(name + "-err");
    box.classList.toggle("is-bad", !!msg);
    if (err) { err.textContent = msg; err.hidden = !msg; }
    [].forEach.call(box.querySelectorAll("input, select, textarea"), function (i) {
      if (msg) {
        i.setAttribute("aria-invalid", "true");
        var ids = (i.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (err && ids.indexOf(err.id) < 0) { ids.push(err.id); i.setAttribute("aria-describedby", ids.join(" ")); }
      } else i.removeAttribute("aria-invalid");
    });
  }
  function validateStep(i, show) {
    var d = serialize(), bad = [];
    STEP_FIELDS[i].forEach(function (name) {
      var msg = RULES[name] ? RULES[name](d) : "";
      if (show) setError(name, msg);
      if (msg) bad.push([name, msg]);
    });
    return bad;
  }
  function showSummary(bad) {
    if (!bad.length) { alertBox.hidden = true; alertBox.innerHTML = ""; return; }
    if (bad.length === 1) {
      alertBox.hidden = true;
      var t = focusTarget(bad[0][0]);
      if (t) t.focus();
      return;
    }
    alertBox.innerHTML = "<p><b>" + bad.length + " answers need attention.</b></p><ul>" +
      bad.map(function (b) { return '<li><a href="#' + b[0] + '-err" data-jump="' + b[0] + '">' + b[1] + "</a></li>"; }).join("") + "</ul>";
    alertBox.hidden = false;
    alertBox.focus();
  }
  alertBox.addEventListener("click", function (e) {
    var a = e.target.closest("[data-jump]");
    if (!a) return;
    e.preventDefault();
    var t = focusTarget(a.getAttribute("data-jump"));
    if (t) t.focus();
  });

  // Once a field has been flagged, re-check it as the visitor fixes it. A
  // field is never flagged just for being left empty on the way past.
  form.addEventListener("input", function (e) {
    var box = e.target.closest("[data-field]");
    if (box && box.classList.contains("is-bad")) {
      var name = box.getAttribute("data-field");
      setError(name, RULES[name] ? RULES[name](serialize()) : "");
    }
  });
  form.addEventListener("focusout", function (e) {
    var el = e.target;
    if (!el.value || !/^(dob|postcode|phone|email|medicare_number|medicare_irn|height_cm|weight_kg)$/.test(el.name)) return;
    setError(el.name, RULES[el.name](serialize()));
  });
  // DD/MM/YYYY as you type
  var dob = form.querySelector("#dob");
  if (dob) dob.addEventListener("input", function (e) {
    if (e.inputType && e.inputType.indexOf("delete") === 0) return;
    var v = digits(dob.value).slice(0, 8);
    dob.value = v.length > 4 ? v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4) : v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
  });
  form.addEventListener("change", function () { applyWhen(); save(); });
  form.addEventListener("input", function () { save(); });
  // a conditions list where "None of these" is exclusive
  form.addEventListener("change", function (e) {
    if (e.target.name !== "conditions") return;
    var none = form.querySelector('[name="conditions"][value="none"]');
    if (e.target === none && none.checked) {
      [].forEach.call(form.querySelectorAll('[name="conditions"]'), function (c) { if (c !== none) c.checked = false; });
    } else if (e.target !== none && e.target.checked) none.checked = false;
  });

  // ------------------------------------------------------------- review --
  function rows(pairs) {
    return pairs.filter(function (p) { return p[1]; }).map(function (p) {
      return "<dt>" + p[0] + "</dt><dd>" + esc(p[1]) + "</dd>";
    }).join("");
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function picked(name) {
    return [].slice.call(form.querySelectorAll('[name="' + name + '"]:checked')).map(labelFor).join(", ");
  }
  function buildReview() {
    var d = serialize();
    var med = d.medicare_number ? "Card ending " + digits(d.medicare_number).slice(-3) + (d.medicare_irn ? ", number " + d.medicare_irn : "") : "";
    var blocks = [
      ["Goals", 0, [["Program", picked("program")], ["Priorities", picked("goals")], ["In your words", d.reason]]],
      ["About you", 1, [["Name", (d.first_name + " " + d.last_name).trim()], ["Date of birth", d.dob], ["Sex", picked("sex")],
        ["Height", d.height_cm ? d.height_cm + " cm" : ""], ["Weight", d.weight_kg ? d.weight_kg + " kg" : ""],
        ["Location", [d.suburb, d.state, d.postcode].filter(Boolean).join(" ")]]],
      ["Health", 2, [["Conditions", picked("conditions") || "None ticked"], ["Other", d.conditions_other], ["Medicines", d.medications],
        ["Allergies", d.allergies], ["Pregnancy", picked("pregnancy")], ["Blood tests, last 3 months", picked("pathology")],
        ["Smoking", picked("smoking")], ["Alcohol", d.alcohol], ["Regular GP", picked("gp")], ["Summary to GP", picked("gp_share")]]],
      ["Contact", 3, [["Phone", d.phone], ["Email", d.email], ["Best time", picked("call_time")], ["Medicare", med],
        ["Journal by email", d.newsletter ? "Yes" : "No"]]]
    ];
    reviewEl.innerHTML = blocks.map(function (b) {
      return '<section><h4>' + b[0] + '</h4><dl>' + rows(b[2]) + '</dl><button type="button" class="linkish" data-goto="' + b[1] + '">Change<span class="visually-hidden"> ' + b[0].toLowerCase() + "</span></button></section>";
    }).join("");
    var echo = form.querySelector('[data-echo="phone"]');
    if (echo && d.phone) echo.textContent = d.phone;
  }
  reviewEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-goto]");
    if (b) go(+b.getAttribute("data-goto"), true);
  });

  // ---------------------------------------------------------- stepping --
  function paintProgress() {
    segs.forEach(function (r, k) {
      r.classList.toggle("is-done", k < cur);
      r.classList.toggle("is-current", k === cur);
    });
    tabs.forEach(function (t, k) {
      t.disabled = k > reached;
      t.classList.toggle("is-done", k < reached && k !== cur);
      if (k === cur) t.setAttribute("aria-current", "step"); else t.removeAttribute("aria-current");
    });
    if (stepNum) stepNum.textContent = String(cur + 1);
    if (stepName) stepName.textContent = steps[cur].getAttribute("data-name");
  }
  function go(i, focus) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    var back = i < cur;
    cur = i;
    reached = Math.max(reached, i);
    steps.forEach(function (s, k) {
      s.classList.toggle("is-current", k === i);
      s.classList.toggle("is-back", k === i && back);
    });
    btnBack.hidden = i === 0;
    form.classList.toggle("on-review", i === steps.length - 1);
    if (i === steps.length - 1) buildReview();
    alertBox.hidden = true;
    result.hidden = true;
    paintProgress();
    save();
    if (focus) {
      var top = form.getBoundingClientRect().top;
      var stripH = (document.querySelector(".strip") || { offsetHeight: 64 }).offsetHeight;
      if (top < stripH + 8 || top > innerHeight * 0.6) {
        window.scrollTo({ top: scrollY + top - stripH - 24, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
      var h = steps[i].querySelector("h2, h3, h4");
      if (h) h.focus({ preventScroll: true });
    }
  }
  btnNext.addEventListener("click", function () {
    var bad = validateStep(cur, true);
    if (bad.length) { showSummary(bad); return; }
    go(cur + 1, true);
  });
  btnBack.addEventListener("click", function () { go(cur - 1, true); });
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { if (!t.disabled) go(+t.getAttribute("data-goto"), true); });
  });
  // Enter in a text field moves forward instead of submitting the form early.
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox" && e.target.type !== "radio" && cur < steps.length - 1) {
      e.preventDefault();
      btnNext.click();
    }
  });

  // -------------------------------------------------------------- send --
  function say(html, cls) {
    result.className = "intake__result" + (cls ? " " + cls : "");
    result.innerHTML = html;
    result.hidden = false;
    result.focus();
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    for (var k = 0; k < steps.length - 1; k++) {
      var bad = validateStep(k, true);
      if (bad.length) { go(k, true); showSummary(bad); return; }
    }
    var data = serialize();
    data.submitted_at = new Date().toISOString();
    data.page = location.pathname;
    var endpoint = form.getAttribute("data-endpoint");
    var checkout = form.getAttribute("data-checkout-url");
    if (!endpoint) {
      say("<h4>Preview build: nothing was sent.</h4>" +
        "<p>This copy of the site isn't connected to the clinic yet, so your answers stayed in this browser and nothing was charged.</p>" +
        "<p>On the live site this button saves your answers for the doctor and opens Stripe's secure checkout for the " + "$75 fee.</p>" +
        '<p class="mono">To connect it, set data-endpoint and data-checkout-url on the form. See README.md.</p>' +
        '<p><button type="button" class="linkish" data-restart>Clear the answers and start again</button></p>');
      return;
    }
    form.classList.add("is-sending");
    btnSubmit.textContent = "Sending…";
    btnSubmit.setAttribute("aria-busy", "true");
    fetch(endpoint, {
      method: "POST", credentials: "omit",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json().catch(function () { return {}; });
    }).then(function (res) {
      try { sessionStorage.removeItem(KEY); } catch (e2) {}
      var url = res.checkoutUrl || checkout;
      if (!url) {
        say("<h4>Your answers are with the clinic.</h4><p>Nothing has been charged. The clinic will be in touch about the consultation fee and a time for the doctor's call.</p>");
        return;
      }
      var u = new URL(url, location.href);
      if (res.id && !u.searchParams.has("client_reference_id")) u.searchParams.set("client_reference_id", String(res.id).replace(/[^\w-]/g, "").slice(0, 200));
      if (data.email && !u.searchParams.has("prefilled_email")) u.searchParams.set("prefilled_email", data.email);
      say("<h4>Saved. Opening secure checkout…</h4><p>If nothing happens, <a href=\"" + esc(u.toString()) + "\">continue to Stripe</a>.</p>");
      location.assign(u.toString());
    }).catch(function () {
      say("<h4>We couldn't send your answers.</h4><p>Nothing was charged, and your answers are still here. Please try again in a moment. If it keeps happening, email <a href=\"mailto:reception@australianlongevityclinic.com.au\">reception@australianlongevityclinic.com.au</a> and the clinic will help. Please don't email health details.</p>", "is-error");
    }).then(function () {
      form.classList.remove("is-sending");
      btnSubmit.textContent = submitLabel;
      btnSubmit.removeAttribute("aria-busy");
    });
  });
  function restart() {
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    form.reset();
    [].forEach.call(form.querySelectorAll(".is-bad"), function (b) { b.classList.remove("is-bad"); });
    [].forEach.call(form.querySelectorAll(".err"), function (e) { e.hidden = true; });
    reached = 0;
    applyWhen();
    go(0, true);
  }
  result.addEventListener("click", function (e) { if (e.target.closest("[data-restart]")) restart(); });
  var clear = form.querySelector("[data-clear]");
  if (clear) clear.addEventListener("click", restart);

  // ---------------------------------------------------- program presets --
  var PROGRAM_KEYS = ["iv", "peptides", "testosterone", "weight", "unsure"];
  function setProgram(key) {
    if (PROGRAM_KEYS.indexOf(key) < 0) return;
    var r = form.querySelector('[name="program"][value="' + key + '"]');
    if (r) { r.checked = true; setError("program", ""); save(); }
  }
  window.ALCIntake = { setProgram: setProgram };

  // ------------------------------------------------------------- start --
  var start = restore();
  applyWhen();
  var q = new URLSearchParams(location.search).get("program");
  if (q) setProgram(q);
  go(start, false);
})();
