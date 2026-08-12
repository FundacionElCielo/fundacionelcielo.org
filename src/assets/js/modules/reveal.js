/** Aparición progresiva al hacer scroll: [data-reveal], líneas SVG que se dibujan, y stats. */
export function initReveal() {
  const targets = document.querySelectorAll(
    "[data-reveal], .draw-line, .stat",
  );
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Stagger automático dentro de un mismo contenedor con [data-reveal-group].
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const step = Number(group.dataset.revealStep || 90);
    group.querySelectorAll("[data-reveal]").forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${index * step}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );

  targets.forEach((el) => observer.observe(el));
}
