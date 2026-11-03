import type {
  ActiveLens,
  Credential,
  Job,
  Lens,
  LensCopy,
  Link,
  MethodStep,
  Photo,
  Project,
  Repo,
  SectionId,
  SkillGroup,
} from './types';

export const person = {
  name: 'Abdul Affou',
  email: 'gangawaliaffou@gmail.com',
  linkedin: 'https://linkedin.com/in/abdulaffou',
  github: 'https://github.com/abdulaffou',
  repo: 'https://github.com/abdulaffou/abdulaffou.github.io',
  location: 'Bengaluru',
};

export const site = {
  title: 'Abdul Affou: data scientist and graph engineer',
  description:
    'Graph engines, data platforms and AI agents for logistics, cybersecurity and enterprise data. Five years of taking a business problem all the way to working software.',
  headline: "Tell me what you're trying to do. I'll build it.",
  switchLabel: 'First, tell me who you are.',
};

export const LENSES: { id: ActiveLens; label: string }[] = [
  { id: 'hiring', label: "I'm hiring" },
  { id: 'clients', label: 'I need something built' },
  { id: 'engineers', label: "I'm an engineer" },
];

const bookCall: Link = {
  label: 'Book a 30-minute call',
  href: `mailto:${person.email}?subject=Project%20enquiry`,
};

export const LENS_COPY: Record<Lens, LensCopy> = {
  default: {
    lede: 'Data scientist and graph engineer, 5+ years. I build graph engines, data platforms and AI agents for logistics, cybersecurity and enterprise data, from the business problem all the way to working software.',
    primary: { label: 'See the work', href: '#work' },
    secondary: { label: 'Get in touch', href: '#contact' },
  },
  hiring: {
    lede: "Data scientist and graph engineer, 5+ years. Built the graph engine of a cybersecurity product, led graph POCs at EY, cut logistics costs by over 70% at Novigo, and as a freelancer lifted a US logistics company's revenue by about 25%.",
    primary: { label: 'View LinkedIn profile', href: person.linkedin },
    secondary: { label: 'See experience', href: '#experience' },
  },
  clients: {
    lede: "Bring the problem, not the spec. I'll model it, build it and hand it over documented. Your data stays where you say it stays.",
    primary: bookCall,
    secondary: { label: 'How I handle your data', href: '#trust' },
  },
  engineers: {
    lede: 'TigerGraph, Neo4j, Python, FastAPI and Microsoft Fabric. Two side projects you can fork today, both built for real use with real results.',
    primary: { label: 'Browse the repos', href: '#code' },
    secondary: { label: 'github.com/abdulaffou', href: person.github },
  },
};

export const SECTION_ORDER: Record<Lens, SectionId[]> = {
  default: ['work', 'method', 'experience', 'skills', 'code', 'trust', 'about', 'credentials', 'contact'],
  hiring: ['experience', 'work', 'skills', 'method', 'code', 'trust', 'about', 'credentials', 'contact'],
  clients: ['work', 'method', 'trust', 'experience', 'skills', 'code', 'about', 'credentials', 'contact'],
  engineers: ['code', 'work', 'skills', 'method', 'experience', 'trust', 'about', 'credentials', 'contact'],
};

