import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const configuredBasePath = process.env.LORCANA_BASE_PATH?.trim().replace(/\/$/, "") ?? "";
const basePath = configuredBasePath.startsWith("/") ? configuredBasePath : "";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Use the Node adapter for Railway/server deployment targets.
    adapter: adapter(),
    paths: {
      base: basePath,
      // Keep app.html assets anchored to the configured app mount so nested
      // routes don't request favicons/manifests from their own URL segment.
      relative: false,
    },
    alias: {
      "@": "./src/lib",
    },
  },
};

export default config;
