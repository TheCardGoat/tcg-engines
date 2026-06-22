import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

const isWorkspaceRoot = resolve(process.cwd()) === import.meta.dirname;

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  run: {
    ...(isWorkspaceRoot ? { cache: { tasks: true, scripts: false } } : {}),
    tasks: {
      "ci:check": {
        command: "bunx turbo run check-types test",
        input: [
          { auto: true },
          "!**/*.tsbuildinfo",
          "!**/dist/**",
          "!**/.vite/**",
          "!**/.turbo/**",
        ],
      },
      "ci:full": {
        command: "bunx turbo run check-types test build",
        input: [
          { auto: true },
          "!**/*.tsbuildinfo",
          "!**/dist/**",
          "!**/.vite/**",
          "!**/.turbo/**",
        ],
      },
    },
  },
});
