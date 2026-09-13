import { describe, expect, it } from "vite-plus/test";

import {
  decodeDeckLegalityReportFromJson,
  encodeDeckLegalityReportToJson,
} from "@tcg/game-page-contract";
import type { Card, ResourceCard, UnitCard } from "@tcg/gundam-types";
import {
  GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
  GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
  validateDeckList,
  type DeckList,
} from "@tcg/gundam-engine";

import { gundamDeckValidationToLegalityReport } from "./gundam-deck-legality-report.js";

function unit(cardNumber: string): UnitCard {
  return {
    cardNumber,
    canonicalId: cardNumber,
    name: cardNumber,
    slug: cardNumber.toLowerCase(),
    type: "unit",
    printings: [],
    color: "blue",
    traits: ["earth federation"],
    level: 1,
    cost: 1,
    ap: 2,
    hp: 3,
    effect: "-",
    effects: [],
    keywordEffects: [],
    rarity: "common",
  };
}

const RESOURCE: ResourceCard = {
  cardNumber: "R-001",
  canonicalId: "R-001",
  name: "Resource",
  slug: "r-001",
  type: "resource",
  printings: [],
  traits: ["-"],
  level: 0,
  cost: 0,
  effect: "",
  effects: [],
  keywordEffects: [],
  rarity: "common",
};

const FORMAT_LEGALITY = {
  formatId: GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
  asOf: "2026-07-24",
  policies: GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
} as const;

function expectRoundtrip(report: ReturnType<typeof gundamDeckValidationToLegalityReport>): void {
  const encoded = encodeDeckLegalityReportToJson(report);
  expect(encoded.ok).toBe(true);
  if (!encoded.ok || !encoded.json) return;
  expect(decodeDeckLegalityReportFromJson(encoded.json)).toEqual({ ok: true, report });
}

describe("gundamDeckValidationToLegalityReport", () => {
  it("maps and roundtrips an official standard-format violation", () => {
    const anksha = unit("GD01-020");
    const catalog: Record<string, Card> = {
      [anksha.cardNumber]: anksha,
      [RESOURCE.cardNumber]: RESOURCE,
    };
    const list: DeckList = {
      name: "Standard",
      cards: [{ cardNumber: anksha.cardNumber, count: 1 }],
      resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
    };
    const validation = validateDeckList(list, {
      catalog,
      mainDeckSize: 1,
      formatLegality: FORMAT_LEGALITY,
    });

    const report = gundamDeckValidationToLegalityReport(validation, {
      formatId: "standard",
    });

    expect(report).toMatchObject({
      game: "gundam",
      formatId: "standard",
      valid: false,
      policy: {
        id: "en-us-constructed-2026-07-24",
        version: "2026-07-24",
        effectiveFrom: "2026-07-24",
      },
    });
    expect(report.policy?.sourceUrls).toContain("https://www.gundam-gcg.com/en/news/01_279.html");
    expect(report.policy?.unresolvedExceptions.map(({ id }) => id)).toEqual([
      "wings-of-advance-unchanged-lineup",
      "iron-bloom-unchanged-lineup",
    ]);
    expect(report.violations).toContainEqual(
      expect.objectContaining({
        code: "format-banned-card",
        zones: ["main"],
        cardIdentities: [{ canonicalId: "GD01-020" }],
        actual: 1,
        allowed: 0,
      }),
    );
    expectRoundtrip(report);
  });

  it("maps and roundtrips BO3 main-plus-sideboard limits with both zones", () => {
    const corsica = unit("ST02-016");
    const catalog: Record<string, Card> = {
      [corsica.cardNumber]: corsica,
      [RESOURCE.cardNumber]: RESOURCE,
    };
    const sideboard: Array<{ cardNumber: string; count: number }> = [
      { cardNumber: corsica.cardNumber, count: 1 },
    ];
    for (let index = 0; index < 9; index++) {
      const cardNumber = `SIDE-${index}`;
      catalog[cardNumber] = unit(cardNumber);
      sideboard.push({ cardNumber, count: 1 });
    }
    const list: DeckList = {
      name: "BO3",
      cards: [{ cardNumber: corsica.cardNumber, count: 2 }],
      resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
      sideboard,
    };
    const validation = validateDeckList(list, {
      catalog,
      mainDeckSize: 2,
      constructionFormat: "best-of-three",
      formatLegality: FORMAT_LEGALITY,
    });

    const report = gundamDeckValidationToLegalityReport(validation, {
      formatId: "best-of-three",
    });

    expect(report.valid).toBe(false);
    expect(report.violations).toContainEqual(
      expect.objectContaining({
        code: "format-copy-limit",
        zones: ["main", "sideboard"],
        cardIdentities: [{ canonicalId: "ST02-016" }],
        actual: 3,
        allowed: 2,
      }),
    );
    expectRoundtrip(report);
  });
});
