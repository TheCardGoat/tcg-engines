import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    include: ["tests/index.test.ts", "tests/test-engine.test.ts"],
    isolate: false,
  },
  pack: {
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
      "@tcg/op-cards": fileURLToPath(new URL("../cards/src/index.ts", import.meta.url)),
      "@tcg/op-types": fileURLToPath(new URL("../types/src/index.ts", import.meta.url)),
    },
  },
});
