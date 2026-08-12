/** Parallax ligero para las formas decorativas del hero (desactivado en móvil/reduced-motion). */
export function initParallax() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (prefersReducedMotion || isCoarsePointer) return;

  const layers = document.querySelectorAll("[data-parallax]");
  if (layers.length === 0) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    layers.forEach((layer) => {
      const speed = Number(layer.dataset.parallax || 0.08);
      const offset = Math.round(scrollY * speed);
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}
