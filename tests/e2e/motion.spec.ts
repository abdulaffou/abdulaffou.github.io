import { expect, test } from '@playwright/test';

test('Expand all opens every project and flips to Collapse all', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('[data-expand-all]');
  await btn.click();
  await expect(page.locator('details[data-project][open]')).toHaveCount(7);
  await expect(btn).toHaveText('Collapse all');
  await btn.click();
  await expect(page.locator('details[data-project][open]')).toHaveCount(0);
  await expect(btn).toHaveText('Expand all');
});

test('Space and Enter on a focused project header toggle it', async ({ page }) => {
  await page.goto('/');
  const summary = page.locator('#project-attack-paths summary');
  await summary.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#project-attack-paths')).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('#project-attack-paths')).not.toHaveAttribute('open', '');
});

test('opening a project animates its body to full height', async ({ page }) => {
  await page.goto('/');
  await page.locator('#project-hos-engine summary').click();
  const body = page.locator('#project-hos-engine .case-body');
  await expect(body).toBeVisible();
  await expect.poll(() => body.evaluate((el) => el.getAnimations().length)).toBe(0);
  expect(await body.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(150);
});

test('method steps switch panels and pressed state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await expect(page.locator('[data-method-panel="2"]')).toBeVisible();
  for (const i of [0, 1, 3]) await expect(page.locator(`[data-method-panel="${i}"]`)).toBeHidden();
  await expect(page.getByRole('button', { name: 'Build', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Understand', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('a skill reference opens the project it names', async ({ page }) => {
  await page.goto('/');
  await page.locator('#skills a[data-open-project="gsql-vc"]').click();
  await expect(page.locator('#project-gsql-vc')).toHaveAttribute('open', '');
});

test('intro plays once per session', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/intro/);
  expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/intro/);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no animations run and everything is visible immediately', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await expect(page.locator('html')).not.toHaveClass(/intro/);
    expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    await page.locator('#project-hos-engine summary').click();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await expect(page.locator('#project-hos-engine')).toHaveAttribute('open', '');
  });
});
