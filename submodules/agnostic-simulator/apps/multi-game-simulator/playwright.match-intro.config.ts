import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "match-intro.spec.ts",
  timeout: 20_000,
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4198",
    viewport: { width: 1440, height: 960 },
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun ../../packages/shared/fixtures/match-intro/server.ts",
    url: "http://127.0.0.1:4198/lobby",
    reuseExistingServer: !process.env.CI,
  },
});
