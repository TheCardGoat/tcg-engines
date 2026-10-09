import { describe, expect, it } from "bun:test";
import { getChooseCostStatusMessage } from "./cost-copy.js";
describe("activation cost copy", () => {
  it("names an item cost once with the correct article", () => {
    expect(
      getChooseCostStatusMessage("Upgraded Chem Purse", {
        kind: "banishItems",
        count: 1,
        candidateCardIds: [],
        zone: "play",
        cardType: "item",
      }),
    ).toBe("Choose an item to banish for Upgraded Chem Purse.");
  });
  it("preserves the character classification for a plural cost", () => {
    expect(
      getChooseCostStatusMessage("Source", {
        kind: "banishCharacters",
        count: 2,
        candidateCardIds: [],
        zone: "play",
        cardType: "character",
        classification: "Pirate",
      }),
    ).toBe("Choose 2 characters with Pirate to banish for Source.");
  });
});
