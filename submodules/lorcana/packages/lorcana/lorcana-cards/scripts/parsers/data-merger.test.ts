import { describe, expect, it } from "bun:test";
import type { InputCard } from "../types";
import { getMergedRulesText, repairEmptySymbolsFromReference } from "./data-merger";

function makeInputCard(overrides: Partial<InputCard> = {}): InputCard {
  return {
    name: "RAHR!",
    subtitle: "",
    card_identifier: "136/207 EN 13",
    rules_text: "Chosen character gets +3 {S} this turn.",
    abilities: [],
    inkwell: true,
    cost: 2,
    color: "Ruby",
    type: "Action",
    classifications: [],
    subtypes: [],
    rarity: "Common",
    set_code: "set13",
    number: 136,
    ...overrides,
  } as InputCard;
}

describe("repairEmptySymbolsFromReference", () => {
  it("repairs empty Lorcast symbol slots from matching Ravensburger symbols", () => {
    expect(
      repairEmptySymbolsFromReference(
        "Chosen character gets +3 {} this turn.",
        "Chosen character gets +3 {S} this turn.",
      ),
    ).toBe("Chosen character gets +3 {S} this turn.");
  });

  it("preserves existing concrete Lorcast symbols while repairing later empty slots", () => {
    expect(
      repairEmptySymbolsFromReference(
        "PAY ATTENTION Whenever you play a character with 5 {S}, you may pay 1 {}.",
        "PAY ATTENTION Whenever you play a character with 5 {S}, you may pay 1 {I}.",
      ),
    ).toBe("PAY ATTENTION Whenever you play a character with 5 {S}, you may pay 1 {I}.");
  });
});

describe("getMergedRulesText", () => {
  it("does not downgrade concrete Ravensburger symbols to empty Lorcast placeholders", () => {
    const lorcastIndex = new Map([
      ["13-136-rahr!-", "Chosen character gets +3 {} this turn."],
    ]);

    expect(getMergedRulesText(makeInputCard(), lorcastIndex).text).toBe(
      "Chosen character gets +3 {S} this turn.",
    );
  });
});
