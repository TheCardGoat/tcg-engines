import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@tcg/cyberpunk-cards": fileURLToPath(
        new URL("../../../../cyberpunk/packages/cards/src/index.ts", import.meta.url),
      ),
      "@tcg/cyberpunk-engine": fileURLToPath(
        new URL("../../../../cyberpunk/packages/engine/src/index.ts", import.meta.url),
      ),
      "@tcg/cyberpunk-types": fileURLToPath(
        new URL("../../../../cyberpunk/packages/types/src/index.ts", import.meta.url),
      ),
    },
  },
});
