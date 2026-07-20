/**
 * main.js
 * Site-wide behaviors: footer year, FAQ accordion, and form handling \u2014
 * client-side validation, a honeypot spam check, then a fetch-based submit
 * with success/error states and no page reload.
 */
(function () {
  function setFooterYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function validateForm(form) {
    var valid = true;
    var fields = form.querySelectorAll(".field");
    fields.forEach(function (fieldWrap) {
      var input = fieldWrap.querySelector(".field__input, .field__textarea");
      if (!input || !input.hasAttribute("required")) {
        fieldWrap.classList.remove("is-invalid");
        return;
      }
      var isEmpty = input.value.trim() === "";
      var isBadEmail = input.type === "email" && input.value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      var invalid = isEmpty || isBadEmail;
      fieldWrap.classList.toggle("is-invalid", invalid);
      if (invalid) valid = false;
    });
    return valid;
  }

  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      var liveAction = form.getAttribute("action");
      var successMessage = form.getAttribute("data-success") || "Thanks \u2014 we'll be in touch.";
      var honeypot = form.querySelector(".form-honeypot");

      // Clear the invalid state as soon as the visitor fixes a field.
      form.querySelectorAll(".field__input, .field__textarea").forEach(function (input) {
        input.addEventListener("input", function () {
          var fieldWrap = input.closest(".field");
          if (fieldWrap) fieldWrap.classList.remove("is-invalid");
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Honeypot: if a bot filled this hidden field, silently drop the submission.
        if (honeypot && honeypot.value.trim() !== "") {
          return;
        }

        if (!validateForm(form)) {
          var firstInvalid = form.querySelector(".field.is-invalid .field__input, .field.is-invalid .field__textarea");
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        var button = form.querySelector('button[type="submit"]');
        var original = button ? button.textContent : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Sending\u2026";
        }

        function showSuccess() {
          var wrap = form.closest("[data-form-wrap]") || form.parentElement;
          var successEl = document.createElement("div");
          successEl.className = form.className + " form-success";
          successEl.setAttribute("role", "status");
          successEl.innerHTML =
            '<div class="icon-badge icon-badge--lg" style="margin-bottom:1.25rem;">' +
            (window.AubeIcons ? window.AubeIcons.iconMarkup("check-circle-2") : "") +
            "</div><p>" + successMessage + "</p>";
          form.replaceWith(successEl);
        }

        function showError() {
          if (button) {
            button.disabled = false;
            button.textContent = original;
          }
          var existing = form.querySelector(".form-error");
          if (existing) existing.remove();
          var errEl = document.createElement("p");
          errEl.className = "form-error";
          errEl.textContent = "Something went wrong sending your message \u2014 please try again or email hello@auberesearch.com directly.";
          form.appendChild(errEl);
        }

        if (liveAction) {
          fetch(liveAction, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          })
            .then(function (res) {
              if (res.ok) {
                showSuccess();
              } else {
                showError();
              }
            })
            .catch(showError);
        } else {
          // Demo-only form (no live backend, e.g. login) — simulate confirmation.
          setTimeout(function () {
            if (button) {
              button.textContent = original;
              button.disabled = false;
            }
            form.reset();
          }, 1400);
        }
      });
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item__trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".faq-item");
        var isOpen = item.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  function init() {
    setFooterYear();
    initForms();
    initFaq();
    if (window.AubeIcons) window.AubeIcons.hydrateIcons(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
