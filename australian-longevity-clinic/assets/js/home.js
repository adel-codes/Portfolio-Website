/* Home: mounts the scrollcraft engine and runs the page's own choreography.

   The signature move lives here, not in the engine. Act 1 pins; this file
   reads the act's progress and moves the round, the borer and the core
   between four poses:

     hero      the round at rest on the right, the label over its edge
     aligned   the round recentred; the borer runs bark to pith along the
               measured radius; the core appears exactly on that radius
     drawn     the core slides out past the bark
     laid out  the core spans the page; decades, centuries and notes arrive

   The round's radius along that line is the measured cumulative ring width,
   so the core's ring lines coincide with the round's rings when it appears.
   Only transform and opacity are written. Under reduced motion nothing
   moves: the round fades, the core appears laid out, and the act is shorter. */
(function () {
  "use strict";
  if (!window.ScrollCraft) return;

  var reduce = window.ScrollCraft.reduce;
  var mobileMQ = matchMedia("(max-width: 860px)");
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;

  var act = document.querySelector(".specimen");
  var pan = document.querySelector(".programs");
  // Spans are authored for a desktop at full motion; adjust before mounting.
  if (act && reduce) act.setAttribute("data-sc-span", "2.6");
  if (pan && mobileMQ.matches && !reduce) pan.setAttribute("data-sc-span", "4.4");

  var sc = window.ScrollCraft.mount(document);
  if (!act) return;
  var A = sc.acts.filter(function (a) { return a.el === act; })[0];
  var P = pan ? sc.acts.filter(function (a) { return a.el === pan; })[0] : null;

  var stage = act.querySelector("[data-sc-stage]");
  var round = act.querySelector(".sp-round");
  var far = act.querySelector(".sp-far");
  var label = act.querySelector(".sp-label");
  var borer = act.querySelector(".sp-borer");
  var borerNote = act.querySelector(".sp-borer-note");
  var core = act.querySelector(".sp-core");
  var strip = act.querySelector(".sp-core__strip");
  var head = act.querySelector(".sp-core__head");
  var ticks = act.querySelector(".sp-core__ticks");
  var spanEl = act.querySelector(".sp-core__span");
  var notes = [].slice.call(act.querySelectorAll(".cr-note"));
  var svg = strip.querySelector("svg");
  var fBark = parseFloat(stage.getAttribute("data-bark")) || 0.44;
  round.style.setProperty("--bark", fBark);

  // core.svg viewBox is "-4 0 (L + 22) 64": pith at x = 0, bark at x = L.
  var vb = svg.getAttribute("viewBox").split(/\s+/).map(parseFloat);
  var VB0 = vb[0], VBW = vb[2], L = VBW - 22;

  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var G = null;          // geometry, measured per layout
  function measure() {
    // Measure the authored layout with every transform cleared.
    [round, far, label, strip].forEach(function (el) { el.style.transform = "none"; });
    var s = stage.getBoundingClientRect();
    var r = round.getBoundingClientRect();
    var c = strip.getBoundingClientRect();
    var vw = s.width, vh = s.height, mob = mobileMQ.matches;
    var D0 = r.width;
    var c0 = { x: r.left - s.left + D0 / 2, y: r.top - s.top + D0 / 2 };
    var D1 = mob ? vw * 0.58 : Math.min(vh * 0.66, vw * 0.42);
    var c1 = mob ? { x: vw * 0.31, y: vh * 0.44 } : { x: vw * 0.27, y: vh * 0.56 };
    var R1 = fBark * D1;
    var W = c.width, H = c.height;
    var X0 = W * (0 - VB0) / VBW;                 // pith, px from the strip's left edge
    var len = W * L / VBW;                         // pith to bark, px, laid out
    var sxA = R1 / len;
    var syA = Math.max(9, R1 * 0.034) / H;        // a little thicker than life, so the core reads as an object
    var base = { x: c.left - s.left, y: c.top - s.top + H / 2 };
    var A_ = { tx: c1.x - base.x - X0 * sxA, ty: c1.y - base.y, sx: sxA, sy: syA };
    var B_ = { tx: A_.tx + R1 + vw * 0.035, ty: A_.ty, sx: sxA, sy: syA };
    G = { vw: vw, vh: vh, mob: mob, D0: D0, D1: D1, c0: c0, c1: c1, A: A_, B: B_ };
    last = -1;
  }

  // pointer depth on the hero: three planes, three rates
  var ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine) {
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      ptr.tx = (e.clientX / innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  function poseCore(t, from, to) {
    return {
      tx: lerp(from.tx, to.tx, t), ty: lerp(from.ty, to.ty, t),
      sx: lerp(from.sx, to.sx, t), sy: lerp(from.sy, to.sy, t)
    };
  }
  var FINAL = { tx: 0, ty: 0, sx: 1, sy: 1 };

  var last = -1, lastPtr = "";
  function render(p) {
    if (!G) return;
    var g = G;
    var depth = 1 - seg(p, 0.1, 0.22);                 // pointer weight, hero only
    var px = ptr.x * depth, py = ptr.y * depth;

    if (reduce) {
      var fade = 1 - seg(p, 0.22, 0.38);
      round.style.opacity = fade.toFixed(3);
      far.style.opacity = (0.62 * fade).toFixed(3);
      label.style.opacity = fade.toFixed(3);
      var on = seg(p, 0.34, 0.46);
      strip.style.opacity = on.toFixed(3);
      core.style.setProperty("--dots", seg(p, 0.42, 0.5).toFixed(3));
      [head, ticks, spanEl].concat(notes).forEach(function (el) { el.style.opacity = seg(p, 0.44, 0.54).toFixed(3); });
      stage.setAttribute("data-sc-verify-state", "p=" + p.toFixed(2) + " reduced");
      return;
    }

    // 1. the round: hero pose to the extraction pose, then it falls away
    var tm = ease(seg(p, 0.12, 0.3));
    var s1 = lerp(1, g.D1 / g.D0, tm);
    var dx = lerp(0, g.c1.x - g.c0.x, tm), dy = lerp(0, g.c1.y - g.c0.y, tm);
    var drift = -seg(p, 0, 0.14) * 26;                 // the specimen settles while the headline reads
    var away = ease(seg(p, 0.53, 0.68));
    dx -= away * g.vw * 0.08;
    var rOp = 1 - 0.62 * seg(p, 0.44, 0.54) - 0.38 * away;
    round.style.transform = "translate3d(" + (dx + px * 9).toFixed(1) + "px," + (dy + drift + py * 7).toFixed(1) + "px,0) scale(" + (s1 * (1 - 0.04 * away)).toFixed(4) + ")";
    round.style.opacity = rOp.toFixed(3);

    // far plane: least movement, opposite the pointer
    var farOp = 0.62 * (1 - 0.7 * seg(p, 0.14, 0.32)) * (1 - seg(p, 0.5, 0.64));
    far.style.transform = "translate3d(" + (-px * 14 - tm * g.vw * 0.05).toFixed(1) + "px," + (-py * 10 + drift * 0.5).toFixed(1) + "px,0)";
    far.style.opacity = farOp.toFixed(3);

    // near plane: the label moves most, then leaves first
    var lOut = ease(seg(p, 0.1, 0.22));
    label.style.transform = "translate3d(" + (px * 22).toFixed(1) + "px," + (py * 16 + drift * 1.8 + lOut * 70).toFixed(1) + "px,0)";
    label.style.opacity = (1 - lOut).toFixed(3);

    // 2. the borer: bark to pith, then gone when the core replaces it
    var b = ease(seg(p, 0.28, 0.4));
    borer.style.transform = "scaleX(" + b.toFixed(4) + ")";
    borer.style.opacity = (1 - seg(p, 0.41, 0.44)).toFixed(3);
    borerNote.style.opacity = (seg(p, 0.29, 0.34) * (1 - seg(p, 0.42, 0.47))).toFixed(3);

    // 3. the core: appears on the radius, slides out, is laid out
    var cp;
    if (p < 0.42) cp = g.A;
    else if (p < 0.54) cp = poseCore(ease(seg(p, 0.42, 0.53)), g.A, g.B);
    else cp = poseCore(ease(seg(p, 0.54, 0.68)), g.B, FINAL);
    strip.style.transform = "translate3d(" + cp.tx.toFixed(1) + "px," + cp.ty.toFixed(1) + "px,0) scale(" + cp.sx.toFixed(4) + "," + cp.sy.toFixed(4) + ")";
    strip.style.opacity = seg(p, 0.39, 0.42).toFixed(3);
    // decade lines carry the extraction; the dots arrive once it is laid out
    core.style.setProperty("--dots", seg(p, 0.62, 0.7).toFixed(3));
    head.style.opacity = seg(p, 0.66, 0.71).toFixed(3);
    ticks.style.opacity = seg(p, 0.63, 0.69).toFixed(3);
    spanEl.style.opacity = seg(p, 0.68, 0.72).toFixed(3);
    notes.forEach(function (n, i) { n.style.opacity = seg(p, 0.66 + i * 0.025, 0.7 + i * 0.025).toFixed(3); });

    var phase = p < 0.12 ? "hero" : p < 0.28 ? "recentre" : p < 0.42 ? "bore" : p < 0.54 ? "draw" : p < 0.68 ? "lay" : "read";
    stage.setAttribute("data-sc-verify-state", "p=" + p.toFixed(2) + " " + phase + " borer=" + b.toFixed(2));
  }

  function progress(a) {
    var vh = innerHeight;
    return clamp((scrollY - a.top) / Math.max(a.height - vh, 1), 0, 1);
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

  function frame() {
    ptr.x += (ptr.tx - ptr.x) * 0.08;
    ptr.y += (ptr.ty - ptr.y) * 0.08;
    var p = progress(A);
    var key = p.toFixed(4) + (fine ? ptr.x.toFixed(3) + ptr.y.toFixed(3) : "");
    var live = scrollY < A.top + A.height + innerHeight;
    if (live && key !== lastPtr) { render(p); lastPtr = key; }
    if (P && scrollY > P.top - innerHeight * 1.2 && scrollY < P.top + P.height) settleRail();
    requestAnimationFrame(frame);
  }

  function relayout() { measure(); lastPtr = ""; }
  addEventListener("resize", function () { requestAnimationFrame(relayout); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();
  requestAnimationFrame(frame);
})();
