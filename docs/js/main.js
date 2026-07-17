/**
 * main.js
 * Site-wide behaviors: footer year, lightweight form feedback.
 * No backend is wired up — forms show a confirmation state client-side.
 */
(function () {
  function setFooterYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      var liveAction = form.getAttribute("action");
      var successMessage = form.getAttribute("data-success") || "Thanks \u2014 we'll be in touch.";

      form.addEventListener("submit", function (e) {
        e.preventDefault();
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
