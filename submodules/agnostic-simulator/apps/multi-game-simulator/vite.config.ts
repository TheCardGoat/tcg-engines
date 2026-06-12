import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
const isVitest = process.env.VITEST === "true";

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./server/app.ts",
        },
      },
    },
  },
  plugins: [tailwindcss(), isVitest ? react() : reactRouter()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      {
        find: /^@cyberpunk-simulator$/,
        replacement: resolve(configDir, "src/games/cyberpunk"),
      },
      {
        find: /^@cyberpunk-simulator\/(.+)$/,
        replacement: resolve(configDir, "src/games/cyberpunk/$1"),
      },
      {
        find: /^@gundam-simulator$/,
        replacement: resolve(configDir, "src/games/gundam"),
      },
      {
        find: /^@gundam-simulator\/(.+)$/,
        replacement: resolve(configDir, "src/games/gundam/$1"),
      },
      {
        find: /^@tcg\/cyberpunk-engine$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/engine/src/index.ts"),
      },
      {
        find: /^@cyberpunk-engine\/(.+)$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/engine/src/$1"),
      },
      {
        find: /^@tcg\/cyberpunk-cards$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/cards/src/index.ts"),
      },
      {
        find: /^@tcg\/cyberpunk-server-adapter\/interaction-protocol$/,
        replacement: resolve(
          configDir,
          "../../packages/cyberpunk/cyberpunk-server-adapter/src/interaction-protocol.ts",
        ),
      },
      {
        find: /^@tcg\/cyberpunk-types$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/types/src/index.ts"),
      },
      {
        find: /^@tcg\/cyberpunk-utils$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/utils/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-cards$/,
        replacement: resolve(configDir, "../../../gundam/packages/cards/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-engine$/,
        replacement: resolve(configDir, "../../../gundam/packages/engine/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-server-adapter$/,
        replacement: resolve(configDir, "../../packages/gundam/gundam-server-adapter/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-token-data$/,
        replacement: resolve(configDir, "../../../gundam/packages/token-data/src/index.ts"),
      },
      {
        find: /^@tcg\/gundam-types$/,
        replacement: resolve(configDir, "../../../gundam/packages/types/src/index.ts"),
      },
      {
        find: /^@tcg\/engine-core$/,
        replacement: resolve(configDir, "../../packages/engine-core/src/index.ts"),
      },
      {
        find: /^@tcg\/game-page-contract$/,
        replacement: resolve(configDir, "../../packages/game-page-contract/src/index.ts"),
      },
      {
        find: /^@tcg\/game-page-contract\/connection-diagnostic$/,
        replacement: resolve(
          configDir,
          "../../packages/game-page-contract/src/connection-diagnostic.ts",
        ),
      },
      {
        find: /^@tcg\/protocol$/,
        replacement: resolve(configDir, "../../packages/protocol/src/index.ts"),
      },
      {
        find: /^@tcg\/protocol\/gateway$/,
        replacement: resolve(configDir, "../../packages/protocol/src/gateway.ts"),
      },
      {
        find: /^@tcg\/shared$/,
        replacement: resolve(configDir, "../../packages/shared/src/index.ts"),
      },
      {
        find: /^@tcg\/shared\/auth$/,
        replacement: resolve(configDir, "../../packages/shared/src/auth/index.ts"),
      },
      {
        find: /^@tcg\/shared\/discord-rich-presence$/,
        replacement: resolve(configDir, "../../packages/shared/src/discord-rich-presence.ts"),
      },
      {
        find: /^@tcg\/shared\/supporter-display$/,
        replacement: resolve(configDir, "../../packages/shared/src/supporter-display.ts"),
      },
      {
        find: /^@tcg\/shared\/game-adapter$/,
        replacement: resolve(configDir, "../../packages/shared/src/game-adapter/index.ts"),
      },
      {
        find: /^@tcg\/shared\/game-engine$/,
        replacement: resolve(configDir, "../../packages/shared/src/game-engine/index.ts"),
      },
      {
        find: /^@tcg\/shared\/cyberpunk\/deck-validation$/,
        replacement: resolve(configDir, "../../packages/shared/src/cyberpunk/deck-validation.ts"),
      },
      {
        find: /^@tcg\/simulator-runtime$/,
        replacement: resolve(configDir, "../../packages/simulator-runtime/src/index.ts"),
      },
      {
        find: /^@tcg\/simulator-runtime\/auth$/,
        replacement: resolve(configDir, "../../packages/simulator-runtime/src/auth.tsx"),
      },
      {
        find: /^@tcg\/simulator-runtime\/chat$/,
        replacement: resolve(configDir, "../../packages/simulator-runtime/src/chat.ts"),
      },
      {
        find: /^@tcg\/simulator-runtime\/debug$/,
        replacement: resolve(configDir, "../../packages/simulator-runtime/src/debug.ts"),
      },
      {
        find: /^@tcg\/simulator-runtime\/gateway$/,
        replacement: resolve(configDir, "../../packages/simulator-runtime/src/gateway.ts"),
      },
      {
        find: /^@tcg\/simulator-testing\/testing-library$/,
        replacement: resolve(configDir, "../../packages/simulator-testing/src/testing-library.ts"),
      },
      {
        find: /^@tcg\/simulator-testing$/,
        replacement: resolve(configDir, "../../packages/simulator-testing/src/index.ts"),
      },
      {
        find: /^@tcg\/simulator-ui$/,
        replacement: resolve(configDir, "../../packages/simulator-ui/src/index.ts"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "**/e2e.test.ts", "**/*.e2e.test.ts", "node_modules/**", "dist/**"],
    setupFiles: "./vitest.setup.mjs",
  },
});
