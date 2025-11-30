import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { princeEricDashingAndBrave } from "./194-prince-eric-dashing-and-brave";

describe("Prince Eric - Dashing and Brave", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [princeEricDashingAndBrave],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricDashingAndBrave);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
