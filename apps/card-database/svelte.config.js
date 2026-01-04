import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex()],

  kit: {
    // Cloudflare Pages adapter - see https://svelte.dev/docs/kit/adapter-cloudflare
    adapter: adapter(),
  },

  extensions: [".svelte", ".svx"],
};

export default config;
