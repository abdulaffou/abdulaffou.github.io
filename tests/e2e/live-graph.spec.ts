import { expect, test, type Page } from '@playwright/test';

const desk = '[data-graph][data-layout="desktop"]';
const box = (page: Page, sel: string) => page.locator(sel).evaluate((el) => {
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
});
const dashOffset = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));

for (const width of [1440, 390]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });

    test('the graph and nodes stay exactly where they are when the role changes', async ({ page }) => {
      await page.goto('/');
      const svg = width > 700 ? desk : '[data-graph][data-layout="phone"]';
      const before = await box(page, svg);
      const nodeBefore = await box(page, `${svg} [data-node="novigo"] circle:not(.halo)`);
      for (const name of ["I'm hiring", 'I need something built', "I'm an engineer", "I'm an engineer"]) {
        await page.getByRole('button', { name }).click();
        expect(await box(page, svg)).toEqual(before);
        expect(await box(page, `${svg} [data-node="novigo"] circle:not(.halo)`)).toEqual(nodeBefore);
      }
    });
  });
}

test.describe('edges', () => {
  test.use({ reducedMotion: 'reduce' });

  test('a role retracts unrelated edges and draws its own in amber', async ({ page }) => {
    await page.goto('/');
    expect(await dashOffset(page, `${desk} line.e[data-from="attack-paths"][data-to="cyber"]`)).toBe(0);
    expect(await dashOffset(page, `${desk} line.e-hi[data-from="novigo"][data-to="hos"]`)).toBe(1);

    await page.getByRole('button', { name: "I'm hiring" }).click();
    expect(await dashOffset(page, `${desk} line.e[data-from="attack-paths"][data-to="cyber"]`)).toBe(1);
    expect(await dashOffset(page, `${desk} line.e-hi[data-from="novigo"][data-to="hos"]`)).toBe(0);
    const stroke = await page.locator(`${desk} line.e-hi[data-from="novigo"][data-to="hos"]`).evaluate((el) => getComputedStyle(el).stroke);
    expect(stroke).toBe('rgb(242, 165, 65)');

    await page.getByRole('button', { name: "I'm hiring" }).click();
    expect(await dashOffset(page, `${desk} line.e[data-from="attack-paths"][data-to="cyber"]`)).toBe(0);
    expect(await dashOffset(page, `${desk} line.e-hi[data-from="novigo"][data-to="hos"]`)).toBe(1);
  });

  test('hovering brings back a retracted edge for its node', async ({ page }) => {
    await page.goto('/?for=hiring');
    await page.locator(`${desk} [data-node="cyber"]`).hover();
    expect(await dashOffset(page, `${desk} line.e[data-from="attack-paths"][data-to="cyber"]`)).toBe(0);
  });
});

test('switching roles animates edges instead of cross-fading the page', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1800);
  await page.getByRole('button', { name: "I'm hiring" }).click();
  const kinds = await page.evaluate(() => document.getAnimations().map((a) => (a as CSSTransition).transitionProperty ?? a.constructor.name));
  expect(kinds).toContain('stroke-dashoffset');
  expect(await page.evaluate(() => document.getAnimations().some((a) => String((a.effect as KeyframeEffect)?.pseudoElement ?? '').includes('view-transition')))).toBe(false);
});
