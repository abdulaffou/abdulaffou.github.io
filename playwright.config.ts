import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  workers: 3,
  retries: 1,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:4321', ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  webServer: {
    command: './node_modules/.bin/astro build && exec python3 -m http.server 4321 --bind 127.0.0.1 -d dist',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
