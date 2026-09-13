import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    // Full One Piece bot matches routinely exceed the default 5s CI budget.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
