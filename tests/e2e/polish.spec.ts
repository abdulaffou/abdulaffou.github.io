import { expect, test, type Page } from '@playwright/test';

const desk = '[data-graph][data-layout="desktop"]';
const AMBER = 'rgb(242, 165, 65)';
const look = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.fill, s.stroke, s.strokeDasharray].join(' | ');
  });

test.use({ reducedMotion: 'reduce' });

test.describe('node kinds and legend', () => {
  const kinds = { company: 'ey', work: 'clustering', skill: 'python', domain: 'logistics' } as const;

  test('each node kind looks different, and the legend shows the same look', async ({ page }) => {
    await page.goto('/');
    const looks: string[] = [];
    for (const [kind, id] of Object.entries(kinds)) {
      const node = await look(page, `${desk} [data-node="${id}"] .core`);
      expect(await look(page, `.legend .key.n-${kind} .core`), kind).toBe(node);
      looks.push(node);
    }
    expect(new Set(looks).size).toBe(4);
  });

  test('a highlighted node is drawn at its own size, not its halo', async ({ page }) => {
    await page.goto('/?for=hiring');
    expect(await page.locator(`${desk} [data-node="ey"] .halo`).evaluate((el) => getComputedStyle(el).fill)).toBe('rgba(0, 0, 0, 0)');
  });
});

test('amber is kept for actions and selections, not results or index letters', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['.case-res', '.tb .res', '.index .letter']) {
    expect(await page.locator(sel).first().evaluate((el) => getComputedStyle(el).color), sel).not.toBe(AMBER);
  }
  expect(await page.locator('.btn-primary').first().evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(AMBER);
});
