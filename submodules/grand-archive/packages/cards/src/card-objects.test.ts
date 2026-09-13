import { describe, expect, it } from "vitest";
import { arisannaAstralZenith } from "./cards/ALC/champions/arisanna-astral-zenith.ts";
import { extortingBlackjack } from "./cards/DTR/attacks/extorting-blackjack.ts";
import { grandArchiveCatalog } from "./generated/grand-archive-catalog.ts";
import {
  grandArchiveCards,
  grandArchiveCardsByCanonicalId,
} from "./generated/grand-archive-card-registry.ts";

const RULES_COUNTER_NAMES = new Set([
  "buff",
  "bulwark",
  "damage",
  "debuff",
  "durability",
  "enlighten",
  "level",
  "omen",
  "preparation",
  "static",
  "wither",
]);

function namedRulesCounterPaths(value: unknown, path = "catalog"): readonly string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => namedRulesCounterPaths(entry, `${path}[${index}]`));
  }
  if (typeof value !== "object" || value === null) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const childPath = `${path}.${key}`;
    if (
      key === "counter" &&
      typeof child === "object" &&
      child !== null &&
      !Array.isArray(child) &&
      Object.keys(child).length === 1 &&
      "named" in child &&
      typeof child.named === "string" &&
      RULES_COUNTER_NAMES.has(child.named)
    ) {
      return [childPath];
    }
    return namedRulesCounterPaths(child, childPath);
  });
}

describe("generated Grand Archive card objects", () => {
  it("groups modules by origin set and printed card type", () => {
    expect(extortingBlackjack.slug).toBe("extorting-blackjack");
    expect(extortingBlackjack.layout.kind).toBe("single-faced");
    expect(arisannaAstralZenith.slug).toBe("arisanna-astral-zenith");
  });

  it("emits exactly one object per catalog identity, independent of printings", () => {
    expect(grandArchiveCards).toHaveLength(grandArchiveCatalog.cards.length);
    expect(grandArchiveCardsByCanonicalId.size).toBe(grandArchiveCatalog.cards.length);
    expect([...grandArchiveCardsByCanonicalId.keys()].sort()).toEqual(
      grandArchiveCatalog.cards.map((card) => card.canonicalId).sort(),
    );
    expect(grandArchiveCatalog.cards.some((card) => card.printings.length > 1)).toBe(true);
  });

  it("preserves every Index-identified Pantheon border tag as a printed restriction", () => {
    const expected = grandArchiveCatalog.cards
      .filter(
        (card) =>
          card.legality?.STANDARD?.limit === 0 &&
          card.legality.DRAFT?.limit === 0 &&
          card.legality.PANTHEON?.limit !== 0,
      )
      .map((card) => card.canonicalId)
      .sort();
    const actual = grandArchiveCards
      .filter((card) => card.formatRestriction?.kind === "pantheon-only")
      .map((card) => card.canonicalId)
      .sort();

    expect(actual).toEqual(expected);
    expect(actual).toHaveLength(64);
  });

  it("preserves every official opposite face as a double-faced layout", () => {
    const expected = grandArchiveCatalog.cards
      .filter((card) => card.relatedFaces.length > 0)
      .map((card) => card.canonicalId)
      .sort();
    const actual = grandArchiveCards
      .filter((card) => card.layout.kind === "double-faced")
      .map((card) => card.canonicalId)
      .sort();
    expect(actual).toEqual(expected);
    expect(actual).toHaveLength(22);
  });

  it("ratchets executable coverage while keeping unsupported text fail-closed", () => {
    let executable = 0;
    let unparsed = 0;
    for (const card of grandArchiveCards) {
      const faces =
        card.layout.kind === "single-faced"
          ? [card.layout.face]
          : [card.layout.defaultFace, card.layout.flipFace];
      for (const face of faces)
        for (const ability of face.abilities) {
          if (ability.kind === "unparsed") {
            unparsed += 1;
            expect(ability.unparsedSegments).toEqual([ability.text]);
          } else {
            executable += 1;
          }
        }
    }
    expect(executable).toBe(4545);
    expect(unparsed).toBe(0);
    expect(executable + unparsed).toBe(4545);
  });

  it("uses canonical engine keys for every rules-defined counter", () => {
    expect(namedRulesCounterPaths(grandArchiveCards)).toEqual([]);
  });
});
