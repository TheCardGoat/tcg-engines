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
        command:
          'vp fmt "**/*.{ts,tsx,css}" --check && vp lint && pnpm exec turbo run check-types test',
        cache: false,
      },
      "ci:full": {
        command: "vp run ci:check && pnpm exec turbo run build",
        cache: false,
      },
    },
  },
});
