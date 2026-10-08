/**
 * Aparición progresiva al hacer scroll (fade + leve translateY).
 *
 * - Solo se activa con JS: la clase `js` en <html> permite ocultar el
 *   contenido en CSS; sin JS o con `prefers-reduced-motion`, todo queda visible.
 * - El contenido sobre el pliegue se muestra de inmediato (sin parpadeo).
 * - Se sirve como módulo estático externo para que la Content-Security-Policy
 *   de public/_headers pueda ser estricta (script-src 'self').
 */
(() => {
  "use strict";

  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!motionOk) return;

  const root = document.documentElement;
  root.classList.add("js");

  /** @type {HTMLElement[]} */
  const els = Array.from(document.querySelectorAll("[data-reveal]"));
  if (els.length === 0) return;

  /** @param {HTMLElement} el */
  const reveal = (el) => el.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    els.forEach(reveal);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );

  // Fuerza un reflow antes de revelar para que la transición se reproduzca
  void root.offsetHeight;

  for (const el of els) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Visible al cargar → revela con la transición de entrada
      reveal(el);
    } else {
      io.observe(el);
    }
  }
})();
