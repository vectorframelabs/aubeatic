/**
 * cursor-spotlight.js
 * A very soft, low-opacity radial glow that follows the pointer \u2014 barely
 * noticeable, purely atmospheric. Disabled entirely for touch devices and
 * for people who prefer reduced motion.
 */
(function () {
  function init() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var noHover = window.matchMedia("(hover: none)").matches;
    if (reduceMotion || noHover) return;

    var spot = document.createElement("div");
    spot.className = "cursor-spotlight";
    spot.setAttribute("aria-hidden", "true");
    document.body.appendChild(spot);

    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var ticking = false;

    function apply() {
      spot.style.setProperty("--spot-x", targetX + "px");
      spot.style.setProperty("--spot-y", targetY + "px");
      ticking = false;
    }

    window.addEventListener(
      "mousemove",
      function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!spot.classList.contains("is-active")) spot.classList.add("is-active");
        if (!ticking) {
          window.requestAnimationFrame(apply);
          ticking = true;
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      spot.classList.remove("is-active");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
