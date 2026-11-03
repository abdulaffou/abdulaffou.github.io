import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://abdulaffou.github.io',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
