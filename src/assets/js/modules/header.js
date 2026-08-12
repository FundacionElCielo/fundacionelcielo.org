/** Header transparente al inicio; gana fondo/sombra al hacer scroll. */
export function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const THRESHOLD = 24;
  let ticking = false;

  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
}
