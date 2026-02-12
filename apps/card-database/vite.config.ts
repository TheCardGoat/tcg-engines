import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vitest/config";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@tcg/core-ui", "@tcg/lorcana-cards"],
  },
  plugins: [
    tailwindcss(),
    sveltekit(),
    devtoolsJson(),
    paraglideVitePlugin({
      outdir: "./src/lib/paraglide",
      project: "./project.inlang",
    }) as any,
  ],
  test: {
    expect: { requireAssertions: true },

    projects: [
      {
        extends: "./vite.config.ts",

        test: {
          name: "client",

          // Browser: {
          //   Enabled: true,
          //   Provider: playwright(),
          //   Instances: [{ browser: "chromium", headless: true }],
          // },

          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
        },
      },

      {
        extends: "./vite.config.ts",

        test: {
          environment: "node",
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          include: ["src/**/*.{test,spec}.{js,ts}"],
          name: "server",
        },
      },
    ],
  },
});
