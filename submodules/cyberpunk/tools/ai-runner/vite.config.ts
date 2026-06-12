import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
  run: {
    tasks: {
      check: {
        command: "vp check",
        input: [{ auto: true }, "!dist/**", "!*.tsbuildinfo"],
      },
      test: {
        command: "vp test",
        input: [{ auto: true }, "!dist/**", "!coverage/**", "!*.tsbuildinfo"],
      },
    },
  },
});
