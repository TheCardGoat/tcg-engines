import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@tcg-engines/naruto-cards": fileURLToPath(
        new URL("../../../../naruto/packages/cards/src/index.ts", import.meta.url),
      ),
      "@tcg-engines/naruto-engine": fileURLToPath(
        new URL("../../../../naruto/packages/engine/src/index.ts", import.meta.url),
      ),
    },
  },
});
