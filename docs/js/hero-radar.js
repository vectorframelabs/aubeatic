/**
 * hero-radar.js
 * Drives the hero radar visualization. Runs several independent "lanes" so
 * at least 3 discoveries are visible at any given moment \u2014 each lane pulses
 * a node card in, holds it, then picks a new random node. Lanes never pick
 * the same node as another currently-active lane.
 */
(function () {
  function initRadar() {
    var visual = document.querySelector(".hero-visual");
    if (!visual) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var nodes = Array.prototype.slice.call(visual.querySelectorAll(".node-card[data-node]"));
    if (nodes.length === 0) return;

    if (reduceMotion) {
      nodes.forEach(function (n) {
        n.classList.add("is-active");
      });
      return;
    }

    var activeKeys = {};
    var HOLD_MS = 3000;
    var GAP_MIN = 80;
    var GAP_MAX = 300;
    var LANE_COUNT = Math.min(4, nodes.length);

    function pickAvailable() {
      var available = nodes.filter(function (n) {
        return !activeKeys[n.getAttribute("data-node")];
      });
      if (available.length === 0) available = nodes; // all taken; allow overlap rather than stall
      return available[Math.floor(Math.random() * available.length)];
    }

    function runLane(delay) {
      window.setTimeout(function laneStep() {
        var node = pickAvailable();
        var key = node.getAttribute("data-node");

        activeKeys[key] = true;
        node.classList.add("is-active");

        window.setTimeout(function () {
          node.classList.remove("is-active");
          delete activeKeys[key];

          var gap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
          window.setTimeout(laneStep, gap);
        }, HOLD_MS);
      }, delay);
    }

    // Stagger each lane's first discovery so they don't all light up in perfect sync.
    for (var i = 0; i < LANE_COUNT; i++) {
      runLane(400 + i * 550);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRadar);
  } else {
    initRadar();
  }
})();
