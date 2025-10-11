import { describe, expect, it } from "bun:test";
import { theDodoOutlandishStoryteller } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Dodo - Outlandish Storyteller", () => {
  it("AN EXTREMELY FATAL SITUATION This character receives +1 {S} for each damage on it.", async () => {
    const testEngine = new TestEngine({
      play: [theDodoOutlandishStoryteller],
    });

    const cardToTest = testEngine.getCardModel(theDodoOutlandishStoryteller);
    console.log("Before", cardToTest.strength);
    cardToTest.damage = 2;

    console.log("after", cardToTest.strength);
    expect(cardToTest.strength).toBe(2);
  });
});
