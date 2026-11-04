import { MARKS } from './marks';
import type { GEdge, GNode, NodeKind } from './types';

export const LAYOUTS = {
  desktop: { width: 640, height: 520, font: 13, companyFont: 14 },
  phone: { width: 360, height: 600, font: 15, companyFont: 16 },
} as const;
export type LayoutName = keyof typeof LAYOUTS;

export const NODE_RADIUS: Record<NodeKind, number> = {
  company: 16,
  work: 9,
  domain: 13,
  skill: 13,
  oss: 9,
};

/** Hand-placed so the picture is the same on every load. Phone has its own layout with larger labels. */
export const graph: { nodes: GNode[]; edges: GEdge[] } = {
  nodes: [
    { id: 'novigo', label: 'Novigo', word: { logo: 'novigo', height: 18 }, kind: 'company', desktop: { x: 110, y: 250, label: 'left' }, phone: { x: 184, y: 83, label: 'above' }, target: 'job:novigo' },
    { id: 'ey', label: 'EY', word: { logo: 'ey', height: 30 }, kind: 'company', desktop: { x: 300, y: 110, label: 'above' }, phone: { x: 84, y: 268, label: 'right' }, target: 'job:ey' },
    { id: 'skill-quotient', label: 'Skill Quotient', word: { text: 'Skill Quotient' }, kind: 'company', desktop: { x: 495, y: 120 }, phone: { x: 92, y: 481, label: 'above' }, target: 'job:skill-quotient' },
    { id: 'freelance', label: 'Freelance', word: { text: 'Freelance', icon: 'briefcase' }, kind: 'company', desktop: { x: 420, y: 370, label: 'left' }, phone: { x: 217, y: 316, label: 'right' }, target: 'job:freelance' },
    { id: 'hos', label: 'HOS rule engine', kind: 'work', desktop: { x: 70, y: 140, label: 'right' }, phone: { x: 105, y: 44, label: 'above' }, target: 'project:hos-engine' },
    { id: 'freight', label: 'Freight optimisation', phoneLines: ['Freight', 'optimisation'], kind: 'work', desktop: { x: 90, y: 390 }, phone: { x: 283, y: 63, label: 'above' }, target: 'aside' },
    { id: 'control-tower', label: 'Control tower', kind: 'work', desktop: { x: 200, y: 40, label: 'above' }, phone: { x: 57, y: 171, label: 'above' }, target: 'project:control-tower' },
    { id: 'attack-paths', label: 'Attack paths', kind: 'work', desktop: { x: 590, y: 210 }, phone: { x: 134, y: 561, label: 'right' }, target: 'project:attack-paths' },
    { id: 'clustering', label: 'Lane clustering', kind: 'work', desktop: { x: 290, y: 450 }, phone: { x: 295, y: 223, label: 'above' }, target: 'project:clustering' },
    { id: 'agent', label: 'Network agent', phoneLines: ['Network', 'agent'], kind: 'work', desktop: { x: 450, y: 430 }, phone: { x: 282, y: 399, label: 'right' }, target: 'project:copilot-agent' },
    { id: 'fabric', label: 'Fabric migration', kind: 'work', desktop: { x: 580, y: 420 }, phone: { x: 290, y: 451 }, target: 'project:fabric-migration' },
    { id: 'logistics', label: 'Logistics', mark: 'truck', kind: 'domain', desktop: { x: 220, y: 300, label: 'left' }, phone: { x: 215, y: 208 } },
    { id: 'cyber', label: 'Cybersecurity', mark: 'shield', kind: 'domain', desktop: { x: 560, y: 40, label: 'above' }, phone: { x: 74, y: 585, label: 'right' } },
    { id: 'automotive', label: 'Automotive', mark: 'car', kind: 'domain', desktop: { x: 90, y: 40, label: 'above' }, phone: { x: 44, y: 64 } },
    { id: 'tigergraph', label: 'TigerGraph', word: { logo: 'tigergraph', height: 22 }, kind: 'skill', desktop: { x: 330, y: 240 }, phone: { x: 136, y: 363, label: 'right' } },
    { id: 'python', label: 'Python', word: { text: 'Python', icon: 'python' }, kind: 'skill', desktop: { x: 480, y: 270, label: 'above' }, phone: { x: 189, y: 435, label: 'above' } },
    { id: 'splitbot', label: 'SplitBot', kind: 'oss', desktop: { x: 600, y: 300 }, phone: { x: 190, y: 534, label: 'right' }, target: 'section:code' },
    { id: 'lego', label: 'LEGO tracker', kind: 'oss', desktop: { x: 540, y: 345 }, phone: { x: 237, y: 510, label: 'right' }, target: 'section:code' },
  ],
  edges: [
    { from: 'novigo', to: 'tigergraph', classes: ['company'] },
    { from: 'ey', to: 'tigergraph', classes: ['company'] },
    { from: 'skill-quotient', to: 'tigergraph', classes: ['company'] },
    { from: 'novigo', to: 'hos', classes: ['company', 'work'] },
    { from: 'novigo', to: 'freight', classes: ['company', 'work'] },
    { from: 'ey', to: 'control-tower', classes: ['company', 'work'] },
    { from: 'skill-quotient', to: 'attack-paths', classes: ['company', 'work'] },
    { from: 'freelance', to: 'clustering', classes: ['company', 'work'] },
    { from: 'freelance', to: 'agent', classes: ['company', 'work'] },
    { from: 'freelance', to: 'fabric', classes: ['company', 'work'] },
    { from: 'attack-paths', to: 'cyber', classes: ['work'] },
    { from: 'control-tower', to: 'logistics', classes: ['work'] },
    { from: 'freight', to: 'logistics', classes: ['work'] },
    { from: 'clustering', to: 'logistics', classes: ['work'] },
    { from: 'agent', to: 'clustering', classes: ['work'] },
    { from: 'agent', to: 'fabric', classes: ['work'] },
    { from: 'hos', to: 'automotive', classes: ['work'] },
    { from: 'tigergraph', to: 'python', classes: ['oss'] },
    { from: 'freelance', to: 'python', classes: ['oss'] },
    { from: 'splitbot', to: 'python', classes: ['oss'] },
    { from: 'lego', to: 'python', classes: ['oss'] },
  ],
};

