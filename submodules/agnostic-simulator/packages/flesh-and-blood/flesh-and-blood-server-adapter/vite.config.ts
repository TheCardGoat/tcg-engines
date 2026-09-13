import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

/** Test the linked FAB source packages, never a potentially stale local dist. */
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@tcg\/flesh-and-blood-cards\/catalog$/,
        replacement: fileURLToPath(
          new URL("../../../../flesh-and-blood/packages/cards/src/catalog.ts", import.meta.url),
        ),
      },
      {
        find: /^@tcg\/flesh-and-blood-cards\/runtime-registry$/,
        replacement: fileURLToPath(
          new URL(
            "../../../../flesh-and-blood/packages/cards/src/runtime-registry.ts",
            import.meta.url,
          ),
        ),
      },
      {
        find: /^@tcg\/flesh-and-blood-cards$/,
        replacement: fileURLToPath(
          new URL("../../../../flesh-and-blood/packages/cards/src/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@tcg\/flesh-and-blood-types\/authoring$/,
        replacement: fileURLToPath(
          new URL("../../../../flesh-and-blood/packages/types/src/authoring.ts", import.meta.url),
        ),
      },
      {
        find: /^@tcg\/flesh-and-blood-types\/catalog$/,
        replacement: fileURLToPath(
          new URL("../../../../flesh-and-blood/packages/types/src/catalog.ts", import.meta.url),
        ),
      },
      {
        find: /^@tcg\/flesh-and-blood-types$/,
        replacement: fileURLToPath(
          new URL("../../../../flesh-and-blood/packages/types/src/index.ts", import.meta.url),
        ),
      },
    ],
  },
});
