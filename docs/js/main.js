/**
 * main.js — Aube Research & Analytics
 * Plain vanilla JS, no dependencies, no build step.
 *  1. Mobile menu toggle
 *  2. Footer year
 *  3. Contact form: inline validation + fetch submit to Web3Forms.
 *     Without JavaScript the form still posts normally (plain HTML POST).
 */
(function () {
  var doc = document.documentElement;
  doc.className = doc.className.replace(/\bno-js\b/, "js");

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) setOpen(false);
    });
  }

  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(form) {
    var ok = true;
    form.querySelectorAll(".field").forEach(function (wrap) {
      var input = wrap.querySelector(".field__input, .field__textarea");
      if (!input || !input.hasAttribute("required")) return;
      var v = input.value.trim();
      var bad = v === "" || (input.type === "email" && !EMAIL_RE.test(v));
      wrap.classList.toggle("is-invalid", bad);
      input.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) ok = false;
    });
    return ok;
  }

  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      // JS takes over validation; without JS the browser's native
      // `required` / `type=email` checks still apply.
      form.setAttribute("novalidate", "");

      var status = form.querySelector(".form__status");
      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.textContent : "";
      var okMsg = form.getAttribute("data-success") || "Thanks, your message was sent.";
      var errMsg = form.getAttribute("data-error") || "Sorry, something went wrong. Please try again.";

      function show(kind, msg) {
        if (!status) return;
        status.hidden = false;
        status.className = "form__status form__status--" + kind;
        status.textContent = msg;
        status.focus();
      }

      form.querySelectorAll(".field__input, .field__textarea").forEach(function (input) {
        input.addEventListener("input", function () {
          var wrap = input.closest(".field");
          if (wrap) wrap.classList.remove("is-invalid");
          input.removeAttribute("aria-invalid");
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (status) status.hidden = true;

        // Honeypot: bots tick hidden checkboxes. Drop quietly.
        var trap = form.querySelector('input[name="botcheck"]');
        if (trap && trap.checked) return;

        if (!validate(form)) {
          var first = form.querySelector(".field.is-invalid .field__input, .field.is-invalid .field__textarea");
          if (first) first.focus();
          return;
        }

        if (button) { button.disabled = true; button.textContent = "Sending…"; }

        var data = {};
        new FormData(form).forEach(function (value, key) { data[key] = value; });

        fetch(form.getAttribute("action"), {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (json) {
              if (res.ok && json.success !== false) {
                form.reset();
                show("ok", okMsg);
              } else {
                show("error", errMsg);
              }
            });
          })
          .catch(function () { show("error", errMsg); })
          .then(function () {
            if (button) { button.disabled = false; button.textContent = label; }
          });
      });
    });
  }

  function init() { initNav(); initYear(); initForms(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
