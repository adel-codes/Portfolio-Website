/* Australian Longevity Clinic — home page behaviour.
   The engine (scrollcraft.js) drives the acts. This file adds the page's own
   two things: the margin folio, and the signature move in chapter III, a
   pathway chart drawn from the act's --sc-p. The engine is never edited. */
(function () {
  "use strict";

  var doc = document;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mount the engine on the page. */
  if (window.ScrollCraft) ScrollCraft.mount(doc.body);

  /* ---------------------------------------------------------- the folio -- */
  var folio = doc.querySelector(".folio");
  var toggle = folio && folio.querySelector(".folio__toggle");
  var numOut = folio && folio.querySelector("[data-folio-num]");
  var titleOut = folio && folio.querySelector("[data-folio-title]");
  var links = folio ? Array.prototype.slice.call(folio.querySelectorAll(".folio__list a")) : [];
  var chapters = Array.prototype.slice.call(doc.querySelectorAll("[data-chapter]"));

  function setCurrent(section) {
    if (!folio || !section) return;
    var id = "#" + section.id;
    links.forEach(function (a) {
      if (a.getAttribute("href") === id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    if (numOut) numOut.textContent = section.getAttribute("data-chapter") || "";
    if (titleOut) titleOut.textContent = section.getAttribute("data-chapter-title") || "";
    folio.classList.toggle("is-on-ink", section.classList.contains("chapter--ink"));
  }

  if (chapters.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setCurrent(e.target);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    chapters.forEach(function (c) { io.observe(c); });
  }
  setCurrent(chapters[0]);

  if (toggle) {
    var setOpen = function (open) {
      folio.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () { setOpen(!folio.classList.contains("is-open")); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    doc.addEventListener("click", function (e) { if (!folio.contains(e.target)) setOpen(false); });
    links.forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
  }

  /* ---------------------------- chapter III: the pathway that draws itself -- */
  var act = doc.getElementById("chapter-3");
  var stage = act && act.querySelector("[data-sc-stage]");
  if (act && stage) {
    var charts = Array.prototype.slice.call(stage.querySelectorAll(".chart__svg"));
    var prepared = charts.map(function (svg) {
      var pick = function (sel) { return svg.querySelector(sel); };
      var main = pick(".chart__main"), ret = pick(".chart__return"), stop = pick(".chart__stopline");
      var lengths = { main: main ? main.getTotalLength() : 0, stop: stop ? stop.getTotalLength() : 0 };
      /* solid strokes draw by dash offset; the dashed return line keeps its own
         pattern and is revealed through a mask whose stroke draws instead */
      [main, stop].forEach(function (el, i) {
        if (!el) return;
        var L = i === 0 ? lengths.main : lengths.stop;
        el.style.strokeDasharray = String(L);
        el.style.strokeDashoffset = String(L);
      });
      /* stations carry the fraction of the main stroke at which they land */
      var stations = Array.prototype.slice.call(svg.querySelectorAll(".chart__station"));
      var leaders = Array.prototype.slice.call(svg.querySelectorAll(".chart__leader"));
      var mask = pick(".chart__retmask");
      var maskL = mask ? mask.getTotalLength() : 0;
      if (mask) { mask.style.strokeDasharray = String(maskL); mask.style.strokeDashoffset = String(maskL); }
      var stopmark = pick(".chart__stopmark");
      return { svg: svg, main: main, ret: ret, stop: stop, mask: mask, maskL: maskL, lengths: lengths, stations: stations, leaders: leaders, stopmark: stopmark };
    });

    var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
    var last = "";

    function draw(p) {
      /* the baseline draws over the first two thirds of the pin; the return line
         and the stop over the last third. One idea per act: scroll is the pencil. */
      var f = clamp01(p / 0.66);
      var g = clamp01((p - 0.70) / 0.14);
      var h = clamp01((p - 0.86) / 0.08);
      var landed = 0;
      prepared.forEach(function (c) {
        if (c.main) c.main.style.strokeDashoffset = (c.lengths.main * (1 - f)).toFixed(1);
        if (c.mask) c.mask.style.strokeDashoffset = (c.maskL * (1 - g)).toFixed(1);
        if (c.stop) c.stop.style.strokeDashoffset = (c.lengths.stop * (1 - h)).toFixed(1);
        if (c.stopmark) c.stopmark.classList.toggle("is-landed", h >= 1);
        var n = 0;
        c.stations.forEach(function (s, i) {
          var at = parseFloat(s.getAttribute("data-at")) || 0;
          var on = f >= at;
          s.classList.toggle("is-landed", on);
          if (c.leaders[i]) c.leaders[i].classList.toggle("is-landed", on);
          if (on) n++;
        });
        landed = Math.max(landed, n);
      });
      /* what the harness sees: the rendered values, rounded, not raw progress */
      var state = "line:" + f.toFixed(2) + " return:" + g.toFixed(2) + " stop:" + h.toFixed(2) + " stations:" + landed;
      if (state !== last) { stage.setAttribute("data-sc-verify-state", state); last = state; }
    }

    if (reduce) {
      /* fewer and gentler, not zero: the finished drawing, present. */
      draw(1);
      stage.setAttribute("data-sc-verify-hold", "true");
    } else {
      var lastP = -1;
      (function loop() {
        var p = parseFloat(act.style.getPropertyValue("--sc-p"));
        if (isNaN(p)) p = 0;
        if (p !== lastP) { draw(p); lastP = p; }
        requestAnimationFrame(loop);
      })();
    }
  }

  /* ---------------------------------------------------------------- misc -- */
  doc.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
