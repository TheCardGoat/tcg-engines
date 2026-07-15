import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { vanellopeVonSchweetzSugarRushChamp } from "./006-vanellope-von-schweetz-sugar-rush-champ";

describe("Vanellope Von Schweetz - Sugar Rush Champ", () => {
  it("should be a vanilla card with correct stats", () => {
    const testEngine = new LorcanaTestEngine({
      play: [vanellopeVonSchweetzSugarRushChamp],
    });

    const cardUnderTest = testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp);
    expect(cardUnderTest.strength).toBe(2);
    expect(cardUnderTest.willpower).toBe(2);
    expect(cardUnderTest.lore).toBe(1);
    expect(cardUnderTest.cost).toBe(1);
  });
});
