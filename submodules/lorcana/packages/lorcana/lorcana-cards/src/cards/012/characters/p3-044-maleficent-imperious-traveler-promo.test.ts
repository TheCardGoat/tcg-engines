import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maleficentImperiousTravelerP3Promo } from "./p3-044-maleficent-imperious-traveler-promo";

const anotherCharacter = createMockCharacter({
  id: "maleficent-promo-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opposingCharacter = createMockCharacter({
  id: "maleficent-promo-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Maleficent - Imperious Traveler (Promo)", () => {
  it("HEED MY WORDS - exerts chosen opposing character when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [maleficentImperiousTravelerP3Promo],
        inkwell: 1,
        deck: 5,
      },
      {
        play: [opposingCharacter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().quest(maleficentImperiousTravelerP3Promo),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(maleficentImperiousTravelerP3Promo, {
        resolveOptional: true,
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
  });
});
