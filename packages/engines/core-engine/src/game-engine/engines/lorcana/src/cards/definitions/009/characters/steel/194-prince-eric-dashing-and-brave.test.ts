import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { princeEricDashingAndBrave } from "./194-prince-eric-dashing-and-brave";

describe("Prince Eric - Dashing and Brave", () => {
  it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_", async () => {
    const testEngine = new TestEngine({
      play: [princeEricDashingAndBrave],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricDashingAndBrave);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
