import { describe, expect, it } from "bun:test";

import {
  CYBERPUNK_MAIN_DECK_MAX,
  CYBERPUNK_MAIN_DECK_MIN,
  validateCyberpunkDeck,
  type CyberpunkDeckValidationCard,
  type CyberpunkDeckValidationEntry,
} from "./deck-validation";

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
});

function card(
  id: string,
  name: string,
  type: string,
  color: string,
  ram: number,
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
