/**
 * carousel.js
 * Powers the horizontal "Who We Help" carousel:
 *   - drag-to-scroll with the mouse
 *   - prev/next arrow buttons
 *   - slow continuous left-to-right autoplay that pauses on hover/drag
 *   - a soft blur on cards near the left/right edges, to match the mask fade
 *
 * True infinite loop: the track markup contains the card set twice back to
 * back (the second copy is aria-hidden). "setWidth" is exactly half of the
 * track's scrollWidth. Whenever the scroll position would cross into or past
 * the duplicate copy, we silently subtract (or add) setWidth \u2014 since the
 * two copies are pixel-identical, the wrap is invisible. This keeps drag,
 * arrows, and autoplay all wrapping seamlessly, in either direction,
 * indefinitely.
 *
 * Touch devices get native momentum scrolling for free via overflow-x:auto.
 */
(function () {
  function initCarousel(wrap) {
    var track = wrap.querySelector(".carousel");
    if (!track) return;
    var innerTrack = track.querySelector("[data-loop-track]");

    var prevBtn = wrap.querySelector(".carousel__arrow--prev");
    var nextBtn = wrap.querySelector(".carousel__arrow--next");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setWidth() {
      return innerTrack ? innerTrack.scrollWidth / 2 : track.scrollWidth / 2;
    }

    // Start at the beginning of the (visually identical) second copy's
    // predecessor position isn't needed \u2014 start at 0, which is set 1.
    function wrap_position(pos) {
      var w = setWidth();
      if (w <= 0) return pos;
      while (pos >= w) pos -= w;
      while (pos < 0) pos += w;
      return pos;
    }

    // --- Drag to scroll ---
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;

    track.addEventListener("mousedown", function (e) {
      isDown = true;
      moved = false;
      track.classList.add("is-dragging");
      startX = e.pageX;
      startScroll = track.scrollLeft;
      pauseAutoplay();
    });

    window.addEventListener("mouseup", function () {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("is-dragging");
      var wrapped = wrap_position(track.scrollLeft);
      if (wrapped !== track.scrollLeft) track.scrollLeft = wrapped;
      scrollPos = track.scrollLeft;
      scheduleAutoplayResume();
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var delta = e.pageX - startX;
      if (Math.abs(delta) > 4) moved = true;
      track.scrollLeft = startScroll - delta;
    });

    // Prevent link/flip click-through immediately after a drag gesture.
    track.addEventListener(
      "click",
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    // --- Arrow buttons ---
    function step() {
      var item = track.querySelector(".carousel__item");
      var itemWidth = item ? item.getBoundingClientRect().width + 20 : 280;
      return itemWidth * 2;
    }

    function scrollByWrapped(delta) {
      pauseAutoplay();
      var target = wrap_position(track.scrollLeft + delta);
      // If wrapping backward past 0 or forward past the set width, jump the
      // underlying (invisible) position first, then smooth-scroll the small
      // remaining distance so the motion still feels continuous.
      track.scrollBy({ left: delta, behavior: "smooth" });
      window.setTimeout(function () {
        track.scrollLeft = wrap_position(track.scrollLeft);
        scrollPos = track.scrollLeft;
      }, 420);
      scheduleAutoplayResume();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollByWrapped(-step());
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollByWrapped(step());
      });
    }

    // --- Edge blur: cards near the left/right edge of the visible track blur slightly ---
    var items = Array.prototype.slice.call(track.querySelectorAll(".carousel__item"));
    var blurTicking = false;
    function applyEdgeBlur() {
      var trackRect = track.getBoundingClientRect();
      var fadeZone = trackRect.width * 0.16;
      items.forEach(function (item) {
        var r = item.getBoundingClientRect();
        var distLeft = r.left - trackRect.left;
        var distRight = trackRect.right - r.right;
        var dist = Math.min(distLeft, distRight);
        var blur = 0;
        if (dist < fadeZone) {
          blur = Math.min(3, (1 - Math.max(dist, 0) / fadeZone) * 3);
        }
        item.style.filter = blur > 0.05 ? "blur(" + blur.toFixed(2) + "px)" : "";
      });
      blurTicking = false;
    }
    function requestEdgeBlur() {
      if (blurTicking) return;
      blurTicking = true;
      window.requestAnimationFrame(applyEdgeBlur);
    }
    track.addEventListener("scroll", requestEdgeBlur, { passive: true });
    window.addEventListener("resize", requestEdgeBlur);
    requestEdgeBlur();

    // --- Slow autoplay, continuous left-to-right, seamless infinite wrap ---
    if (reduceMotion) return;

    var AUTOPLAY_SPEED = 0.5; // px per frame, deliberately slow
    var autoplayRAF = null;
    var paused = false;
    var resumeTimer = null;
    var scrollPos = track.scrollLeft;

    function autoplayStep() {
      if (!paused) {
        var w = setWidth();
        if (w > 0) {
          scrollPos += AUTOPLAY_SPEED;
          if (scrollPos >= w) scrollPos -= w; // seamless: identical duplicate content
          track.scrollLeft = scrollPos;
        }
      } else {
        scrollPos = track.scrollLeft;
      }
      autoplayRAF = window.requestAnimationFrame(autoplayStep);
    }

    function pauseAutoplay() {
      paused = true;
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }
    function scheduleAutoplayResume() {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        scrollPos = wrap_position(track.scrollLeft);
        track.scrollLeft = scrollPos;
        paused = false;
      }, 1600);
    }

    wrap.addEventListener("mouseenter", pauseAutoplay);
    wrap.addEventListener("mouseleave", scheduleAutoplayResume);
    wrap.addEventListener(
      "touchstart",
      function () {
        pauseAutoplay();
      },
      { passive: true }
    );
    wrap.addEventListener("touchend", scheduleAutoplayResume);

    autoplayRAF = window.requestAnimationFrame(autoplayStep);
  }

  function init() {
    document.querySelectorAll(".carousel-wrap").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
