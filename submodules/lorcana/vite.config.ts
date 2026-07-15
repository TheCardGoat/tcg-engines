import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    cache: {
      tasks: true,
      scripts: false,
    },
    tasks: {
      "ci:check": {
        command: "pnpm exec turbo run lint check-types test",
        cache: false,
      },
      "ci:full": {
        command: "vp run ci:check && pnpm exec turbo run build",
        cache: false,
      },
    },
  },
  staged: { "*": "vp check --fix" },
  lint: {
    options: { typeAware: false, typeCheck: false },
    rules: {
      "unicorn/no-empty-file": "off",
      "unicorn/no-thenable": "off",
      "eslint/no-unused-vars": "off",
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
});
