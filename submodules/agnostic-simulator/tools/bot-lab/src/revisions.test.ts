import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vite-plus/test";

import { catalogRevision, sourceTreeRevision } from "./revisions.ts";

const HASH_PATTERN = /^fnv1a32:[0-9a-f]{8}$/u;

const tempRoots: string[] = [];

function makeTree(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "bot-lab-revisions-"));
  tempRoots.push(root);
  for (const [relative, content] of Object.entries(files)) {
    const path = join(root, relative);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, content);
  }
  return root;
}

afterAll(() => {
  for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
});

describe("catalogRevision", () => {
  const cards = [
    { id: "OP01-001", canonicalId: "OP01-001", cardType: "leader", power: 5000 },
    { id: "OP01-002", canonicalId: "OP01-002", cardType: "character", cost: 3, power: 4000 },
  ];

  it("is deterministic and returns a stableBotHash", () => {
    const hash = catalogRevision(cards);
    expect(hash).toMatch(HASH_PATTERN);
    expect(catalogRevision(cards)).toBe(hash);
  });

  it("does not depend on export order", () => {
    expect(catalogRevision([...cards].reverse())).toBe(catalogRevision(cards));
  });

  it("changes when a gameplay field changes", () => {
    const modified = cards.map((card) => (card.id === "OP01-002" ? { ...card, cost: 4 } : card));
    expect(catalogRevision(modified)).not.toBe(catalogRevision(cards));
  });

  it("changes when a card is added or removed", () => {
    expect(catalogRevision(cards.slice(1))).not.toBe(catalogRevision(cards));
    expect(
      catalogRevision([
        ...cards,
        { id: "OP01-003", canonicalId: "OP01-003", cardType: "event", cost: 1 },
      ]),
    ).not.toBe(catalogRevision(cards));
  });

  it("changes when a card identity changes", () => {
    const renamed = cards.map((card) =>
      card.id === "OP01-002" ? { ...card, canonicalId: "OP01-002-alt" } : card,
    );
    expect(catalogRevision(renamed)).not.toBe(catalogRevision(cards));
  });
});

describe("sourceTreeRevision", () => {
  it("is deterministic for identical content", () => {
    const files = { "src/index.ts": "export const a = 1;\n", "src/lib/util.ts": "export {};\n" };
    const first = sourceTreeRevision(makeTree(files));
    const second = sourceTreeRevision(makeTree(files));
    expect(first).toMatch(HASH_PATTERN);
    expect(second).toBe(first);
  });

  it("changes when a source file changes", () => {
    const base = sourceTreeRevision(makeTree({ "index.ts": "export const a = 1;\n" }));
    const changed = sourceTreeRevision(makeTree({ "index.ts": "export const a = 2;\n" }));
    expect(changed).not.toBe(base);
  });

  it("changes when a file is added", () => {
    const base = sourceTreeRevision(makeTree({ "index.ts": "export {};\n" }));
    const added = sourceTreeRevision(
      makeTree({ "index.ts": "export {};\n", "extra.ts": "export {};\n" }),
    );
    expect(added).not.toBe(base);
  });

  it("changes when a file is renamed", () => {
    const base = sourceTreeRevision(makeTree({ "index.ts": "export {};\n" }));
    const renamed = sourceTreeRevision(makeTree({ "renamed.ts": "export {};\n" }));
    expect(renamed).not.toBe(base);
  });

  // ~2k files under packages/engine/src; cold hash under parallel CI load can
  // exceed the default 5s budget even when local runs finish in a few hundred ms.
  it("produces a stable hash for the real One Piece engine source", () => {
    const engineSrc = fileURLToPath(
      new URL("../../../../one-piece/packages/engine/src/", import.meta.url),
    );
    const first = sourceTreeRevision(engineSrc);
    expect(first).toMatch(HASH_PATTERN);
    expect(sourceTreeRevision(engineSrc)).toBe(first);
  }, 30_000);
});
