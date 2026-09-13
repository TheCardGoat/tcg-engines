import { fileURLToPath } from "node:url";

import { defineConfig } from "vite-plus";

const siblingPackage = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@tcg\/gundam-cards$/,
        replacement: siblingPackage("../../../gundam/packages/cards/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-token-data$/,
        replacement: siblingPackage("../../../gundam/packages/token-data/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-types$/,
        replacement: siblingPackage("../../../gundam/packages/types/src/index.ts"),
      },
    ],
  },
  test: {
    globals: true,
    // Adapter modules pull large engine graphs; file-level parallelism double-loads
    // Gundam under CI transform pressure and flakes the registry import smoke test.
    fileParallelism: false,
  },
});
