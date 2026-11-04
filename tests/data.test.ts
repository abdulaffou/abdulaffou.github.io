import { describe, expect, it } from 'vitest';
import * as content from '../src/data/content';
import { LAYOUTS, NODE_RADIUS, graph, labelBox, ringsFrom } from '../src/data/graph';
import type { GNode } from '../src/data/types';

const { projects, skills, SECTION_ORDER, jobs } = content;
const projectIds = new Set(projects.map((p) => p.id));
const sectionIds = new Set(SECTION_ORDER.default);

describe('content', () => {
  it('has the seven projects in spec order', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'clustering',
      'attack-paths',
      'copilot-agent',
      'hos-engine',
      'fabric-migration',
      'control-tower',
      'gsql-vc',
    ]);
  });

  it('every skill reference points at a real project', () => {
    for (const group of skills)
      for (const item of group.items)
        for (const ref of item.refs) if (ref.projectId) expect(projectIds).toContain(ref.projectId);
  });

  it('every lens order is a permutation of the nine sections ending in contact', () => {
    for (const order of Object.values(SECTION_ORDER)) {
      expect([...order].sort()).toEqual([...SECTION_ORDER.default].sort());
      expect(order).toHaveLength(9);
      expect(order.at(-1)).toBe('contact');
    }
  });

  it('keeps excluded and private material off the site', () => {
    const text = JSON.stringify(content);
    expect(text).not.toMatch(/delivered|built by hand|\[verify\]/i);
  });

  it('has no visitor-facing photo placeholders', () => {
    expect(JSON.stringify(content)).not.toMatch(/Shoulders up|Same portrait|placeholder/i);
  });

  it('lists the four jobs, freelance first', () => {
    expect(jobs.map((j) => j.id)).toEqual(['freelance', 'skill-quotient', 'ey', 'novigo']);
  });

  it('every project has a hot final pill in its drawing', () => {
    for (const p of projects) expect(p.chain.some((c) => c.hot)).toBe(true);
  });
});

