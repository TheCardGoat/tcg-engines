import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloMakingAWish, stitchNewDog, arielOnHumanLegs } from "../../001";
import { rescueRangersAway } from "./029-rescue-rangers-away";

const opposingCharacter = createMockCharacter({
  id: "rescue-rangers-target-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Rescue Rangers Away!", () => {
  it("reduces chosen character's strength by the number of characters you have in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: rescueRangersAway.cost,
        hand: [rescueRangersAway],
        play: [liloMakingAWish, stitchNewDog, arielOnHumanLegs],
        deck: 2,
      },
      {
        play: [opposingCharacter],
        deck: 2,
      },
    );

    const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

    expect(
      testEngine.asPlayerOne().playCard(rescueRangersAway, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 3);
  });

  it("effect lasts until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: rescueRangersAway.cost,
        hand: [rescueRangersAway],
        play: [liloMakingAWish, stitchNewDog, arielOnHumanLegs],
        deck: 2,
      },
      {
        play: [opposingCharacter],
        deck: 2,
      },
    );

    const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

    expect(
      testEngine.asPlayerOne().playCard(rescueRangersAway, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 3);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 3);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore);
  });

  it("can target own characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: rescueRangersAway.cost,
      hand: [rescueRangersAway],
      play: [liloMakingAWish, stitchNewDog, arielOnHumanLegs],
      deck: 2,
    });

    const strengthBefore = testEngine.asPlayerOne().getCardStrength(liloMakingAWish);

    expect(
      testEngine.asPlayerOne().playCard(rescueRangersAway, {
        targets: [liloMakingAWish],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(liloMakingAWish)).toBe(strengthBefore - 3);
  });
});
