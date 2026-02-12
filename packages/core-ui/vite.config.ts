import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    enhancedImages(),
    tailwindcss(),
    sveltekit(),
    devtoolsJson(),
    paraglideVitePlugin({
      outdir: "./src/lib/paraglide",
      project: "./project.inlang",
    }),
  ],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          // Environment: "browser",
          // Browser: {
          //   Enabled: true,
          //   Provider: "playwright",
          //   Instances: [{ browser: "chromium" }],
          // },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["./vitest-setup-client.ts"],
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
