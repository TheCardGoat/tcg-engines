import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@tcg/op-cards": fileURLToPath(
        new URL("../../../../one-piece/packages/cards/src/index.ts", import.meta.url),
      ),
      "@tcg/op-engine": fileURLToPath(
        new URL("../../../../one-piece/packages/engine/src/index.ts", import.meta.url),
      ),
      "@tcg/op-types": fileURLToPath(
        new URL("../../../../one-piece/packages/types/src/index.ts", import.meta.url),
      ),
    },
  },
});
