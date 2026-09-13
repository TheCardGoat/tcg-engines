import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsRoot = path.join(packageRoot, "src/cards");
const generatedRoot = path.join(packageRoot, "src/generated");

async function sourceFiles(root: string): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(root, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return entry.isFile() && target.endsWith(".ts") && !target.endsWith(".test.ts")
        ? [target]
        : [];
    }),
  );
  return files.flat().sort((left, right) => left.localeCompare(right));
}

describe("Grand Archive generation manifest", () => {
  it("binds the generated catalog to its official snapshot and exact output", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(generatedRoot, "grand-archive-generation-manifest.json"), "utf8"),
    ) as {
      readonly schemaVersion: number;
      readonly snapshot: { readonly sha256: string; readonly source: string } | null;
      readonly compilerVersion: number;
      readonly cardCount: number;
      readonly abilityCount: number;
      readonly outputFingerprint: {
        readonly algorithm: string;
        readonly value: string;
        readonly files: readonly string[];
      };
    };
    const files = [
      ...(await sourceFiles(cardsRoot)),
      path.join(generatedRoot, "grand-archive-catalog.ts"),
      path.join(generatedRoot, "grand-archive-card-registry.ts"),
    ].sort((left, right) => left.localeCompare(right));
    const fingerprint = createHash("sha256");
    for (const file of files) {
      fingerprint.update(path.relative(path.resolve(packageRoot, "..", ".."), file));
      fingerprint.update("\0");
      fingerprint.update(await readFile(file));
      fingerprint.update("\0");
    }

    expect(manifest).toMatchObject({
      schemaVersion: 1,
      snapshot: { source: "gatcg-index-api", sha256: expect.stringMatching(/^[a-f0-9]{64}$/u) },
      compilerVersion: expect.any(Number),
      cardCount: 2495,
      abilityCount: 4545,
      outputFingerprint: { algorithm: "sha256" },
    });
    expect(manifest.outputFingerprint.files).toEqual(
      files.map((file) => path.relative(path.resolve(packageRoot, "..", ".."), file)),
    );
    expect(manifest.outputFingerprint.value).toBe(fingerprint.digest("hex"));
  });
});
