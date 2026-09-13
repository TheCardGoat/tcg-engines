/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PLAYWRIGHT_PORT ? parseInt(process.env.PLAYWRIGHT_PORT, 10) : 5193;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SIMULATOR_BASE_PATH = "/cyberpunk/simulator";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: ".",
  testMatch: ["e2e/specs/**/*.spec.ts", "card-tests/**/e2e.test.ts", "card-tests/**/*.e2e.test.ts"],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    // The Playwright harness depends on dev-only engine bridges
    // (window.__cyberpunkEngine / window.__cyberpunkSimulator), so e2e must run
    // against `vp dev`, never `vp preview`. The /tests/* fixture routes
    // themselves render in production too. Workspace libraries should be built
    // separately in CI.
    command: `vp dev --host 127.0.0.1 --port ${PORT}`,
    url: `${BASE_URL}${SIMULATOR_BASE_PATH}/`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
