import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsImpatientTravelerP3Promo } from "./p3-046-queen-of-hearts-impatient-traveler-promo";

const anotherCharacter = createMockCharacter({
  id: "qoh-promo-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const targetCharacter = createMockCharacter({
  id: "qoh-promo-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Queen of Hearts - Impatient Traveler (Promo)", () => {
  it("ROYAL COMMAND - chosen character gains Rush when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [queenOfHeartsImpatientTravelerP3Promo, targetCharacter],
        inkwell: 1,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().quest(queenOfHeartsImpatientTravelerP3Promo),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(queenOfHeartsImpatientTravelerP3Promo, {
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: targetCharacter,
      keyword: "Rush",
    });
  });
});
