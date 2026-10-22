/**
 * Perspective tilt for [data-tilt] elements: they lean toward a mouse pointer
 * and expose --glare-x / --glare-y for a highlight that follows it.
 * Skipped for touch input and reduced motion.
 */
export function initTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  for (const el of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
    const max = Number(el.dataset.tilt) || 6;
    let frame = 0;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.transition = "transform 120ms ease-out";
        el.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max * 1.4).toFixed(2)}deg)`;
        el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(frame);
      el.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "";
    });
  }
}
