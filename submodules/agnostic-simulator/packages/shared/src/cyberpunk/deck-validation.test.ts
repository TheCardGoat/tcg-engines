import { describe, expect, it } from "bun:test";

import {
  CYBERPUNK_MAIN_DECK_MAX,
  CYBERPUNK_MAIN_DECK_MIN,
  CYBERPUNK_SIDEBOARD_SIZE,
  validateCyberpunkDeck,
  type CyberpunkDeckValidationCard,
  type CyberpunkDeckValidationEntry,
} from "./deck-validation.js";

describe("validateCyberpunkDeck", () => {
  it("accepts a deck with three unique Legends, 40-50 main deck cards, copy limits, and RAM coverage", () => {
    const result = validateCyberpunkDeck({
      legends: [
        entry(card("legend-1", "Goro", "Legend", "Green", 2)),
        entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
        entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
      ],
      mainDeck: Array.from({ length: 14 }, (_, index) =>
        entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 4), 3),
      ),
      sideboard: legalSideboard(),
    });

    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.mainDeckCount).toBe(42);
    expect(result.ramBudget.get("Green")).toBe(4);
    expect(result.ramBudget.get("Red")).toBe(2);
  });

  it("reports each Cyberpunk deck construction issue", () => {
    const result = validateCyberpunkDeck({
      legends: [
        entry(card("legend-1", "Goro Takemura", "Legend", "Green", 2)),
        entry(card("legend-2", "Goro Takemura", "Legend", "Green", 2)),
      ],
      mainDeck: [
        entry(card("unit-1", "Too Many Friends", "Unit", "Green", 1), 4),
        entry(card("unit-2", "Heavy Red Card", "Program", "Red", 1), 1),
      ],
    });

    expect(result.isValid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual([
      "legend-count",
      "legend-name-unique",
      "main-deck-min",
      "copy-limit",
      "ram-limit",
    ]);
  });

  it("accepts a quick Alpha list that omits the sideboard", () => {
    const result = validateCyberpunkDeck({
      legends: [
        entry(card("legend-1", "Goro", "Legend", "Green", 2)),
        entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
        entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
      ],
      mainDeck: Array.from({ length: 40 }, (_, index) =>
        entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
      ),
    });

    expect(result.isValid).toBe(true);
    expect(result.issues.some((issue) => issue.code === "sideboard-max")).toBe(false);
  });

  const validLegends = [
    entry(card("legend-1", "Goro", "Legend", "Green", 2)),
    entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
    entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
  ];
  const validMainDeck = Array.from({ length: CYBERPUNK_MAIN_DECK_MIN }, (_, index) =>
    entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
  );
  const validSideboard = legalSideboard();

  for (const scenario of [
    {
      name: "exactly three Legends",
      legends: validLegends.slice(0, 2),
      mainDeck: validMainDeck,
      sideboard: validSideboard,
      expectedCode: "legend-count",
    },
    {
      name: "unique Legend names",
      legends: [
        entry(card("legend-1", "Goro", "Legend", "Green", 2)),
        entry(card("legend-2", "Goro", "Legend", "Green", 2)),
        entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
      ],
      mainDeck: validMainDeck,
      sideboard: validSideboard,
      expectedCode: "legend-name-unique",
    },
    {
      name: "at least 40 main deck cards",
      legends: validLegends,
      mainDeck: validMainDeck.slice(0, CYBERPUNK_MAIN_DECK_MIN - 1),
      sideboard: validSideboard,
      expectedCode: "main-deck-min",
    },
    {
      name: "no more than 50 main deck cards",
      legends: validLegends,
      mainDeck: Array.from({ length: CYBERPUNK_MAIN_DECK_MAX + 1 }, (_, index) =>
        entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
      ),
      sideboard: validSideboard,
      expectedCode: "main-deck-max",
    },
    {
      name: "no more than three copies of a card",
      legends: validLegends,
      mainDeck: [entry(card("unit-1", "Unit 1", "Unit", "Green", 1), 4), ...validMainDeck],
      sideboard: validSideboard,
      expectedCode: "copy-limit",
    },
    {
      name: "RAM by matching Legend color",
      legends: validLegends,
      mainDeck: [
        entry(card("red-over-limit", "Red Over Limit", "Unit", "Red", 3)),
        ...validMainDeck.slice(1),
      ],
      sideboard: validSideboard,
      expectedCode: "ram-limit",
    },
  ] satisfies Array<{
    name: string;
    legends: CyberpunkDeckValidationEntry[];
    mainDeck: CyberpunkDeckValidationEntry[];
    sideboard: CyberpunkDeckValidationEntry[];
    expectedCode: ReturnType<typeof validateCyberpunkDeck>["issues"][number]["code"];
  }>) {
    it(`reports the guide rule for ${scenario.name}`, () => {
      const result = validateCyberpunkDeck({
        legends: scenario.legends,
        mainDeck: scenario.mainDeck,
        sideboard: scenario.sideboard,
      });

      expect(result.isValid).toBe(false);
      expect(result.issues.some((issue) => issue.code === scenario.expectedCode)).toBe(true);
    });
  }

  it("reports decks above the main deck maximum", () => {
    const result = validateCyberpunkDeck({
      legends: [
        entry(card("legend-1", "Goro", "Legend", "Green", 2)),
        entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
        entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
      ],
      mainDeck: Array.from({ length: CYBERPUNK_MAIN_DECK_MAX + 1 }, (_, index) =>
        entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 4)),
      ),
      sideboard: legalSideboard(),
    });

    expect(result.issues.some((issue) => issue.code === "main-deck-max")).toBe(true);
  });

  it("uses quantities when counting Legends and main deck cards", () => {
    const result = validateCyberpunkDeck({
      legends: [entry(card("legend-1", "Goro", "Legend", "Green", 2), 3)],
      mainDeck: [entry(card("unit-1", "Unit 1", "Unit", "Green", 2), CYBERPUNK_MAIN_DECK_MIN)],
    });

    expect(result.legendCount).toBe(3);
    expect(result.mainDeckCount).toBe(CYBERPUNK_MAIN_DECK_MIN);
  });

  it("treats null RAM as zero for deck validation", () => {
    const result = validateCyberpunkDeck({
      legends: [
        entry(card("legend-1", "Goro", "Legend", "Green", null)),
        entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
        entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
      ],
      mainDeck: [
        ...Array.from({ length: CYBERPUNK_MAIN_DECK_MIN - 1 }, (_, index) =>
          entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
        ),
        entry(card("unit-null-ram", "No RAM Card", "Unit", "Green", null)),
      ],
      sideboard: legalSideboard(),
    });

    expect(result.ramBudget.get("Green")).toBe(2);
    expect(result.issues.some((issue) => issue.code === "ram-limit")).toBe(false);
  });

  it("rejects legends that share a name when the subtitle differs", () => {
    const result = validateCyberpunkDeck({
      legends: [
        entry(card("v-street", "V", "Legend", "Red", 2, { subname: "Streetkid" })),
        entry(card("v-corpo", "V", "Legend", "Blue", 2, { subname: "Corporate Exile" })),
        entry(card("panam", "Panam Palmer", "Legend", "Yellow", 2, { subname: "Nomad Cavalry" })),
      ],
      mainDeck: validMainDeck,
      sideboard: validSideboard,
    });

    expect(result.isValid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "legend-name-unique")).toBe(true);
  });

  it("counts a fourth copy split across printings and boards, and ignores a different subtitle and the maybeboard", () => {
    const shared = { name: "Dying Night", subname: "V's Pistol" };
    const otherSubtitle = card("other-print", "Dying Night", "Gear", "Green", 1, {
      subname: "Another Gun",
    });
    const deck = {
      legends: validLegends,
      mainDeck: [
        entry(card("print-a", shared.name, "Gear", "Green", 1, { subname: shared.subname }), 2),
        entry(otherSubtitle, 3),
        ...validMainDeck.slice(0, CYBERPUNK_MAIN_DECK_MIN - 5),
      ],
      sideboard: [
        entry(card("print-b", shared.name, "Gear", "Green", 1, { subname: shared.subname }), 2),
        ...legalSideboard().slice(1),
      ],
      maybeboard: [
        entry(card("maybe", shared.name, "Gear", "Green", 1, { subname: shared.subname }), 3),
      ],
    };

    const result = validateCyberpunkDeck(deck);

    expect(result.isValid).toBe(false);
    expect(result.issues.filter((issue) => issue.code === "copy-limit")).toEqual([
      expect.objectContaining({ cardId: "print-a", cardName: "Dying Night" }),
    ]);
  });

  it("applies RAM to the sideboard and rejects a sideboard over seven cards", () => {
    const overRam = validateCyberpunkDeck({
      legends: validLegends,
      mainDeck: validMainDeck,
      sideboard: [
        entry(card("heavy", "Heavy Side", "Unit", "Red", 3)),
        ...legalSideboard().slice(1),
      ],
    });
    expect(
      overRam.issues.some((issue) => issue.code === "ram-limit" && issue.cardId === "heavy"),
    ).toBe(true);

    const six = validateCyberpunkDeck({
      legends: validLegends,
      mainDeck: validMainDeck,
      sideboard: Array.from({ length: CYBERPUNK_SIDEBOARD_SIZE - 1 }, (_, index) =>
        entry(card(`side-size-${index}`, `Side Size ${index}`, "Unit", "Green", 1)),
      ),
    });
    expect(six.isValid).toBe(true);

    const eight = validateCyberpunkDeck({
      legends: validLegends,
      mainDeck: validMainDeck,
      sideboard: Array.from({ length: CYBERPUNK_SIDEBOARD_SIZE + 1 }, (_, index) =>
        entry(card(`side-over-${index}`, `Side Over ${index}`, "Unit", "Green", 1)),
      ),
    });
    expect(eight.isValid).toBe(false);
    expect(eight.issues.some((issue) => issue.code === "sideboard-max")).toBe(true);
  });

  it("rejects a legend in the sideboard", () => {
    const result = validateCyberpunkDeck({
      legends: validLegends,
      mainDeck: validMainDeck,
      sideboard: [
        entry(card("extra-legend", "Rogue", "Legend", "Yellow", 2, { subname: "Preem Solo" })),
        ...legalSideboard(),
      ],
    });

    expect(result.isValid).toBe(false);
    expect(result.sideboardCount).toBe(CYBERPUNK_SIDEBOARD_SIZE);
    expect(result.issues.some((issue) => issue.code === "sideboard-legend")).toBe(true);
  });

  it("enforces Appendix B set legality, named bans, textless identities, and catalog test prints", () => {
    const retail = { setCode: "welcometonightcityretail", rarity: "Common" };
    const legalRetail = validateCyberpunkDeck({
      legends: validLegends,
      mainDeck: [
        entry(
          card("beta-unit", "Beta Unit", "Unit", "Green", 1, { setCode: "welcometonightcitybeta" }),
        ),
        ...validMainDeck.slice(1),
      ],
      sideboard: legalSideboard().map((sideEntry, index) =>
        index === 0
          ? entry(card(sideEntry.card.id, sideEntry.card.name, "Unit", "Green", 1, retail))
          : sideEntry,
      ),
    });
    expect(legalRetail.issues.some((issue) => issue.code === "constructed-legality")).toBe(false);

    const alpha = validateCyberpunkDeck(
      withReplacement("alpha-kit", { setCode: "alpha", rarity: "Rare" }),
    );
    expect(
      alpha.issues.some(
        (issue) => issue.code === "constructed-legality" && issue.cardId === "alpha-kit",
      ),
    ).toBe(true);

    const nova = validateCyberpunkDeck(
      withReplacement("alpha-nova", { setCode: "alpha", rarity: "Nova Rare" }),
    );
    expect(nova.issues.some((issue) => issue.cardId === "alpha-nova")).toBe(false);

    const jackie = validateCyberpunkDeck(
      withReplacement("jackie-v", {
        name: "Jackie & V",
        subname: "Chooms to the End",
        setCode: "welcometonightcityretail",
      }),
    );
    expect(
      jackie.issues.some(
        (issue) => issue.code === "constructed-legality" && issue.cardId === "jackie-v",
      ),
    ).toBe(true);

    const otherJackie = validateCyberpunkDeck(
      withReplacement("jackie-welles", {
        name: "Jackie Welles",
        subname: "Mama's Favorite",
        setCode: "welcometonightcityretail",
      }),
    );
    expect(otherJackie.issues.some((issue) => issue.cardId === "jackie-welles")).toBe(false);

    for (const identity of [
      { id: "lucy", name: "Lucyna Kushinada", subname: "Fresh Beginnings" },
      { id: "david", name: "David Martinez", subname: "Built Different" },
      { id: "rebecca", name: "Rebecca", subname: "Having a Moment" },
    ]) {
      const textless = validateCyberpunkDeck(
        withReplacement(identity.id, {
          name: identity.name,
          subname: identity.subname,
          textless: true,
          setCode: "PRM01",
          printings: [{ setCode: "PRM01", rarity: "Nova Rare" }],
        }),
      );
      expect(textless.issues.some((issue) => issue.cardId === identity.id)).toBe(true);

      const reprinted = validateCyberpunkDeck(
        withReplacement(`${identity.id}-retail`, {
          name: identity.name,
          subname: identity.subname,
          textless: true,
          setCode: "PRM01",
          printings: [{ setCode: "welcometonightcityretail", rarity: "Rare" }],
        }),
      );
      expect(reprinted.issues.some((issue) => issue.cardId === `${identity.id}-retail`)).toBe(
        false,
      );
    }

    const testPrint = validateCyberpunkDeck(
      withReplacement("test-print", { setCode: "welcometonightcityretail", testPrint: true }),
    );
    expect(testPrint.issues.some((issue) => issue.cardId === "test-print")).toBe(true);

    const unmarked = validateCyberpunkDeck(
      withReplacement("unmarked", { setCode: "welcometonightcityretail" }),
    );
    expect(unmarked.issues.some((issue) => issue.cardId === "unmarked")).toBe(false);
  });
});

