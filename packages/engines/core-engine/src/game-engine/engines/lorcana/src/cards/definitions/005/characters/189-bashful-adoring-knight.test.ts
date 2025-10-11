import { describe, expect, it } from "bun:test";
import {
  bashfulAdoringKnight,
  snowWhiteFairhearted,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bashful - Adoring Knight", () => {
  it("**IMPRESS THE PRINCESS** While you have a character named Snow White in play, this character gains **Bodyguard**. _(An opposing character who challenges one of your character must chose one with Bodyguard if able.)_", async () => {
    // Setup test with only Bashful in play
    const testEngine = new TestEngine({
      inkwell: bashfulAdoringKnight.cost,
      play: [bashfulAdoringKnight],
    });

    const bashfulCard = testEngine.getCardModel(bashfulAdoringKnight);

    // Test initial state (without Snow White)
    expect(bashfulCard.hasBodyguard).toBe(false);

    // Setup test with both Bashful and Snow White in play
    const testEngineWithSnowWhite = new TestEngine({
      inkwell: bashfulAdoringKnight.cost,
      play: [bashfulAdoringKnight, snowWhiteFairhearted],
    });

    const bashfulCardWithSnowWhite =
      testEngineWithSnowWhite.getCardModel(bashfulAdoringKnight);

    // Test state with Snow White in play
    expect(bashfulCardWithSnowWhite.hasBodyguard).toBe(true);
  });
});
