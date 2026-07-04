import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pocahontasGuidingTheTribePD1Promo } from "./pd1-003-pocahontas-guiding-the-tribe-promo";

const freeCharacter = createMockCharacter({
  id: "pocahontas-guiding-the-tribe-free-character",
  name: "Free Character",
  cost: 1,
});

describe("Pocahontas - Guiding the Tribe Promo", () => {
  it("may play a cost 1 character for free when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasGuidingTheTribePD1Promo, freeCharacter],
      inkwell: pocahontasGuidingTheTribePD1Promo.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(pocahontasGuidingTheTribePD1Promo),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasGuidingTheTribePD1Promo, {
        resolveOptional: true,
        targets: [freeCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(freeCharacter)).toBe("play");
  });
});
