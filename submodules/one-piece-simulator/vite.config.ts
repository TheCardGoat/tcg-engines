import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

const isWorkspaceRoot = resolve(process.cwd()) === import.meta.dirname;

export default defineConfig({
  run: {
    ...(isWorkspaceRoot
      ? {
          cache: {
            scripts: false,
            tasks: true,
          },
        }
      : {}),
    tasks: {
      "ci:check": {
        command: "pnpm exec turbo run check test",
        untrackedEnv: ["TURBO_TOKEN", "TURBO_TEAM", "TURBO_REMOTE_CACHE_SIGNATURE_KEY"],
        input: [
          { auto: true },
          "!node_modules/.vite/task-cache/**",
          "!**/node_modules/.vite-temp/**",
          "!**/.turbo/**",
          "!**/dist/**",
          "!**/coverage/**",
          "!**/*.tsbuildinfo",
        ],
      },
      "ci:full": {
        command: "pnpm exec turbo run check test build",
        untrackedEnv: ["TURBO_TOKEN", "TURBO_TEAM", "TURBO_REMOTE_CACHE_SIGNATURE_KEY"],
        input: [
          { auto: true },
          "!node_modules/.vite/task-cache/**",
          "!**/node_modules/.vite-temp/**",
          "!**/.turbo/**",
          "!**/dist/**",
          "!**/coverage/**",
          "!**/*.tsbuildinfo",
        ],
      },
      "full-ready": {
        command: "vp fmt && vp lint && pnpm exec turbo run test build",
        untrackedEnv: ["TURBO_TOKEN", "TURBO_TEAM", "TURBO_REMOTE_CACHE_SIGNATURE_KEY"],
        input: [
          { auto: true },
          "!node_modules/.vite/task-cache/**",
          "!**/node_modules/.vite-temp/**",
          "!**/.turbo/**",
          "!**/dist/**",
          "!**/coverage/**",
          "!**/*.tsbuildinfo",
        ],
      },
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  lint: {
    ignorePatterns: ["**/dist/**"],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ["**/dist/**"],
  },
  resolve: {
    alias: {
      "@tcg/op-cards": fileURLToPath(new URL("./packages/cards/src/index.ts", import.meta.url)),
      "@tcg/op-engine": fileURLToPath(new URL("./packages/engine/src/index.ts", import.meta.url)),
      "@tcg/op-types": fileURLToPath(new URL("./packages/types/src/index.ts", import.meta.url)),
    },
  },
});
