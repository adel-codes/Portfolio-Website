/* Home: mounts the scrollcraft engine and runs the page's own behaviour.

   The signature move lives here, not in the engine: your goal, routed.
   Every goal control on the page (the hero, the programs rail, the route
   act) routes to the same goal. In the pinned route act, scrolling walks the
   four goals in turn and each panel's rows rise as the act advances; choosing
   a goal jumps to its panel and sets the program in the assessment form, so
   the close opens on the visitor's own goal.

   The route measures its panels before it pins. When a whole panel fits the
   screen it is shown whole ("full"). When it doesn't, the panel is split: the
   checks first, then the rule and the re-test in their place ("split"). When
   even half won't fit, or motion is reduced, nothing pins and every panel is
   shown in order ("static"). Only transform and opacity are animated. */
(function () {
  "use strict";
  if (!window.ScrollCraft) return;

  var reduce = window.ScrollCraft.reduce;
  var mobileMQ = matchMedia("(max-width: 860px)");
  var touch = matchMedia("(hover: none)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;

  var hero = document.querySelector(".hero");
  var pan = document.querySelector(".programs");
  var routeAct = document.querySelector(".route-act");

  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  function progress(a) { return clamp((scrollY - a.top) / Math.max(a.height - innerHeight, 1), 0, 1); }

  // ------------------------------------------------------------ the goals --
  var panels = routeAct ? [].slice.call(routeAct.querySelectorAll(".route")) : [];
  var keys = panels.map(function (el) { return el.getAttribute("data-goal"); });
  var stage = routeAct && routeAct.querySelector("[data-sc-stage]");
  var chosenOut = routeAct && routeAct.querySelector("[data-chosen]");
  var routeLinks = routeAct ? [].slice.call(routeAct.querySelectorAll(".goals--route [data-goal]")) : [];
  var grid = routeAct && routeAct.querySelector(".route-act__grid");
  var routeHead = routeAct && routeAct.querySelector(".route-act__head");
  var routeNav = routeAct && routeAct.querySelector(".goals--route");
  var name = function (k) { var el = document.getElementById("route-" + k + "-h"); return el ? el.textContent : k; };

  // Segments of the pinned act: a short lead-in, then one quarter per goal.
  var N = panels.length || 1, S0 = 0.03, SEG = (1 - 2 * S0) / N;

  function choose(k) {
    if (window.ALCIntake) window.ALCIntake.setProgram(k);
    if (chosenOut) chosenOut.textContent = "Your assessment is set to: " + name(k);
  }
  function goTo(k) {
    var i = keys.indexOf(k);
    if (i < 0) return;
    if (mode !== "static" && RA) {
      // Land where the checks are all up: whole panels near their end, split
      // ones just before the rule takes the checks' place.
      var p = S0 + i * SEG + SEG * (mode === "split" ? 0.45 : 0.8);
      var y = RA.top + p * Math.max(RA.height - innerHeight, 1);
      window.scrollTo({ top: y, behavior: reduce ? "instant" : "smooth" });
    } else {
      panels[i].scrollIntoView({ block: "start", behavior: reduce ? "instant" : "smooth" });
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-goal]");
    if (!a) return;
    var k = a.getAttribute("data-goal");
    if (keys.indexOf(k) < 0) return;
    e.preventDefault();
    choose(k);
    goTo(k);
    if (history.replaceState) history.replaceState(null, "", "#route-" + k);
  });

  // ------------------------------------------------------ the route's mode --
  var SPAN = { full: 4.6, split: 5.6 };
  var mode = "static", stacked = false;
  var current = -1, lastKey = "";

  // Lay the act out as scripted, read what the tallest panel needs, then put
  // the classes back. Runs before the engine mounts, and again once the real
  // fonts are in or the screen changes shape.
  function measure() {
    if (!routeAct || !grid || !routeHead) return "static";
    var cls = routeAct.className;
    routeAct.classList.add("is-scripted");
    routeAct.classList.remove("is-phased", "is-static");
    var gs = getComputedStyle(grid);
    stacked = gs.gridTemplateColumns.trim().split(/\s+/).length < 2;
    var room = innerHeight - (parseFloat(gs.paddingTop) || 0) - 24;
    var headH = routeHead.offsetHeight;
    var whole = 0, half = 0;
    panels.forEach(function (el) {
      var gap = parseFloat(getComputedStyle(el).rowGap) || 0;
      var h = el.querySelector(".route__head").offsetHeight;
      var c = el.querySelector(".route__block--check").offsetHeight;
      var a = el.querySelector(".route__after").offsetHeight;
      whole = Math.max(whole, h + c + a + 2 * gap);
      half = Math.max(half, h + gap + Math.max(c, a));
    });
    routeAct.className = cls;
    if (reduce) return "static";
    if (stacked) room -= headH + (parseFloat(gs.rowGap) || 0);
    else if (headH > room) return "static";
    return whole <= room ? "full" : half <= room ? "split" : "static";
  }

  function apply(m) {
    mode = m;
    var pinned = m !== "static";
    routeAct.classList.toggle("is-scripted", pinned);
    routeAct.classList.toggle("is-phased", m === "split");
    routeAct.classList.toggle("is-static", !pinned);
    panels.forEach(function (el) { el.classList.remove("is-active", "is-later"); });
    if (pinned) {
      routeAct.setAttribute("data-sc-act", "pin");
      routeAct.setAttribute("data-sc-span", String(SPAN[m]));
    } else {
      // Undo what a pinned mount leaves on the act.
      routeAct.setAttribute("data-sc-act", "flow");
      routeAct.removeAttribute("data-sc-span");
      routeAct.style.height = "";
      routeAct.classList.remove("sc-act--pinned");
      if (stage) stage.classList.remove("sc-stage");
    }
    if (stage) stage.setAttribute("data-sc-verify-state", "route " + m);
    current = -1; lastKey = "";
  }

  // ------------------------------------------------------- the route act --
  // Static: nothing pins, so the goal of the panel filling the upper part of
  // the screen, below the sticky goals row on a phone, is lit.
  function renderStatic() {
    var top = stacked && routeNav ? routeNav.getBoundingClientRect().bottom : 0;
    var line = top + (innerHeight - top) * 0.3;
    var i = -1;
    panels.forEach(function (el, j) { if (el.getBoundingClientRect().top <= line) i = j; });
    if (i === current) return;
    current = i;
    var lit = null;
    routeLinks.forEach(function (a) {
      var on = i >= 0 && a.getAttribute("data-goal") === keys[i];
      a.setAttribute("aria-current", on ? "true" : "false");
      if (on) lit = a;
    });
    // On a phone the row scrolls sideways; keep the lit goal in it. Set
    // directly: a second smooth scroll would cut short the page's own.
    if (lit && stacked && routeNav.scrollWidth > routeNav.clientWidth) {
      routeNav.scrollLeft = Math.max(lit.offsetLeft - 16, 0);
    }
  }

  function renderRoute() {
    if (!RA) return;
    if (mode === "static") { renderStatic(); return; }
    var split = mode === "split";
    var p = progress(RA);
    var i = clamp(Math.floor((p - S0) / SEG), 0, N - 1);
    var q = clamp((p - S0 - i * SEG) / SEG, 0, 1);
    var key = i + ":" + q.toFixed(3);
    if (key === lastKey) return;
    lastKey = key;
    if (i !== current) {
      // A panel that is left resets, so nothing in it stays visible (or in
      // the way of a tap) behind the next one, and its rows rise again on
      // the way back.
      panels.forEach(function (el, j) {
        el.classList.toggle("is-active", j === i);
        if (j === i) return;
        el.classList.remove("is-later");
        [].forEach.call(el.querySelectorAll(".is-on"), function (x) { x.classList.remove("is-on"); });
      });
      routeLinks.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("data-goal") === keys[i] ? "true" : "false"); });
      current = i;
    }
    var panel = panels[i];
    var step = split ? 0.06 : 0.075;
    [].forEach.call(panel.querySelectorAll(".route__tests li"), function (li, j) { li.classList.toggle("is-on", q > 0.02 + j * step); });
    var later = split && q > 0.52;
    panel.classList.toggle("is-later", later);
    var rule = panel.querySelector(".route__block--rule"), again = panel.querySelector(".route__block--again"), go = panel.querySelector(".route__go");
    if (rule) rule.classList.toggle("is-on", q > (split ? 0.56 : 0.48));
    if (again) again.classList.toggle("is-on", q > (split ? 0.64 : 0.6));
    if (go) go.classList.toggle("is-on", q > (split ? 0.72 : 0.7));
    stage.setAttribute("data-sc-verify-state", "route " + mode + " goal=" + keys[i] + " q=" + q.toFixed(2) + (split ? (later ? " showing=rule" : " showing=checks") : ""));
  }

  // --------------------------------------------------------- the hero slip --
  var slip = hero && hero.querySelector(".slip");
  var slipGoal = slip && slip.querySelector("[data-slip-goal]");
  var slipTests = slip && slip.querySelector("[data-slip-tests]");
  var slipKey = "testosterone", slipTimer = 0;
  function showSlip(k) {
    if (!slip || k === slipKey || keys.indexOf(k) < 0) return;
    slipKey = k;
    var names = [].map.call(document.querySelectorAll("#route-" + k + " .route__tests b"), function (b) { return b.textContent; });
    slip.classList.add("is-swapping");
    clearTimeout(slipTimer);
    slipTimer = setTimeout(function () {
      slipGoal.textContent = name(k);
      slipTests.innerHTML = "";
      names.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; slipTests.appendChild(li); });
      slip.classList.remove("is-swapping");
    }, reduce ? 0 : 170);
  }
  if (hero) {
    [].forEach.call(hero.querySelectorAll(".goals--hero [data-goal]"), function (a) {
      var k = a.getAttribute("data-goal");
      a.addEventListener("pointerenter", function () { showSlip(k); });
      a.addEventListener("focus", function () { showSlip(k); });
    });
  }

  // ------------------------------------------------------- pointer depth --
  var ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine && hero) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      ptr.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
      ptr.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
    });
    hero.addEventListener("pointerleave", function () { ptr.tx = 0; ptr.ty = 0; });
  }
  function renderDepth() {
    if (!fine || !hero) return;
    if (scrollY > hero.offsetHeight) return;
    ptr.x += (ptr.tx - ptr.x) * 0.08;
    ptr.y += (ptr.ty - ptr.y) * 0.08;
    hero.style.setProperty("--dx", ptr.x.toFixed(3));
    hero.style.setProperty("--dy", ptr.y.toFixed(3));
  }

  // ----------------------------------------------------------- the rail --
  var rail = pan && pan.querySelector("[data-sc-pan]");
  var items = rail ? [].slice.call(rail.children).slice(1) : [];
  function settleRail() {
    if (!rail || reduce) return;
    var vw = innerWidth;
    items.forEach(function (it) {
      var x = it.getBoundingClientRect().left;
      var t = clamp((vw - x) / (vw * 0.42), 0, 1);
      it.style.setProperty("--in", (0.55 + 0.45 * t).toFixed(3));
    });
  }
  // Keyboard focus inside the rail scrolls the page so the focused plate is
  // in view; the rail's transform is the only way to reach it.
  if (rail && P) {
    rail.addEventListener("focusin", function (e) {
      var item = e.target.closest(".rail > *");
      if (!item || reduce) return;
      var over = rail.scrollWidth - innerWidth;
      if (over <= 0) return;
      var total = over * (1 + (P.railExtra || 0));
      var want = clamp((item.offsetLeft + item.offsetWidth / 2 - innerWidth / 2) / total, 0, 1);
      var y = P.top + want * Math.max(P.height - innerHeight, 1);
      var r = item.getBoundingClientRect();
      if (r.left < 0 || r.right > innerWidth) window.scrollTo({ top: y, behavior: "instant" });
    });
  }

  // ------------------------------------------------------------- mounting --
  var sc = null, P = null, RA = null;
  var actOf = function (el) { return el && sc ? sc.acts.filter(function (a) { return a.el === el; })[0] : null; };
  var panSpan = function () { return mobileMQ.matches && !reduce ? "4.4" : "3.2"; };
  function mount() {
    if (sc) sc.destroy();
    if (pan) pan.setAttribute("data-sc-span", panSpan());
    sc = window.ScrollCraft.mount(document);
    P = actOf(pan); RA = actOf(routeAct);
    renderRoute();
  }
  // Re-mount only when the route's mode or the rail's length has to change,
  // and hold the reader's place in whichever act they were in.
  function recheck() {
    var m = routeAct ? measure() : mode;
    if (m === mode && (!pan || pan.getAttribute("data-sc-span") === panSpan())) return;
    var at = null;
    sc.acts.some(function (a) {
      if (scrollY < a.top + a.height) { at = { el: a.el, f: clamp((scrollY - a.top) / Math.max(a.height, 1), 0, 1) }; return true; }
      return false;
    });
    if (routeAct) apply(m);
    mount();
    var a = at && actOf(at.el);
    if (a) window.scrollTo({ top: a.top + at.f * a.height, behavior: "instant" });
  }

  if (routeAct) apply(measure());
  mount();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(recheck);
  var lastW = innerWidth, lastH = innerHeight, rz = 0;
  addEventListener("resize", function () {
    clearTimeout(rz);
    rz = setTimeout(function () {
      // A phone's URL bar changes the height and not the width. That is not
      // a new screen, and re-laying out under the reader's thumb jumps.
      if (innerWidth === lastW && (touch || Math.abs(innerHeight - lastH) < 40)) return;
      lastW = innerWidth; lastH = innerHeight;
      recheck();
    }, 180);
  }, { passive: true });

  function frame() {
    renderDepth();
    if (RA && scrollY > RA.top - innerHeight * 1.25 && scrollY < RA.top + RA.height) renderRoute();
    if (P && scrollY > P.top - innerHeight * 1.2 && scrollY < P.top + P.height) settleRail();
    requestAnimationFrame(frame);
  }

  // A link straight to a goal (#route-weight) lands on it once the act exists.
  if (/^#route-/.test(location.hash)) {
    var k0 = location.hash.slice(7);
    if (keys.indexOf(k0) >= 0) requestAnimationFrame(function () { goTo(k0); });
  }
  requestAnimationFrame(frame);
})();
