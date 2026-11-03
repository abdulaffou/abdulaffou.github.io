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
  test('projects and industries look different, and the legend shows the same look', async ({ page }) => {
    await page.goto('/');
    const looks: string[] = [];
    for (const [kind, id] of [['work', 'clustering'], ['domain', 'logistics']]) {
      const node = await look(page, `${desk} [data-node="${id}"] .core`);
      expect(await look(page, `.legend .key.n-${kind} .core`), kind).toBe(node);
      looks.push(node);
    }
    expect(new Set(looks).size).toBe(2);
  });

  test('companies and tools are drawn as their logos, not circles', async ({ page }) => {
    await page.goto('/');
    for (const id of ['novigo', 'ey', 'skill-quotient', 'freelance', 'tigergraph', 'python']) {
      await expect(page.locator(`${desk} [data-node="${id}"] .word`), id).toHaveCount(1);
      await expect(page.locator(`${desk} [data-node="${id}"] circle`), id).toHaveCount(0);
    }
  });

  for (const layout of ['desktop', 'phone']) {
    test(`every logo fits inside the plate that hides the lines beneath it (${layout})`, async ({ page }) => {
      await page.setViewportSize(layout === 'phone' ? { width: 390, height: 844 } : { width: 1440, height: 900 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const spill = await page.locator(`[data-graph][data-layout="${layout}"] .word`).evaluateAll((words) =>
        words.flatMap((w) => {
          const plate = w.previousElementSibling!.getBoundingClientRect();
          const b = w.getBoundingClientRect();
          const id = (w.parentElement as HTMLElement).dataset.node;
          return b.left < plate.left || b.right > plate.right || b.top < plate.top || b.bottom > plate.bottom ? [id] : [];
        }),
      );
      expect(spill).toEqual([]);
    });
  }

  test('a highlighted logo gets an amber outline and keeps its own colours', async ({ page }) => {
    await page.goto('/?for=hiring');
    expect(await page.locator(`${desk} [data-node="ey"] .plate`).evaluate((el) => getComputedStyle(el).stroke)).toBe(AMBER);
    expect(await page.locator(`${desk} [data-node="ey"] .logo path`).last().evaluate((el) => getComputedStyle(el).fill)).toBe('rgb(255, 230, 0)');
  });
});

test('amber is kept for actions and selections, not results or index letters', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['.case-res', '.tb .res', '.index .letter']) {
    expect(await page.locator(sel).first().evaluate((el) => getComputedStyle(el).color), sel).not.toBe(AMBER);
  }
  expect(await page.locator('.btn-primary').first().evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(AMBER);
});

test.describe('first-visit sweep', () => {
  test.use({ reducedMotion: 'no-preference' });
  const hi = `${desk} .e-hi`;
  const running = (page: Page) =>
    page.locator(hi).evaluateAll((els) => els.filter((el) => el.getAnimations().some((a) => a.playState === 'running')).length);

  test('the default view lights every edge once, then settles back to grey within 5 seconds', async ({ page }) => {
    await page.goto('/');
    await expect.poll(() => running(page), { timeout: 2500 }).toBeGreaterThan(10);
    await page.waitForTimeout(5000);
    expect(await running(page)).toBe(0);
    const offsets = await page.locator(hi).evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).strokeDashoffset)));
    expect(offsets.every((o) => o === 1)).toBe(true);
  });

  test('a visitor who arrives with a role sees no sweep', async ({ page }) => {
    await page.goto('/?for=hiring');
    await page.waitForTimeout(1500);
    expect(await running(page)).toBe(0);
  });
});

test('the default intro says what Abdul is', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-lens-copy="default"] .lede')).toContainText('Data scientist and graph engineer');
});

test('every edge starts at the end nearer the hub, so highlights ripple outward', async ({ page }) => {
  await page.goto('/');
  const bad = await page.locator(`${desk} .e-hi`).evaluateAll((lines) => {
    const ring = (el: Element) => Number((el as HTMLElement).style.getPropertyValue('--d'));
    // A node's centre: its circle's, or the middle of its logo plate.
    const centre = (g: Element) => {
      const c = g.querySelector('.core');
      if (c) return [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))];
      const p = g.querySelector('.plate')!;
      return [Number(p.getAttribute('x')) + Number(p.getAttribute('width')) / 2, Number(p.getAttribute('y')) + Number(p.getAttribute('height')) / 2];
    };
    const nodeAt = (x: number, y: number) =>
      [...document.querySelectorAll(`[data-graph][data-layout="desktop"] [data-node]`)].find((g) => {
        const [cx, cy] = centre(g);
        return Math.abs(cx - x) < 0.01 && Math.abs(cy - y) < 0.01;
      })!;
    return lines
      .filter((l) => ring(nodeAt(+l.getAttribute('x1')!, +l.getAttribute('y1')!)) > ring(nodeAt(+l.getAttribute('x2')!, +l.getAttribute('y2')!)))
      .map((l) => `${(l as SVGElement).dataset.from}>${(l as SVGElement).dataset.to}`);
  });
  expect(bad).toEqual([]);
});
