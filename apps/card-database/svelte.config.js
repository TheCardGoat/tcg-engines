import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // For more information about preprocessors
  extensions: [".svelte", ".svx"],

  kit: {
    // Cloudflare Pages adapter
    // See https://svelte.dev/docs/kit/adapter-cloudflare for more information
    adapter: adapter({
      // Render a plaintext 404 page for non-matching asset requests
      fallback: "plaintext",
      routes: {
        exclude: ["<all>"],
        include: ["/*"],
      },
    }),
  },

  preprocess: [vitePreprocess(), mdsvex()],
};

export default config;
