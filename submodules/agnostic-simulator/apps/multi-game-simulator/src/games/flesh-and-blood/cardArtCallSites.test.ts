import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const gameDir = dirname(fileURLToPath(import.meta.url));

describe("FAB card-art lookup call sites", () => {
  it("raw board/printed lookups appear only in sanctioned production files", () => {
    const sanctioned = new Set([
      "cardArt.ts",
      "projection.ts", // entityFor stamps entity art for every entity surface
      "FabBoardCardFace.tsx", // board→printed error fallback + preview entity
      "FabCardPreview.tsx", // previews always resolve the full printed card
    ]);
    const skippedDirs = new Set(["generated", "assets", "node_modules"]);
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (skippedDirs.has(entry.name) || entry.name.startsWith(".")) continue;
          walk(join(dir, entry.name));
          continue;
        }
        if (!entry.isFile()) continue;
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        if (entry.name.includes(".test.") || entry.name.includes(".spec.")) continue;
        const relativePath = relative(gameDir, join(dir, entry.name));
        if (sanctioned.has(relativePath)) continue;
        const source = readFileSync(join(dir, entry.name), "utf8");
        if (/boardImageUrlForFabCard|imageUrlForFabCard/.test(source)) {
          offenders.push(relativePath);
        }
      }
    };
    walk(gameDir);
    expect(offenders).toEqual([]);
  });

  it("keeps combat cards on the shared FAB card-face boundary", () => {
    const sources = ["CombatChain.tsx", "CompactResolutionStack.tsx"].map((file) =>
      readFileSync(join(gameDir, file), "utf8"),
    );

    for (const source of sources) {
      expect(source).toContain("<FabBoardCardFace");
      expect(source).not.toContain('from "./cardArt"');
      expect(source).not.toMatch(/<img\b/u);
      expect(source).not.toMatch(/\bentityFor\(/u);
    }
  });
});
