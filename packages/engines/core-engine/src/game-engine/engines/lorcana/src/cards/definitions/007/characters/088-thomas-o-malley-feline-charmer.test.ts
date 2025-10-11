import { describe, expect, it } from "bun:test";
import { thomasOmalleyFelineCharmer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Thomas O'malley - Feline Charmer", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [thomasOmalleyFelineCharmer],
    });

    const cardUnderTest = testEngine.getCardModel(thomasOmalleyFelineCharmer);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
