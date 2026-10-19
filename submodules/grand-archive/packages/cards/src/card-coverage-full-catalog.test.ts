import { describe, expect, it } from "vitest";
import { assertGrandArchiveFullCatalogCoverage } from "../scripts/card-coverage/full-catalog.ts";

const complete = {
  abilities: 12,
  coveredAbilities: 12,
  blockedAbilities: 0,
  outOfScopeAbilities: 0,
  untestedAbilities: 0,
  cardsWithoutAbilities: 2,
  coveredCardsWithoutAbilities: 2,
};

describe("full-catalog release coverage", () => {
  it("accepts complete behavior evidence including cards without abilities", () => {
    expect(() => assertGrandArchiveFullCatalogCoverage(complete)).not.toThrow();
  });
  it.each([
    { untestedAbilities: 1, coveredAbilities: 11 },
    { blockedAbilities: 1, coveredAbilities: 11 },
    { outOfScopeAbilities: 1, coveredAbilities: 11 },
    { coveredCardsWithoutAbilities: 1 },
    { coveredAbilities: 11 },
  ])("rejects incomplete release evidence: %j", (gap) => {
    expect(() => assertGrandArchiveFullCatalogCoverage({ ...complete, ...gap })).toThrow(
      "Full-catalog coverage is incomplete",
    );
  });
});
