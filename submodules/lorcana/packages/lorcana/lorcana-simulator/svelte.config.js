import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Use the Node adapter for Railway/server deployment targets.
    adapter: adapter(),
    paths: {
      // Keep app.html static assets root-relative so nested routes don't
      // request favicons/manifests from their own URL segment.
      relative: false,
    },
    alias: {
      "@": "./src/lib",
    },
  },
};

export default config;
