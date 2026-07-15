import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonDespicableDealer } from "./010-gaston-despicable-dealer";

const discountedCharacter = createMockCharacter({
  id: "gaston-despicable-discount-target",
  name: "Discount Target",
  cost: 5,
  strength: 3,
  willpower: 4,
});

describe("Gaston - Despicable Dealer", () => {
  it("reduces the cost of the next character you play this turn by 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discountedCharacter],
      inkwell: discountedCharacter.cost - 2,
      play: [gastonDespicableDealer],
    });

    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(gastonDespicableDealer, {
        ability: "DUBIOUS RECRUITMENT",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(discountedCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(discountedCharacter)).toBe("play");
  });

  it("expires at end of turn if you do not play a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [discountedCharacter],
        inkwell: discountedCharacter.cost - 2,
        play: [gastonDespicableDealer],
      },
      {
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(gastonDespicableDealer, {
        ability: "DUBIOUS RECRUITMENT",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(discountedCharacter)).toBe(false);
  });
});
