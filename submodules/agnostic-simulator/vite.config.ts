import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    ignorePatterns: ["**/*.test.ts"],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
