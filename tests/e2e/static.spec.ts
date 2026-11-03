import { expect, test } from '@playwright/test';
import { LENS_COPY, SECTION_ORDER, projects } from '../../src/data/content';

test.use({ javaScriptEnabled: false });

test('every section and project is reachable without JavaScript', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('#sections > section').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(SECTION_ORDER.default);

  const details = page.locator('details[data-project]');
  await expect(details).toHaveCount(7);
  await expect(details.first()).toHaveAttribute('open', '');
  for (const p of projects) {
    await expect(page.locator(`#project-${p.id} .story`)).toHaveText(p.story);
    await expect(page.locator(`#project-${p.id} .case-res`)).toHaveText(p.headline);
  }
});

test('the who-are-you switch is hidden and the default intro shows', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.switch-wrap')).toBeHidden();
  await expect(page.getByText(LENS_COPY.default.lede, { exact: true })).toBeVisible();
  await expect(page.getByText(LENS_COPY.hiring.lede, { exact: true })).toBeHidden();
});

test('all four method steps are readable without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-method-panel]')).toHaveCount(4);
  for (const panel of await page.locator('[data-method-panel]').all()) await expect(panel).toBeVisible();
});

test('no visitor-facing placeholders or photos until supplied', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).not.toContainText(/Shoulders up|Same portrait|3:2|4:5|placeholder/i);
  await expect(page.locator('#about img, #contact img')).toHaveCount(0);
  await expect(page.locator('footer')).toContainText('Source on GitHub');
});