export const NAV: { id: SectionId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'method', label: 'How I work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'code', label: 'Open source' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export const projects: Project[] = [
  {
    id: 'clustering',
    title: 'Clustering a freight network by space and time',
    client: 'Freelance, US logistics company',
    headline: 'About 25% more revenue',
    chainLabel: 'Origin event joins a cluster, clusters connect into lanes, which reveal a return load',
    chain: [
      { label: 'Origin event' },
      { label: 'Cluster' },
      { label: 'Lane' },
      { label: 'Cluster' },
      { label: 'Return load', hot: true, hotEdge: true },
    ],
    story:
      'Every shipment has an origin and a destination, about 400K of them a week. I put each event on the map, linked it to the next to form lanes, and wrote a clustering algorithm from scratch that groups events within 50 miles and shows which clusters feed which. For the first time planners could see how manifests and drivers actually flow, and plan which load a truck picks up on its way back.',
    stack: 'TigerGraph, Python, Google Maps, React',
    role: 'Designed and built the algorithm and the planner view',
    result: 'About 25% more revenue, from trucks that come back full',
  },
  {
    id: 'attack-paths',
    title: 'Finding attack paths in Azure AD',
    client: 'Skill Quotient, cybersecurity product',
    headline: 'Ranked attack paths',
    chainLabel: 'Path from a user through two groups to Domain Admins',
    chain: [
      { label: 'intern@corp' },
      { label: 'Helpdesk', hotEdge: true },
      { label: 'IT-Ops', hotEdge: true },
      { label: 'Domain Admins', hot: true, hotEdge: true },
    ],
    story:
      'Attackers chain group memberships and sessions until they reach a domain admin. I built the identity graph on TigerGraph and the GSQL traversals that find every such path and rank it by risk.',
    stack: 'TigerGraph, GSQL, Python, REST',
    role: 'Architect and builder of the graph engine',
    result: 'A ranked remediation list with each path drawn',
  },
  {
    id: 'copilot-agent',
    title: 'A Copilot agent that knows the network',
    client: 'Freelance, US logistics company',
    headline: 'Load factor on demand',
    chainLabel: 'Clusters, databases and documents feed a Copilot agent used by planners and management',
    chain: [
      { label: 'Clusters' },
      { label: 'Databases' },
      { label: 'Documents' },
      { label: 'Copilot agent', hot: true, hotEdge: true },
      { label: 'Planners and management', hotEdge: true },
    ],
    story:
      "I built a Microsoft Copilot agent grounded on the clustering results, the client's existing databases, the planning tool and their documents. Planners ask which loads a truck has been assigned and how full it is so far. Management asks for today's load factor and how the week is trending.",
    stack: 'Copilot Studio, Microsoft Fabric, TigerGraph',
    role: 'Designed the data, grounding and prompts',
    result: 'Truck fill and load factor on demand, in plain English',
  },
  {
    id: 'hos-engine',
    title: 'Rules as data: an hours-of-service engine',
    client: 'Novigo, automobile client',
    headline: 'About 30% savings',
    chainLabel: 'Driver clock feeds a rule node and condition which produce a required break',
    chain: [
      { label: 'Driver clock' },
      { label: 'Rule node' },
      { label: 'Condition' },
      { label: 'Break required', hot: true, hotEdge: true },
    ],
    story:
      'Driving-hour rules were hardcoded, so every regulation change needed a release. I moved the rules into a graph of about 200 nodes, evaluated live by parameterised GSQL.',
    stack: 'TigerGraph, GSQL, Python, REST',
    role: 'Project lead, owner of the graph',
    result: 'Rules change without code; about 30% savings reported',
  },
  {
    id: 'fabric-migration',
    title: 'Moving a freight business onto Microsoft Fabric',
    client: 'Freelance, US logistics company',
    headline: '15 pipelines in 3 months',
    chainLabel: 'An AS/400 freight system and on-premises pipelines rebuilt as Fabric pipelines',
    chain: [
      { label: 'AS/400 system' },
      { label: 'On-prem pipelines' },
      { label: 'Speed targets' },
      { label: 'Fabric pipelines', hot: true, hotEdge: true },
    ],
    story:
      "A merger meant the client's on-premises systems had to move, fast. I read the legacy docs and pipelines, pinned down the speed each process needed, connected the AS/400 freight system through its SOAP services, and rebuilt every pipeline from scratch in Microsoft Fabric.",
    stack: 'Microsoft Fabric, Data Factory, UDFs, SOAP/WCF, SQL',
    role: 'Owned the migration end to end',
    result: '15 major pipelines moved in 3 months',
  },
  {
    id: 'control-tower',
    title: 'One view of a freight network',
    client: 'EY, logistics client',
    headline: 'One view of the network',
    chainLabel: 'Facility to lane to facility to cost per lane',
    chain: [
      { label: 'Facility' },
      { label: 'Lane' },
      { label: 'Facility' },
      { label: 'Cost per lane', hot: true, hotEdge: true },
    ],
    story:
      'Facilities, lanes, shipments and carriers sat in separate systems. I modelled the whole network as one graph, with entity resolution, cost aggregation and alternate-route queries.',
    stack: 'TigerGraph, SQL Server, Python',
    role: 'Led the build',
    result: 'Cost, delays and bottlenecks in one view',
  },
  {
    id: 'gsql-vc',
    title: 'Version control for graph queries',
    client: 'Novigo, internal tooling',
    headline: 'Every query versioned',
    chainLabel: 'Installed TigerGraph queries are exported as redeployable scripts and committed to Git',
    chain: [
      { label: 'TigerGraph' },
      { label: 'Installed queries' },
      { label: 'Redeployable .gsql' },
      { label: 'Git history', hot: true, hotEdge: true },
    ],
    story:
      'TigerGraph had no built-in way to version the queries a team installs. I built a CI pipeline that exports every installed GSQL query, rewrites it as a script that can be dropped and reinstalled on any graph, and commits the lot to Git.',
    stack: 'Azure Pipelines, GSQL client, Bash, Git',
    role: 'Built it',
    result: 'Every query versioned and redeployable. Code is private.',
  },
];

