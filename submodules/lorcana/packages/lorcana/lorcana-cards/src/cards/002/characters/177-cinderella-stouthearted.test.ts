import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { grabYourSword } from "../../001/actions/198-grab-your-sword";
import { cinderellaStouthearted } from "./177-cinderella-stouthearted";

const readyDefender = createMockCharacter({
  id: "cinderella-ready-defender",
  name: "Cinderella Ready Defender",
  cost: 2,
});

describe("Cinderella - Stouthearted", () => {
  it("has Shift 5 and Resist +2", () => {
    const testEngine = new LorcanaTestEngine({
      play: [cinderellaStouthearted],
    });

    const cardUnderTest = testEngine.getCardModel(cinderellaStouthearted);
    expect(cardUnderTest.hasShift()).toBe(true);
    expect(cardUnderTest.shiftInkCost).toBe(5);
    expect(cardUnderTest.hasResist).toBe(true);
    expect(cardUnderTest.damageReduction).toBe(2);
  });

  it("may challenge ready characters this turn after you play a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourSword],
        inkwell: grabYourSword.cost,
        play: [cinderellaStouthearted],
        deck: 1,
      },
      {
        play: [readyDefender],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(cinderellaStouthearted, readyDefender)).toBe(
      false,
    );
    expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().canChallenge(cinderellaStouthearted, readyDefender)).toBe(true);
  });
});
