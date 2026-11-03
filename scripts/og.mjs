// Renders public/og.png (1200x630) from the built site's hero graph.
// Usage: npm run build, serve dist on a port, then: node scripts/og.mjs http://127.0.0.1:4400
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://127.0.0.1:4400';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await page.goto(`${base}/?for=hiring`);
const svg = await page.locator('[data-graph][data-layout="desktop"]').evaluate((el) => el.outerHTML);
const styles = await page.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet], style')].map((n) => n.outerHTML).join(''));

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<!doctype html><html data-lens="hiring"><head><base href="${base}/">${styles}
<style>
  body { margin: 0; background: var(--bg); }
  .og { width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 56px 56px 72px; display: grid; grid-template-columns: 500px 1fr; gap: 24px; align-items: center; }
  .og h1 { font-size: 68px; margin: 0 0 28px; }
  .og p { font-size: 22px; color: var(--text2); margin: 0; line-height: 1.45; }
  .og .name { font-stretch: 125%; font-weight: 800; font-size: 22px; color: var(--accent); margin: 0 0 20px; }
  .og svg { width: 100%; height: auto; }
</style></head><body>
<div class="og"><div><p class="name">Abdul Affou</p><h1>Tell me what you're trying to do. I'll build it.</h1><p>Data scientist and graph engineer. Graph engines, data platforms and AI agents.</p></div>${svg}</div>
</body></html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('wrote public/og.png');
