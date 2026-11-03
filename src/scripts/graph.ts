import { openProject } from './collapse';

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll to whatever a graph node points at, opening the project if that's where it goes. */
export function goToTarget(target: string): void {
  const [kind, id] = target.split(':');
  const el =
    kind === 'project'
      ? document.getElementById(`project-${id}`)
      : kind === 'job'
        ? document.getElementById(`job-${id}`)
        : kind === 'section'
          ? document.getElementById(id)
          : document.getElementById('novigo-optimisation');
  if (!el) return;
  if (el instanceof HTMLDetailsElement) openProject(el);
  el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  const focusable = el instanceof HTMLDetailsElement ? el.querySelector('summary') : el;
  if (focusable instanceof HTMLElement) {
    if (!focusable.matches('summary, a, button')) focusable.setAttribute('tabindex', '-1');
    focusable.focus({ preventScroll: true });
  }
}

function wire(svg: SVGSVGElement) {
  const edges = [...svg.querySelectorAll<SVGLineElement>('line[data-from]')];
  const nodes = new Map([...svg.querySelectorAll<SVGGElement>('[data-node]')].map((g) => [g.dataset.node!, g]));

  const clear = () => {
    svg.classList.remove('has-focus');
    svg.querySelectorAll('.is-near, .is-focus').forEach((el) => el.classList.remove('is-near', 'is-focus'));
  };

  const highlight = (id: string) => {
    clear();
    svg.classList.add('has-focus');
    nodes.get(id)?.classList.add('is-near', 'is-focus');
    for (const e of edges) {
      if (e.dataset.from !== id && e.dataset.to !== id) continue;
      e.classList.add('is-near');
      nodes.get(e.dataset.from === id ? e.dataset.to! : e.dataset.from!)?.classList.add('is-near');
    }
  };

  for (const [id, g] of nodes) {
    g.addEventListener('pointerenter', () => highlight(id));
    g.addEventListener('pointerleave', clear);
    g.addEventListener('focus', () => highlight(id));
    g.addEventListener('blur', clear);
    g.addEventListener('click', () => g.dataset.target && goToTarget(g.dataset.target));
    g.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && g.dataset.target) {
        event.preventDefault();
        goToTarget(g.dataset.target);
      } else if (event.key === 'Escape') {
        clear();
      }
    });
  }
}

document.querySelectorAll<SVGSVGElement>('[data-graph]').forEach(wire);
