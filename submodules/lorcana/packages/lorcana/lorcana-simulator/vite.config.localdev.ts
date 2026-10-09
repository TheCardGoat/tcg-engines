// Scratch local-dev config: the simulator package's node_modules symlinks
// resolve into a sibling checkout at /private/tmp/tcg-pr-followups, which the
// tracked vite.config's fs.allow probe does not cover. Extend the allow list
// for this local run only. NOT part of the codebase — delete after use.
import { defineConfig, type UserConfig } from "vite-plus";
// @ts-expect-error — sibling config in the same package root
import base from "./vite.config.ts";

export default defineConfig(async (env) => {
  const cfg = (await (base as (e: unknown) => Promise<UserConfig> | UserConfig)(env)) as UserConfig;
  return {
    ...cfg,
    server: {
      ...cfg.server,
      fs: {
        ...cfg.server?.fs,
        allow: [
          ...(cfg.server?.fs?.allow ?? []),
          "/private/tmp/tcg-pr-followups/submodules/lorcana",
        ],
      },
    },
  };
});
