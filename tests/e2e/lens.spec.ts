import { expect, test, type Page } from '@playwright/test';
import { LENS_COPY } from '../../src/data/content';

const order = (page: Page) => page.locator('#sections > section').evaluateAll((els) => els.map((e) => e.id));
const lensOf = (page: Page) => page.evaluate(() => document.documentElement.getAttribute('data-lens'));

test('?for=hiring opens the hiring view with experience first', async ({ page }) => {
  await page.goto('/?for=hiring');
  await expect(page.getByRole('button', { name: "I'm hiring" })).toHaveAttribute('aria-pressed', 'true');
  expect((await order(page))[0]).toBe('experience');
  await expect(page.getByText(LENS_COPY.hiring.lede, { exact: true })).toBeVisible();
  await expect(page.locator('#experience .start[data-start="hiring"]')).toBeVisible();
});

test('clicking the active lens returns to the default view and clears the URL', async ({ page }) => {
  await page.goto('/?for=hiring');
  await page.getByRole('button', { name: "I'm hiring" }).click();
  await expect.poll(() => lensOf(page)).toBeNull();
  expect(new URL(page.url()).searchParams.has('for')).toBe(false);
  expect((await order(page))[0]).toBe('work');
  await expect(page.getByText(LENS_COPY.default.lede, { exact: true })).toBeVisible();
});

test('choosing clients updates the URL and the order', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'I need something built' }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get('for')).toBe('clients');
  expect((await order(page)).slice(0, 3)).toEqual(['work', 'method', 'trust']);
  await expect(page.getByRole('button', { name: 'I need something built' })).toHaveAttribute('aria-pressed', 'true');
});

for (const q of ['?for=ceo', '?for=', '?for=HIRING']) {
  test(`unknown lens ${q} falls back to default without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/' + q);
    expect(await lensOf(page)).toBeNull();
    expect((await order(page))[0]).toBe('work');
    expect(errors).toEqual([]);
  });
}

test('lens plus hash applies the lens and lands on the hash', async ({ page }) => {
  await page.goto('/?for=clients#experience');
  expect(await lensOf(page)).toBe('clients');
  await expect(page.locator('#experience h2')).toBeInViewport();
});
