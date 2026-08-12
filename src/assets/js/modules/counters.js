/** Conteo animado para cifras numéricas en la banda de estadísticas. */
export function initCounters() {
  const els = document.querySelectorAll("[data-counter-to]");
  if (els.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function animate(el) {
    const to = Number(el.dataset.counterTo);
    const prefix = el.dataset.counterPrefix || "";
    const suffix = el.dataset.counterSuffix || "";

    if (prefersReducedMotion || Number.isNaN(to)) {
      el.textContent = `${prefix}${to}${suffix}`;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.round(to * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  els.forEach((el) => observer.observe(el));
}
