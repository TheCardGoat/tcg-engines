import { describe, expect, it } from "vite-plus/test";

import {
  evaluateGundamFormatLegality,
  selectGundamFormatLegalityPolicy,
} from "./format-legality.ts";
import {
  GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
  GUNDAM_EN_US_CURRENT_POLICY_URL,
  GUNDAM_EN_US_JULY_2026_VANILLA_UNIT_GROUP,
  GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
} from "./official-format-policies.ts";

const JULY_CONTEXT = {
  formatId: GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
  asOf: "2026-07-24",
  policies: GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
} as const;

describe("official EN-US Gundam format policy data", () => {
  it("selects the sourced April history before the July snapshot", () => {
    const april = selectGundamFormatLegalityPolicy({
      ...JULY_CONTEXT,
      asOf: "2026-04-01",
    });
    const july = selectGundamFormatLegalityPolicy(JULY_CONTEXT);

    expect(april).toMatchObject({
      id: "en-us-constructed-2026-04-01",
      announcedAt: "2026-03-27",
      effectiveFrom: "2026-04-01",
      copyRestrictions: [{ cardId: "ST02-016", maxCopies: 2 }],
    });
    expect(july).toMatchObject({
      id: "en-us-constructed-2026-07-24",
      announcedAt: "2026-07-10",
      effectiveFrom: "2026-07-24",
      bannedCards: [{ cardId: "GD01-020" }],
    });
    expect(july?.sourceUrls).toContain(GUNDAM_EN_US_CURRENT_POLICY_URL);
    expect(july?.unresolvedExceptions?.map(({ id }) => id)).toEqual([
      "wings-of-advance-unchanged-lineup",
      "iron-bloom-unchanged-lineup",
    ]);
    expect(july?.unchangedLineupExceptions).toBeUndefined();
  });

  it("contains every card number in the official 20-card vanilla Unit group", () => {
    expect(GUNDAM_EN_US_JULY_2026_VANILLA_UNIT_GROUP).toEqual([
      "GD01-035",
      "GD01-060",
      "GD01-085",
      "GD02-013",
      "GD02-080",
      "GD03-032",
      "GD03-063",
      "GD04-078",
      "GD05-014",
      "GD05-027",
      "GD05-042",
      "GD05-062",
      "GD05-077",
      "ST01-005",
      "ST04-008",
      "ST05-004",
      "ST05-009",
      "ST06-004",
      "ST09-005",
      "ST10-005",
    ]);
  });

  it("enforces the current ban, Restricted (2), and explicit pairs across main plus sideboard", () => {
    const report = evaluateGundamFormatLegality(
      [
        { cardNumber: "GD01-020", canonicalId: "GD01-020", count: 1, zone: "main" },
        { cardNumber: "ST02-016", canonicalId: "ST02-016", count: 2, zone: "main" },
        { cardNumber: "ST02-016", canonicalId: "ST02-016", count: 1, zone: "sideboard" },
        { cardNumber: "GD01-008", canonicalId: "GD01-008", count: 1, zone: "main" },
        { cardNumber: "GD05-015", canonicalId: "GD05-015", count: 1, zone: "sideboard" },
      ],
      JULY_CONTEXT,
    );

    expect(report.violations).toContainEqual(
      expect.objectContaining({
        code: "format-banned-card",
        cardIds: ["GD01-020"],
        actual: 1,
        allowed: 0,
        zones: ["main"],
      }),
    );
    expect(report.violations).toContainEqual(
      expect.objectContaining({
        code: "format-copy-limit",
        cardIds: ["ST02-016"],
        actual: 3,
        allowed: 2,
        zones: ["main", "sideboard"],
      }),
    );
    expect(report.violations).toContainEqual(
      expect.objectContaining({
        code: "format-composition",
        restrictionId: "gd01-008-gd05-015",
        cardIds: ["GD01-008", "GD05-015"],
        zones: ["main", "sideboard"],
      }),
    );
  });

  it("rejects mixing two listed identities even at 2+2, but permits four of one", () => {
    const mixed = evaluateGundamFormatLegality(
      [
        { cardNumber: "GD01-035", canonicalId: "GD01-035", count: 2 },
        { cardNumber: "GD01-060", canonicalId: "GD01-060", count: 2 },
      ],
      JULY_CONTEXT,
    );
    const singleIdentity = evaluateGundamFormatLegality(
      [{ cardNumber: "GD01-035", canonicalId: "GD01-035", count: 4 }],
      JULY_CONTEXT,
    );

    expect(mixed.violations).toContainEqual(
      expect.objectContaining({
        code: "format-composition",
        restrictionId: "vanilla-lv2-cost1-2ap-2hp",
        cardIds: ["GD01-035", "GD01-060"],
        actual: 2,
        allowed: 1,
      }),
    );
    expect(singleIdentity.violations).toEqual([]);
  });

  it("retains the general combined-copy-limit capability for future policy data", () => {
    const report = evaluateGundamFormatLegality(
      [
        { cardNumber: "A", canonicalId: "A", count: 2 },
        { cardNumber: "B", canonicalId: "B", count: 2 },
      ],
      {
        formatId: "fixture",
        asOf: "2026-01-01",
        policies: [
          {
            id: "combined-fixture",
            formatId: "fixture",
            version: "test",
            effectiveFrom: "2026-01-01",
            compositionRestrictions: [
              {
                id: "combined",
                kind: "combined-copy-limit",
                cardIds: ["A", "B"],
                maxCombinedCopies: 3,
              },
            ],
          },
        ],
      },
    );

    expect(report.violations).toContainEqual(
      expect.objectContaining({
        code: "format-composition",
        restrictionId: "combined",
        actual: 4,
        allowed: 3,
      }),
    );
  });
});
