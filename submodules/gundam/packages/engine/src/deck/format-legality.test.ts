import { describe, expect, it } from "vite-plus/test";

import type { Card, ResourceCard, UnitCard } from "@tcg/gundam-types";

import {
  evaluateGundamFormatLegality,
  selectGundamFormatLegalityPolicy,
  type GundamFormatLegalityPolicy,
} from "./format-legality.ts";
import { validateDeckList, type DeckList } from "./deck-list.ts";
import {
  GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
  GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
} from "./official-format-policies.ts";

function unit(
  cardNumber: string,
  canonicalId: string = cardNumber,
  name: string = cardNumber,
  color: UnitCard["color"] = "blue",
): UnitCard {
  return {
    cardNumber,
    canonicalId,
    name,
    slug: cardNumber.toLowerCase(),
    type: "unit",
    printings: [],
    color,
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
const OTHER_RESOURCE: ResourceCard = {
  ...RESOURCE,
  cardNumber: "R-002",
  canonicalId: "R-002",
  slug: "r-002",
};

const RX_78 = unit("GD01-001", "GD01-001", "Gundam");
const ZAKU = unit("GD01-002", "GD01-002", "Zaku II");
const BASE_CATALOG: Record<string, Card> = {
  [RX_78.cardNumber]: RX_78,
  [ZAKU.cardNumber]: ZAKU,
  [RESOURCE.cardNumber]: RESOURCE,
  [OTHER_RESOURCE.cardNumber]: OTHER_RESOURCE,
};

function smallDeck(cards: DeckList["cards"]): DeckList {
  return {
    name: "Policy sensor",
    cards,
    resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
  };
}

const AUGUST_POLICY: GundamFormatLegalityPolicy = {
  id: "standard-2026-08",
  formatId: "standard",
  version: "2026.08",
  effectiveFrom: "2026-08-01T00:00:00Z",
  effectiveUntil: "2026-09-01T00:00:00Z",
  bannedCards: [{ cardId: RX_78.canonicalId, reason: "fixture restriction" }],
};

describe("dated Gundam format policy selection", () => {
  it("is inactive before its effective date, active at it, and inactive after its end", () => {
    const policies = [AUGUST_POLICY];

    expect(
      selectGundamFormatLegalityPolicy({
        formatId: "standard",
        asOf: "2026-07-31T23:59:59Z",
        policies,
      }),
    ).toBeUndefined();
    expect(
      selectGundamFormatLegalityPolicy({
        formatId: "standard",
        asOf: "2026-08-01T00:00:00Z",
        policies,
      })?.id,
    ).toBe(AUGUST_POLICY.id);
    expect(
      selectGundamFormatLegalityPolicy({
        formatId: "standard",
        asOf: "2026-09-01T00:00:00Z",
        policies,
      }),
    ).toBeUndefined();
  });

  it("selects a later scheduled snapshot without changing engine code", () => {
    const september: GundamFormatLegalityPolicy = {
      id: "standard-2026-09",
      formatId: "standard",
      version: "2026.09",
      effectiveFrom: "2026-09-01T00:00:00Z",
      copyRestrictions: [{ cardId: ZAKU.canonicalId, maxCopies: 1 }],
    };

    const selected = selectGundamFormatLegalityPolicy({
      formatId: "standard",
      asOf: new Date("2026-09-15T12:00:00Z"),
      policies: [AUGUST_POLICY, september],
    });

    expect(selected?.id).toBe(september.id);
  });
});

describe("validateDeckList: format legality", () => {
  it("activates a player-readable banned-card violation at the exact effective time", () => {
    const list = smallDeck([{ cardNumber: RX_78.cardNumber, count: 1 }]);
    const before = validateDeckList(list, {
      catalog: BASE_CATALOG,
      mainDeckSize: 1,
      formatLegality: {
        formatId: "standard",
        asOf: "2026-07-31T23:59:59Z",
        policies: [AUGUST_POLICY],
      },
    });
    const at = validateDeckList(list, {
      catalog: BASE_CATALOG,
      mainDeckSize: 1,
      formatLegality: {
        formatId: "standard",
        asOf: "2026-08-01T00:00:00Z",
        policies: [AUGUST_POLICY],
      },
    });

    expect(before.ok).toBe(true);
    expect(at.ok).toBe(false);
    if (at.ok) return;
    expect(at.policy?.id).toBe(AUGUST_POLICY.id);
    expect(at.violations).toContainEqual(
      expect.objectContaining({
        code: "format-banned-card",
        cardIds: [RX_78.canonicalId],
        actual: 1,
        allowed: 0,
      }),
    );
    expect(at.errors.some((message) => message.includes("fixture restriction"))).toBe(true);
  });

  it("aggregates alternate catalog card numbers by canonical identity", () => {
    const alternate = unit("GD01-001-P", RX_78.canonicalId, "Gundam Parallel");
    const catalog: Record<string, Card> = {
      ...BASE_CATALOG,
      [alternate.cardNumber]: alternate,
    };
    const list = smallDeck([
      { cardNumber: RX_78.cardNumber, count: 2 },
      { cardNumber: alternate.cardNumber, count: 1 },
    ]);
    const policy: GundamFormatLegalityPolicy = {
      id: "canonical-copy-sensor",
      formatId: "standard",
      version: "test",
      effectiveFrom: "2026-01-01",
      copyRestrictions: [{ cardId: RX_78.canonicalId, maxCopies: 2 }],
    };

    const result = validateDeckList(list, {
      catalog,
      mainDeckSize: 3,
      formatLegality: {
        formatId: "standard",
        asOf: "2026-01-02",
        policies: [policy],
      },
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.violations).toContainEqual(
      expect.objectContaining({
        code: "format-copy-limit",
        actual: 3,
        allowed: 2,
      }),
    );
  });

  it("enforces a pair restriction only after its policy activates", () => {
    const policy: GundamFormatLegalityPolicy = {
      id: "pair-sensor",
      formatId: "standard",
      version: "test",
      effectiveFrom: "2027-01-01T00:00:00Z",
      compositionRestrictions: [
        {
          id: "gundam-zaku-pair",
          kind: "cannot-combine",
          cardIds: [RX_78.canonicalId, ZAKU.canonicalId],
          reason: "fixture pair restriction",
        },
      ],
    };
    const list = smallDeck([
      { cardNumber: RX_78.cardNumber, count: 1 },
      { cardNumber: ZAKU.cardNumber, count: 1 },
    ]);
    const validateAt = (asOf: string) =>
      validateDeckList(list, {
        catalog: BASE_CATALOG,
        mainDeckSize: 2,
        formatLegality: { formatId: "standard", asOf, policies: [policy] },
      });

    expect(validateAt("2026-12-31T23:59:59Z").ok).toBe(true);
    const active = validateAt("2027-01-01T00:00:00Z");
    expect(active.ok).toBe(false);
    if (active.ok) return;
    expect(active.violations).toContainEqual(
      expect.objectContaining({
        code: "format-composition",
        restrictionId: "gundam-zaku-pair",
        cardIds: [RX_78.canonicalId, ZAKU.canonicalId],
      }),
    );
  });

  it("reports every violation without mutating or throwing away the saveable deck document", () => {
    const list = smallDeck([
      { cardNumber: RX_78.cardNumber, count: 1 },
      { cardNumber: ZAKU.cardNumber, count: 1 },
    ]);
    const snapshot = JSON.stringify(list);
    Object.freeze(list.cards);
    Object.freeze(list.resource);
    Object.freeze(list);
    const policy: GundamFormatLegalityPolicy = {
      id: "non-destructive-sensor",
      formatId: "standard",
      version: "test",
      effectiveFrom: "2026-01-01",
      bannedCards: [{ cardId: RX_78.canonicalId }],
      compositionRestrictions: [
        {
          id: "pair",
          kind: "cannot-combine",
          cardIds: [RX_78.canonicalId, ZAKU.canonicalId],
        },
      ],
    };

    const report = validateDeckList(list, {
      catalog: BASE_CATALOG,
      mainDeckSize: 2,
      formatLegality: {
        formatId: "standard",
        asOf: "2026-01-02",
        policies: [policy],
      },
    });

    expect(report.ok).toBe(false);
    expect(JSON.stringify(list)).toBe(snapshot);
    if (report.ok) return;
    expect(report.violations.map(({ code }) => code)).toEqual([
      "format-banned-card",
      "format-composition",
    ]);
    expect(list.cards).toHaveLength(2);
  });
});

describe("validateDeckList: unchanged registered starter exception", () => {
  const REGISTERED_LINEUP = {
    mainDeck: [
      { cardNumber: RX_78.cardNumber, count: 1 },
      { cardNumber: ZAKU.cardNumber, count: 1 },
    ],
    resourceDeck: [{ cardNumber: RESOURCE.cardNumber, count: 10 }],
  } as const;
  const POLICY: GundamFormatLegalityPolicy = {
    id: "unchanged-starter-sensor",
    formatId: "standard",
    version: "test",
    effectiveFrom: "2026-01-01",
    copyRestrictions: [{ cardId: RX_78.canonicalId, maxCopies: 0 }],
    compositionRestrictions: [
      {
        id: "registered-pair",
        kind: "cannot-combine",
        cardIds: [RX_78.canonicalId, ZAKU.canonicalId],
      },
    ],
    unchangedLineupExceptions: [
      {
        id: "registered-starter",
        description: "Unchanged registered starter fixture",
        sourceUrl: "https://example.com/official-starter",
        registeredLineup: REGISTERED_LINEUP,
        waivedCopyRestrictionCardIds: [RX_78.canonicalId],
        waivedCompositionRestrictionIds: ["registered-pair"],
      },
    ],
  };
  const FORMAT_CONTEXT = {
    formatId: "standard",
    asOf: "2026-01-02",
    policies: [POLICY],
  } as const;

  it("waives only named restrictions for an exact Main Deck and Resource Deck multiset", () => {
    const result = validateDeckList(
      {
        name: "Exact registered starter",
        cards: [...REGISTERED_LINEUP.mainDeck].reverse(),
        resource: REGISTERED_LINEUP.resourceDeck[0],
      },
      {
        catalog: BASE_CATALOG,
        mainDeckSize: 2,
        formatLegality: FORMAT_CONTEXT,
      },
    );

    expect(result).toMatchObject({
      ok: true,
      violations: [],
      appliedExceptionIds: ["registered-starter"],
    });
  });

  it("fails closed when the evaluator is not given submitted lineup evidence", () => {
    const report = evaluateGundamFormatLegality(
      [
        {
          cardNumber: RX_78.cardNumber,
          canonicalId: RX_78.canonicalId,
          count: 1,
          zone: "main",
        },
        {
          cardNumber: ZAKU.cardNumber,
          canonicalId: ZAKU.canonicalId,
          count: 1,
          zone: "main",
        },
      ],
      FORMAT_CONTEXT,
    );

    expect(report.appliedExceptionIds).toBeUndefined();
    expect(report.violations).toEqual([
      expect.objectContaining({ code: "format-copy-limit", cardIds: [RX_78.canonicalId] }),
      expect.objectContaining({ code: "format-composition", restrictionId: "registered-pair" }),
    ]);
  });

  it.each([
    {
      name: "changes a Main Deck quantity",
      list: {
        name: "Modified main",
        cards: [{ cardNumber: RX_78.cardNumber, count: 2 }],
        resource: REGISTERED_LINEUP.resourceDeck[0],
      },
    },
    {
      name: "changes the Resource Deck card",
      list: {
        name: "Modified resource",
        cards: REGISTERED_LINEUP.mainDeck,
        resource: { cardNumber: OTHER_RESOURCE.cardNumber, count: 10 },
      },
    },
    {
      name: "adds a sideboard",
      list: {
        name: "Modified with sideboard",
        cards: REGISTERED_LINEUP.mainDeck,
        resource: REGISTERED_LINEUP.resourceDeck[0],
        sideboard: [{ cardNumber: ZAKU.cardNumber, count: 1 }],
      },
    },
  ])("applies the ordinary restriction when the player $name", ({ list }) => {
    const result = validateDeckList(list, {
      catalog: BASE_CATALOG,
      mainDeckSize: 2,
      formatLegality: FORMAT_CONTEXT,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.appliedExceptionIds).toBeUndefined();
    expect(result.violations).toContainEqual(
      expect.objectContaining({
        code: "format-copy-limit",
        cardIds: [RX_78.canonicalId],
      }),
    );
  });

  it("does not waive an unrelated active restriction for an exact registered lineup", () => {
    const result = validateDeckList(
      {
        name: "Exact starter with unrelated policy",
        cards: REGISTERED_LINEUP.mainDeck,
        resource: REGISTERED_LINEUP.resourceDeck[0],
      },
      {
        catalog: BASE_CATALOG,
        mainDeckSize: 2,
        formatLegality: {
          ...FORMAT_CONTEXT,
          policies: [{ ...POLICY, bannedCards: [{ cardId: ZAKU.canonicalId }] }],
        },
      },
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.appliedExceptionIds).toEqual(["registered-starter"]);
    expect(result.violations).toEqual([
      expect.objectContaining({ code: "format-banned-card", cardIds: [ZAKU.canonicalId] }),
    ]);
  });
});

describe("validateDeckList: BO3 sideboard construction", () => {
  function bo3Fixture(): { catalog: Record<string, Card>; list: DeckList } {
    const catalog: Record<string, Card> = { ...BASE_CATALOG };
    const sideboard: Array<{ cardNumber: string; count: number }> = [];
    for (let index = 0; index < 10; index++) {
      const cardNumber = `SIDE-${index}`;
      catalog[cardNumber] = unit(cardNumber);
      sideboard.push({ cardNumber, count: 1 });
    }
    return {
      catalog,
      list: {
        name: "BO3 sensor",
        cards: [{ cardNumber: RX_78.cardNumber, count: 1 }],
        resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
        sideboard,
      },
    };
  }

  it("requires exactly 10 sideboard cards in BO3 and rejects a sideboard in standard", () => {
    const { catalog, list } = bo3Fixture();

    expect(
      validateDeckList(list, {
        catalog,
        mainDeckSize: 1,
        constructionFormat: "best-of-three",
      }).ok,
    ).toBe(true);

    const standard = validateDeckList(list, { catalog, mainDeckSize: 1 });
    expect(standard.ok).toBe(false);
    if (standard.ok) return;
    expect(standard.violations).toContainEqual(
      expect.objectContaining({
        code: "sideboard-not-allowed",
        zone: "sideboard",
        actual: 10,
      }),
    );

    const short = validateDeckList(
      { ...list, sideboard: list.sideboard?.slice(0, 9) },
      { catalog, mainDeckSize: 1, constructionFormat: "best-of-three" },
    );
    expect(short.ok).toBe(false);
    if (short.ok) return;
    expect(short.violations).toContainEqual(
      expect.objectContaining({ code: "sideboard-size", zone: "sideboard", actual: 9 }),
    );
  });

  it("prohibits Resource cards in the sideboard with a structured zone", () => {
    const { catalog, list } = bo3Fixture();
    const sideboard = [
      { cardNumber: RESOURCE.cardNumber, count: 1 },
      ...(list.sideboard?.slice(0, 9) ?? []),
    ];

    const result = validateDeckList(
      { ...list, sideboard },
      { catalog, mainDeckSize: 1, constructionFormat: "best-of-three" },
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.violations).toContainEqual(
      expect.objectContaining({
        code: "wrong-deck",
        zone: "sideboard",
        cardIds: [RESOURCE.cardNumber],
      }),
    );
  });

  it("aggregates the four-copy rule across main and sideboard", () => {
    const { catalog, list } = bo3Fixture();
    const sideboard = [
      { cardNumber: RX_78.cardNumber, count: 1 },
      ...(list.sideboard?.slice(0, 9) ?? []),
    ];
    const result = validateDeckList(
      {
        ...list,
        cards: [{ cardNumber: RX_78.cardNumber, count: 4 }],
        sideboard,
      },
      { catalog, mainDeckSize: 4, constructionFormat: "best-of-three" },
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.violations).toContainEqual(
      expect.objectContaining({
        code: "base-copy-limit",
        zone: "main-and-sideboard",
        actual: 5,
        allowed: 4,
      }),
    );
  });

  it("aggregates the two-color rule across main and sideboard", () => {
    const { catalog, list } = bo3Fixture();
    catalog["SIDE-0"] = unit("SIDE-0", "SIDE-0", "green side", "green");
    catalog["SIDE-1"] = unit("SIDE-1", "SIDE-1", "red side", "red");

    const result = validateDeckList(list, {
      catalog,
      mainDeckSize: 1,
      constructionFormat: "best-of-three",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.violations).toContainEqual(
      expect.objectContaining({
        code: "deck-colors",
        zone: "main-and-sideboard",
        actual: 3,
        allowed: 2,
      }),
    );
  });

  it("applies one official policy series to standard main decks and BO3 main plus sideboard", () => {
    const corsica = unit("ST02-016");
    const catalog: Record<string, Card> = {
      ...BASE_CATALOG,
      [corsica.cardNumber]: corsica,
    };
    const sideboard: Array<{ cardNumber: string; count: number }> = [
      { cardNumber: corsica.cardNumber, count: 1 },
    ];
    for (let index = 0; index < 9; index++) {
      const cardNumber = `POLICY-SIDE-${index}`;
      catalog[cardNumber] = unit(cardNumber);
      sideboard.push({ cardNumber, count: 1 });
    }
    const formatLegality = {
      formatId: GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
      asOf: "2026-07-24",
      policies: GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
    } as const;

    const standard = validateDeckList(smallDeck([{ cardNumber: corsica.cardNumber, count: 3 }]), {
      catalog,
      mainDeckSize: 3,
      formatLegality,
    });
    const bo3 = validateDeckList(
      {
        ...smallDeck([{ cardNumber: corsica.cardNumber, count: 2 }]),
        sideboard,
      },
      {
        catalog,
        mainDeckSize: 2,
        constructionFormat: "best-of-three",
        formatLegality,
      },
    );

    for (const result of [standard, bo3]) {
      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.violations).toContainEqual(
        expect.objectContaining({
          code: "format-copy-limit",
          cardIds: ["ST02-016"],
          actual: 3,
          allowed: 2,
        }),
      );
    }
    if (!bo3.ok) {
      expect(bo3.violations).toContainEqual(
        expect.objectContaining({
          code: "format-copy-limit",
          zones: ["main", "sideboard"],
        }),
      );
    }
  });
});
