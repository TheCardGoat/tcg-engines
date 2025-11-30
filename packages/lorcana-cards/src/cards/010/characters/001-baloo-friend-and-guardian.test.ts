import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { balooFriendAndGuardian } from "./001-baloo-friend-and-guardian";

describe("Baloo - Friend and Guardian", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [balooFriendAndGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [balooFriendAndGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
