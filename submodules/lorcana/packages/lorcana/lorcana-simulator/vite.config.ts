import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type UserConfig } from "vite-plus";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

async function loadSvelteKitPlugin() {
  const originalCwd = process.cwd();

  try {
    process.chdir(packageRoot);
    const { sveltekit } = await import("@sveltejs/kit/vite");
    return sveltekit();
  } finally {
    process.chdir(originalCwd);
  }
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, packageRoot, "");
  const hotUpdateDelayMs = Number(env.HOT_UPDATE_DELAY_MS ?? 0);
  const shouldDelayHotUpdates = Number.isFinite(hotUpdateDelayMs) && hotUpdateDelayMs > 0;
  const paraglideWatchIgnore = ["**/src/lib/paraglide/**"];
  // When this package is nested as a submodule of the-card-goat-online, pnpm
  // hoists deps like @sveltejs/kit to the outer monorepo's node_modules, which
  // lives above this package's own workspace root and is rejected by Vite's
  // default fs.allow. Probe for an outer-monorepo marker before extending the
  // allow list — in a standalone checkout this candidate path resolves to "/"
  // and must NOT be allowed (would expose readable files via /@fs when
  // --host is used).
  const candidateOuterRoot = fileURLToPath(new URL("../../../../../", import.meta.url));
  const isNestedInConsumingMonorepo = existsSync(
    join(candidateOuterRoot, "submodules/lorcana/pnpm-workspace.yaml"),
  );
  const extraFsAllow = isNestedInConsumingMonorepo ? [candidateOuterRoot] : undefined;

  // The union of these three plugins' return types blows TypeScript's
  // structural comparison budget under svelte-check on CI ("Excessive stack
  // depth comparing types 'Plugin<any>[]' and 'Plugin<any>[]'", TS2321) but
  // the error doesn't reproduce locally. Cast each element to `unknown`
  // individually so inference never attempts to unify the Plugin<any>[] types.
  const plugins: unknown[] = [
    tailwindcss() as unknown,
    (await loadSvelteKitPlugin()) as unknown,
    paraglideVitePlugin({ project: "./project.inlang", outdir: "./src/lib/paraglide" }) as unknown,
  ];

  return {
    root: packageRoot,
    server: {
      port: 5173, // your preferred starting port
      strictPort: false, // fall through to next available
      ...(extraFsAllow && {
        fs: { allow: extraFsAllow },
      }),
      watch: {
        // Paraglide regenerates this directory during dev. Watching it causes
        // Vite to invalidate the graph from its own generated output.
        ignored: paraglideWatchIgnore,
      },
    },
    resolve: {
      conditions: mode === "test" ? ["browser"] : undefined,
      alias: {
        "node:events": fileURLToPath(new URL("./src/lib/shims/node-events.ts", import.meta.url)),
        "node:module": fileURLToPath(new URL("./src/lib/shims/node-module.ts", import.meta.url)),
        // daisyui has `"browser": "./daisyui.css"` which Vite's resolver picks up via
        // browser conditions, causing @tailwindcss/vite to fail loading it as a JS plugin.
        // Force resolution to the JS entry point.
        daisyui: fileURLToPath(import.meta.resolve("daisyui/index.js")),
      },
    },
    plugins: plugins as UserConfig["plugins"],
    optimizeDeps: {
      include: [
        "@tcg/lorcana-cards/cards/001",
        "@tcg/lorcana-cards/cards/002",
        "@tcg/lorcana-cards/cards/003",
        "@tcg/lorcana-cards/cards/004",
        "@tcg/lorcana-cards/cards/005",
        "@tcg/lorcana-cards/cards/006",
        "@tcg/lorcana-cards/cards/007",
        "@tcg/lorcana-cards/cards/008",
        "@tcg/lorcana-cards/cards/009",
        "@tcg/lorcana-cards/cards/010",
        "@tcg/lorcana-cards/cards/011",
        "@tcg/lorcana-cards/cards/012",
        "@tcg/lorcana-cards/deck-list-resolver",
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("lorcana-engine")) return "lorcana-engine";
            if (id.includes("lorcana-cards")) return "lorcana-cards";
          },
        },
      },
    },
  } as UserConfig;
});
