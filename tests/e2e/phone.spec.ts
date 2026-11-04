import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

/** Steps that start a new row must not carry a sideways connector. */
const danglingConnectors = (page: Page, items: string) =>
  page.locator(items).evaluateAll((els) =>
    els
      .filter((el, i) => i > 0 && el.parentElement === els[i - 1].parentElement && el.getBoundingClientRect().top > els[i - 1].getBoundingClientRect().bottom - 4)
      .filter((el) => parseFloat(getComputedStyle(el, '::before').width) > 3)
      .map((el) => el.textContent?.trim()),
  );

test('project drawings and the method steps have no stray connectors when they wrap', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-expand-all]').click();
  expect(await danglingConnectors(page, '.chain .step')).toEqual([]);
  expect(await danglingConnectors(page, '.method li')).toEqual([]);
});

test('the who-are-you switch never leaves one option alone on a row', async ({ page }) => {
  await page.goto('/');
  const boxes = await page.locator('.switch .tab').evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  const sameRow = boxes.every((b) => b.top === boxes[0].top);
  const stacked = boxes.every((b) => b.left === boxes[0].left && b.width === boxes[0].width);
  expect(sameRow || stacked).toBe(true);
});

test('the nav is one compact row that stays on screen while scrolling', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('body > header');
  expect((await header.boundingBox())!.height).toBeLessThanOrEqual(64);
  const tops = await page.locator('.nav-links a').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  await page.mouse.wheel(0, 3000);
  await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
});

test('a nav jump lands below the sticky header', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-links a[href="#experience"]').click();
  const header = (await page.locator('body > header').boundingBox())!;
  await expect.poll(async () => (await page.locator('#experience h2').boundingBox())!.y).toBeGreaterThanOrEqual(header.height);
});

test('graph nodes are at least 40px tap targets on phone', async ({ page }) => {
  await page.goto('/');
  const sizes = await page.locator('[data-graph][data-layout="phone"] .halo').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(40);
});

test('nothing is wider than the screen, with every project open', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-expand-all]').click();
  const wide = await page.evaluate(() =>
    [...document.querySelectorAll('.case, .story, .tb, .method, .switch')]
      .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
      .map((el) => el.className || el.tagName),
  );
  expect(wide).toEqual([]);
});

test('step and switch labels fit inside their buttons', async ({ page }) => {
  await page.goto('/');
  const spill = await page.locator('.mstep, .switch .tab').evaluateAll((els) =>
    els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent?.trim()),
  );
  expect(spill).toEqual([]);
});

test.describe('on a small 360px phone', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('labels fit and nothing is wider than the screen', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-expand-all]').click();
    const problems = await page.evaluate(() => [
      ...[...document.querySelectorAll('.mstep, .switch .tab')].filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => `spills: ${el.textContent?.trim()}`),
      ...[...document.querySelectorAll('.case, .story, .tb, .method, .switch, .repo')].filter((el) => el.getBoundingClientRect().right > innerWidth + 1).map((el) => `too wide: ${el.className}`),
    ]);
    expect(problems).toEqual([]);
  });
});

test('a drawing that scrolls sideways can be focused; on desktop it cannot', async ({ page }) => {
  await page.goto('/');
  const chain = page.locator('#project-clustering .chain');
  await expect(chain).toHaveAttribute('tabindex', '0');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(chain).not.toHaveAttribute('tabindex');
});
