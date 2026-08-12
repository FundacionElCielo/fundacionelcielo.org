/** Menú móvil accesible: toggle, cierre con ESC/click-afuera/enlace, foco atrapado. */
export function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;

  const focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const first = panel.querySelector(focusableSelector);
    first?.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function close({ restoreFocus = true } = {}) {
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (restoreFocus) lastFocused?.focus();
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(panel.querySelectorAll(focusableSelector));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => close({ restoreFocus: false }));
  });

  // Cierra automáticamente si el viewport crece a escritorio.
  const desktopQuery = window.matchMedia("(min-width: 940px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) close({ restoreFocus: false });
  });
}
