import type { MarkId } from './marks';

export type Lens = 'default' | 'hiring' | 'clients' | 'engineers';
export type ActiveLens = Exclude<Lens, 'default'>;

export type SectionId =
  | 'work'
  | 'method'
  | 'experience'
  | 'skills'
  | 'code'
  | 'trust'
  | 'about'
  | 'credentials'
  | 'contact';

export type ProjectId =
  | 'clustering'
  | 'attack-paths'
  | 'copilot-agent'
  | 'hos-engine'
  | 'fabric-migration'
  | 'control-tower'
  | 'gsql-vc';

export interface Link {
  label: string;
  href: string;
}

export interface LensCopy {
  lede: string;
  primary: Link;
  secondary: Link;
}

/** One pill in a project's drawing. `hotEdge` colours the line leading into this pill. */
export interface ChainNode {
  label: string;
  hot?: boolean;
  hotEdge?: boolean;
}

export interface Project {
  id: ProjectId;
  title: string;
  client: string;
  headline: string;
  chain: ChainNode[];
  chainLabel: string;
  story: string;
  stack: string;
  role: string;
  result: string;
}

export interface Job {
  id: string;
  years: string;
  company: string;
  role: string;
  description: string;
}

export interface SkillRef {
  label: string;
  projectId?: ProjectId;
}

export interface SkillGroup {
  letters: string;
  items: { term: string; refs: SkillRef[] }[];
}

export interface Repo {
  name: string;
  stack: string;
  paragraphs: string[];
  result?: string;
  url: string;
}

export interface MethodStep {
  name: string;
  heading: string;
  principle: string;
  example: string;
}

export interface Credential {
  label: string;
  detail: string;
}

export interface Photo {
  src: string;
  alt: string;
}

export type NodeKind = 'company' | 'work' | 'domain' | 'skill' | 'oss';
export type EdgeClass = 'company' | 'work' | 'oss';

export interface Pt {
  x: number;
  y: number;
  /** Where the label sits relative to the node. Defaults to below. */
  label?: 'above' | 'below' | 'left' | 'right';
}

/** A logo at a fixed height, or text set like one, with an optional icon before it. */
export type Wordmark = { logo: MarkId; height: number } | { text: string; icon?: MarkId };

export interface GNode {
  id: string;
  label: string;
  /** Optional line break for the phone layout. */
  phoneLines?: string[];
  /** Icon drawn inside the node's circle. */
  mark?: MarkId;
  /** Companies and tools are drawn as their own logo, in place of the circle and label. */
  word?: Wordmark;
  kind: NodeKind;
  desktop: Pt;
  phone: Pt;
  /** Where clicking the node takes you: `project:<id>`, `job:<id>`, `section:<id>` or `aside`. */
  target?: string;
}

export interface GEdge {
  from: string;
  to: string;
  classes: EdgeClass[];
}
