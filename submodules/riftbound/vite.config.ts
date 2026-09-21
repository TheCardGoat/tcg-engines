import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    tasks: {
      "ci:check": {
        command: 'vp fmt "**/*.{ts,json}" --check && vp run check-types && vp run test',
        cache: false,
      },
      "ci:full": {
        command: "vp run ci:check && vp run -r build",
        cache: false,
      },
    },
  },
});
