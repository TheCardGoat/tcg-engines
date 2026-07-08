import { describe, expect, it } from "bun:test";

import {
  CYBERPUNK_MAIN_DECK_MAX,
  CYBERPUNK_MAIN_DECK_MIN,
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

  const validLegends = [
    entry(card("legend-1", "Goro", "Legend", "Green", 2)),
    entry(card("legend-2", "Saburo", "Legend", "Green", 2)),
    entry(card("legend-3", "Yorinobu", "Legend", "Red", 2)),
  ];
  const validMainDeck = Array.from({ length: CYBERPUNK_MAIN_DECK_MIN }, (_, index) =>
    entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
  );

  for (const scenario of [
    {
      name: "exactly three Legends",
      legends: validLegends.slice(0, 2),
      mainDeck: validMainDeck,
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
      expectedCode: "legend-name-unique",
    },
    {
      name: "at least 40 main deck cards",
      legends: validLegends,
      mainDeck: validMainDeck.slice(0, CYBERPUNK_MAIN_DECK_MIN - 1),
      expectedCode: "main-deck-min",
    },
    {
      name: "no more than 50 main deck cards",
      legends: validLegends,
      mainDeck: Array.from({ length: CYBERPUNK_MAIN_DECK_MAX + 1 }, (_, index) =>
        entry(card(`unit-${index}`, `Unit ${index}`, "Unit", "Green", 1)),
      ),
      expectedCode: "main-deck-max",
    },
    {
      name: "no more than three copies of a card",
      legends: validLegends,
      mainDeck: [entry(card("unit-1", "Unit 1", "Unit", "Green", 1), 4), ...validMainDeck],
      expectedCode: "copy-limit",
    },
    {
      name: "RAM by matching Legend color",
      legends: validLegends,
      mainDeck: [
        entry(card("red-over-limit", "Red Over Limit", "Unit", "Red", 3)),
        ...validMainDeck.slice(1),
      ],
      expectedCode: "ram-limit",
    },
  ] satisfies Array<{
    name: string;
    legends: CyberpunkDeckValidationEntry[];
    mainDeck: CyberpunkDeckValidationEntry[];
    expectedCode: ReturnType<typeof validateCyberpunkDeck>["issues"][number]["code"];
  }>) {
    it(`reports the guide rule for ${scenario.name}`, () => {
      const result = validateCyberpunkDeck({
        legends: scenario.legends,
        mainDeck: scenario.mainDeck,
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
    });

    expect(result.ramBudget.get("Green")).toBe(2);
    expect(result.issues.some((issue) => issue.code === "ram-limit")).toBe(false);
  });
});

function card(
  id: string,
  name: string,
  type: string,
  color: string,
  ram: number | null,
): CyberpunkDeckValidationCard {
  return {
    id,
    name,
    displayName: name,
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
