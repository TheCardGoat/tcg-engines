import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
  run: {
    tasks: {
      build: {
        command: "vp pack",
        input: [{ auto: true }, "!dist/**", "!*.tsbuildinfo"],
      },
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
