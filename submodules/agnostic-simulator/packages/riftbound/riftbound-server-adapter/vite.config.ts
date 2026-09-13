import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@tcg/riftbound-cards": fileURLToPath(
        new URL("../../../../riftbound/packages/cards/src/index.ts", import.meta.url),
      ),
      "@tcg/riftbound-types": fileURLToPath(
        new URL("../../../../riftbound/packages/types/src/index.ts", import.meta.url),
      ),
      "@tcg/riftbound-decks": fileURLToPath(
        new URL("../../../../riftbound/packages/decks/src/index.ts", import.meta.url),
      ),
      "@tcg/shared/game-adapter": fileURLToPath(
        new URL("../../shared/src/game-adapter/index.ts", import.meta.url),
      ),
    },
  },
});
