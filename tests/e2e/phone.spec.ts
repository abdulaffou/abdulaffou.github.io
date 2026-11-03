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
