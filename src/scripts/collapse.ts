const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const running = new WeakMap<HTMLDetailsElement, Animation>();

/** Where a project is heading: its animation's direction while one runs, otherwise its current state. */
const intendedOpen = (d: HTMLDetailsElement) => (running.has(d) ? d.hasAttribute('data-opening') : d.open);

/** Open or close a project with a height animation that starts from wherever it is now; exits run faster. */
export async function animateDetails(el: HTMLDetailsElement, open: boolean): Promise<void> {
  const body = el.querySelector<HTMLElement>('.case-body');
  el.toggleAttribute('data-opening', open);
  const previous = running.get(el);
  if (!body || reduceMotion()) {
    previous?.cancel();
    el.open = open;
    return;
  }
  // Measure mid-flight values before cancelling, so a reversal continues instead of jumping.
  const fromHeight = el.open ? body.getBoundingClientRect().height : 0;
  const fromOpacity = previous ? Number(getComputedStyle(body).opacity) : el.open ? 1 : 0;
  previous?.cancel();
  el.open = true;
  const toHeight = open ? body.scrollHeight : 0;
  const animation = body.animate(
    [
      { height: `${fromHeight}px`, opacity: fromOpacity },
      { height: `${toHeight}px`, opacity: open ? 1 : 0 },
    ],
    { duration: open ? 280 : 200, easing: EASE },
  );
  running.set(el, animation);
  try {
    await animation.finished;
    if (!open) el.open = false;
  } catch {
    // cancelled by a newer toggle; that one owns the final state
  } finally {
    if (running.get(el) === animation) running.delete(el);
  }
}

export function openProject(el: HTMLDetailsElement): Promise<void> {
  return intendedOpen(el) && !running.has(el) ? Promise.resolve() : animateDetails(el, true);
}

const projects = [...document.querySelectorAll<HTMLDetailsElement>('details[data-project]')];
const expandAll = document.querySelector<HTMLButtonElement>('[data-expand-all]');
const allOpen = () => projects.every(intendedOpen);
const syncLabel = () => {
  if (expandAll) expandAll.textContent = allOpen() ? 'Collapse all' : 'Expand all';
};

for (const d of projects) {
  d.querySelector('summary')?.addEventListener('click', (event) => {
    event.preventDefault();
    animateDetails(d, !intendedOpen(d)).then(syncLabel);
    syncLabel();
  });
  d.addEventListener('toggle', syncLabel);
}

expandAll?.addEventListener('click', () => {
  const open = !allOpen();
  projects.forEach((d) => animateDetails(d, open).then(syncLabel));
  syncLabel();
});

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-open-project]');
  const target = link && document.getElementById(`project-${link.dataset.openProject}`);
  if (target instanceof HTMLDetailsElement) openProject(target);
});

syncLabel();
