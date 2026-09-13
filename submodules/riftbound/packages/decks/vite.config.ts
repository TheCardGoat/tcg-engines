import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: { dts: { tsgo: true }, exports: true },
});
