import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev -- --port 5174",
    port: 5174,
    reuseExistingServer: true,
  },
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:5174",
  },
});
