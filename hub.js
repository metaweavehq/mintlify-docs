/*
  The docs home's two rails (index.mdx), in apple.com's behaviour (apple-website-design-skill, galleries.md):
  the priority router autoplays every 6.25s with a timed dot and a pause chip; the topic rail moves by paddles.
  Every driven move glides over one second on easeInOutCubic. Reduced motion: no autoplay, instant moves.
  Mintlify loads this file on every page and renders pages client-side, so it watches for the hub to appear.
*/
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function glide(el, to, done) {
    cancelAnimationFrame(el._aafRaf);
    var from = el.scrollLeft, start = null, ms = reduce ? 0 : 1000;
    el._aafGliding = true;
    el.style.scrollSnapType = "none";
    function step(ts) {
      if (start === null) start = ts;
      var p = ms ? Math.min(1, (ts - start) / ms) : 1;
      el.scrollLeft = from + (to - from) * ease(p);
      if (p < 1) { el._aafRaf = requestAnimationFrame(step); return; }
      el.style.scrollSnapType = "";
      el._aafGliding = false;
      if (done) done();
    }
    el._aafRaf = requestAnimationFrame(step);
  }

  function nearest(track, items) {
    var best = 0, d = Infinity, base = items[0].offsetLeft;
    items.forEach(function (it, i) {
      var x = Math.abs(it.offsetLeft - base - track.scrollLeft);
      if (x < d) { d = x; best = i; }
    });
    return best;
  }

  function slideshow(root) {
    root.setAttribute("data-ready", "");
    var track = root.querySelector(".aaf-router-track");
    var cards = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(root.querySelectorAll(".aaf-dots button"));
    var chip = root.querySelector(".aaf-play");
    var cur = 0, playing = !reduce, timer = null, DURATION = 6250;
    var offset = function (i) { return cards[i].offsetLeft - cards[0].offsetLeft; };

    function mark(i) {
      cur = i;
      dots.forEach(function (d, j) {
        d.setAttribute("aria-selected", j === i ? "true" : "false");
        d.classList.remove("is-timing");
      });
      if (playing) { void dots[i].offsetWidth; dots[i].classList.add("is-timing"); }
    }
    function schedule() {
      clearTimeout(timer);
      if (!playing) return;
      timer = setTimeout(function () {
        if (!root.isConnected) return;
        if (document.hidden) { schedule(); return; }
        go(cur + 1);
      }, DURATION);
    }
    function go(i) {
      i = (i + cards.length) % cards.length;
      mark(i);
      schedule();
      glide(track, offset(i));
    }
    function setPlaying(p) {
      playing = p;
      root.classList.toggle("is-paused", !p);
      chip.setAttribute("aria-label", p ? "Pause" : "Play");
      mark(cur);
      schedule();
    }

    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
    chip.addEventListener("click", function () { setPlaying(!playing); });

    // a swipe or trackpad scroll picks the card it lands on and restarts the clock
    var settle;
    track.addEventListener("scroll", function () {
      if (track._aafGliding) return;
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = nearest(track, cards);
        if (i !== cur) { mark(i); schedule(); }
      }, 140);
    }, { passive: true });
    window.addEventListener("resize", function () { track.scrollLeft = offset(cur); });

    root.classList.toggle("is-paused", !playing);
    if (!playing) chip.setAttribute("aria-label", "Play");
    mark(0);
    schedule();
  }

  function rail(root) {
    root.setAttribute("data-ready", "");
    var list = root.querySelector(".aaf-rail");
    var tiles = Array.prototype.slice.call(list.children);
    var prev = root.querySelector('.aaf-paddle[data-dir="-1"]');
    var next = root.querySelector('.aaf-paddle[data-dir="1"]');

    function update() {
      var max = list.scrollWidth - list.clientWidth;
      root.classList.toggle("aaf-fits", max <= 2);
      prev.disabled = list.scrollLeft <= 2;
      next.disabled = list.scrollLeft >= max - 2;
    }
    function move(dir) {
      var pitch = tiles.length > 1 ? tiles[1].offsetLeft - tiles[0].offsetLeft : list.clientWidth;
      var visible = Math.max(1, Math.floor((list.clientWidth * 0.875 + 20) / pitch));
      var i = Math.max(0, Math.min(tiles.length - 1, nearest(list, tiles) + dir * visible));
      var max = list.scrollWidth - list.clientWidth;
      glide(list, Math.min(max, tiles[i].offsetLeft - tiles[0].offsetLeft), update);
    }
    prev.addEventListener("click", function () { move(-1); });
    next.addEventListener("click", function () { move(1); });
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function scan() {
    var hub = document.querySelector(".aaf-hub");
    if (hub) hub.classList.add("aaf-js");
    document.querySelectorAll("[data-aaf-slideshow]:not([data-ready])").forEach(slideshow);
    document.querySelectorAll("[data-aaf-rail]:not([data-ready])").forEach(rail);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
  new MutationObserver(function () { scan(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
