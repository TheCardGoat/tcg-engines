import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const workspaceRoot = new URL("../../../", import.meta.url);
const inspectedFiles = [
  "packages/cards/package.json",
  "packages/cards/src/index.ts",
  "packages/types/src/index.ts",
  "tools/parser/package.json",
  "tools/parser/src/index.ts",
] as const;
const prohibitedDependencies = [
  "engine-core",
  "bot-core",
  "agent-core",
  "matchmaking",
  "replay",
  "server-game-engine",
] as const;

describe("Riftbound catalog dependency boundary", () => {
  it("does not import executable rules, bots, matchmaking, or replay packages", async () => {
    for (const relativePath of inspectedFiles) {
      const source = await readFile(new URL(relativePath, workspaceRoot), "utf8");
      for (const prohibited of prohibitedDependencies) {
        expect(source.toLowerCase(), `${relativePath} contains ${prohibited}`).not.toContain(
          prohibited,
        );
      }
    }
  });
});
