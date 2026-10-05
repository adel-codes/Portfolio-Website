/* Shared behaviour for every page: the accession strip, its menus, the
   phone assessment bar, program presets and the journal sign-up. */
(function () {
  "use strict";
  var strip = document.querySelector(".strip");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --------------------------------------------- the strip takes the ground
  // The strip reads the ground of whatever section sits under its midline.
  var grounds = [].slice.call(document.querySelectorAll("main[data-ground], main [data-ground], body > footer[data-ground]"));
  var ticking = false, underPinned = false;
  function paintStrip() {
    ticking = false;
    if (!strip) return;
    // the last section whose top has passed the midline; above the first
    // section (a page's top padding), the first section's ground
    var mid = strip.offsetHeight / 2, under = grounds[0] || null;
    for (var i = 0; i < grounds.length; i++) {
      if (grounds[i].getBoundingClientRect().top <= mid) under = grounds[i];
    }
    if (under) strip.setAttribute("data-ground", under.getAttribute("data-ground"));
    var overSpecimen = under && under.classList.contains("specimen");
    strip.classList.toggle("is-solid", scrollY > 4 && !overSpecimen);
    // a pinned act owns the whole screen; the bar would cover its content
    underPinned = !!under && /^(pin|pan|scrub)$/.test(under.getAttribute("data-sc-act") || "");
    paintBar();
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(paintStrip); } }, { passive: true });
  addEventListener("resize", paintStrip, { passive: true });

  // --------------------------------------------------- programs disclosure
  var more = document.querySelector(".nav__more");
  var menu = more && document.getElementById(more.getAttribute("aria-controls"));
  function setMenu(open) {
    if (!more) return;
    more.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
  }
  if (more) {
    more.addEventListener("click", function () { setMenu(more.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("click", function (e) { if (!e.target.closest(".nav__group")) setMenu(false); });
    more.parentNode.addEventListener("focusout", function (e) {
      if (!more.parentNode.contains(e.relatedTarget)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && more.getAttribute("aria-expanded") === "true") { setMenu(false); more.focus(); }
    });
  }

  // ---------------------------------------------------- the phone menu sheet
  var mbtn = document.querySelector(".strip__menu");
  var sheet = document.getElementById("sheet-menu");
  if (mbtn && sheet) {
    var closeBtn = sheet.querySelector(".sheet-menu__close");
    var open = function () {
      sheet.hidden = false;
      mbtn.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      closeBtn.focus();
    };
    var shut = function (refocus) {
      sheet.hidden = true;
      mbtn.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      if (refocus) mbtn.focus();
    };
    mbtn.addEventListener("click", open);
    closeBtn.addEventListener("click", function () { shut(true); });
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) shut(false); });
    sheet.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { shut(true); return; }
      if (e.key !== "Tab") return;
      var f = [].slice.call(sheet.querySelectorAll("a, button")).filter(function (x) { return x.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // ------------------------------------------------- phone assessment bar
  // Shown once the opening screen has passed, hidden while the form itself is
  // on screen, so it never covers the thing it points at.
  var bar = document.querySelector(".cta-bar");
  var form = document.getElementById("assessment");
  var formOnScreen = false;
  if (form && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { formOnScreen = es[0].isIntersecting; paintBar(); }, { threshold: 0 }).observe(form);
  }
  var footerEl = document.querySelector(".foot");
  var footOnScreen = false;
  if (footerEl && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { footOnScreen = es[0].isIntersecting; paintBar(); }, { threshold: 0 }).observe(footerEl);
  }
  function paintBar() {
    if (!bar) return;
    bar.classList.toggle("is-on", scrollY > innerHeight * 0.9 && !underPinned && !formOnScreen && !footOnScreen && (!sheet || sheet.hidden));
  }

  // --------------------------------------------- program presets on links
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-program]");
    if (a && window.ALCIntake) window.ALCIntake.setProgram(a.getAttribute("data-program"));
  });

  // ------------------------------------------------------ journal sign-up
  [].forEach.call(document.querySelectorAll("form.news"), function (f) {
    var out = f.querySelector('[role="status"]');
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = f.querySelector('input[type="email"]');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        out.textContent = "Enter an email address, like name@example.com.";
        email.focus();
        return;
      }
      var endpoint = f.getAttribute("data-endpoint");
      if (!endpoint) {
        out.textContent = "Preview build: no subscription was made. This form isn't connected to a mailing list yet.";
        return;
      }
      out.textContent = "Subscribing…";
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.value.trim() }), credentials: "omit" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); out.textContent = "Subscribed. The next journal arrives within a fortnight."; f.reset(); })
        .catch(function () { out.textContent = "That didn't go through. Please try again in a moment."; });
    });
  });

  // in-page anchors land below the fixed strip
  if (strip) document.documentElement.style.scrollPaddingTop = (strip.offsetHeight + 12) + "px";
  if (reduce) document.documentElement.style.scrollBehavior = "auto";
  paintStrip();
  // The engine sets pinned act heights when home.js mounts it, after this
  // script has run; paint again once that layout exists.
  requestAnimationFrame(paintStrip);
  addEventListener("load", paintStrip);
})();
