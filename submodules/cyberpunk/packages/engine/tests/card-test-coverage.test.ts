import { describe, expect, it } from "vite-plus/test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { structuredCards } from "@tcg/cyberpunk-cards";

/**
 * Every card in `structuredCards` must have a corresponding test file at
 * packages/engine/src/cards/{type}/{slug}.test.ts. Since the canonical-card
 * consolidation the authored tree is per-type (one file per card, no set
 * nesting), and this mirror follows it. This is a coverage gate — it doesn't
 * validate the test's contents, only that an example exists. New cards landing
 * without any runtime exercise fail the build.
 *
 * The test resolves paths relative to this file's directory at runtime so it
 * works the same in CI and locally.
 */

const ENGINE_SRC = join(__dirname, "../src");

const TYPE_TO_FOLDER: Record<string, string> = {
  unit: "units",
  gear: "gear",
  program: "programs",
  legend: "legends",
};

describe("card test coverage", () => {
  it("every structured card has a matching *.test.ts file under packages/engine/src/cards/{type}/", () => {
    const missing: Array<{ slug: string; expectedPath: string }> = [];
    for (const card of structuredCards) {
      const folder = TYPE_TO_FOLDER[card.type];
      if (!folder) {
        missing.push({ slug: card.slug, expectedPath: `unknown card.type: ${card.type}` });
        continue;
      }
      const expectedPath = join(ENGINE_SRC, "cards", folder, `${card.slug}.test.ts`);
      if (!existsSync(expectedPath)) {
        missing.push({
          slug: card.slug,
          expectedPath: expectedPath.replace(ENGINE_SRC, "engine/src"),
        });
      }
    }
    expect(missing).toEqual([]);
  });
});
