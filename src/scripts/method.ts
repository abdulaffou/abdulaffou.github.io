const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const steps = [...document.querySelectorAll<HTMLButtonElement>('[data-method-step]')];
const panels = [...document.querySelectorAll<HTMLElement>('[data-method-panel]')];

function show(index: number) {
  steps.forEach((s) => s.setAttribute('aria-pressed', String(Number(s.dataset.methodStep) === index)));
  panels.forEach((p) => {
    const active = Number(p.dataset.methodPanel) === index;
    const changed = active !== p.classList.contains('is-active');
    p.classList.toggle('is-active', active);
    if (active && changed && !reduceMotion()) {
      p.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
    }
  });
}

steps.forEach((s) => s.addEventListener('click', () => show(Number(s.dataset.methodStep))));
