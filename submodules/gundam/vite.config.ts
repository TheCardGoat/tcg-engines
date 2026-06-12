import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

const isWorkspaceRoot = resolve(process.cwd()) === import.meta.dirname;

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["**/dist/**", "**/build/**", "**/.turbo/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
  run: {
    ...(isWorkspaceRoot ? { cache: { tasks: true, scripts: false } } : {}),
    tasks: {
      "ci:check": {
        command: "vp fmt --check && vp lint && pnpm exec turbo run test",
        untrackedEnv: ["TURBO_TOKEN", "TURBO_TEAM", "TURBO_REMOTE_CACHE_SIGNATURE_KEY"],
        input: [{ auto: true }, "!**/*.tsbuildinfo", "!**/dist/**", "!**/build/**", "!**/.vite/**"],
      },
      "ci:full": {
        command: "vp fmt --check && vp lint && pnpm exec turbo run test build",
        untrackedEnv: ["TURBO_TOKEN", "TURBO_TEAM", "TURBO_REMOTE_CACHE_SIGNATURE_KEY"],
        input: [{ auto: true }, "!**/*.tsbuildinfo", "!**/dist/**", "!**/build/**", "!**/.vite/**"],
      },
      pack: {
        command: "pnpm exec turbo run build --filter='./packages/*' --filter='./tools/*'",
        untrackedEnv: ["TURBO_TOKEN", "TURBO_TEAM", "TURBO_REMOTE_CACHE_SIGNATURE_KEY"],
        input: [{ auto: true }, "!**/*.tsbuildinfo", "!**/dist/**", "!**/build/**", "!**/.vite/**"],
      },
    },
  },
});
