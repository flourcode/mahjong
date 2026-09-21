/* MahjongCenter main script
   Only small enhancements live here. Every page works without JavaScript. */
(function () {
  "use strict";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var close = function (returnFocus) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        close(false);
      } else {
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close(true);
    });
    // If the window grows to desktop width, reset the mobile state.
    var mq = window.matchMedia("(min-width: 860px)");
    var onChange = function () { if (mq.matches) close(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
  }
})();
