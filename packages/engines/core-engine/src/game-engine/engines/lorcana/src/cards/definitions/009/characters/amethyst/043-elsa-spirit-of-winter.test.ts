import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { elsaSpiritOfWinter } from "./043-elsa-spirit-of-winter";

describe("Elsa - Spirit of Winter", () => {
  it.skip("**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_", async () => {
    const testEngine = new TestEngine({
      play: [elsaSpiritOfWinter],
    });

    const cardUnderTest = testEngine.getCardModel(elsaSpiritOfWinter);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it.skip("**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: elsaSpiritOfWinter.cost,
      hand: [elsaSpiritOfWinter],
    });

    await testEngine.playCard(elsaSpiritOfWinter);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
