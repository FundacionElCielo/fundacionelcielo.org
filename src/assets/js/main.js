import { initHeader } from "./modules/header.js";
import { initMobileNav } from "./modules/nav-mobile.js";
import { initReveal } from "./modules/reveal.js";
import { initParallax } from "./modules/parallax.js";
import { initCounters } from "./modules/counters.js";
import { initCardGlow } from "./modules/card-glow.js";

function init() {
  initHeader();
  initMobileNav();
  initReveal();
  initParallax();
  initCounters();
  initCardGlow();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