function legalSideboard(): CyberpunkDeckValidationEntry[] {
  return Array.from({ length: CYBERPUNK_SIDEBOARD_SIZE }, (_, index) =>
    entry(card(`side-${index}`, `Side ${index}`, "Unit", "Green", 1)),
  );
}

function withReplacement(
  id: string,
  extra: Partial<CyberpunkDeckValidationCard>,
): Parameters<typeof validateCyberpunkDeck>[0] {
  const [first, ...rest] = legalSideboard();
  if (!first) throw new Error("legal sideboard is empty");
  return {
    legends: [
      entry(card("legend-1", "Goro", "Legend", "Green", 2)),
      entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
      entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
    ],
    mainDeck: Array.from({ length: CYBERPUNK_MAIN_DECK_MIN }, (_, index) =>
      entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
    ),
    sideboard: [
      entry({ ...first.card, id, name: extra.name ?? first.card.name, ...extra }),
      ...rest,
    ],
  };
}

function card(
  id: string,
  name: string,
  type: string,
  color: string,
  ram: number | null,
  extra: Partial<CyberpunkDeckValidationCard> = {},
): CyberpunkDeckValidationCard {
  return {
    id,
    name,
    displayName: extra.displayName ?? name,
    type,
    color,
    ram,
    ...extra,
    id,
    name,
    type,
    color,
    ram,
  };
}

function entry(cardValue: CyberpunkDeckValidationCard, quantity = 1): CyberpunkDeckValidationEntry {
  return {
    card: cardValue,
    quantity,
  };
}
