import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts", "src/preconstructed-decks.ts"],
    dts: true,
    exports: true,
  },
  lint: {
    ignorePatterns: ["**/dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ["**/dist/**"],
  },
  resolve: {
    alias: {
      "@tcg/op-types": fileURLToPath(new URL("../types/src/index.ts", import.meta.url)),
    },
  },
});