export const workIntro = 'Seven systems across logistics, cybersecurity and automotive. Open one to see how it connects.';
export const workAside =
  'Also as tech lead at Novigo: two logistics optimisation projects that each cut operations and planning cost by over 70%.';

export const methodIntro = 'The same four steps on every project. Pick one to see it on a real job.';
export const methodSteps: MethodStep[] = [
  {
    name: 'Understand',
    heading: 'What are you actually trying to do?',
    principle: 'Before any code, I find out what done looks like and what it has to be fast enough for.',
    example:
      "On the Fabric migration, that meant reading the legacy docs and pipelines, pinning down each process's speed requirement, and trying Apache NiFi before recommending Fabric.",
  },
  {
    name: 'Model',
    heading: 'Map the entities and how they connect',
    principle: 'Most business problems are relationship problems. Get the model right and the code gets simpler.',
    example: 'In the hours-of-service engine, the rules themselves became nodes, so new rules needed no code.',
  },
  {
    name: 'Build',
    heading: 'Build it, tested as it goes',
    principle: 'Pipelines, graph queries, APIs and the screen people use, with tests that gate every change.',
    example: 'The LEGO tracker runs 200+ tests before every daily run.',
  },
  {
    name: 'Hand over',
    heading: 'Hand it over so your team owns it',
    principle: 'Docs, lineage and runbooks, written for whoever runs it after me.',
    example:
      'At Novigo I founded the Graph Center of Excellence and wrote the modelling standards the team still works from.',
  },
];

export const experienceIntro =
  "Five years in graph technology and data, from founding a company's graph practice to running my own client work.";
export const jobs: Job[] = [
  {
    id: 'freelance',
    years: '2024 – now',
    company: 'Freelance',
    role: 'Independent data and graph consultant, remote',
    description:
      "For a US logistics company: lane clustering that lifted revenue by about 25%, a Copilot agent for planners and management, and 15 major pipelines moved to Microsoft Fabric in three months. Weekly Power BI and cost reviews show planners what went right and what didn't.",
  },
  {
    id: 'skill-quotient',
    years: '2025 – 2026',
    company: 'Skill Quotient',
    role: 'Data Scientist and Graph Database Engineer, Kuala Lumpur (remote)',
    description:
      'Architected the graph engine of a cybersecurity product: identity graph, attack-path traversals and risk scoring, wired into the product UI with the frontend and security teams.',
  },
  {
    id: 'ey',
    years: '2024 – 2025',
    company: 'Ernst and Young (EY)',
    role: 'Consultant, Data Science and Graph Technology, Bengaluru',
    description:
      "Led the graph practice's proofs of concept for clients including a major FMCG company and an international tobacco firm, from discovery to architecture and proposal.",
  },
  {
    id: 'novigo',
    years: '2021 – 2024',
    company: 'Novigo Solutions',
    role: 'Senior Data Scientist, Graph Technology (from Full Stack Engineer), Mangalore',
    description:
      'Founded the Graph Center of Excellence, mentored five developers into graph-native modelling and led two optimisation projects with over 70% cost reduction.',
  },
];

