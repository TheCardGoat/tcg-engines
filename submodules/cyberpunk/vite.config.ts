import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

const isWorkspaceRoot = resolve(process.cwd()) === import.meta.dirname;

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  test: {
    environment: "jsdom",
    // Match the CI runner capacity; simulation tests have wall-clock budgets.
    maxWorkers: 2,
    exclude: [
      "**/.claude/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/e2e/**",
      "**/e2e.test.ts",
      "**/*.e2e.test.ts",
    ],
    globals: true,
  },
  run: {
    ...(isWorkspaceRoot ? { cache: { tasks: true, scripts: false } } : {}),
    tasks: {
      "ci:check": {
        command:
          'node --test tools/card-faq-inventory.checks.mjs && vp fmt "**/*.{ts,tsx,css}" --check && vp check --no-fmt && node packages/cards/scripts/audit-canonical-card-layout.mjs && node tools/check-card-faq-coverage.mjs --all-tests',
        cache: false,
      },
      "ci:faq": {
        command:
          "node --test tools/card-faq-inventory.checks.mjs && node tools/check-card-faq-coverage.mjs --run-tests",
        cache: false,
      },
      "ci:full": {
        command: "vp run ci:check && bunx turbo run build",
        cache: false,
      },
      pack: {
        command: "true",
        dependsOn: [
          "@tcg/cyberpunk-types#build",
          "@tcg/cyberpunk-cards#build",
          "@tcg/cyberpunk-engine#build",
          "@tcg/cyberpunk-utils#build",
          "@tcg/cyberpunk-scraper#build",
          "@tcg/cyberpunk-parser#build",
        ],
        input: [{ auto: true }, "!node_modules/.vite/task-cache/**", "!dist/**", "!*.tsbuildinfo"],
      },
      "build:libs": {
        command: "true",
        dependsOn: [
          "@tcg/cyberpunk-types#build",
          "@tcg/cyberpunk-cards#build",
          "@tcg/cyberpunk-engine#build",
          "@tcg/cyberpunk-utils#build",
        ],
        input: [{ auto: true }, "!node_modules/.vite/task-cache/**", "!dist/**", "!*.tsbuildinfo"],
      },
      ready: {
        command: "vp fmt && vp lint && vp run -r test && vp run -r build",
        input: [
          { auto: true },
          "!node_modules/.vite/task-cache/**",
          "!dist/**",
          "!*.tsbuildinfo",
          "!coverage/**",
        ],
      },
    },
  },
});
