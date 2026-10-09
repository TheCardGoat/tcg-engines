import { describe, expect, it } from "bun:test";
import type { CyberpunkDeckValidationEntry } from "./deck-validation.js";
import { validateCyberpunkDeck } from "./deck-validation.js";
import { validateCyberpunkSixPackDeck } from "./six-pack-deck-validation.js";

function card(
  id: string,
  overrides: Partial<CyberpunkDeckValidationEntry["card"]> = {},
): CyberpunkDeckValidationEntry["card"] {
  return {
    id,
    name: id,
    type: "unit",
    color: "red",
    ram: 9,
    ...overrides,
  };
}

function entry(
  id: string,
  quantity: number,
  overrides: Partial<CyberpunkDeckValidationEntry["card"]> = {},
): CyberpunkDeckValidationEntry {
  return { card: card(id, overrides), quantity };
}

function copies(
  id: string,
  quantity: number,
  overrides: Partial<CyberpunkDeckValidationEntry["card"]> = {},
) {
  return entry(id, quantity, overrides);
}

describe("validateCyberpunkSixPackDeck", () => {
  const pool = { red: 4, legend: 1, off: 2 };

  it("allows a 30-card deck over the RAM and copy caps when the pool contains the cards", () => {
    const result = validateCyberpunkSixPackDeck({
      legends: [entry("legend", 1, { type: "legend", name: "Lucy", color: "blue", ram: 1 })],
      mainDeck: [copies("red", 30, { ram: 9 })],
      sideboard: [],
      colors: ["red"],
      pool: { ...pool, red: 30 },
    });
    expect(result.isValid).toBe(true);
  });

  it("allows duplicate Legend names and quantities within the opened pool", () => {
    const input = {
      legends: [
        entry("legend", 2, { type: "legend", name: "Lucy" }),
        entry("legend-other", 1, { type: "legend", name: "Lucy" }),
      ],
      mainDeck: [copies("red", 30)],
      sideboard: [],
      colors: ["red"],
      pool: { red: 30, legend: 2, "legend-other": 1 },
    };
    expect(validateCyberpunkSixPackDeck(input).isValid).toBe(true);
    expect(
      validateCyberpunkSixPackDeck({ ...input, pool: { ...input.pool, legend: 1 } }).issues.map(
        (issue) => issue.code,
      ),
    ).toContain("pool");
  });

  it("rejects 29 cards, a fourth color, a card outside the pool, and a fourth Legend", () => {
    const short = validateCyberpunkSixPackDeck({
      legends: [],
      mainDeck: [copies("red", 29)],
      sideboard: [],
      colors: ["red"],
      pool: { red: 29 },
    });
    expect(short.issues.map((item) => item.code)).toContain("main-deck-min");

    const colors = validateCyberpunkSixPackDeck({
      legends: [],
      mainDeck: [copies("red", 30)],
      sideboard: [copies("off", 1, { color: "yellow" })],
      colors: ["red", "blue", "green", "yellow"],
      pool: { red: 30, off: 1 },
    });
    expect(colors.issues.map((item) => item.code)).toContain("colors");

    const missing = validateCyberpunkSixPackDeck({
      legends: [entry("other-legend", 1, { type: "legend", name: "Other" })],
      mainDeck: [copies("red", 30)],
      sideboard: [],
      colors: ["red"],
      pool: { red: 30 },
    });
    expect(missing.issues.map((item) => item.code)).toContain("pool");

    const legends = validateCyberpunkSixPackDeck({
      legends: [1, 2, 3, 4].map((index) =>
        entry(`legend-${index}`, 1, { type: "legend", name: `Legend ${index}` }),
      ),
      mainDeck: [copies("red", 30)],
      sideboard: [],
      colors: ["red"],
      pool: { red: 30, "legend-1": 1, "legend-2": 1, "legend-3": 1, "legend-4": 1 },
    });
    expect(legends.issues.map((item) => item.code)).toContain("legend-count");
  });

  it("skips opened-copy checks when the caller did not supply a pool", () => {
    const unchecked = validateCyberpunkSixPackDeck({
      legends: [],
      mainDeck: [copies("red", 30)],
      sideboard: [],
      colors: ["red"],
    });
    expect(unchecked.issues.map((item) => item.code)).not.toContain("pool");
    expect(unchecked.isValid).toBe(true);

    const emptyPool = validateCyberpunkSixPackDeck({
      legends: [],
      mainDeck: [copies("red", 30)],
      sideboard: [],
      colors: ["red"],
      pool: {},
    });
    expect(emptyPool.issues.map((item) => item.code)).toContain("pool");
  });

  it("keeps the same list illegal in constructed Alpha", () => {
    const alpha = validateCyberpunkDeck({
      legends: [entry("legend", 1, { type: "legend", name: "Lucy", color: "red", ram: 1 })],
      mainDeck: [copies("red", 30, { ram: 9 })],
      sideboard: [],
    });
    expect(alpha.isValid).toBe(false);
    expect(alpha.issues.map((item) => item.code)).toEqual(
      expect.arrayContaining(["legend-count", "main-deck-min", "copy-limit", "ram-limit"]),
    );
  });
});
