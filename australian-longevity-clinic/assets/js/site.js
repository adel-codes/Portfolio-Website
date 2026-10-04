/* Australian Longevity Clinic — site behaviour
   Deliberately small: masthead condensing, mobile navigation, current-page
   marking, gentle reveal on scroll, and the enquiry form. No dependencies. */
(function () {
  "use strict";

  var doc = document;
  var html = doc.documentElement;
  html.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Masthead: condense once the page has moved. */
  var masthead = doc.querySelector(".masthead");
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile navigation. */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      doc.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    var desktop = window.matchMedia("(min-width: 980px)");
    var onChange = function (e) {
      if (e.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else desktop.addListener(onChange);
  }

  /* Mark the current page in the primary navigation. */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  doc.querySelectorAll(".nav a").forEach(function (a) {
    var raw = a.getAttribute("href") || "";
    if (raw.indexOf("#") !== -1) return; /* anchor links are never "current" */
    if (raw.toLowerCase() === here) a.setAttribute("aria-current", "page");
  });

  /* Reveal on scroll — subtle, once, and skipped when motion is reduced. */
  var revealables = doc.querySelectorAll(".reveal");
  if (revealables.length) {
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
      );
      revealables.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* "On this page" — highlight the section in view. */
  var asideLinks = doc.querySelectorAll(".article__aside a[href^='#']");
  if (asideLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    asideLinks.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var sections = Object.keys(byId)
      .map(function (id) {
        return doc.getElementById(id);
      })
      .filter(Boolean);
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            asideLinks.forEach(function (a) {
              a.classList.remove("is-active");
            });
            byId[entry.target.id].classList.add("is-active");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* Footer year. */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Enquiry form.
     If data-endpoint is set on the form, the enquiry is POSTed there as JSON
     (for a form service or the clinic's own handler). Without an endpoint it
     falls back to opening the visitor's email app with the enquiry drafted to
     reception, so the page is useful before anything is wired up. */
  var form = doc.getElementById("enquiry-form");
  if (form) {
    var status = doc.getElementById("form-status");
    var say = function (msg) {
      if (!status) return;
      status.hidden = false;
      status.textContent = msg;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = {};
      new FormData(form).forEach(function (v, k) {
        data[k] = v;
      });
      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        say("Sending your enquiry…");
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        })
          .then(function (r) {
            if (!r.ok) throw new Error("Request failed");
            form.reset();
            say("Thank you. Reception will be in touch within one business day.");
          })
          .catch(function () {
            say("We couldn't send that just now. Please email reception@australianlongevityclinic.com.au and we will come back to you.");
          });
        return;
      }
      var to = form.getAttribute("data-mailto") || "reception@australianlongevityclinic.com.au";
      var subject = "Consultation enquiry — " + (data.interest || "General");
      var lines = [
        "Name: " + (data.name || ""),
        "Email: " + (data.email || ""),
        "Phone: " + (data.phone || ""),
        "Interest: " + (data.interest || ""),
        "",
        data.message || ""
      ];
      window.location.href =
        "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      say("Your email app should now open with your enquiry addressed to reception. If it doesn't, email reception@australianlongevityclinic.com.au directly.");
    });
  }
})();
