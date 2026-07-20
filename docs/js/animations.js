/**
 * animations.js
 * IntersectionObserver-driven scroll reveal with staggered delays,
 * plus a tiny animated-counter helper for stat values.
 */
(function () {
  function initScrollReveal() {
    var groups = document.querySelectorAll("[data-reveal-group]");
    groups.forEach(function (group) {
      var children = group.querySelectorAll("[data-reveal]");
      children.forEach(function (child, i) {
        child.style.transitionDelay = Math.min(i * 70, 420) + "ms";
      });
    });

    var targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach(function (t) {
        t.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (t) {
      observer.observe(t);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollReveal);
  } else {
    initScrollReveal();
  }
})();
