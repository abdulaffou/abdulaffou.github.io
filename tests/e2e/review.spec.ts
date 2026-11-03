import { expect, test, type Locator } from '@playwright/test';

const desk = '[data-graph][data-layout="desktop"]';
const effectiveOpacity = (l: Locator) =>
  l.evaluate((el) => {
    let o = 1;
    for (let n: Element | null = el; n && n instanceof Element; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  });

test('first visit: the intro does not lock graph dimming on', async ({ page }) => {
  await page.goto('/?for=hiring');
  await expect(page.locator('html')).toHaveClass(/intro/);
  await page.waitForTimeout(2500);
  await expect.poll(() => effectiveOpacity(page.locator(`${desk} [data-node="hos"] circle:not(.halo)`))).toBeLessThan(0.5);
  await page.locator(`${desk} [data-node="clustering"]`).hover();
  await expect.poll(() => effectiveOpacity(page.locator(`${desk} [data-node="cyber"] circle:not(.halo)`))).toBeLessThan(0.5);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('dimmed graph labels stay readable', async ({ page }) => {
    await page.goto('/?for=hiring');
    const label = page.locator(`${desk} [data-node="hos"] text`);
    expect(await effectiveOpacity(label)).toBe(1);
    expect(await label.evaluate((el) => getComputedStyle(el).fill)).toBe('rgb(147, 163, 189)');
    expect(await effectiveOpacity(page.locator(`${desk} [data-node="hos"] circle:not(.halo)`))).toBeLessThan(0.5);
  });

  test('clicking a graph label works like clicking its node', async ({ page }) => {
    await page.goto('/');
    await page.locator(`${desk} [data-node="control-tower"] text`).click();
    await expect(page.locator('#project-control-tower')).toHaveAttribute('open', '');
  });
});

test('double-clicking a lens toggles it back off', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const b = document.querySelector<HTMLButtonElement>('[data-lens="hiring"]')!;
    b.click();
    b.click();
  });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-lens'))).toBeNull();
});

test('reversing a project mid-animation does not jump', async ({ page }) => {
  await page.goto('/');
  await page.locator('#project-hos-engine summary').click();
  await page.waitForTimeout(110);
  const [before, after] = await page.evaluate(async () => {
    const body = document.querySelector('#project-hos-engine .case-body')!;
    const h = body.getBoundingClientRect().height;
    document.querySelector<HTMLElement>('#project-hos-engine summary')!.click();
    // Sample every frame of the reversal; any frame taller than where it started is the jump.
    let max = body.getBoundingClientRect().height;
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      max = Math.max(max, body.getBoundingClientRect().height);
    }
    return [h, max];
  });
  expect(before).toBeGreaterThan(0);
  expect(after).toBeLessThanOrEqual(before + 4);
});

test('rapid Expand all clicks end in the state of the last click', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('[data-expand-all]');
  await btn.click();
  await btn.click();
  await btn.click();
  await page.waitForTimeout(500);
  await expect(page.locator('details[data-project][open]')).toHaveCount(7);
  await expect(btn).toHaveText('Collapse all');
});

test('following a link to a closing project opens it', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.querySelector<HTMLElement>('#project-clustering summary')!.click();
    document.querySelector<HTMLElement>('#skills a[data-open-project="clustering"]')!.click();
  });
  await page.waitForTimeout(600);
  await expect(page.locator('#project-clustering')).toHaveAttribute('open', '');
});

test.describe('small laptop', () => {
  test.use({ viewport: { width: 1100, height: 800 }, reducedMotion: 'reduce' });
  test('graph labels stay at least 12px', async ({ page }) => {
    await page.goto('/');
    const svg = page.locator('[data-graph]:visible');
    const sizes = await svg.evaluate((el) => {
      const s = el as SVGSVGElement;
      const scale = s.getBoundingClientRect().width / s.viewBox.baseVal.width;
      return [...s.querySelectorAll('text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * scale);
    });
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(12);
  });
});
