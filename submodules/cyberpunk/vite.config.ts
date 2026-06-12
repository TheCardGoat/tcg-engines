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
        command: 'vp fmt "**/*.{ts,tsx,css}" --check && vp check --no-fmt && bunx turbo run test',
        input: [
          { auto: true },
          "!node_modules/.vite/task-cache/**",
          "!dist/**",
          "!*.tsbuildinfo",
          "!coverage/**",
        ],
      },
      "ci:full": {
        command:
          'vp fmt "**/*.{ts,tsx,css}" --check && vp check --no-fmt && bunx turbo run test build',
        input: [
          { auto: true },
          "!node_modules/.vite/task-cache/**",
          "!dist/**",
          "!*.tsbuildinfo",
          "!coverage/**",
        ],
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