export const skillsIntro = 'Every skill points to where it was used.';
export const skills: SkillGroup[] = [
  {
    letters: 'A–F',
    items: [
      { term: 'AS/400 integration, SOAP/WCF', refs: [{ label: 'Fabric migration', projectId: 'fabric-migration' }] },
      { term: 'Azure DevOps pipelines', refs: [{ label: 'GSQL version control', projectId: 'gsql-vc' }] },
      { term: 'Clustering algorithms', refs: [{ label: 'lane clustering', projectId: 'clustering' }] },
      { term: 'Copilot Studio agents', refs: [{ label: 'network agent', projectId: 'copilot-agent' }] },
      { term: 'Django', refs: [{ label: 'IoT routing, Google Maps geocoding' }] },
      { term: 'Entity resolution', refs: [{ label: 'control tower', projectId: 'control-tower' }] },
      { term: 'FastAPI', refs: [{ label: 'SplitBot' }] },
    ],
  },
  {
    letters: 'G–N',
    items: [
      { term: 'Gemini structured output', refs: [{ label: 'SplitBot' }] },
      {
        term: 'Geospatial analysis, Google Maps',
        refs: [{ label: 'lane clustering', projectId: 'clustering' }, { label: 'IoT routing' }],
      },
      {
        term: 'Graph algorithms',
        refs: [
          { label: 'control tower', projectId: 'control-tower' },
          { label: 'attack paths', projectId: 'attack-paths' },
        ],
      },
      {
        term: 'Microsoft Fabric',
        refs: [{ label: 'Fabric migration', projectId: 'fabric-migration' }, { label: 'freight pipelines' }],
      },
      { term: 'Neo4j, Cypher', refs: [{ label: 'certified 2023' }] },
    ],
  },
  {
    letters: 'O–Z',
    items: [
      { term: 'Ontology design', refs: [{ label: 'HOS rule engine', projectId: 'hos-engine' }] },
      { term: 'Power BI', refs: [{ label: 'weekly planner reviews' }] },
      { term: 'pytest, GitHub Actions', refs: [{ label: 'LEGO tracker, 200+ tests' }] },
      { term: 'Python', refs: [{ label: 'nearly everything here' }] },
      { term: 'React', refs: [{ label: 'lane clustering planner view', projectId: 'clustering' }] },
      {
        term: 'TigerGraph, GSQL',
        refs: [
          { label: 'attack paths', projectId: 'attack-paths' },
          { label: 'HOS engine', projectId: 'hos-engine' },
          { label: 'control tower', projectId: 'control-tower' },
          { label: 'lane clustering', projectId: 'clustering' },
        ],
      },
    ],
  },
];

export const reposIntro = 'Side projects built for real use, with the code public.';
export const repos: Repo[] = [
  {
    name: 'SplitBot',
    stack: 'Python, FastAPI, Gemini, Pydantic, Supabase, Instagram Graph API',
    paragraphs: [
      'An Instagram DM bot for a friend group\'s trip. Type "900 cab with Diya and Esha" and it becomes a ledger entry, with balances and settle-ups.',
      "It never guesses an ambiguous name. It asks, so a typo can't corrupt anyone's balance.",
    ],
    url: 'https://github.com/abdulaffou/split_bot',
  },
  {
    name: 'LEGO Price Tracker',
    stack: 'Python, GitHub Actions, pytest, openpyxl',
    paragraphs: [
      'Checks four Indian retailers every morning, keeps 26K+ rows of price history and emails only when a price is genuinely good.',
    ],
    result: 'Its alerts bought two sets at 50% off.',
    url: 'https://github.com/abdulaffou/lego_tracker',
  },
];

export const trust: string[] = [
  "Most of what I build touches data a company can't afford to lose or leak. So I work inside your environment, with access you grant and you revoke.",
  "An NDA and a written scope come before discovery. Every pipeline is documented down to the field. When we're done, the code, docs and runbooks are yours, and your team can run it without me.",
];

export const about: string[] = [
  'I grew up in Riyadh and Jeddah, studied engineering in Mangalore and now live in Bengaluru. I speak English, Hindi, Urdu, Kannada and Arabic.',
  'Away from work: singing, football, swimming, custom LEGO builds, and six countries so far.',
];

/** Set `src` (a file in /public/photos/) to show a photo. Unset means the slot does not render. */
export const photos: { portrait?: Photo; meetup?: Photo } = {};

export const credentials: Credential[][] = [
  [
    { label: 'Community leader, TigerGraph Bangalore', detail: 'Launched and scaled in 2 months' },
    { label: 'Meetups, workshops and hackathons', detail: 'Ongoing' },
    { label: 'B.E. Information Science, VTU', detail: '2021' },
  ],
  [
    { label: 'Google Advanced Data Analytics', detail: '2024' },
    { label: 'TigerGraph Associate', detail: '2022' },
    { label: 'Neo4j and Cypher Fundamentals', detail: '2023' },
  ],
];

export const contact = {
  heading: 'What are you trying to do?',
  links: [
    { label: 'Email me', href: `mailto:${person.email}` },
    { label: 'LinkedIn', href: person.linkedin },
    { label: 'GitHub', href: person.github },
  ] satisfies Link[],
};

export const footer = {
  left: `${person.name}, ${person.location}. Open to relocation.`,
  right: { label: 'Source on GitHub', href: person.repo },
};

/** Sections that show a "Start here" badge per lens, with the badge text. */
export const START_HERE: Record<ActiveLens, { section: SectionId; text: string }[]> = {
  hiring: [{ section: 'experience', text: 'Start here' }],
  clients: [
    { section: 'work', text: 'Start here' },
    { section: 'trust', text: 'For clients' },
  ],
  engineers: [{ section: 'code', text: 'Start here' }],
};
