import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

for (const q of ['', '?for=hiring', '?for=clients', '?for=engineers']) {
  test(`no serious accessibility violations ${q || '(default)'}`, async ({ page }) => {
    await page.goto('/' + q);
    await page.locator('[data-expand-all]').click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
  });
}

test('every link goes somewhere real', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  for (const h of hrefs) expect(h, h).toMatch(/^(https:\/\/|mailto:|#[a-z]|\/$)/);
  const ids = hrefs.filter((h) => h.startsWith('#')).map((h) => h.slice(1));
  for (const id of ids) await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
  const github = hrefs.filter((h) => h.includes('github.com/abdulaffou/'));
  for (const h of github) expect(h).toMatch(/\/(split_bot|lego_tracker|abdulaffou\.github\.io)$/);
});

test('page has title, description and social image', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Abdul Affou: data scientist and graph engineer');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://abdulaffou.github.io/og.png');
  const og = await page.request.get('/og.png');
  expect(og.status()).toBe(200);
});
