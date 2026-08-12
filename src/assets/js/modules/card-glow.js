/** Brillo que sigue el puntero en las cards (hover con profundidad). */
export function initCardGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}
