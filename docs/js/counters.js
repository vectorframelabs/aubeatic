/**
 * counters.js
 * Animated stat counters, SSR-safe: the server renders the true final value
 * directly in the markup (crawlers, link previews, and no-JS visitors see
 * the real number). This script is purely progressive enhancement \u2014 on
 * load it captures each element's real value, visually resets to 0, and
 * animates back up. If this script never runs, nothing is lost.
 *
 * Also drives the "Judgment" glitch word, which replays each time the hero
 * title enters the viewport (and periodically while it stays in view).
 */
(function () {
  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count-to"), 10);
    var prefix = el.getAttribute("data-count-prefix") || "";
    var suffix = el.getAttribute("data-count-suffix") || "";
    if (isNaN(target)) return;

    // Respect reduced-motion: leave the server-rendered real value as-is.
    if (reduceMotion) return;

    if (el._countRAF) window.cancelAnimationFrame(el._countRAF);

    var duration = 1500;
    var start = null;
    el.classList.add("is-counting");
    el.textContent = prefix + "0" + suffix; // JS-only reset, never in the SSR markup

    function step(timestamp) {
      if (start === null) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutQuint(progress);
      var value = target * eased;
      el.textContent = prefix + formatNumber(value) + suffix;

      if (progress < 1) {
        el._countRAF = window.requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatNumber(target) + suffix;
        el.classList.remove("is-counting");
      }
    }

    el._countRAF = window.requestAnimationFrame(step);
  }

  function replayGlitch(word) {
    if (reduceMotion) return;
    word.classList.remove("is-active");
    // Force reflow so the animation restarts even though the class name is unchanged.
    void word.offsetWidth;
    word.classList.add("is-active");
  }

  function initReplayOnScroll() {
    if (!("IntersectionObserver" in window)) {
      // No IO support: just run everything once immediately.
      document.querySelectorAll("[data-count-to]").forEach(animateCounter);
      var w = document.querySelector(".glitch-word");
      if (w) replayGlitch(w);
      return;
    }

    var metricTargets = document.querySelectorAll("[data-count-to]");
    var glitchWord = document.querySelector(".glitch-word");
    var heroTitle = document.querySelector(".hero__title");

    if (metricTargets.length) {
      var metricsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      metricTargets.forEach(function (t) {
        metricsObserver.observe(t);
      });
    }

    if (glitchWord && heroTitle) {
      var wasVisible = false;
      var glitchInterval = null;
      var REPEAT_MS = 4200;

      var titleObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !wasVisible) {
              replayGlitch(glitchWord);
              if (glitchInterval) window.clearInterval(glitchInterval);
              glitchInterval = window.setInterval(function () {
                replayGlitch(glitchWord);
              }, REPEAT_MS);
            } else if (!entry.isIntersecting && wasVisible) {
              if (glitchInterval) {
                window.clearInterval(glitchInterval);
                glitchInterval = null;
              }
            }
            wasVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.5 }
      );
      titleObserver.observe(heroTitle);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReplayOnScroll);
  } else {
    initReplayOnScroll();
  }
})();
