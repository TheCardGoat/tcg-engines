import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(configDir, "../../../..");
if (repoRoot === parse(repoRoot).root) {
  throw new Error(`Refusing to expose filesystem root through Vite server.fs.allow: ${repoRoot}`);
}
const isVitest = process.env.VITEST === "true";
const immerEntry = fileURLToPath(import.meta.resolve("immer"));
const mantineCoreEntry = fileURLToPath(import.meta.resolve("@mantine/core"));
const mantineHooksEntry = fileURLToPath(import.meta.resolve("@mantine/hooks"));
const cyberpunkFixtureTestPatterns = [
  "card-tests/cyberpunk/**",
  "src/games/cyberpunk/testing/fixtures/jsdom/**",
  "src/games/cyberpunk/testing/cyberpunk-simulator-pom-root-fixtures.test.tsx",
];

function isCyberpunkFixtureTestArg(arg: string): boolean {
  return cyberpunkFixtureTestPatterns.some((pattern) => {
    const pathPrefix = pattern.replace(/\/\*\*$/, "");
    return arg.includes(pathPrefix);
  });
}

const includeCyberpunkFixtureTests =
  process.env.CYBERPUNK_FIXTURE_TESTS === "1" || process.argv.some(isCyberpunkFixtureTestArg);

const CARD_PACKAGES_BY_GAME = {
  cyberpunk: ["@tcg/cyberpunk-cards"],
  "flesh-and-blood": ["@tcg/flesh-and-blood-cards"],
  "grand-archive": ["@tcg/grand-archive-cards"],
  gundam: ["@tcg/gundam-cards"],
  naruto: ["@tcg-engines/naruto-cards"],
  "one-piece": ["@tcg/op-cards"],
} as const;
const selectedCardPackages =
  CARD_PACKAGES_BY_GAME[process.env.GAME_SLUG as keyof typeof CARD_PACKAGES_BY_GAME] ?? [];
const prebundleSelectedCards =
  process.env.VITE_OPTIMIZE_DEPS_DISCOVERY === "false" && selectedCardPackages.length > 0;

