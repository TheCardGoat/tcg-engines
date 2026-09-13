import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // Keep generation formatting within this independently installed workspace.
  fmt: {},
  resolve: {
    alias: {
      "@tcg/grand-archive-types": fileURLToPath(
        new URL("./packages/types/src/index.ts", import.meta.url),
      ),
    },
  },
  run: {
    tasks: {
      "ci:check": {
        command: "pnpm -r --if-present run check-types && pnpm -r --if-present run test",
        cache: false,
      },
    },
  },
});
