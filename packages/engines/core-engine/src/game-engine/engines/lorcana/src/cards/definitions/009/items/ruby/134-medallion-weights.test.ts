import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { medallionWeights } from "./134-medallion-weights";

describe("Medallion Weights", () => {
  it.skip("**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: medallionWeights.cost,
      play: [medallionWeights],
      hand: [medallionWeights],
    });

    await testEngine.playCard(medallionWeights);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
