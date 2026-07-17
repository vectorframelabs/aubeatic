/**
 * navbar.js
 * Desktop dropdown menus (hover/focus), mobile menu toggle, and active-link highlighting.
 */
(function () {
  function initNavbar() {
    var navbar = document.querySelector(".navbar");
    if (!navbar) return;

    var navItems = navbar.querySelectorAll(".nav-item");

    function closeAll() {
      navItems.forEach(function (item) {
        item.classList.remove("is-open");
      });
    }

    navItems.forEach(function (item) {
      if (!item.querySelector(".nav-dropdown")) return;

      item.addEventListener("mouseenter", function () {
        closeAll();
        item.classList.add("is-open");
      });
      item.addEventListener("focusin", function () {
        closeAll();
        item.classList.add("is-open");
      });
    });

    var nav = navbar.querySelector(".navbar__links");
    if (nav) {
      nav.addEventListener("mouseleave", closeAll);
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });

    // Mobile toggle
    var toggle = navbar.querySelector(".navbar__toggle");
    var menuIcon = navbar.querySelector('[data-toggle-icon="menu"]');
    var closeIcon = navbar.querySelector('[data-toggle-icon="close"]');
    if (toggle) {
      toggle.addEventListener("click", function () {
        var isOpen = navbar.classList.toggle("is-mobile-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (menuIcon && closeIcon) {
          menuIcon.style.display = isOpen ? "none" : "";
          closeIcon.style.display = isOpen ? "" : "none";
        }
      });
    }

    // Close mobile menu on link click
    navbar.querySelectorAll(".navbar__mobile-link, .navbar__mobile-cta").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("is-mobile-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (menuIcon && closeIcon) {
          menuIcon.style.display = "";
          closeIcon.style.display = "none";
        }
      });
    });

    // Active link highlighting based on current path
    var path = window.location.pathname.replace(/\/index\.html$/, "/");
    navbar.querySelectorAll("a[href]").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      var resolved = new URL(href, window.location.href).pathname.replace(/\/index\.html$/, "/");
      if (resolved === path) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavbar);
  } else {
    initNavbar();
  }
})();