const testExclude = [
  "e2e/**",
  "**/e2e.test.ts",
  "**/*.e2e.test.ts",
  "node_modules/**",
  "dist/**",
  ...(includeCyberpunkFixtureTests ? [] : cyberpunkFixtureTestPatterns),
];

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  optimizeDeps: {
    // The Docker stack runs one selected game at a time. Scanning every lazy
    // game route eagerly can exhaust Docker Desktop before the first page
    // hydrates, so Docker opts into this bounded shared-runtime warmup.
    noDiscovery: process.env.VITE_OPTIMIZE_DEPS_DISCOVERY === "false",
    include:
      process.env.VITE_OPTIMIZE_DEPS_DISCOVERY === "false"
        ? [
            "@dnd-kit/core",
            "@mantine/core",
            "@mantine/hooks",
            "@radix-ui/react-dialog",
            "@tabler/icons-react",
            "howler",
            "lucide-react",
            "prop-types",
            "react",
            "react-dom",
            "react-router",
            "react-router-dom",
            "socket.io-client",
            "socket.io-msgpack-parser",
            "@react-three/fiber",
            ...selectedCardPackages,
          ]
        : undefined,
  },
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./server/app.ts",
        },
      },
    },
  },
  server: {
    origin: process.env.VITE_DEV_ASSET_ORIGIN,
    fs: {
      allow: [repoRoot],
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
        find: /^@cyberpunk$/,
        replacement: resolve(configDir, "src/games/cyberpunk"),
      },
      {
        find: /^@cyberpunk\/(.+)$/,
        replacement: resolve(configDir, "src/games/cyberpunk/$1"),
      },
      {
        find: /^@e2e$/,
        replacement: resolve(configDir, "e2e"),
      },
      {
        find: /^@e2e\/(.+)$/,
        replacement: resolve(configDir, "e2e/$1"),
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
        find: /^@mantine\/core$/,
        replacement: mantineCoreEntry,
      },
      {
        find: /^@mantine\/hooks$/,
        replacement: mantineHooksEntry,
      },
      {
        find: /^immer$/,
        replacement: immerEntry,
      },
      {
        find: /^@tcg\/cyberpunk-engine$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/engine/src/index.ts"),
      },
      {
        find: /^@cyberpunk-engine\/(.+)$/,
        replacement: resolve(configDir, "../../../cyberpunk/packages/engine/src/$1"),
      },
      ...(prebundleSelectedCards && process.env.GAME_SLUG === "cyberpunk"
        ? []
        : [
            {
              find: /^@tcg\/cyberpunk-cards$/,
              replacement: resolve(configDir, "../../../cyberpunk/packages/cards/src/index.ts"),
            },
          ]),
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
      ...(prebundleSelectedCards && process.env.GAME_SLUG === "flesh-and-blood"
        ? []
        : [
            {
              find: /^@tcg\/flesh-and-blood-cards$/,
              replacement: resolve(
                configDir,
                "../../../flesh-and-blood/packages/cards/src/index.ts",
              ),
            },
          ]),
      {
        // This generated, fixture-only entrypoint changes without lockfile
        // updates. Resolve it as source so a running dev stack cannot retain a
        // stale optimized-dependency export list after regeneration.
        find: /^@tcg\/flesh-and-blood-cards\/simulator-scenario-cards$/,
        replacement: resolve(
          configDir,
          "../../../flesh-and-blood/packages/cards/src/simulator-scenario-cards.ts",
        ),
      },
      {
        find: /^@tcg\/flesh-and-blood-types$/,
        replacement: resolve(configDir, "../../../flesh-and-blood/packages/types/src/index.ts"),
      },
      ...(prebundleSelectedCards && process.env.GAME_SLUG === "gundam"
        ? []
        : [
            {
              find: /^@tcg\/gundam-cards$/,
              replacement: resolve(configDir, "../../../gundam/packages/cards/src/index.ts"),
            },
          ]),
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
      ...(prebundleSelectedCards && process.env.GAME_SLUG === "grand-archive"
        ? []
        : [
            {
              find: /^@tcg\/grand-archive-cards$/,
              replacement: resolve(configDir, "../../../grand-archive/packages/cards/src/index.ts"),
            },
          ]),
      {
        find: /^@tcg\/grand-archive-engine\/automation$/,
        replacement: resolve(
          configDir,
          "../../../grand-archive/packages/engine/src/automation/index.ts",
        ),
      },
      {
        find: /^@tcg\/grand-archive-engine\/runtime$/,
        replacement: resolve(
          configDir,
          "../../../grand-archive/packages/engine/src/runtime-api.ts",
        ),
      },
      {
        find: /^@tcg\/grand-archive-engine\/simulator$/,
        replacement: resolve(
          configDir,
          "../../../grand-archive/packages/engine/src/simulator-api.ts",
        ),
      },
      {
        find: /^@tcg\/grand-archive-server-adapter$/,
        replacement: resolve(
          configDir,
          "../../packages/grand-archive/grand-archive-server-adapter/src/index.ts",
        ),
      },
      {
        find: /^@tcg\/grand-archive-types$/,
        replacement: resolve(configDir, "../../../grand-archive/packages/types/src/index.ts"),
      },
      {
        find: /^@tcg-engines\/naruto-cards$/,
        replacement: resolve(configDir, "../../../naruto/packages/cards/src/index.ts"),
      },
      {
        find: /^@tcg-engines\/naruto-engine$/,
        replacement: resolve(configDir, "../../../naruto/packages/engine/src/index.ts"),
      },
      ...(prebundleSelectedCards && process.env.GAME_SLUG === "one-piece"
        ? []
        : [
            {
              find: /^@tcg\/op-cards$/,
              replacement: resolve(configDir, "../../../one-piece/packages/cards/src/index.ts"),
            },
          ]),
      {
        find: /^@tcg\/op-engine$/,
        replacement: resolve(configDir, "../../../one-piece/packages/engine/src/index.ts"),
      },
      {
        find: /^@tcg\/op-engine\/practice-st01$/,
        replacement: resolve(configDir, "../../../one-piece/packages/engine/src/practice-st01.ts"),
      },
      {
        find: /^@tcg\/op-types$/,
        replacement: resolve(configDir, "../../../one-piece/packages/types/src/index.ts"),
      },
      {
        find: /^@tcg\/op-utils$/,
        replacement: resolve(configDir, "../../../one-piece/packages/utils/src/index.ts"),
      },
      {
        find: /^@tcg\/engine-core\/test-simulator$/,
        replacement: resolve(configDir, "../../packages/engine-core/src/test-simulator.ts"),
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
        find: /^@tcg\/gateway-client$/,
        replacement: resolve(configDir, "../../packages/gateway-client/src/index.ts"),
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
    exclude: testExclude,
    setupFiles: "./vitest.setup.mjs",
    // Shard 2 runs heavy board files (fab-board ~165 cases) on a shared 8-vCPU
    // runner. Isolated cases finish in <1s; under that load the 5s default
    // times out healthy tests at exactly 5000ms.
    testTimeout: 20_000,
  },
});
