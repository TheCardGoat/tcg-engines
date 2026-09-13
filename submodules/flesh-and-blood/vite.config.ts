import { defineConfig } from "vite-plus";
import { fileURLToPath } from "node:url";

const localPerformanceBenchmarkEnabled =
  process.env.FAB_RUNTIME_BENCHMARK === "1" ||
  process.env.FAB_TEST_INITIALIZATION_BENCHMARK === "1";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@tcg\/flesh-and-blood-types\/catalog$/,
        replacement: fileURLToPath(new URL("./packages/types/src/catalog.ts", import.meta.url)),
      },
      {
        find: /^@tcg\/flesh-and-blood-types\/authoring$/,
        replacement: fileURLToPath(new URL("./packages/types/src/authoring.ts", import.meta.url)),
      },
      {
        find: /^@tcg\/flesh-and-blood-types$/,
        replacement: fileURLToPath(new URL("./packages/types/src/index.ts", import.meta.url)),
      },
    ],
  },
  test: {
    // Deck-qa play-lines share the thread pool with ~4k card tests; 5s default
    // times out healthy cases under that load (they finish in <1s isolated).
    testTimeout: 20_000,
    // Generated card-behavior plans are inventory requirements, not runnable
    // proof. Coverage inventory lives in packages/cards/scripts/card-coverage.ts.
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/card-behavior/plans/**",
      ...(!localPerformanceBenchmarkEnabled ? ["**/*.local-only.test.ts"] : []),
    ],
  },
  fmt: {
    ignorePatterns: [
      // Compact JSON is a hashed CDN artifact; oxfmt pretty-print makes --check fail.
      "packages/cards/src/generated/presentation-catalog.json",
      "packages/cards/src/generated/presentation-revision.ts",
    ],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    rules: {
      // FabEffect / ability AST uses `then` / `else` branches (CR conditionals).
      // Same project-wide skip as lorcana/platform — not a Promise thenable.
      "unicorn/no-thenable": "off",
    },
  },
  run: {
    tasks: {
      check: {
        command: "vp check",
        cache: false,
      },
      "ci:check": {
        command:
          // fmt skipped: oxfmt has no project config and flags 4k+ pre-existing files under defaults.
          // Run `vp fmt packages/engine --write` once config is restored.
          // Product packages only. tools/catalog is snapshot ingestion, not
          // production runtime — keep it out of the product gate.
          "pnpm -r --if-present --filter './packages/**' run check-types && pnpm -r --if-present --filter './packages/**' run test",
        cache: false,
      },
      "ci:full": {
        command: "vp run ci:check && pnpm run build",
        cache: false,
      },
    },
  },
  staged: {
    "*": "vp check --fix",
  },
});
