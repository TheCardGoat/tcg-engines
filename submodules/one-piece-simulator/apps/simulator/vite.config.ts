import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/one-piece-simulator/" : "/",
  lint: {
    ignorePatterns: ["**/dist/**"],
  },
  fmt: {
    ignorePatterns: ["**/dist/**"],
  },
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@tcg/op-engine": fileURLToPath(
        new URL("../../packages/engine/src/index.ts", import.meta.url),
      ),
      "@tcg/op-cards": fileURLToPath(new URL("../../packages/cards/src/index.ts", import.meta.url)),
      "@tcg/op-types": fileURLToPath(new URL("../../packages/types/src/index.ts", import.meta.url)),
    },
  },
}));
