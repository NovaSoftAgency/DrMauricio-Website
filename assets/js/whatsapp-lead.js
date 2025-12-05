(function () {
  "use strict";

  // ===== Config =====
  var HUBSPOT_PORTAL_ID = "50731811";
  var HUBSPOT_REGION = "na1";

  var FORMS = {
    HA_NL: {
      formId: "3f0019ad-1cb8-4556-ac67-dd468c613aee",
      label: "Hospital Ángeles - San Pedro Garza García, NL",
    },
    CEON_TMPS: {
      formId: "e9b5c874-d607-48f0-9de2-6c1625e5a570",
      label: "Clínica CEON - Tampico, TMPS",
    },
  };

  var WA_PREFILL = "Hola Dr. Mauricio, me interesa recibir más información";
  var WA_DIRECT_URL =
    "https://wa.me/528331407976?text=" + encodeURIComponent(WA_PREFILL);

  function $(sel, el) {
    return (el || document).querySelector(sel);
  }

  function injectOnce(id, fn) {
    if (document.getElementById(id)) return;
    fn();
  }

  // ===== Network hints =====
  injectOnce("waLeadNetworkHints", function () {
    var holder = document.createElement("div");
    holder.id = "waLeadNetworkHints";
    holder.style.display = "none";
    holder.innerHTML =
      '<link rel="preconnect" href="https://js.hsforms.net" crossorigin>' +
      '<link rel="preconnect" href="https://forms.hsforms.com" crossorigin>' +
      '<link rel="dns-prefetch" href="//js.hsforms.net">' +
      '<link rel="dns-prefetch" href="//forms.hsforms.com">';
    document.head.appendChild(holder);
  });

  // ===== Styles =====
  injectOnce("waLeadStyles", function () {
    var style = document.createElement("style");
    style.id = "waLeadStyles";
    style.textContent =
      "#waLeadBtn.wa-lead-fab{" +
      "position:fixed;right:18px;bottom:18px;z-index:999998;" +
      "width:64px;height:64px;border:0;cursor:pointer;border-radius:999px;" +
      "display:flex;align-items:center;justify-content:center;" +
      "box-shadow:0 10px 28px rgba(0,0,0,.22);background:#25D366;" +
      "}" +
      "#waLeadBtn.wa-lead-fab:hover{filter:brightness(.97)}" +
      "#waLeadBtn.wa-lead-fab svg{width:30px;height:30px;display:block}" +
      "#waLeadOverlay{" +
      "position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;" +
      "align-items:center;justify-content:center;" +
      "padding:16px;" +
      "padding-top:calc(16px + env(safe-area-inset-top, 0px));" +
      "padding-bottom:calc(16px + env(safe-area-inset-bottom, 0px));" +
      "z-index:999999;" +
      "}" +
      "#waLeadOverlay.is-open{display:flex}" +
      "#waLeadPanel{" +
      "width:min(560px,100%);background:#fff;border-radius:16px;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.25);overflow:hidden;" +
      "max-height:calc(100dvh - 32px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));" +
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;" +
      "}" +
      "#waLeadHead{" +
      "position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;" +
      "padding:14px 16px;border-bottom:1px solid rgba(0,0,0,.08);background:#fff;z-index:1;" +
      "}" +
      "#waLeadHead h2{margin:0;font-size:18px;line-height:1.2}" +
      "#waLeadClose{" +
      "border:0;background:transparent;font-size:22px;cursor:pointer;line-height:1;" +
      "padding:8px 10px;border-radius:10px;" +
      "}" +
      "#waLeadClose:hover{background:rgba(0,0,0,.06)}" +
      "#waLeadBody{" +
      "padding:14px 16px 18px;overflow:auto;-webkit-overflow-scrolling:touch;" +
      "max-height:calc(100dvh - 92px - 32px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));" +
      "}" +
      ".wa-step{display:none}" +
      ".wa-step.is-active{display:block}" +
      ".wa-help{margin:8px 0 10px;color:rgba(0,0,0,.72);font-size:14px}" +
      ".wa-choices{display:grid;gap:10px;margin:10px 0 12px}" +
      ".wa-choice-btn{" +
      "width:100%;text-align:left;border:1px solid rgba(0,0,0,.12);background:#fff;" +
      "border-radius:14px;padding:12px;cursor:pointer;font-size:14px;" +
      "}" +
      ".wa-choice-btn:hover{background:rgba(0,0,0,.02);border-color:rgba(0,0,0,.24)}" +
      "#waBackBtn{" +
      "display:inline-flex;align-items:center;gap:8px;border:0;background:transparent;cursor:pointer;" +
      "color:rgba(0,0,0,.7);font-size:14px;padding:8px 0;margin:4px 0 8px;" +
      "}" +
      "#waBackBtn:hover{text-decoration:underline}" +
      "#waError{display:none;color:#b00020;margin-top:10px;font-size:13px}" +
      ".wa-loaderWrap{position:relative;min-height:64px}" +
      ".wa-loading{" +
      "display:flex;align-items:center;gap:10px;padding:10px 0;color:rgba(0,0,0,.72);font-size:14px;" +
      "}" +
      ".wa-spinner{" +
      "width:16px;height:16px;border-radius:50%;border:2px solid rgba(0,0,0,.18);" +
      "border-top-color:rgba(0,0,0,.55);animation:waSpin .8s linear infinite;" +
      "}" +
      "@keyframes waSpin{to{transform:rotate(360deg)}}" +
      "@media (max-width:520px){" +
      "#waLeadOverlay{padding:12px;padding-top:calc(12px + env(safe-area-inset-top,0px));padding-bottom:calc(12px + env(safe-area-inset-bottom,0px))}" +
      "#waLeadPanel{border-radius:14px}" +
      "#waLeadHead{padding:12px 14px}" +
      "#waLeadBody{padding:12px 14px 14px}" +
      "}";
    document.head.appendChild(style);
  });

  // ===== UI injection =====
  function ensureFab() {
    var btn = $("#waLeadBtn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "waLeadBtn";
      btn.type = "button";
      btn.className = "wa-lead-fab";
      btn.setAttribute("aria-label", "WhatsApp");
      // Simple WhatsApp-ish icon (no external deps)
      btn.innerHTML =
        btn.innerHTML = "<svg viewBox=\"0 0 32 32\" aria-hidden=\"true\" focusable=\"false\">" +"<path fill=\"#fff\" d=\"M19.11 17.21c-.27-.14-1.57-.77-1.81-.86-.24-.09-.42-.14-.6.14-.18.27-.69.86-.85 1.04-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.18-1.34-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.31.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.45-.82-1.99-.22-.53-.44-.46-.6-.47h-.52c-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22s.95 2.58 1.08 2.76c.13.18 1.87 2.86 4.53 4.01.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.07 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.07-.11-.24-.18-.51-.32z\"/>" +"<path fill=\"#fff\" d=\"M26.64 5.36A13.85 13.85 0 0 0 16.02 1C8.29 1 2 7.29 2 15.02c0 2.47.65 4.88 1.88 6.99L2 31l9.2-1.81a14 14 0 0 0 4.82.85h.01C23.75 30.04 30 23.75 30 16.02a13.9 13.9 0 0 0-3.36-10.66zM16.03 27.7h-.01a11.6 11.6 0 0 1-4.99-1.13l-.36-.17-5.45 1.08 1.16-5.31-.19-.38a11.6 11.6 0 0 1-1.5-5.77C4.69 8.64 9.65 3.69 16.02 3.69c3.1 0 6.02 1.21 8.21 3.41a11.5 11.5 0 0 1 3.39 8.19c0 6.37-4.95 12.41-11.59 12.41z\"/>" +"</svg>";
      document.body.appendChild(btn);
    }
    return btn;
  }

  function ensureOverlay() {
    var overlay = $("#waLeadOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "waLeadOverlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div id="waLeadPanel" role="dialog" aria-modal="true" aria-label="Agenda por WhatsApp">' +
      '<div id="waLeadHead"><h2>Agenda por WhatsApp</h2><button id="waLeadClose" type="button" aria-label="Cerrar">×</button></div>' +
      '<div id="waLeadBody">' +
      '<div id="waStepChoose" class="wa-step is-active">' +
      '<p class="wa-help">¿Dónde requieres atención?</p>' +
      '<div class="wa-choices">' +
      '<button type="button" class="wa-choice-btn" data-loc="HA_NL">' +
      FORMS.HA_NL.label +
      "</button>" +
      '<button type="button" class="wa-choice-btn" data-loc="CEON_TMPS">' +
      FORMS.CEON_TMPS.label +
      "</button>" +
      "</div></div>" +
      '<div id="waStepForm" class="wa-step">' +
      '<button type="button" id="waBackBtn">← Cambiar ubicación</button>' +
      '<div class="wa-loaderWrap" id="waFormArea">' +
      '<div class="wa-loading" id="waFormLoader"><div class="wa-spinner" aria-hidden="true"></div><div>Cargando formulario…</div></div>' +
      '<div id="hsWhatsAppFormLeadMount"></div>' +
      "</div>" +
      '<div id="waError"></div>' +
      "</div></div></div>";
    document.body.appendChild(overlay);
    return overlay;
  }

  // ===== HubSpot loader =====
  var hubspotLoading = false;
  var hubspotLoaded = false;

  function loadHubSpotV2(cb, errEl) {
    if (window.hbspt && window.hbspt.forms && window.hbspt.forms.create) {
      hubspotLoaded = true;
      cb();
      return;
    }

    var existing = document.querySelector(
      'script[src="https://js.hsforms.net/forms/v2.js"]'
    );
    if (existing) {
      if (!hubspotLoaded) {
        existing.addEventListener(
          "load",
          function () {
            hubspotLoaded = true;
            cb();
          },
          { once: true }
        );
      } else cb();
      return;
    }

    if (hubspotLoading) return;
    hubspotLoading = true;

    var s = document.createElement("script");
    s.src = "https://js.hsforms.net/forms/v2.js";
    s.async = true;
    s.onload = function () {
      hubspotLoading = false;
      hubspotLoaded = true;
      cb();
    };
    s.onerror = function () {
      hubspotLoading = false;
      if (errEl) {
        errEl.textContent =
          "No pudimos cargar el formulario. Intenta de nuevo.";
        errEl.style.display = "block";
      }
    };
    document.head.appendChild(s);
  }

  function setLoaderVisible(overlay, visible) {
    var loader = $("#waFormLoader", overlay);
    if (!loader) return;
    loader.style.display = visible ? "flex" : "none";
  }

  function clearForm(overlay) {
    var mount = $("#hsWhatsAppFormLeadMount", overlay);
    if (mount) mount.innerHTML = "";
  }

  function showChoose(overlay) {
    var err = $("#waError", overlay);
    if (err) err.style.display = "none";
    clearForm(overlay);
    setLoaderVisible(overlay, false);
    $("#waStepChoose", overlay).classList.add("is-active");
    $("#waStepForm", overlay).classList.remove("is-active");
  }

  function showForm(overlay, locKey) {
    var err = $("#waError", overlay);
    if (err) err.style.display = "none";
    clearForm(overlay);
    setLoaderVisible(overlay, true);

    $("#waStepChoose", overlay).classList.remove("is-active");
    $("#waStepForm", overlay).classList.add("is-active");

    var cfg = FORMS[locKey];
    if (!cfg) return;

    loadHubSpotV2(
      function () {
        if (!(window.hbspt && window.hbspt.forms && window.hbspt.forms.create)) {
          return;
        }
        // Render into the unique inner mount (not the loader wrapper)
        window.hbspt.forms.create({
          region: HUBSPOT_REGION,
          portalId: HUBSPOT_PORTAL_ID,
          formId: cfg.formId,
          target: "#hsWhatsAppFormLeadMount",
          onFormReady: function () {
            setLoaderVisible(overlay, false);
          },
          onFormSubmitted: function () {
            setLoaderVisible(overlay, false);
          },
        });

        // Fallback: if HubSpot doesn't fire callbacks, hide loader once a form appears.
        try {
          var container = $("#hsWhatsAppFormLeadMount", overlay);
          if (!container) return;
          var killed = false;
          var kill = function () {
            if (killed) return;
            killed = true;
            setLoaderVisible(overlay, false);
          };
          var obs = new MutationObserver(function () {
            if (container.querySelector("form")) {
              kill();
              try {
                obs.disconnect();
              } catch (e) {}
            }
          });
          obs.observe(container, { childList: true, subtree: true });
          setTimeout(function () {
            kill();
            try {
              obs.disconnect();
            } catch (e) {}
          }, 4000);
        } catch (e) {}
      },
      err
    );
  }

  function openOverlay(overlay) {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    showChoose(overlay);
    // Warm-up on open
    loadHubSpotV2(function () {}, $("#waError", overlay));
  }

  function closeOverlay(overlay) {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function boot() {
    var btn = ensureFab();
    var overlay = ensureOverlay();

    // Background warm-up
    loadHubSpotV2(function () {}, $("#waError", overlay));

    btn.addEventListener("click", function (e) {
      if (e && e.preventDefault) e.preventDefault();
      openOverlay(overlay);
    });

    $("#waLeadClose", overlay).addEventListener("click", function () {
      closeOverlay(overlay);
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeOverlay(overlay);
      var choice = e.target.closest(".wa-choice-btn");
      if (choice) {
        var loc = choice.getAttribute("data-loc");
        if (loc === "HA_NL" || loc === "CEON_TMPS") showForm(overlay, loc);
      }
    });

    $("#waBackBtn", overlay).addEventListener("click", function () {
      showChoose(overlay);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeOverlay(overlay);
      }
    });

    // Messenger "CONTÁCTANOS" -> WhatsApp direct
    document.addEventListener("click", function (e) {
      var a = e.target.closest(
        'a[href*="m.me/cirujanoplasticocertificad"],a[href*="m.me/cirujanplasticocertificad"]'
      );
      if (!a) return;
      e.preventDefault();
      window.open(WA_DIRECT_URL, "_blank", "noopener,noreferrer");
    });

    // Optional trigger
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-wa-lead-trigger]");
      if (!t) return;
      e.preventDefault();
      openOverlay(overlay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
