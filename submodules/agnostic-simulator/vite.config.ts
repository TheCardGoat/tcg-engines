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
    tasks: {
      "ci:check": {
        command: "pnpm run check && vp run -r test",
        cache: false,
      },
      "ci:full": {
        command: "vp run ci:check && vp run -r build",
        cache: false,
      },
    },
  },
});
