import { expect, test } from '@playwright/test';

const desk = '[data-graph][data-layout="desktop"]';
const node = (id: string, svg = desk) => `${svg} [data-node="${id}"]`;
const dot = (id: string) => `${node(id)} circle:not(.halo)`;
const opacity = (page: import('@playwright/test').Page, sel: string) =>
  page.locator(sel).evaluate((el) => Number(getComputedStyle(el).opacity));

test.use({ reducedMotion: 'reduce' });

test('hiring lens lights companies and dims the rest', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: "I'm hiring" }).click();
  await expect.poll(() => opacity(page, dot('novigo'))).toBe(1);
  await expect.poll(() => opacity(page, dot('hos'))).toBeLessThan(0.5);
  const fill = await page.locator(`${node('ey')} circle:not(.halo)`).evaluate((el) => getComputedStyle(el).fill);
  expect(fill).toBe('rgb(242, 165, 65)');
});

test('hovering a node lights it and its neighbours only', async ({ page }) => {
  await page.goto('/');
  await page.locator(node('clustering')).hover();
  for (const id of ['clustering', 'freelance', 'logistics', 'agent']) await expect(page.locator(node(id))).toHaveClass(/is-near/);
  await expect(page.locator(node('cyber'))).not.toHaveClass(/is-near/);
  await expect.poll(() => opacity(page, dot('cyber'))).toBeLessThan(0.5);
  await page.mouse.move(5, 5);
  await expect(page.locator(desk)).not.toHaveClass(/has-focus/);
});

test('clicking a project node opens that project', async ({ page }) => {
  await page.goto('/');
  await page.locator(node('control-tower')).click();
  await expect(page.locator('#project-control-tower')).toHaveAttribute('open', '');
  await expect(page.locator('#project-control-tower summary')).toBeInViewport();
});

test('company node goes to its experience row; Enter works from the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.locator(node('ey')).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#job-ey')).toBeInViewport();
});

test.describe('phone', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('no horizontal scroll and graph labels stay readable and inside the graph', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    const phone = page.locator('[data-graph][data-layout="phone"]');
    await expect(phone).toBeVisible();
    await expect(page.locator(desk)).toBeHidden();
    const report = await phone.evaluate((svg) => {
      const box = svg.getBoundingClientRect();
      const scale = box.width / svg.viewBox.baseVal.width;
      return [...svg.querySelectorAll('text')].map((t) => {
        const r = t.getBoundingClientRect();
        return {
          size: parseFloat(getComputedStyle(t).fontSize) * scale,
          inside: r.left >= box.left - 1 && r.right <= box.right + 1 && r.top >= box.top - 1 && r.bottom <= box.bottom + 1,
          text: t.textContent,
        };
      });
    });
    for (const l of report) {
      expect(l.size, l.text!).toBeGreaterThanOrEqual(13);
      expect(l.inside, l.text!).toBe(true);
    }
  });
});
