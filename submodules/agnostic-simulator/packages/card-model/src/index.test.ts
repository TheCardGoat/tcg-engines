import { describe, expect, it } from "vitest";

import type { BaseCardDefinition, ExternalSource } from "./index.js";
import { EXTERNAL_SOURCES, isExternalSource } from "./index.js";

// --- Type-level smoke checks (compile-time only) -----------------------------
// These consts exist so the compiler rejects contract regressions. They are
// referenced from the runtime suite below to satisfy unused-var checks.

/**
 * A fully-populated BaseCardDefinition literal — including a Printing and an
 * externalIds entry — must be assignable to BaseCardDefinition. If this stops
 * compiling, the base contract changed shape.
 */
const fullCard: BaseCardDefinition = {
  canonicalId: "lorcana:goat",
  slug: "the-card-goat",
  name: "The Card Goat",
  printings: [
    {
      id: "GD01-001",
      artId: "GD01-001-art",
      setCode: "GD01",
      collectorNumber: "001",
      rarity: "mythic",
      imageUrl: "https://example.com/card.png",
    },
  ],
  externalIds: { bandai: "OP01-001" },
};

/**
 * externalIds is keyed by ExternalSource: seed keys are accepted.
 */
const seedExternalIds = { bandai: "OP01-001" } satisfies Partial<Record<ExternalSource, string>>;

/**
 * ...and bogus keys are rejected at compile time. This const only compiles
 * while "bogus" is NOT a member of ExternalSource.
 */
const bogusKeyRejected: "bogus" extends ExternalSource ? true : false = false;

// --- Runtime smoke checks ----------------------------------------------------

describe("EXTERNAL_SOURCES", () => {
  it("contains exactly the 7 supported values and excludes cdn", () => {
    expect([...EXTERNAL_SOURCES]).toEqual([
      "ravensburger",
      "cultureInvariantId",
      "lorcast",
      "tcgPlayer",
      "tcgcsv",
      "cardNexus",
      "bandai",
    ]);
    expect(EXTERNAL_SOURCES).not.toContain("cdn");
  });
});

describe("isExternalSource", () => {
  it("returns true for every member of EXTERNAL_SOURCES", () => {
    for (const source of EXTERNAL_SOURCES) {
      expect(isExternalSource(source)).toBe(true);
    }
  });

  it("returns false for unknown strings, non-strings, and cdn", () => {
    expect(isExternalSource("cdn")).toBe(false);
    expect(isExternalSource("not-a-source")).toBe(false);
    expect(isExternalSource("")).toBe(false);
    expect(isExternalSource(123)).toBe(false);
    expect(isExternalSource(null)).toBe(false);
    expect(isExternalSource(undefined)).toBe(false);
    expect(isExternalSource({ ravensburger: "x" })).toBe(false);
  });
});

describe("BaseCardDefinition contract", () => {
  it("compiles a full card literal and ties type-level checks to runtime", () => {
    expect(fullCard.canonicalId).toBe("lorcana:goat");
    expect(fullCard.printings).toHaveLength(1);
    expect(fullCard.externalIds?.bandai).toBe("OP01-001");
    expect(seedExternalIds.bandai).toBe("OP01-001");
    expect(bogusKeyRejected).toBe(false);
  });
});
