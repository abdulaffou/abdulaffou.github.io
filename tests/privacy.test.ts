import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The list of private terms lives in a gitignored file so the public repo never names what it hides.
const listPath = new URL('./private-denylist.json', import.meta.url);
const terms: string[] = existsSync(listPath) ? JSON.parse(readFileSync(listPath, 'utf8')) : [];

describe.skipIf(terms.length === 0)('published files', () => {
  it('never mention a private term', () => {
    const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter((f) => f && !f.endsWith('.png'));
    const hits: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      for (const t of terms) if (text.toLowerCase().includes(t.toLowerCase())) hits.push(`${f}: ${t}`);
    }
    expect(hits).toEqual([]);
  });
});
