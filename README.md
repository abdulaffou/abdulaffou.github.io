# abdulaffou.github.io

Source for [abdulaffou.github.io](https://abdulaffou.github.io), the portfolio of Abdul Affou, data scientist and graph engineer.

One static page built with [Astro](https://astro.build). The hero is a hand-placed graph of companies, projects, tools and industries; a "who are you" switch (`?for=hiring`, `?for=clients`, `?for=engineers`) re-weights and reorders the page for each kind of visitor. Everything works with JavaScript off.

## Run it

```bash
npm install
npm run dev          # http://localhost:4321
npm test             # content integrity checks
npm run test:e2e     # browser tests (Playwright)
```

## Make it yours

Fork it, then replace `src/data/content.ts` and `src/data/graph.ts` with your own story. The components read everything from there. Deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## Licence

Code: MIT. Written content and photos: © Abdul Affou, all rights reserved.
