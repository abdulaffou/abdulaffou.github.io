# abdulaffou.github.io

Abdul Affou's personal portfolio: a one-page static site for hiring managers, consulting clients and engineers. Live at https://abdulaffou.github.io (GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main`).

Read `CLAUDE.local.md` too if it exists: it holds private notes (sources, exclusions, client confidentiality) that are deliberately not in this public repo.

## Where things live

- **Content:** `src/data/content.ts` (copy, projects, jobs, skills, repos, lens copy, section order) and `src/data/graph.ts` (hero graph nodes, edges, desktop and phone coordinates). Types in `src/data/types.ts`. Change content here, not in components.
- **Components:** `src/components/*.astro`, one per page section. They render plain HTML that works with JavaScript off.
- **Behaviour:** `src/scripts/` — `lens.ts` (who-are-you switch, `?for=` URL, section reorder), `graph.ts` (hover highlight, click-to-target), `collapse.ts` (animated project panels, Expand all), `method.ts` (How I work stepper). The first-load intro is pure CSS keyed on `html.intro`, set by the inline script in `src/layouts/Base.astro`.
- **Styles:** `src/styles/tokens.css` (colour and motion tokens), `src/styles/global.css`.
- **Share image:** `public/og.png`, regenerated with `npm run og` against a served build.

## Commands

- `npm run dev` — local dev server
- `npm test` — content, graph-geometry and privacy checks (Vitest)
- `npm run test:e2e` — behaviour, accessibility and layout tests (Playwright; builds and serves `dist` itself)

## Rules that must not break

- **Confidentiality:** freelance work is always "a US logistics company"; consulting clients stay anonymous; private repositories are described, never linked.
- **Facts:** every number on the site must be one Abdul has confirmed. Don't invent stats.
- **No trackers or analytics**, no runtime requests to third parties (fonts are self-hosted via Fontsource).
- **Accessibility:** WCAG 2.1 AA, keyboard operable, visible focus, everything respects `prefers-reduced-motion`.
- **No visitor-facing placeholders.** Photos render only when set in `photos` in `content.ts`.
- **Look:** graphite `#121417` (warm near-black, no blue) with amber `#F2A541` as the only colour, Archivo (wide for headlines), Newsreader only for the data letter and skills-index letters. No gradients, glass, emoji, skill bars or logo walls.
- **Graph edits:** after moving nodes, `npm test` checks that no edge crosses a node or label and that labels never overlap.

## Pending (from Abdul)

- Résumé PDF: the hiring button points to LinkedIn until one is chosen; then put it in `public/` and update `LENS_COPY.hiring.primary`.
- Portrait (4:5) and meetup photo (3:2): put in `public/photos/` and set `photos` in `content.ts`.
- Booking link: "Book a 30-minute call" is a mailto until a Calendly-style link exists.