describe('graph', () => {
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const jobIds = new Set(jobs.map((j) => j.id));

  it('every edge connects existing nodes', () => {
    for (const e of graph.edges) {
      expect(nodeIds).toContain(e.from);
      expect(nodeIds).toContain(e.to);
    }
  });

  it('every node target resolves', () => {
    for (const n of graph.nodes) {
      if (!n.target) continue;
      const [kind, id] = n.target.split(':');
      if (kind === 'project') expect(projectIds).toContain(id);
      else if (kind === 'job') expect(jobIds).toContain(id);
      else if (kind === 'section') expect(sectionIds).toContain(id);
      else expect(n.target).toBe('aside');
    }
  });

  it('every project and company node links somewhere', () => {
    for (const n of graph.nodes)
      if (n.kind === 'work' || n.kind === 'company' || n.kind === 'oss') expect(n.target, n.id).toBeTruthy();
  });

  for (const layout of ['desktop', 'phone'] as const) {
    const { width, height } = LAYOUTS[layout];
    const pos = (n: GNode) => n[layout];

    it(`${layout}: nodes sit inside the canvas`, () => {
      for (const n of graph.nodes) {
        const r = NODE_RADIUS[n.kind];
        expect(pos(n).x - r, n.id).toBeGreaterThanOrEqual(0);
        expect(pos(n).x + r, n.id).toBeLessThanOrEqual(width);
        expect(pos(n).y - r, n.id).toBeGreaterThanOrEqual(0);
        expect(pos(n).y + r, n.id).toBeLessThanOrEqual(height);
      }
    });

    it(`${layout}: no edge runs through a node it does not connect`, () => {
      const byId = new Map(graph.nodes.map((n) => [n.id, n]));
      for (const e of graph.edges) {
        const a = pos(byId.get(e.from)!);
        const b = pos(byId.get(e.to)!);
        for (const n of graph.nodes) {
          if (n.id === e.from || n.id === e.to) continue;
          const p = pos(n);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
          const dist = Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
          expect(dist, `${e.from}-${e.to} passes ${n.id}`).toBeGreaterThan(NODE_RADIUS[n.kind] + 6);
        }
      }
    });

    it(`${layout}: labels stay inside the canvas and never overlap labels or nodes`, () => {
      const boxes = graph.nodes.map((n) => ({ id: n.id, ...labelBox(n, layout) }));
      for (const b of boxes) {
        expect(b.x0, `${b.id} left`).toBeGreaterThanOrEqual(0);
        expect(b.x1, `${b.id} right`).toBeLessThanOrEqual(width);
        expect(b.y0, `${b.id} top`).toBeGreaterThanOrEqual(0);
        expect(b.y1, `${b.id} bottom`).toBeLessThanOrEqual(height);
      }
      const overlap = (a: typeof boxes[number], b: { x0: number; x1: number; y0: number; y1: number }) =>
        a.x0 < b.x1 + 2 && b.x0 < a.x1 + 2 && a.y0 < b.y1 + 2 && b.y0 < a.y1 + 2;
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++)
          expect(overlap(boxes[i], boxes[j]), `${boxes[i].id} label vs ${boxes[j].id} label`).toBe(false);
        for (const n of graph.nodes) {
          if (n.id === boxes[i].id) continue;
          const p = pos(n);
          const r = NODE_RADIUS[n.kind];
          expect(
            overlap(boxes[i], { x0: p.x - r, x1: p.x + r, y0: p.y - r, y1: p.y + r }),
            `${boxes[i].id} label vs ${n.id} node`,
          ).toBe(false);
        }
      }
    });

    it(`${layout}: no edge crosses a label`, () => {
      const byId = new Map(graph.nodes.map((n) => [n.id, n]));
      const segHitsBox = (ax: number, ay: number, bx: number, by: number, b: ReturnType<typeof labelBox>) => {
        for (let t = 0; t <= 1; t += 0.01) {
          const x = ax + (bx - ax) * t;
          const y = ay + (by - ay) * t;
          if (x > b.x0 - 1 && x < b.x1 + 1 && y > b.y0 - 1 && y < b.y1 + 1) return true;
        }
        return false;
      };
      for (const e of graph.edges) {
        const a = pos(byId.get(e.from)!);
        const b = pos(byId.get(e.to)!);
        for (const n of graph.nodes) {
          // A line runs into the logo it connects to; the logo's plate covers its end.
          if (n.word && (n.id === e.from || n.id === e.to)) continue;
          expect(segHitsBox(a.x, a.y, b.x, b.y, labelBox(n, layout)), `${e.from}-${e.to} crosses ${n.id} label`).toBe(false);
        }
      }
    });
  }

  it('the phone graph is no more tangled than the desktop one, and fits a phone screen', () => {
    const crossings = (layout: 'desktop' | 'phone') => {
      const at = (id: string) => graph.nodes.find((n) => n.id === id)![layout];
      const side = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) =>
        (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      let count = 0;
      graph.edges.forEach((e, i) =>
        graph.edges.slice(i + 1).forEach((f) => {
          if ([e.from, e.to].some((id) => id === f.from || id === f.to)) return;
          const [a, b, c, d] = [at(e.from), at(e.to), at(f.from), at(f.to)];
          if (side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0) count++;
        }),
      );
      return count;
    };
    expect(crossings('phone')).toBeLessThanOrEqual(crossings('desktop'));
    expect(LAYOUTS.phone.height).toBeLessThanOrEqual(600);
  });

  it('every node is reachable from the TigerGraph hub', () => {
    expect(ringsFrom().size).toBe(graph.nodes.length);
  });
});

describe('copy', () => {
  it('says "Tell me" only in the headline', async () => {
    const { readFileSync } = await import('node:fs');
    const sources = ['src/data/content.ts', 'src/components/Graph.astro'].map((f) => readFileSync(f, 'utf8')).join('\n');
    expect(sources.match(/tell me/gi)?.length).toBe(1);
  });
});
