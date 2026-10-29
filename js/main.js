/* ===================================================================
   Kavita Jha — Art Showcase · interactions
   Plain JavaScript, no libraries. Everything degrades gracefully:
   if JS is off, the page is still fully readable.
   =================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js"); // tells the CSS it may hide-then-reveal

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- tiny helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* =================================================================
     1. Intro loader  (plays briefly, then lifts; click to skip)
     ================================================================= */
  var loader = $("#loader");
  function dismissLoader() {
    if (loader) loader.classList.add("done");
    var h = $(".hero");
    if (h) h.classList.add("hero-in");   // kick off the hero word reveal
  }
  if (loader) {
    loader.addEventListener("click", dismissLoader);
    setTimeout(dismissLoader, reduce ? 350 : 1900);
  }

  /* =================================================================
     2. Footer year
     ================================================================= */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =================================================================
     3. Build the left journey rail from the chapter sections
     ================================================================= */
  var chapters = $all(".chapter");
  var sections = $all("[data-accent]");      // hero, about, chapters, contact
  var hero = $(".hero");
  var railDots = $("#railDots");
  var railFill = $("#railFill");
  var nowShowing = $("#nowShowing");
  var nowNum = $("#nowNum");
  var nowName = $("#nowName");
  var dotEls = [];

  chapters.forEach(function (sec) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Go to " + sec.dataset.name);
    var label = document.createElement("span");
    label.className = "label";
    label.textContent = sec.dataset.num + ". " + sec.dataset.name;
    li.appendChild(btn);
    li.appendChild(label);
    btn.addEventListener("click", function () {
      sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    railDots.appendChild(li);
    dotEls.push(li);
  });

  // top progress bar (used on small screens where the rail is hidden)
  var topbar = document.createElement("div");
  topbar.id = "topbar";
  document.body.appendChild(topbar);

  // position each rail dot at its real scroll fraction, so the fill
  // line reaches a dot exactly when you reach that chapter.
  function layoutRail() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    chapters.forEach(function (sec, i) {
      var frac = max > 0 ? clamp(sec.offsetTop / max, 0, 1) : 0;
      dotEls[i].style.top = (frac * 100) + "%";
    });
  }

  /* =================================================================
     4. Active section -> morph the accent colour everywhere
        (rail, cursor, numerals, links, even the scrollbar)
     ================================================================= */
  var activeChapterIndex = -1;
  function setActive(el) {
    var accent = el.dataset.accent;
    root.style.setProperty("--accent", accent);

    // chapter indicator
    if (el === hero) {
      nowShowing.classList.remove("show");
    } else {
      nowShowing.classList.add("show");
      nowNum.textContent = el.dataset.num;
      nowName.textContent = el.dataset.name;
    }

    // light up the matching rail dot
    var idx = chapters.indexOf(el);
    if (idx !== activeChapterIndex) {
      dotEls.forEach(function (d) { d.classList.remove("active"); });
      if (idx > -1) dotEls[idx].classList.add("active");
      activeChapterIndex = idx;
    }
  }

  // Only the section crossing the centre band of the screen is "active".
  var centreObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target); });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  sections.forEach(function (s) { centreObserver.observe(s); });

  /* =================================================================
     5. Reveal on scroll
     ================================================================= */
  var revealEls = $all(".chapter-head, .art, .about-photo, .about-text, .contact-inner");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* =================================================================
     5b. Text reveal — split headings/leads into masked words and give
         each word a small stagger, so lines rise in sequence.
         Skipped entirely for reduced-motion (text just shows plainly).
     ================================================================= */
  function splitWords(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {                       // text node
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (p === "") return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var mask = document.createElement("span");
            mask.className = "r-word";
            var inner = document.createElement("span");
            inner.className = "r-word-i";
            inner.textContent = p;
            mask.appendChild(inner);
            frag.appendChild(mask);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.nodeName !== "BR") {
          walk(child);                                    // keep <em>, skip <br>
        }
      });
    })(el);
  }

  function prepReveal(scope, selector) {
    if (!scope) return;
    $all(selector, scope).forEach(function (el) {
      if (el.dataset.split !== "1") { splitWords(el); el.dataset.split = "1"; }
    });
    var step = 0.04;                                      // 40ms between words
    $all(".r-word-i", scope).forEach(function (w, i) {
      w.style.transitionDelay = (Math.min(i, 18) * step).toFixed(3) + "s";
    });
  }

  if (!reduce) {
    $all(".chapter-head").forEach(function (h) {
      prepReveal(h, ".eyebrow, .ch-title, .ch-desc");
    });
    prepReveal($(".about-text"), ".eyebrow, .lede");
    prepReveal($(".contact-inner"), ".eyebrow, .contact-title");
    prepReveal($(".hero-content"), ".hero-eyebrow, .hero-title, .hero-sub");
  }

  /* =================================================================
     6. Scroll-linked work: progress + gentle parallax
     ================================================================= */
  var heroBg = $(".hero-bg");
  var chNums = $all(".ch-num");
  var arts = $all(".art");
  var toTop = $("#toTop");

  // Decorative scroll motion runs on every screen size (it's transform-only
  // and rAF-throttled, so phones stay smooth). On small screens we simply
  // scale the drift down so it stays subtle. Disabled only for reduced-motion.
  var bigScreen = window.matchMedia("(min-width:901px)");
  var allowParallax = !reduce;
  var motionScale = bigScreen.matches ? 1 : 0.6;

  function onScrollFrame() {
    var sy = window.pageYOffset;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    var progress = max > 0 ? clamp(sy / max, 0, 1) : 0;

    // progress indicators
    if (railFill) railFill.style.height = (progress * 100) + "%";
    topbar.style.width = (progress * 100) + "%";
    if (toTop) toTop.classList.toggle("show", sy > vh * 0.8);

    if (!allowParallax) return; // skip decorative motion on phones/tablets & reduced-motion

    // hero background drifts slower than the page (kept within its overscan)
    if (heroBg && sy < vh) {
      var hy = clamp(sy * 0.3, 0, vh * 0.07) * motionScale;
      heroBg.style.transform = "translate3d(0," + hy + "px,0) scale(1.14)";
    }

    // giant chapter numerals drift
    chNums.forEach(function (n) {
      var r = n.getBoundingClientRect();
      var dy = clamp((r.top + r.height / 2 - vh / 2) * -0.06, -60, 60) * motionScale;
      n.style.transform = "translate3d(0," + dy + "px,0)";
    });

    // each artwork shifts a hair against the scroll
    arts.forEach(function (a) {
      var r = a.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return; // skip off-screen
      var speed = parseFloat(a.dataset.speed || "0.06");
      var dy = clamp((r.top + r.height / 2 - vh / 2) * -speed, -55, 55) * motionScale;
      a.style.setProperty("--py", dy.toFixed(1) + "px");
    });
  }

  var ticking = false;
  function requestScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScrollFrame(); ticking = false; });
      ticking = true;
    }
  }
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", function () {
    motionScale = bigScreen.matches ? 1 : 0.6;
    layoutRail(); requestScroll();
  });
  window.addEventListener("load", function () { layoutRail(); requestScroll(); });
  layoutRail();
  onScrollFrame();

  /* =================================================================
     7. Back to top
     ================================================================= */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* =================================================================
     8. Custom cursor (real-mouse devices only)
     ================================================================= */
  if (finePointer) {
    var dot = $("#cursor-dot");
    var ring = $("#cursor-ring");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;     // target
    var rx = mx, ry = my;                                           // ring (eased)

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      if (reduce) {
        ring.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      }
    });

    if (!reduce) {
      (function ringLoop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
        window.requestAnimationFrame(ringLoop);
      })();
    }

    // grow over things you can interact with
    $all("a, button, .art, .rail-dots li, .contact-qr").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        ring.classList.add("is-hover"); dot.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function () {
        ring.classList.remove("is-hover"); dot.classList.remove("is-hover");
      });
    });

    // hide when the pointer leaves the window
    document.addEventListener("mouseleave", function () {
      dot.style.opacity = "0"; ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      dot.style.opacity = ""; ring.style.opacity = "";
    });
  }
})();
