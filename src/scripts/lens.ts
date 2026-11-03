import type { Lens } from '../data/types';

const ACTIVE = ['hiring', 'clients', 'engineers'] as const;

export function parseLens(value: string | null): Lens {
  return (ACTIVE as readonly string[]).includes(value ?? '') ? (value as Lens) : 'default';
}

// The lens the visitor asked for last. View Transitions apply changes a frame later,
// so reading the page back would miss a second quick click.
let chosenLens: Lens = parseLens(document.documentElement.getAttribute('data-lens'));

export function currentLens(): Lens {
  return chosenLens;
}

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function applyLens(lens: Lens, opts: { updateUrl: boolean; animate: boolean }): void {
  chosenLens = lens;
  const container = document.getElementById('sections');
  const orders = JSON.parse(container?.dataset.order ?? '{}') as Record<Lens, string[]>;

  const run = () => {
    const html = document.documentElement;
    if (lens === 'default') html.removeAttribute('data-lens');
    else html.setAttribute('data-lens', lens);

    document.querySelectorAll<HTMLButtonElement>('[data-lens-switch] [data-lens]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lens === lens));
    });

    // CSS `order` already shows the right sequence; moving the nodes keeps tab order in step with it.
    for (const id of orders[lens] ?? []) {
      const el = document.getElementById(id);
      if (container && el?.parentElement === container) container.appendChild(el);
    }

    if (opts.updateUrl) {
      const url = new URL(location.href);
      if (lens === 'default') url.searchParams.delete('for');
      else url.searchParams.set('for', lens);
      history.replaceState(history.state, '', url);
    }

    document.dispatchEvent(new CustomEvent('lenschange', { detail: { lens } }));
  };

  if (opts.animate && 'startViewTransition' in document && !reduceMotion()) document.startViewTransition(run);
  else run();
}

function init() {
  applyLens(parseLens(new URLSearchParams(location.search).get('for')), { updateUrl: false, animate: false });

  document.querySelector('[data-lens-switch]')?.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-lens]');
    if (!button) return;
    const chosen = parseLens(button.dataset.lens ?? null);
    applyLens(chosen === currentLens() ? 'default' : chosen, { updateUrl: true, animate: true });
  });
}

init();