export function fontFor(node: GNode, layout: LayoutName): number {
  const l = LAYOUTS[layout];
  return node.kind === 'company' ? l.companyFont : l.font;
}

export function linesFor(node: GNode, layout: LayoutName): string[] {
  return layout === 'phone' && node.phoneLines ? node.phoneLines : [node.label];
}

/** Text wordmarks are set in Archivo 800 at 112% width; their widths in em, measured in the browser. */
export const WORD_TEXT_EM: Record<string, number> = { 'Skill Quotient': 7.35, Freelance: 5.55, Python: 3.9 };
/** Space between a wordmark and the edge of the plate that hides the lines beneath it. */
export const WORD_PAD = 5;

export function wordFont(layout: LayoutName): number {
  return LAYOUTS[layout].companyFont + 1;
}

/** Width and height of a node's wordmark, and where its icon and text sit, centred on the node. */
export function wordLayout(node: GNode, layout: LayoutName) {
  const word = node.word!;
  if ('logo' in word) {
    const [, , vw, vh] = MARKS[word.logo].viewBox.split(' ').map(Number);
    return { w: (word.height * vw) / vh, h: word.height, icon: 0, gap: 0, fs: 0 };
  }
  const fs = wordFont(layout);
  const icon = word.icon ? Math.round(fs * 1.35) : 0;
  const gap = word.icon ? Math.round(fs * 0.35) : 0;
  return { w: icon + gap + WORD_TEXT_EM[word.text] * fs, h: Math.max(icon, fs * 1.2), icon, gap, fs };
}

/** Text anchor point, anchor and first-line baseline for a node label. */
export function labelPlacement(node: GNode, layout: LayoutName) {
  const p = node[layout];
  const r = NODE_RADIUS[node.kind];
  const fs = fontFor(node, layout);
  const lines = linesFor(node, layout).length;
  switch (p.label ?? 'below') {
    case 'above':
      return { x: p.x, y: p.y - r - 10 - (lines - 1) * fs * 1.2, anchor: 'middle' as const };
    case 'left':
      return { x: p.x - r - 8, y: p.y + fs * 0.35, anchor: 'end' as const };
    case 'right':
      return { x: p.x + r + 8, y: p.y + fs * 0.35, anchor: 'start' as const };
    default:
      return { x: p.x, y: p.y + r + 18, anchor: 'middle' as const };
  }
}

/** Approximate label bounding box, used by tests to keep labels clear of each other. A wordmark is its own label. */
export function labelBox(node: GNode, layout: LayoutName) {
  if (node.word) {
    const { w, h } = wordLayout(node, layout);
    const { x, y } = node[layout];
    return { x0: x - w / 2 - WORD_PAD, x1: x + w / 2 + WORD_PAD, y0: y - h / 2 - WORD_PAD, y1: y + h / 2 + WORD_PAD };
  }
  const fs = fontFor(node, layout);
  const lines = linesFor(node, layout);
  const charW = fs * (node.kind === 'company' ? 0.6 : 0.56);
  const w = Math.max(...lines.map((l) => l.length)) * charW;
  const { x, y, anchor } = labelPlacement(node, layout);
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x : x - w;
  return { x0, x1: x0 + w, y0: y - fs * 0.78, y1: y + fs * 0.22 + (lines.length - 1) * fs * 1.2 };
}

/** Breadth-first ring of every node from the TigerGraph hub, for the intro animation. */
export function ringsFrom(start = 'tigergraph'): Map<string, number> {
  const ring = new Map<string, number>([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const id = queue.shift()!;
    for (const e of graph.edges) {
      const next = e.from === id ? e.to : e.to === id ? e.from : null;
      if (next && !ring.has(next)) {
        ring.set(next, ring.get(id)! + 1);
        queue.push(next);
      }
    }
  }
  return ring;
}

export function neighbours(id: string): Set<string> {
  const out = new Set<string>([id]);
  for (const e of graph.edges) {
    if (e.from === id) out.add(e.to);
    if (e.to === id) out.add(e.from);
  }
  return out;
}
